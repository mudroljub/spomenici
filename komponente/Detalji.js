import {mapa} from '../klase/mapa.js'
import {mestoUrl, navigacijaUrl, escapeHtml, naziviStanja, nestao} from '../utils/helpers.js'
import {dajOznaku, postaviOznaku, promene} from '../utils/oznake.js'
import {uRuti, dodajURutu, ukloniIzRute, promeneRute} from '../utils/ruta.js'

const boja = '#822323'

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
    left: 0;
    max-height: 65%;
    overflow-y: auto;
    padding-bottom: var(--dno);
    position: fixed;
    right: 0;
    z-index: 1000;
  }

  @media (min-width: 600px) {
    #panel {
      border-radius: 12px;
      bottom: calc(var(--visina-slajdera) + var(--dno) + 10px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      left: 10px;
      max-height: calc(100% - var(--visina-slajdera) - var(--dno) - 80px);
      right: auto;
      width: 360px;
    }
  }

  /* povratak postoji samo na telefonu, gde prozor spomenika prekriva rutu */
  #nazad {
    background: none;
    border: none;
    color: ${boja};
    cursor: pointer;
    font: inherit;
    min-height: 44px;
    padding: 0 16px;
  }

  #nazad + header {
    padding-top: 0;
  }

  @media (min-width: 600px) {
    #nazad {
      display: none;
    }

    #nazad + header {
      padding-top: 12px;
    }
  }

  header {
    align-items: flex-start;
    display: flex;
    justify-content: space-between;
    padding: 12px 0 0 16px;
  }

  h2 {
    font-size: 20px;
    margin: 4px 0 0;
  }

  #zatvori {
    background: none;
    border: none;
    color: #555;
    cursor: pointer;
    flex: none;
    font-size: 28px;
    height: 44px;
    line-height: 1;
    width: 44px;
  }

  .sadrzaj {
    padding: 0 16px 16px;
  }

  .sadrzaj > p {
    margin: 8px 0;
  }

  .stanje {
    background: #eee;
    border-radius: 4px;
    color: #555;
    display: inline-block;
    font-size: 13px;
    font-weight: normal;
    margin-left: 6px;
    padding: 2px 6px;
    vertical-align: middle;
  }

  .stanje.nestao {
    background: ${boja};
    color: #fff;
  }

  .podaci {
    color: #666;
    font-size: 14px;
  }

  a {
    color: ${boja};
  }

  .vise {
    white-space: nowrap;
  }

  /* mesto za sliku je odredjeno unapred, da panel ne skoci kad se slika ucita */
  img {
    background: #efe9df;
    border-radius: 8px;
    display: block;
    height: 30vh;
    margin: 12px 0;
    object-fit: contain;
    width: 100%;
  }

  .akcije {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0 0;
  }

  .akcije a,
  .akcije button {
    background: none;
    border: 1px solid ${boja};
    border-radius: 20px;
    box-sizing: border-box;
    color: ${boja};
    cursor: pointer;
    font: inherit;
    min-height: 40px;
    padding: 8px 14px;
    text-decoration: none;
  }

  .akcije .glavna {
    background: ${boja};
    color: #fff;
  }

  /* jedna oznaka sa dve mogucnosti: delovi su spojeni u jedno dugme */
  .oznaka {
    display: inline-flex;
  }

  /* mesto za kvacicu je uvek rezervisano, da dugme ne promeni sirinu kad se pritisne */
  .akcije .oznaka button {
    border-radius: 0;
    padding: 8px 22px;
    position: relative;
  }

  .akcije .oznaka button:first-child {
    border-radius: 20px 0 0 20px;
  }

  .akcije .oznaka button:last-child {
    border-left: none;
    border-radius: 0 20px 20px 0;
  }

  /* izabrano se razlikuje od glavne akcije: svetla pozadina i kvacica */
  .akcije [aria-pressed="true"] {
    background: #f3e1dc;
  }

  .akcije .oznaka [aria-pressed="true"]::before {
    content: '✓';
    left: 8px;
    position: absolute;
  }

  /* znak ima stalnu sirinu, da dugme ne promeni velicinu kad se pritisne */
  .akcije #ruta::before {
    content: '+';
    display: inline-block;
    width: 1em;
  }

  .akcije #ruta[aria-pressed="true"]::before {
    content: '✓';
  }
`

// pomera mapu tako da izabrani spomenik ostane vidljiv pored panela
const pokaziNaMapi = (marker, panel) => {
  const velicina = mapa.getSize()
  const okvir = panel.getBoundingClientRect()
  const cilj = okvir.left > 0
    ? L.point((velicina.x + okvir.right) / 2, velicina.y / 2)
    : L.point(velicina.x / 2, (velicina.y - okvir.height) / 2 + 25)
  const tacka = mapa.latLngToContainerPoint(marker.dajPoziciju())
  mapa.panBy(tacka.subtract(cilj))
}

const praviLink = id => `${location.origin}${location.pathname}#${encodeURIComponent(id)}`

