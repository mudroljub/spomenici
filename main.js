// import Slika from './komponente/Slika.js'
import Slajder from './komponente/Slajder.js'
import Marker from './klase/Marker.js'
import './komponente/PunEkran.js'
import './komponente/Lokator.js'

/* FUNKCIJE */

function init(spomenici) {
  const slike = []
  spomenici.forEach(spomen => {
    // const prozor = new Prozor(spomen)
    const marker = new Marker(null, spomen)
    // if (spomen.slika) slike.push(new Slika(spomen, marker, prozor))
  })
  document.body.appendChild(new Slajder(slike))
}

/* INIT */

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(init)
