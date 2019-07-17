import Slika from './komponente/Slika.js'
import Pretraga from './komponente/Pretraga.js'
import Slajder from './komponente/Slajder.js'
import Marker from './klase/Marker.js'
import './komponente/PunEkran.js'
import './komponente/Lokator.js'
import {$, jeRazvoj} from './utils/helpers.js'
import {mapa} from './klase/mapa.js'

const markeri = L.layerGroup().addTo(mapa)

/* FUNKCIJE */

const render = spomenici => {
  $('#slajder-okvir').innerHTML = ''
  markeri.clearLayers()
  const slike = []
  spomenici.forEach(spomenik => {
    const marker = new Marker(spomenik)
    markeri.addLayer(marker.element)
    slike.push(new Slika(spomenik, marker))
  })
  $('#slajder-okvir').appendChild(new Slajder(slike))
}

/* INIT */

if (!jeRazvoj() && 'serviceWorker' in navigator)
  navigator.serviceWorker.register('utils/service-worker.js')

fetch('https://spomenici-api.herokuapp.com/kolekcija/spomenici')
  .then(res => res.json())
  .then(res => {
    render(res.data)
    document.body.appendChild(new Pretraga(res.data, render))
  })
