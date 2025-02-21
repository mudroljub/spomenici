import {praviUrl} from '../utils/helpers.js'

export default class Marker {

  constructor(spomen) {
    const ikonica = L.icon({
      iconUrl: 'slike/obelisk.png',
      forceZIndex: 999,
      iconAnchor: [0, 40],
    })
    const url = praviUrl(spomen.koordinate)
    this.element = L
      .marker([spomen.koordinate.lat, spomen.koordinate.lng], {icon: ikonica})
      .bindPopup(spomen.modal ? spomen.modal : `
        <h3>${spomen.title}</h3>
        <p>${spomen.name || ''}</p>
        <a href="${url}">Find place</a>
        ${spomen.info ? `<a href="${spomen.info}" target="_blank">Read more</a>` : ''}
        <p><img src="${spomen.slika}"></p>
        ${spomen.author ? `<p>Author: ${spomen.author}</p>` : ''}
      `)
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    this.element.openPopup()
  }
}
