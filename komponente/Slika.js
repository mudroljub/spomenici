import {mapa} from '../klase/mapa.js'

export default class Slika extends HTMLImageElement {

  constructor(spomen, marker, prozor) {
    super()
    this.src = spomen.slika
    this.alt = this.title = `Spomenik ${spomen.naslov}`
  
    this.addEventListener('click', () => {
      prozor.otvori(marker, spomen.slika)
      mapa.panTo(marker.getPosition())
    })
    this.ondragstart = () => false // sprecava vucenje slike
    this.onerror = () => console.log('Slika nije ucitana: ', spomen)
  }

}

customElements.define('nav-slika', Slika, { extends: 'img' })
