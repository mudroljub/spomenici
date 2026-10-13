import {mapa} from '../klase/mapa.js'
import {nestao, ruine} from '../utils/helpers.js'
import {dajOznaku, promene} from '../utils/oznake.js'
import {t, nazivDrzave} from '../utils/jezik.js'
import {izgledMarkera} from '../utils/ikonice.js'

const boja = '#822323'

// unutar grupe vazi bilo koja izabrana opcija (ili), a izmedju grupa sve (i)
const praviGrupe = drzave => [
  {kljuc: 'istaknut', naziv: t('grupaPrikaz'), opcije: {istaknut: t('najznacajniji')},
    uslov: s => Boolean(s.istaknut)},
  {kljuc: 'stanje', naziv: t('grupaStanje'), opcije: {postoji: t('postoji'), rusevine: t('ruine'), nestao: t('uklonjen')},
    uslov: (s, o) => o === 'nestao' ? nestao(s.stanje) : o === 'rusevine' ? ruine(s.stanje) : !nestao(s.stanje) && !ruine(s.stanje)},
  {kljuc: 'poseta', naziv: t('grupaPoseta'), opcije: {neposecen: t('neposecen'), lista: t('lista'), posetio: t('posetio')},
    uslov: (s, o) => o === 'neposecen' ? dajOznaku(s.id) !== 'posetio' : dajOznaku(s.id) === o},
  {kljuc: 'drzava', naziv: t('grupaDrzava'), opcije: Object.fromEntries(drzave.map(d => [d, nazivDrzave(d)])),
    uslov: (s, o) => s.drzava === o},
  {kljuc: 'tip', naziv: t('grupaVrsta'), opcije: {kompleks: t('kompleks'), spomenik: t('spomenik'), lokalni: t('lokalni'), ploca: t('ploca'), groblje: t('groblje'), muzej: t('muzej')},
    uslov: (s, o) => (s.type || 'spomenik') === o},
]

const style = document.createElement('style')
style.textContent = `
  :host {
    font: 16px system-ui, sans-serif;
  }

  #panel {
    background: #fffdf8;
    border-radius: 12px 12px 0 0;
    bottom: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    left: 0;
    max-height: 85%;
    padding-bottom: var(--dno);
    position: fixed;
    right: 0;
    z-index: 1001;
  }

  #panel[hidden] {
    display: none;
  }

  @media (min-width: 600px) {
    #panel {
      border-radius: 12px;
      bottom: auto;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      left: auto;
      max-height: calc(100% - var(--visina-slajdera) - var(--dno) - 80px);
      right: 10px;
      top: calc(60px + var(--vrh));
      width: 400px;
    }
  }

  header, footer {
    align-items: center;
    display: flex;
    flex: none;
    justify-content: space-between;
    padding: 4px 4px 4px 16px;
  }

  header {
    border-bottom: 1px solid #e5ddd0;
    font-weight: bold;
  }

  footer {
    border-top: 1px solid #e5ddd0;
    gap: 8px;
    padding: 10px 16px;
  }

  #zatvori {
    background: none;
    border: none;
    color: #555;
    cursor: pointer;
    font-size: 28px;
    height: 44px;
    width: 44px;
  }

  .grupe {
    overflow-y: auto;
    padding: 0 16px 8px;
  }

  h3 {
    color: #666;
    font-size: 13px;
    font-weight: normal;
    letter-spacing: 0.04em;
    margin: 14px 0 8px;
    text-transform: uppercase;
  }

  .cipovi {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  button.cip {
    background: white;
    border: 1px solid #c9bfb0;
    border-radius: 18px;
    color: #333;
    cursor: pointer;
    font: inherit;
    font-size: 15px;
    min-height: 36px;
    padding: 6px 12px;
  }

  button.cip[aria-pressed="true"] {
    background: ${boja};
    border-color: ${boja};
    color: #fff;
  }

  button.cip:disabled {
    opacity: 0.4;
  }

  .broj {
    margin-left: 4px;
    opacity: 0.7;
  }

  #ponisti {
    background: none;
    border: none;
    color: ${boja};
    cursor: pointer;
    font: inherit;
    padding: 10px 0;
    text-decoration: underline;
  }

  #prikazi {
    background: ${boja};
    border: none;
    border-radius: 20px;
    color: #fff;
    cursor: pointer;
    flex: 1;
    font: inherit;
    max-width: 260px;
    min-height: 44px;
  }

  .legenda {
    color: #555;
    display: grid;
    font-size: 14px;
    gap: 6px 10px;
    grid-template-columns: 20px 1fr;
    align-items: end;
  }

  .legenda img {
    filter: drop-shadow(2px 3px 2px rgba(0, 0, 0, 0.4));
    justify-self: center;
  }
`

