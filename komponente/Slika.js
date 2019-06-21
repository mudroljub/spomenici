import {mapa} from '../utils/mapa.js'
import {otvoriProzor} from '../utils/helpers.js'

export default class Slika extends HTMLImageElement {

  constructor(spomen, marker, prozor) {
    super()
    this.addEventListener('click', this.locirajMe)
    this.ondragstart = () => false // zaustavlja pomeranje slike ispod misha
    this.addEventListener('click', () => {
      otvoriProzor(prozor, marker, spomen.slika)
      mapa.panTo(marker.getPosition())
    })
    this.dataset.src = spomen.slika // za kasnije
    this.alt = this.title = `Spomenik ${spomen.mesto}`
  }

  dodeliIzvor() {
    if (this.src) return
    this.src = this.dataset.src
    delete this.dataset.src
  }
}

customElements.define('nav-slika', Slika, { extends: 'img' })
