import {mapa} from '../klase/mapa.js'
import {naziviStanja} from '../utils/helpers.js'
import {dajRutu, dajNaziv, postaviRutu, izaberiTuru, ukloniIzRute, pomeri, promeneRute} from '../utils/ruta.js'

const boja = '#822323'
const najviseZaGoogle = 10 // odrediste i 9 usputnih tacaka

const style = document.createElement('style')
style.textContent = `
  :host {
    font: 16px system-ui, sans-serif;
  }

  [hidden] {
    display: none !important;
  }

  #dugme {
    background: ${boja};
    border: none;
    border-radius: 22px;
    bottom: calc(var(--visina-slajdera) + var(--dno) + 2px);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    color: #fff;
    cursor: pointer;
    font: inherit;
    left: 10px;
    min-height: 44px;
    padding: 0 16px;
    position: fixed;
    z-index: 1;
  }

  #panel {
    background: #fffdf8;
    border-radius: 12px 12px 0 0;
    bottom: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
    left: 0;
    max-height: 65%;
    overflow-y: auto;
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

  button {
    cursor: pointer;
    font: inherit;
  }

  /* kartice i zatvaranje su uvek vidljivi, i kad se spisak pomeri */
  header {
    background: #fffdf8;
    border-bottom: 1px solid #ddd;
    display: flex;
    padding-left: 4px;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .kartice {
    display: flex;
    flex: 1;
  }

  .kartice button {
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    color: #666;
    min-height: 48px;
    padding: 0 12px;
  }

  .kartice [aria-selected="true"] {
    border-bottom-color: ${boja};
    color: #222;
  }

  #zatvori {
    align-self: center;
    background: none;
    border: none;
    color: #555;
    font-size: 28px;
    height: 44px;
    width: 44px;
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    align-items: center;
    border-bottom: 1px solid #eee;
    display: flex;
    padding-left: 16px;
  }

  li button {
    background: none;
    border: none;
    color: #555;
    flex: none;
    height: 44px;
    width: 44px;
  }

  li button:disabled {
    opacity: 0.25;
  }

  .broj {
    color: ${boja};
    flex: none;
    font-weight: bold;
    min-width: 28px;
  }

  li .naziv {
    color: inherit;
    flex: 1;
    height: auto;
    min-width: 0;
    padding: 10px 0;
    text-align: left;
    width: auto;
  }

  .opis {
    color: #666;
    display: block;
    font-size: 14px;
  }

  li .tura {
    padding: 10px 16px 10px 0;
  }

  /* spisak mesta u turi staje u dva reda */
  .tura .opis {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow: hidden;
  }

  .alati {
    border-bottom: 1px solid #eee;
    display: flex;
    margin: 0;
    padding: 0 4px;
  }

  .alati button {
    background: none;
    border: none;
    color: ${boja};
    min-height: 44px;
    padding: 0 12px;
    text-decoration: underline;
  }

  #isprazni {
    margin-left: auto;
  }

  #ime-rute {
    font-size: 18px;
    margin: 0;
    padding: 12px 16px 4px;
  }

  .uvod {
    margin: 0;
    padding: 16px;
  }

  /* glavna akcija je uvek pri dnu panela */
  footer {
    background: #fffdf8;
    border-top: 1px solid #ddd;
    bottom: 0;
    padding: 12px 16px calc(12px + var(--dno));
    position: sticky;
  }

  .glavna {
    background: ${boja};
    border-radius: 20px;
    box-sizing: border-box;
    color: #fff;
    display: block;
    padding: 10px 14px;
    text-align: center;
    text-decoration: none;
  }

  .napomena {
    color: #666;
    font-size: 14px;
    margin: 8px 0 0;
  }

  #ture {
    padding-bottom: var(--dno);
  }
`

const bezHtml = tekst => (tekst || '').replace(/<[^>]*>/g, '')

const tacka = ({lat, lng}) => `${lat},${lng}`

// bez polazista Google Maps krece od trenutnog polozaja
const googleUrl = spomenici => {
  const stanice = spomenici.slice(0, najviseZaGoogle).map(s => tacka(s.koordinate))
  const parametri = new URLSearchParams({api: 1, destination: stanice.pop()})
  if (stanice.length) parametri.set('waypoints', stanice.join('|'))
  return `https://www.google.com/maps/dir/?${parametri}`
}

