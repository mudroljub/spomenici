import {$, praviProzor, praviMarker} from './modules/helpers.js'
import Slika from './komponente/Slika.js'
import './komponente/PunEkran.js'
import './komponente/Slajder.js'
import './komponente/Lokator.js'

const brojSlika = window.innerWidth / 50

/* FUNKCIJE */

function pripremiSlike(spomenici) {
  return spomenici
    .filter(spomen => spomen.slika)
    .map(spomen => {
      const prozor = praviProzor(spomen)
      const marker = praviMarker(prozor, spomen)
      return new Slika(spomen, marker, prozor)
    })
}

function init(spomenici) {
  const slike = pripremiSlike(spomenici)
  slike.forEach((slika, i) => {
    if (i < brojSlika) slika.src = slika.dataset.src
    $('nav-slajder').shadowRoot.querySelector('#slike').appendChild(slika)
  })
}

/* INIT */

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(init)
