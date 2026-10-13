import {mapa} from '../klase/mapa.js'
import {t} from '../utils/jezik.js'
import {izgledMarkera} from '../utils/ikonice.js'

const boja = '#822323'

const style = document.createElement('style')
style.textContent = `
  :host {
    font: 16px system-ui, sans-serif;
  }

  [hidden] {
    display: none !important;
  }

  #dugme {
    background: white;
    border: none;
    border-radius: 22px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    font: inherit;
    min-height: 44px;
    padding: 0 16px;
  }

  /* na telefonu panel dolazi odozdo, kao U blizini i Trenutna ruta */
  #panel {
    background: white;
    border-radius: 12px 12px 0 0;
    bottom: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
    left: 0;
    max-height: 65%;
    overflow-y: auto;
    padding-bottom: var(--dno);
    position: fixed;
    right: 0;
    z-index: 1000;
  }

  /* na sirem ekranu stoji levo, na mestu svog dugmeta, koje se tada skriva */
  @media (min-width: 600px) {
    #panel {
      border-radius: 12px;
      bottom: calc(var(--visina-slajdera) + var(--dno) + 2px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      left: 10px;
      max-height: calc(100% - var(--visina-slajdera) - var(--dno) - 130px);
      right: auto;
      width: min(640px, calc(100% - 20px));
    }
  }

  header {
    align-items: center;
    background: white;
    border-bottom: 1px solid #ddd;
    display: flex;
    font-weight: bold;
    justify-content: space-between;
    padding-left: 16px;
    position: sticky;
    top: 0;
  }

  header button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    height: 44px;
    width: 44px;
  }

  .sadrzaj {
    padding: 0 16px 16px;
  }

  h3 {
    color: #666;
    font-size: 13px;
    font-weight: normal;
    letter-spacing: 0.04em;
    margin: 14px 0 8px;
    text-transform: uppercase;
  }

  /* sire nego vise: vrste u vise kolona, a manje grupe jedna pored druge */
  .stavke,
  .male-grupe {
    display: grid;
    gap: 8px 12px;
    grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
  }

  .male-grupe .stavke {
    grid-template-columns: 1fr;
  }

  .stavka {
    align-items: end;
    color: #444;
    display: flex;
    font-size: 15px;
    gap: 10px;
  }

  .ikona {
    display: flex;
    flex: none;
    justify-content: center;
    width: 20px;
  }

  .ikona img {
    filter: drop-shadow(2px 3px 2px rgba(0, 0, 0, 0.4));
  }

  /* na telefonu tri uze kolone, da panel bude nizak */
  @media (max-width: 599px) {
    .stavke,
    .male-grupe {
      gap: 6px 8px;
      grid-template-columns: repeat(3, 1fr);
    }

    .stavka {
      font-size: 13px;
      gap: 6px;
    }

    h3 {
      margin-top: 10px;
    }
  }

  button:focus-visible {
    outline: 2px solid ${boja};
    outline-offset: 2px;
  }
`

const stavka = (slika, sirina, visina, naziv, stil = '') => `
  <div class="stavka">
    <span class="ikona"><img src="${slika}" width="${sirina}" height="${visina}" alt=""${stil ? ` style="${stil}"` : ''}></span>
    <span>${naziv}</span>
  </div>`

const vrsta = type => {
  const {slika, sirina, visina} = izgledMarkera({type})
  const visinaIkone = type === 'lokalni' ? 22 : 34
  return stavka(slika, Math.round(sirina * visinaIkone / visina), visinaIkone, t(type + 'Jednina'))
}

// istaknuti, obican i lokalni spomenik razlikuju se samo velicinom znaka, pa stoje zajedno na pocetku
const vrste = stavka('slike/obelisk.png', 12, 44, t('najznacajnijiVeci'))
  + ['spomenik', 'lokalni', 'kompleks', 'ploca', 'groblje', 'muzej', 'bista'].map(vrsta).join('')

const grupa = ([naslov, stavke]) => `<div><h3>${naslov}</h3><div class="stavke">${stavke}</div></div>`

const maleGrupe = [
  [t('grupaPosetaJednina'), stavka('slike/obelisk.png', 10, 34, t('lista'), 'filter: drop-shadow(0 0 3px #f2b705) drop-shadow(0 0 2px #f2b705)')
    + stavka('slike/obelisk.png', 10, 34, t('posetio'), 'opacity: 0.5')],
  [t('grupaStanje'), stavka('slike/obelisk-rusevina.png', 10, 34, t('ruineJednina')) + stavka('slike/obelisk-uklonjen.png', 10, 34, t('nestao'))],
]

// legenda je u donjem levom uglu mape i otvara se samo na zahtev, da ne zaklanja spomenike
export default class Legenda extends HTMLElement {
  constructor() {
    super()
    this.dugme = document.createElement('button')
    this.dugme.id = 'dugme'
    this.dugme.textContent = t('legenda')
    this.dugme.addEventListener('click', () => this.prikazi(this.panel.hidden))

    this.panel = document.createElement('section')
    this.panel.id = 'panel'
    this.panel.hidden = true
    this.panel.innerHTML = `
      <header><span>${t('legenda')}</span><button title="${t('zatvori')}">×</button></header>
      <div class="sadrzaj">
        ${grupa([t('grupaVrsta'), vrste])}
        <div class="male-grupe">${maleGrupe.map(grupa).join('')}</div>
      </div>
    `
    this.panel.querySelector('header button').addEventListener('click', () => this.prikazi(false))

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(style, this.dugme, this.panel)

    mapa.on('click', () => this.prikazi(false))
    mapa.on('izbor', ({marker}) => marker && this.prikazi(false))
  }

  prikazi(otvoren) {
    this.panel.hidden = !otvoren
    this.dugme.hidden = otvoren
  }
}

customElements.define('dugme-legenda', Legenda)
