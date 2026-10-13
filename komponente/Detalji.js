import {mapa} from '../klase/mapa.js'
import {mestoUrl, navigacijaUrl, escapeHtml, naziviStanja, nestao} from '../utils/helpers.js'
import {dajOznaku, postaviOznaku, promene} from '../utils/oznake.js'
import {uRuti, dodajURutu, ukloniIzRute, promeneRute} from '../utils/ruta.js'
import {jezik, t} from '../utils/jezik.js'

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

  .sadrzaj > p:last-child {
    margin-bottom: 0;
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

  .slika {
    margin: 12px 0 0;
    position: relative;
  }

  img {
    border-radius: 8px 8px 0 0;
    display: block;
    height: auto;
    width: 100%;
  }

  /* licenca slika sa Wikimedije trazi ime autora; stoji preko slike, da ne odvoji sliku od oznaka */
  figcaption {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px 0 0 0;
    bottom: 0;
    box-sizing: border-box;
    color: #fff;
    font-size: 11px;
    max-width: 100%;
    overflow: hidden;
    padding: 2px 6px;
    position: absolute;
    right: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sadrzaj > .slika + .poseta {
    margin-top: 0;
  }

  .sadrzaj > .slika + .poseta .oznaka {
    border-radius: 0 0 9px 9px;
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

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid ${boja};
    outline-offset: 3px;
  }

  .oznaka svg {
    flex: none;
    height: 18px;
    width: 18px;
  }

  .oznaka {
    background: #ece9e1;
    border-radius: 9px;
    box-sizing: border-box;
    display: flex;
    gap: 4px;
    padding: 4px;
    width: 100%;
  }

  .oznaka button {
    align-items: center;
    background: none;
    border: none;
    border-radius: 6px;
    color: #555;
    cursor: pointer;
    display: flex;
    flex: 1;
    font: 14px system-ui, sans-serif;
    gap: 6px;
    justify-content: center;
    min-height: 44px;
    min-width: 0;
    padding: 8px 6px;
  }

  .oznaka button:hover {
    background: #fffdf8;
  }

  .oznaka [data-oznaka="lista"][aria-pressed="true"] {
    background: #f2df9e;
    color: #594510;
  }

  .oznaka [data-oznaka="lista"][aria-pressed="true"] svg {
    fill: currentColor;
  }

  .oznaka [data-oznaka="posetio"][aria-pressed="true"] {
    background: #355d48;
    color: #fff;
  }

  .akcije #ruta[aria-pressed="true"] {
    background: #f3e1dc;
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

    // name namerno sadrzi HTML linkove, pa se ne escape-uje; na engleskom ima prednost nad izvornim nazivom
    const naziv = jezik === 'en' && spomen.name ? spomen.name : spomen.naziv ? escapeHtml(spomen.naziv) : spomen.name || ''
    this.panel.innerHTML = `
      ${izRute ? `<button id="nazad">‹ ${t('mojaRuta')}</button>` : ''}
      <header>
        <h2>
          ${escapeHtml(spomen.title)}
          ${spomen.stanje ? `<span class="stanje ${nestao(spomen.stanje) ? 'nestao' : ''}">${naziviStanja[spomen.stanje]}</span>` : ''}
        </h2>
        <button id="zatvori" title="Close">×</button>
      </header>
      <div class="sadrzaj">
        <p>
          ${naziv}
          ${vise ? `<a href="${escapeHtml(vise)}" target="_blank" class="vise">Read more ›</a>` : ''}
        </p>
        ${podaci ? `<p class="podaci">${podaci}</p>` : ''}
        <p class="akcije">
          <a href="${escapeHtml(navigacijaUrl(spomen.koordinate))}" target="_blank" class="glavna">${t('navigacija')}</a>
          <a href="${escapeHtml(mestoUrl(spomen))}" target="_blank">${t('mesto')}</a>
          <button id="ruta">${t('ruta')}</button>
        </p>
        ${spomen.slika ? `
          <figure class="slika">
            <img src="${escapeHtml(spomen.slika)}" alt="" onerror="this.parentNode.remove()">
            ${spomen.slikaAutor ? `<figcaption>Photo: ${escapeHtml(spomen.slikaAutor)}</figcaption>` : ''}
          </figure>
        ` : ''}
        <p class="poseta">
          <span class="oznaka" role="group" aria-label="My visit">
            <button data-oznaka="lista"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z" stroke-linejoin="round"/></svg>${t('lista')}</button>
            <button data-oznaka="posetio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('posetio')}</button>
          </span>
        </p>
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

}

customElements.define('detalji-spomenika', Detalji)
