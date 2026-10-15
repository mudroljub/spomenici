import {malaSlika} from '../utils/helpers.js'

export default class Slika extends HTMLElement {

  constructor(spomen, marker) {
    super()
    this.url = malaSlika(spomen.slika)
    this.slika = document.createElement('img')
    // velicina pre ucitavanja, da traka zna koliko slika staje i ne trazi visak
    this.slika.width = Math.round(116 * spomen.slikaOdnos)
    this.slika.height = 116
    this.slika.alt = this.slika.title = `Spomenik ${spomen.title}`
    this.slika.ondragstart = () => false // sprecava vucenje slike
    this.slika.onerror = () => this.style.display = 'none'
    this.naziv = document.createElement('small')
    this.naziv.textContent = this.naziv.title = spomen.title

    this.addEventListener('click', () => marker.otvoriProzor())
  }

  connectedCallback() {
    this.slika.src = this.url // da ne ucitava pre nego sto se doda u dom
    this.append(this.slika, this.naziv)
  }
}

customElements.define('nav-slika', Slika)
