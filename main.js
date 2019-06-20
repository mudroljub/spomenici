import {$, praviProzor, praviMarker} from './modules/helpers.js'
import Slika from './komponente/Slika.js'
import './komponente/PunEkran.js'
import Slajder from './komponente/Slajder.js'
import './komponente/Lokator.js'

const inicijalnoSlika = window.innerWidth / 50

/* FUNKCIJE */

function init(spomenici) {
  const slike = spomenici.map((spomen, i) => {
    const prozor = praviProzor(spomen)
    const marker = praviMarker(prozor, spomen)
    const slika = new Slika(spomen, marker, prozor)
    if (slika.dataset.src && i < inicijalnoSlika) slika.src = slika.dataset.src
    // TODO: proslediti podatke komponenti na pametniji nacin
    $('nav-slajder').shadowRoot.querySelector('#slike').appendChild(slika)
    return slika
  })
  // new Slajder(slike)
}

/* INIT */

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(init)
