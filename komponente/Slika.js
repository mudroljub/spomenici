export default class Slika extends HTMLImageElement {

  constructor(spomen, marker) {
    super()
    this.src = `https://spomenici-api.herokuapp.com/kolekcija/spomenici/slika/${spomen._id}`
    this.alt = this.title = `Spomenik ${spomen.naslov}`

    this.addEventListener('click', () => marker.otvoriProzor())
    this.ondragstart = () => false // sprecava vucenje slike
    this.onerror = () => this.style.display = 'none'
  }
}

customElements.define('nav-slika', Slika, { extends: 'img' })
