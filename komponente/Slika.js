export default class Slika extends HTMLImageElement {

  constructor(spomen, marker) {
    super()
    this.dataset.src = spomen.slika
    this.alt = this.title = `Spomenik ${spomen.title}`

    this.addEventListener('click', () => marker.otvoriProzor())
    this.ondragstart = () => false // sprecava vucenje slike
    this.onerror = () => this.style.display = 'none'
  }

  connectedCallback() {
    this.src = this.dataset.src // da ne ucitava pre nego sto se doda u dom
  }
}

customElements.define('nav-slika', Slika, { extends: 'img' })
