import {mapa} from './mapa.js'
import {praviUrl} from '../utils/helpers.js'

const ikonica = L.icon({
  iconUrl: 'slike/obelisk.png',
})

export default class Marker {
  constructor(spomen) {
    const url = praviUrl(spomen.gmapPlaceId, spomen.lokacija)
    this.element = L.marker([spomen.lokacija.lat, spomen.lokacija.lon], {icon: ikonica})
      .addTo(mapa)
      .bindPopup(`
        <h3>${spomen.naslov}</h3>
        </p>${spomen.opis || ''}</p>
        <a href="${url}">Find place</a>
        ${spomen.info ? `<a href="${spomen.info}" target="_blank">Read more</a>` : ''}
        <p><img src="${spomen.slika}"></p>
      `)
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    this.element.openPopup()
  }
}