// priblizno najkraci obilazak: uvek najbliza sledeca stanica, pa 2-opt okretanje deonica koje se ukrstaju
// polaziste ostaje prvo, a vraca indekse ostalih tacaka redom obilaska
const najkraciRedosled = (polaziste, tacke) => {
  const tacka = i => i < 0 ? polaziste : tacke[i]
  const d = (i, j) => j === undefined ? 0 : tacka(i).distanceTo(tacka(j)) // put je otvoren, posle kraja nema deonice
  const ostale = tacke.map((_, i) => i)
  const put = [-1]
  while (ostale.length) {
    const poslednja = put[put.length - 1]
    const najbliza = ostale.reduce((a, b) => d(poslednja, b) < d(poslednja, a) ? b : a)
    put.push(...ostale.splice(ostale.indexOf(najbliza), 1))
  }

  let popravljeno = true
  while (popravljeno) {
    popravljeno = false
    for (let i = 1; i < put.length - 1; i++)
      for (let k = i + 1; k < put.length; k++) {
        const ustede = d(put[i - 1], put[i]) + d(put[k], put[k + 1]) - d(put[i - 1], put[k]) - d(put[i], put[k + 1])
        if (ustede > 1) {
          put.splice(i, k - i + 1, ...put.slice(i, k + 1).reverse())
          popravljeno = true
        }
      }
  }
  return put.slice(1)
}

export default class Ruta extends HTMLElement {
  constructor() {
    super()
    this.stavke = new Map()
    this.linija = L.polyline([], {color: boja, weight: 3, dashArray: '6 8', interactive: false})

    this.dugme = document.createElement('button')
    this.dugme.id = 'dugme'
    this.dugme.hidden = true // do ucitavanja spomenika
    this.dugme.addEventListener('click', () => this.otvori())

    this.panel = document.createElement('section')
    this.panel.id = 'panel'
    this.panel.hidden = true
    this.panel.innerHTML = `
      <header>
        <div class="kartice" role="tablist">
          <button role="tab" data-kartica="planer"></button>
          <button role="tab" data-kartica="ture">Suggested routes</button>
        </div>
        <button id="zatvori" title="Close">×</button>
      </header>
      <div id="planer" role="tabpanel">
        <h2 id="ime-rute"></h2>
        <p class="uvod" id="prazna">No stops yet. Add monuments with <b>+ Route</b> in their details, or pick one of the suggested routes.</p>
        <p class="alati">
          <button id="redosled">Optimize order</button>
          <button id="isprazni">Clear route</button>
        </p>
        <ol id="stanice"></ol>
        <footer>
          <a id="google" target="_blank" class="glavna">Open in Google Maps</a>
          <p class="napomena" id="ogranicenje"></p>
        </footer>
      </div>
      <div id="ture" role="tabpanel">
        <ol id="spisak-tura"></ol>
      </div>
    `
    this.lista = this.panel.querySelector('#stanice')
    this.panel.querySelector('#zatvori').addEventListener('click', () => this.panel.hidden = true)
    this.panel.querySelectorAll('[data-kartica]').forEach(kartica =>
      kartica.addEventListener('click', () => this.prikaziKarticu(kartica.dataset.kartica))
    )
    this.panel.querySelector('#redosled').addEventListener('click', () => this.poredjaj())
    this.panel.querySelector('#isprazni').addEventListener('click', () => postaviRutu([]))

    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(style, this.dugme, this.panel)

    promeneRute.addEventListener('promena', () => this.prikazi())
    mapa.on('izbor', ({marker}) => marker && (this.panel.hidden = true))
    mapa.on('pozicija', ({latlng}) => this.pozicija = latlng)
  }

  postavi(stavke, ture) {
    this.stavke = new Map(stavke.map(stavka => [stavka.spomenik.id, stavka]))
    this.panel.querySelector('#spisak-tura').replaceChildren(...ture.map(tura => this.praviTuru(tura)))
    this.prikazi()
  }

  // id-jevi iz starijih podataka koji vise ne postoje se preskacu
  stanice() {
    return dajRutu().map(id => this.stavke.get(id)).filter(Boolean)
  }

  // prazna ruta nema sta da pokaze, pa se otvaraju ture
  otvori() {
    mapa.fire('izbor', {marker: null})
    this.prikaziKarticu(this.stanice().length ? 'planer' : 'ture')
    this.panel.hidden = false
  }

  prikaziKarticu(kartica) {
    this.kartica = kartica
    this.osveziKartice()
    this.panel.scrollTop = 0
  }

  osveziKartice() {
    const broj = this.stanice().length
    this.panel.querySelectorAll('[data-kartica]').forEach(kartica => {
      const izabrana = kartica.dataset.kartica === this.kartica
      kartica.setAttribute('aria-selected', izabrana)
      this.panel.querySelector(`#${kartica.dataset.kartica}`).hidden = !izabrana
    })
    this.panel.querySelector('[data-kartica="planer"]').textContent = broj ? `My route · ${broj}` : 'My route'
  }

