import {praviProzor, praviMarker} from './utils/helpers.js'
import Slika from './komponente/Slika.js'
import Slajder from './komponente/Slajder.js'
import './komponente/PunEkran.js'
import './komponente/Lokator.js'

const inicijalnoSlika = window.innerWidth / 50

/* FUNKCIJE */

function init(spomenici) {
  const slike = []
  spomenici.forEach((spomen, i) => {
    const prozor = praviProzor(spomen)
    const marker = praviMarker(prozor, spomen)
    if (spomen.slika) {
      const slika = new Slika(spomen, marker, prozor)
      if (i < inicijalnoSlika) slika.src = slika.dataset.src
      slike.push(slika)
    }
  })
  document.body.appendChild(new Slajder(slike))
}

/* INIT */

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(init)