export default class Detalji extends HTMLElement {
  constructor() {
    super()
    this.panel = document.createElement('section')
    this.panel.id = 'panel'
    this.panel.hidden = true

    this.autori = {}

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(style, this.panel)

    mapa.on('izbor', ({marker, izRute}) => marker ? this.prikazi(marker, izRute) : this.sakrij())
    mapa.on('click', () => this.marker && mapa.fire('izbor', {marker: null}))
    promene.addEventListener('promena', () => this.marker && this.osveziOznake())
    promeneRute.addEventListener('promena', () => this.marker && this.osveziRutu())
  }

  prikazi(marker, izRute) {
    this.marker = marker
    const spomen = marker.spomen
    const podaci = [this.praviAutore(spomen.author), escapeHtml(spomen.year || ''), escapeHtml(spomen.drzava || '')]
      .filter(Boolean).join(' · ')

    // jedan link za vise: clanak na Wikipediji, a bez njega drugi izvor
    const vise = spomen.wiki || spomen.info

    // name namerno sadrzi HTML linkove, pa se ne escape-uje
    this.panel.innerHTML = `
      ${izRute ? '<button id="nazad">‹ My route</button>' : ''}
      <header>
        <h2>
          ${escapeHtml(spomen.title)}
          ${spomen.stanje ? `<span class="stanje ${nestao(spomen.stanje) ? 'nestao' : ''}">${naziviStanja[spomen.stanje]}</span>` : ''}
        </h2>
        <button id="zatvori" title="Close">×</button>
      </header>
      <div class="sadrzaj">
        <p>
          ${spomen.naziv ? escapeHtml(spomen.naziv) : spomen.name || ''}
          ${vise ? `<a href="${escapeHtml(vise)}" target="_blank" class="vise">Read more ›</a>` : ''}
        </p>
        ${podaci ? `<p class="podaci">${podaci}</p>` : ''}
        <p class="akcije">
          <a href="${escapeHtml(navigacijaUrl(spomen.koordinate))}" target="_blank" class="glavna">Navigate</a>
          <a href="${escapeHtml(mestoUrl(spomen))}" target="_blank">Find place</a>
          <button id="ruta">Route</button>
        </p>
        <p class="akcije">
          <span class="oznaka" role="group" aria-label="My visit">
            <button data-oznaka="lista">Want to visit</button>
            <button data-oznaka="posetio">Visited</button>
          </span>
          <button id="podeli">Share</button>
        </p>
        ${spomen.slika ? `<img src="${escapeHtml(spomen.slika)}" alt="" onerror="this.remove()">` : ''}
      </div>
    `
    this.panel.querySelector('#zatvori').addEventListener('click', () => mapa.fire('izbor', {marker: null}))
    this.panel.querySelector('#nazad')?.addEventListener('click', () => mapa.fire('otvoriRutu'))
    // ponovni dodir na izabranu oznaku je skida
    this.panel.querySelectorAll('[data-oznaka]').forEach(dugme => dugme.addEventListener('click', () =>
      postaviOznaku(spomen.id, dajOznaku(spomen.id) === dugme.dataset.oznaka ? null : dugme.dataset.oznaka)
    ))
    this.panel.querySelector('#ruta').addEventListener('click', () =>
      uRuti(spomen.id) ? ukloniIzRute(spomen.id) : dodajURutu(spomen.id)
    )
    this.panel.querySelector('#podeli').addEventListener('click', e => this.podeli(e.target))
    this.osveziOznake()
    this.osveziRutu()

    this.panel.hidden = false
    this.panel.scrollTop = 0
    history.replaceState(null, '', `#${encodeURIComponent(spomen.id)}`)
    pokaziNaMapi(marker, this.panel)
  }

  // link autora je u posebnom spisku, jer isti autor ima vise spomenika
  postaviAutore(autori) {
    this.autori = autori
  }

  praviAutore(autor) {
    if (!autor) return ''
    return autor.split(' & ').map(ime => this.autori[ime]
      ? `<a href="${escapeHtml(this.autori[ime])}" target="_blank">${escapeHtml(ime)}</a>`
      : escapeHtml(ime)
    ).join(' & ')
  }

  sakrij() {
    this.marker = null
    this.panel.hidden = true
    history.replaceState(null, '', location.pathname + location.search)
  }

  osveziOznake() {
    this.panel.querySelectorAll('[data-oznaka]').forEach(dugme =>
      dugme.setAttribute('aria-pressed', dajOznaku(this.marker.spomen.id) === dugme.dataset.oznaka)
    )
  }

  osveziRutu() {
    this.panel.querySelector('#ruta').setAttribute('aria-pressed', uRuti(this.marker.spomen.id))
  }

  podeli(dugme) {
    const {title} = this.marker.spomen
    const url = praviLink(this.marker.spomen.id)
    if (navigator.share) return navigator.share({title, url}).catch(() => {})
    if (!navigator.clipboard) return prompt('Copy link', url)
    navigator.clipboard.writeText(url).then(() => {
      dugme.textContent = 'Link copied'
      setTimeout(() => dugme.textContent = 'Share', 2000)
    })
  }
}

customElements.define('detalji-spomenika', Detalji)