const legenda = `
  <h3>${t('legenda')}</h3>
  <div class="legenda">
    ${['kompleks', 'spomenik', 'lokalni', 'ploca', 'groblje', 'muzej'].map(type => {
    const {slika, sirina, visina} = izgledMarkera({type})
    const visinaIkone = type === 'lokalni' ? 22 : 34
    return `<img src="${slika}" width="${Math.round(sirina * visinaIkone / visina)}" height="${visinaIkone}" alt=""><span>${t(type)}</span>`
  }).join('')}
    <img src="slike/obelisk.png" width="12" height="44" alt=""><span>${t('najznacajnijiVeci')}</span>
    <img src="slike/obelisk.png" width="10" height="34" alt=""><span>${t('ostali')}</span>
    <img src="slike/obelisk.png" width="10" height="34" alt="" style="filter: drop-shadow(0 0 3px #f2b705) drop-shadow(0 0 2px #f2b705)"><span>${t('lista')}</span>
    <img src="slike/obelisk.png" width="10" height="34" alt="" style="opacity: 0.5"><span>${t('posetio')}</span>
    <img src="slike/obelisk-rusevina.png" width="10" height="34" alt=""><span>${t('ruine')}</span>
    <img src="slike/obelisk-uklonjen.png" width="10" height="34" alt=""><span>${t('nestao')}</span>
  </div>
`

export default class Filteri extends HTMLElement {
  constructor(stavke) {
    super()
    const drzave = [...new Set(stavke.map(({spomenik}) => spomenik.drzava))].sort((a, b) => nazivDrzave(a).localeCompare(nazivDrzave(b)))
    this.grupe = praviGrupe(drzave)
    this.izbor = Object.fromEntries(this.grupe.map(g => [g.kljuc, new Set()]))
    this.osnova = stavke

    this.panel = document.createElement('section')
    this.panel.id = 'panel'
    this.panel.hidden = true
    this.panel.innerHTML = `
      <header>${t('filteri')}<button id="zatvori" title="${t('zatvori')}">×</button></header>
      <div class="grupe"></div>
      <footer><button id="ponisti">${t('obrisiSve')}</button><button id="prikazi"></button></footer>
    `
    this.sadrzaj = this.panel.querySelector('.grupe')
    this.panel.querySelector('#zatvori').addEventListener('click', () => this.zatvori())
    this.panel.querySelector('#ponisti').addEventListener('click', () => this.ponisti())
    // filteri ne menjaju zum ni polozaj mape; to odredjuje korisnik
    this.panel.querySelector('#prikazi').addEventListener('click', () => this.zatvori())
    this.sadrzaj.addEventListener('click', e => {
      const cip = e.target.closest('button.cip')
      if (cip) this.obrni(cip.dataset.grupa, cip.dataset.opcija)
    })

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(style, this.panel)

    promene.addEventListener('promena', () => {
      if (this.izbor.poseta.size) this.javi()
      else if (!this.panel.hidden) this.prikaziGrupe()
    })
  }

  // spomenici koji odgovaraju pretrazi; brojevi uz opcije se racunaju od njih
  postaviOsnovu(stavke) {
    this.osnova = stavke
    if (!this.panel.hidden) this.prikaziGrupe()
  }

  odgovara(spomenik, osim) {
    return this.grupe.every(g => g.kljuc === osim || !this.izbor[g.kljuc].size ||
      [...this.izbor[g.kljuc]].some(o => g.uslov(spomenik, o)))
  }

  brojAktivnih() {
    return Object.values(this.izbor).reduce((zbir, izabrano) => zbir + izabrano.size, 0)
  }

  obrni(grupa, opcija) {
    const izabrano = this.izbor[grupa]
    if (izabrano.has(opcija)) izabrano.delete(opcija)
    else izabrano.add(opcija)
    this.javi()
  }

  ponisti() {
    Object.values(this.izbor).forEach(izabrano => izabrano.clear())
    this.javi()
  }

  javi() {
    this.dispatchEvent(new Event('promena'))
    if (!this.panel.hidden) this.prikaziGrupe()
  }

  otvori() {
    mapa.fire('izbor', {marker: null})
    this.prikaziGrupe()
    this.panel.hidden = false
  }

  zatvori() {
    this.panel.hidden = true
  }

  prikaziGrupe() {
    const cipovi = g => Object.entries(g.opcije).map(([opcija, naziv]) => {
      const broj = this.osnova.filter(({spomenik}) => this.odgovara(spomenik, g.kljuc) && g.uslov(spomenik, opcija)).length
      const izabran = this.izbor[g.kljuc].has(opcija)
      return `<button class="cip" data-grupa="${g.kljuc}" data-opcija="${opcija}" aria-pressed="${izabran}"
        ${!broj && !izabran ? 'disabled' : ''}>${naziv}<span class="broj">${broj}</span></button>`
    }).join('')

    this.sadrzaj.innerHTML = this.grupe.map(g => `
      <h3>${g.naziv}</h3>
      <div class="cipovi">${cipovi(g)}</div>
    `).join('') + legenda

    const ukupno = this.osnova.filter(({spomenik}) => this.odgovara(spomenik)).length
    this.panel.querySelector('#prikazi').textContent = t('prikazi', ukupno)
  }
}

customElements.define('panel-filteri', Filteri)