  prikazi() {
    const stanice = this.stanice()
    this.dugme.hidden = false
    this.dugme.textContent = stanice.length ? `My route · ${stanice.length}` : 'My route'
    this.osveziKartice()

    this.linija.setLatLngs(stanice.map(({marker}) => marker.dajPoziciju()))
    if (stanice.length > 1) this.linija.addTo(mapa)
    else this.linija.remove()

    this.lista.replaceChildren(...stanice.map((stavka, i) => this.praviRed(stavka, i, stanice.length)))
    this.panel.querySelector('#google').href = googleUrl(stanice.map(({spomenik}) => spomenik))
    const ogranicenje = this.panel.querySelector('#ogranicenje')
    ogranicenje.hidden = stanice.length <= najviseZaGoogle
    ogranicenje.textContent = `Google Maps takes only the first ${najviseZaGoogle} stops.`
    this.panel.querySelector('#prazna').hidden = stanice.length > 0
    this.panel.querySelector('#ime-rute').textContent = dajNaziv()
    this.panel.querySelector('#ime-rute').hidden = !dajNaziv()
    this.panel.querySelector('.alati').hidden = !stanice.length
    this.panel.querySelector('footer').hidden = !stanice.length
    this.panel.querySelector('#redosled').hidden = stanice.length < 3
  }

  praviRed({spomenik, marker}, i, ukupno) {
    const red = document.createElement('li')
    red.innerHTML = `
      <span class="broj"></span>
      <button class="naziv"><span class="ime"></span><span class="opis"></span></button>
      <button title="Move up" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button title="Move down" ${i === ukupno - 1 ? 'disabled' : ''}>↓</button>
      <button title="Remove">×</button>
    `
    const naziv = bezHtml(spomenik.name)
    red.querySelector('.broj').textContent = i + 1
    red.querySelector('.ime').textContent = naziv || spomenik.title
    red.querySelector('.opis').textContent = [naziv && spomenik.title, naziviStanja[spomenik.stanje]].filter(Boolean).join(' · ')
    red.querySelector('.naziv').addEventListener('click', () => marker.otvoriProzor())
    red.querySelector('[title="Move up"]').addEventListener('click', () => pomeri(spomenik.id, -1))
    red.querySelector('[title="Move down"]').addEventListener('click', () => pomeri(spomenik.id, 1))
    red.querySelector('[title="Remove"]').addEventListener('click', () => ukloniIzRute(spomenik.id))
    return red
  }

  praviTuru({naziv, spomenici}) {
    const red = document.createElement('li')
    red.innerHTML = '<button class="naziv tura"><span class="ime"></span><span class="opis"></span></button>'
    const mesta = spomenici.map(id => this.stavke.get(id)?.spomenik.title).filter(Boolean)
    red.querySelector('.ime').textContent = naziv
    red.querySelector('.opis').textContent = `${mesta.length} stops: ${mesta.join(', ')}`
    red.querySelector('button').addEventListener('click', () => {
      izaberiTuru({naziv, spomenici})
      this.prikaziKarticu('planer')
      this.pokaziTuru()
    })
    return red
  }

  // jedini izuzetak od pravila da mapa sama ne menja zum: izabrana tura je obicno van vidnog polja
  // na telefonu panel prekriva vecinu mape, pa se zatvara da bi se tura videla cela
  pokaziTuru() {
    const panelLevo = this.panel.getBoundingClientRect().left > 0
    if (!panelLevo) this.panel.hidden = true
    const levo = panelLevo ? this.panel.getBoundingClientRect().right : 0
    const dole = mapa.getSize().y - this.dugme.getBoundingClientRect().top
    mapa.fitBounds(this.linija.getBounds(), {
      paddingTopLeft: [levo + 30, 80],
      paddingBottomRight: [30, dole + 20],
      maxZoom: 11,
    })
  }

  // polazi od korisnika ako je lociran, inace prva stanica ostaje prva
  poredjaj() {
    const stanice = this.stanice()
    const tacke = stanice.map(({marker}) => marker.dajPoziciju())
    const redosled = this.pozicija
      ? najkraciRedosled(this.pozicija, tacke)
      : [0, ...najkraciRedosled(tacke[0], tacke.slice(1)).map(i => i + 1)]
    postaviRutu(redosled.map(i => stanice[i].spomenik.id))
  }
}

customElements.define('planer-rute', Ruta)
