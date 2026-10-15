import Slika from './komponente/Slika.js'
import Pretraga from './komponente/Pretraga.js'
import Slajder from './komponente/Slajder.js'
import Najblizi from './komponente/Najblizi.js'
import Detalji from './komponente/Detalji.js'
import Ruta from './komponente/Ruta.js'
import Marker from './klase/Marker.js'
import './komponente/PunEkran.js'
import './komponente/Jezik.js'
import './komponente/Legenda.js'
import './komponente/Lokator.js'
import {$} from './utils/helpers.js'
import {jezik} from './utils/jezik.js'
import {mapa, postaviMarkere} from './klase/mapa.js'

document.documentElement.lang = jezik

const najblizi = new Najblizi()
const ruta = new Ruta()
$('dugme-legenda').after(ruta, najblizi)
const detalji = document.body.appendChild(new Detalji())

/* FUNKCIJE */

const praviStavku = spomenik => {
  const marker = new Marker(spomenik)
  const slika = spomenik.slika && new Slika(spomenik, marker)
  return {spomenik, marker, slika}
}

// link za deljenje (#id) otvara mapu na tom spomeniku
const otvoriIzLinka = stavke => {
  const id = decodeURIComponent(location.hash.slice(1))
  const stavka = id && stavke.find(({spomenik}) => spomenik.id === id)
  if (!stavka) return
  mapa.setView(stavka.marker.dajPoziciju(), 11, {animate: false})
  stavka.marker.otvoriProzor()
}

const render = (stavke, suzeno) => {
  $('#slajder-okvir').innerHTML = ''
  postaviMarkere(stavke.map(({marker}) => marker), suzeno)
  const slike = stavke.map(({slika}) => slika).filter(Boolean)
  $('#slajder-okvir').appendChild(new Slajder(slike))
  najblizi.postavi(stavke)
}

/* INIT */

// rad bez signala
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js')

const ucitaj = putanja => fetch(putanja).then(res => res.json())

Promise.all([ucitaj('data/spomeniks.json'), ucitaj('data/autori.json'), ucitaj('data/posvete.json'), ucitaj('data/ture.json')])
  .then(([spomenici, autori, posvete, ture]) => {
    detalji.postaviAutore(autori)
    detalji.postaviPosvete(posvete)
    const stavke = spomenici.map(praviStavku)
    render(stavke, false)
    ruta.postavi(stavke, ture)
    document.body.appendChild(new Pretraga(stavke, nadjene => render(nadjene, nadjene.length < stavke.length)))
    otvoriIzLinka(stavke)
  })
