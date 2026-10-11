import Slika from './komponente/Slika.js'
import Pretraga from './komponente/Pretraga.js'
import Slajder from './komponente/Slajder.js'
import Marker from './klase/Marker.js'
import './komponente/PunEkran.js'
import './komponente/Lokator.js'
import {$} from './utils/helpers.js'
import {mapa} from './klase/mapa.js'

const markeri = L.layerGroup().addTo(mapa)

/* FUNKCIJE */

const praviStavku = spomenik => {
  const marker = new Marker(spomenik)
  const slika = spomenik.slika && new Slika(spomenik, marker)
  return {spomenik, marker, slika}
}

const render = stavke => {
  $('#slajder-okvir').innerHTML = ''
  mapa.closePopup()
  markeri.clearLayers()
  stavke.forEach(({marker}) => markeri.addLayer(marker.element))
  const slike = stavke.map(({slika}) => slika).filter(Boolean)
  $('#slajder-okvir').appendChild(new Slajder(slike))
}

/* INIT */

fetch('data/spomeniks.json')
  .then(res => res.json())
  .then(spomenici => {
    const stavke = spomenici.map(praviStavku)
    render(stavke)
    document.body.appendChild(new Pretraga(stavke, render))
  })
