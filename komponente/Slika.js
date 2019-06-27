export default class Slika extends HTMLImageElement {

  constructor(spomen, marker) {
    super()
    this.src = 'data:image/jpeg;base64,' + spomen.slika
    this.alt = this.title = `Spomenik ${spomen.naslov}`

    this.addEventListener('click', () => marker.otvoriProzor())
    this.ondragstart = () => false // sprecava vucenje slike
    this.onerror = () => console.log('Slika nije ucitana: ', spomen)
  }
}

customElements.define('nav-slika', Slika, { extends: 'img' })
