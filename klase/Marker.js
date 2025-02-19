import {praviUrl} from '../utils/helpers.js'

export default class Marker {

  constructor(spomen) {
    const ikonica = L.icon({
      iconUrl: 'slike/obelisk.png',
      forceZIndex: 999,
      iconAnchor: [0, 40],
    })
    const url = praviUrl(spomen.gmapPlaceId, spomen.lokacija)
    this.element = L
      .marker([spomen.lokacija.lat, spomen.lokacija.lon], {icon: ikonica})
      .bindPopup(`
        <h3>${spomen.naslov}</h3>
        </p>${spomen.opis || ''}</p>
        <a href="${url}">Find place</a>
        ${spomen.website ? `<a href="${spomen.website}" target="_blank">Read more</a>` : ''}
        <p><img src="spomenici.json/slika/${spomen._id}"></p>
      `)
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    this.element.openPopup()
  }
}
