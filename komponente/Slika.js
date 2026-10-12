export default class Slika extends HTMLElement {

  constructor(spomen, marker) {
    super()
    this.url = spomen.slika
    this.slika = document.createElement('img')
    this.slika.alt = this.slika.title = `Spomenik ${spomen.title}`
    this.slika.ondragstart = () => false // sprecava vucenje slike
    this.slika.onerror = () => this.style.display = 'none'

    this.addEventListener('click', () => marker.otvoriProzor())
  }

  connectedCallback() {
    this.slika.src = this.url // da ne ucitava pre nego sto se doda u dom
    this.appendChild(this.slika)
  }
}

customElements.define('nav-slika', Slika)
