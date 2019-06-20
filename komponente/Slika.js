import {mapa} from '../modules/mapa.js'
import {otvoriProzor} from '../modules/helpers.js'

export default class Slika extends HTMLImageElement {
  constructor(spom, marker, prozor) {
    super()
    this.addEventListener('click', this.locirajMe)
    this.ondragstart = () => false
    this.addEventListener('click', () => {
      otvoriProzor(prozor, marker, spom.slika)
      mapa.panTo(marker.getPosition())
    })
    this.dataset.src = spom.slika // za kasnije
  }
}

customElements.define('nav-slika', Slika, { extends: 'img' })
