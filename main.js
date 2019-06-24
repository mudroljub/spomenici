import Slika from './komponente/Slika.js'
import Slajder from './komponente/Slajder.js'
import Marker from './klase/Marker.js'
import './komponente/PunEkran.js'
import './komponente/Lokator.js'

/* FUNKCIJE */

function init(spomenici) {
  const slike = []
  spomenici.forEach(spomenik => {
    const marker = new Marker(spomenik)
    if (spomenik.slika) slike.push(new Slika(spomenik, marker))
  })
  document.body.appendChild(new Slajder(slike))
}

/* INIT */

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(init)
