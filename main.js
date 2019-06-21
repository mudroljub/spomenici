import {praviProzor, praviMarker} from './utils/helpers.js'
import Slika from './komponente/Slika.js'
import Slajder from './komponente/Slajder.js'
import './komponente/PunEkran.js'
import './komponente/Lokator.js'


/* FUNKCIJE */

function init(spomenici) {
  const slike = []
  spomenici.forEach(spomen => {
    const prozor = praviProzor(spomen)
    const marker = praviMarker(prozor, spomen)
    if (spomen.slika) slike.push(new Slika(spomen, marker, prozor))
  })
  document.body.appendChild(new Slajder(slike))

  const filtrirano = spomenici.filter(s => !s.slika) // 253
  console.log(filtrirano)
}

/* INIT */

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(init)
