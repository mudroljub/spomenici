import {mapa} from '../utils/mapa.js'
import {otvoriProzor} from '../utils/helpers.js'

export default class Slika extends HTMLImageElement {

  constructor(spomen, marker, prozor) {
    super()
    this.alt = this.title = `Spomenik ${spomen.mesto}`
    this.dataset.src = spomen.slika // za kasnije

    this.addEventListener('click', () => {
      otvoriProzor(prozor, marker, spomen.slika)
      mapa.panTo(marker.getPosition())
    })
    this.ondragstart = () => false // sprecava vucenje slike
    this.onerror = () => console.log('Slika nije ucitana: ', spomen)
  }

  dodeliIzvor() {
    if (this.src) return
    this.src = this.dataset.src
    delete this.dataset.src
  }
}

customElements.define('nav-slika', Slika, { extends: 'img' })
