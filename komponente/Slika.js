import {mapa} from '../utils/mapa.js'
import {otvoriProzor} from '../utils/helpers.js'

export default class Slika extends HTMLImageElement {

  constructor(spomen, marker, prozor) {
    super()
    this.src = spomen.slika
    this.alt = this.title = `Spomenik ${spomen.mesto}`
  
    this.addEventListener('click', () => {
      otvoriProzor(prozor, marker, spomen.slika)
      mapa.panTo(marker.getPosition())
    })
    this.ondragstart = () => false // sprecava vucenje slike
    this.onerror = () => console.log('Slika nije ucitana: ', spomen)
  }

}

customElements.define('nav-slika', Slika, { extends: 'img' })
