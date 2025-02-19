import {praviUrl} from '../utils/helpers.js'

export default class Marker {

  constructor(spomen) {
    const ikonica = L.icon({
      iconUrl: 'slike/obelisk.png',
      forceZIndex: 999,
      iconAnchor: [0, 40],
    })
    const url = praviUrl(spomen.place_id, spomen.koordinate)
    this.element = L
      .marker([spomen.koordinate.lat, spomen.koordinate.lng], {icon: ikonica})
      .bindPopup(`
        <h3>${spomen.mesto}</h3>
        </p>${spomen.naziv || ''}</p>
        <a href="${url}">Find place</a>
        ${spomen.website ? `<a href="${spomen.website}" target="_blank">Read more</a>` : ''}
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
