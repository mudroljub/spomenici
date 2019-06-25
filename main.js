import Slika from './komponente/Slika.js'
import Slajder from './komponente/Slajder.js'
import Marker from './klase/Marker.js'
import './komponente/PunEkran.js'
import './komponente/Lokator.js'
import {$} from './utils/helpers.js'

let spomenici = []
let filtrirano = []

/* FUNKCIJE */

function init(spomenici) {
  $('#slajder-okvir').innerHTML = ''
  const slike = []
  spomenici.forEach(spomenik => {
    const marker = new Marker(spomenik)
    if (spomenik.slika) slike.push(new Slika(spomenik, marker))
  })
  $('#slajder-okvir').appendChild(new Slajder(slike))
}

$('#pretraga').on('input', e => {
  const fraza = e.target.value
  if (fraza.length < 1) return
  filtrirano = spomenici.filter(x =>
    x.naslov.toLowerCase().includes(fraza) ||
    (x.opis && x.opis.toLowerCase().includes(fraza))
  )
  init(filtrirano)
})

/* INIT */

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(res => {
    init(res)
    spomenici = res
  })
