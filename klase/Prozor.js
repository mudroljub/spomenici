import {mapa} from './mapa.js'
import {praviUrl} from '../utils/helpers.js'
const {InfoWindow} = google.maps

class Prozor extends InfoWindow {
  constructor(spomen) {
    const url = praviUrl(spomen.gmapPlaceId, spomen.lokacija)
    const content = `
      <h3>${spomen.naslov}</h3>
      </p>${spomen.opis || ''}</p>
      <a href="${url}">Find place</a>
      ${spomen.info ? `<a href="${spomen.info}" target="_blank">Read more</a>` : ''}
    `  
    super({content})
  }

  otvori(marker, slika) {
    this.open(mapa, marker)
    this.dodajSliku(slika)
  }  

  dodajSliku(slika) {
    if (!slika || this.imaSliku) return
    this.setContent(this.getContent() + `<p><img src="${slika}"></p>`)
    this.imaSliku = true
  }  
}

export default Prozor
