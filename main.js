import Slika from './komponente/Slika.js'
import Slajder from './komponente/Slajder.js'
import Marker from './modeli/Marker.js'
import {mapa} from './modeli/mapa.js'
import './komponente/PunEkran.js'
import './komponente/Lokator.js'
import {$, jeRazvoj, sadrziFrazu} from './utils/helpers.js'

let spomenici = []
const markeri = L.layerGroup().addTo(mapa)

/* FUNKCIJE */

function init(spomenici) {
  $('#slajder-okvir').innerHTML = ''
  markeri.clearLayers()
  const slike = []

  spomenici.forEach(spomenik => {
    const marker = new Marker(spomenik)
    markeri.addLayer(marker.element)
    if (spomenik.slika) slike.push(new Slika(spomenik, marker))
  })

  $('#slajder-okvir').appendChild(new Slajder(slike))
}

// mozda odvojiti u komponentu
$('#pretraga').on('input', e => {
  const { value } = e.target
  if (value.length < 1) return
  const filtrirano = spomenici.filter(s => sadrziFrazu(s, value))
  init(filtrirano)
})

/* INIT */

if (!jeRazvoj() && 'serviceWorker' in navigator)
  navigator.serviceWorker.register('utils/service-worker.js')

fetch('data/spomenici-bez-slika.json')
  .then(res => res.json())
  .then(res => {
    init(res)
    spomenici = res
  })
