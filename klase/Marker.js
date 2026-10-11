import {praviUrl, escapeHtml} from '../utils/helpers.js'

export default class Marker {

  constructor(spomen) {
    const ikonica = L.icon({
      iconUrl: 'slike/obelisk.png',
      iconAnchor: [0, 40],
    })
    const url = praviUrl(spomen.koordinate)
    // name namerno sadrzi HTML linkove, pa se ne escape-uje
    this.element = L
      .marker([spomen.koordinate.lat, spomen.koordinate.lng], {icon: ikonica})
      .bindPopup(`
        <h3>${escapeHtml(spomen.title)}</h3>
        <p>${spomen.name || ''}</p>
        <a href="${escapeHtml(url)}">Find place</a>
        ${spomen.info ? `<a href="${escapeHtml(spomen.info)}" target="_blank">Read more</a>` : ''}
        ${spomen.slika ? `<p><img src="${escapeHtml(spomen.slika)}" onerror="this.remove()"></p>` : ''}
        ${spomen.author ? `<p>Author: ${escapeHtml(spomen.author)}</p>` : ''}
      `)
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    this.element.openPopup()
  }
}
