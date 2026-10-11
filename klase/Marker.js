import {mestoUrl, navigacijaUrl, umanjenaSlika, escapeHtml} from '../utils/helpers.js'

const vazneKategorije = ['kompleks', 'muzej']
const razmeraZuma = {6: 0.5, 7: 0.55, 8: 0.65, 9: 0.8} // ostali zumovi pun obelisk
const razmeraVaznih = 1.25

const ikonice = {}
const dajIkonicu = razmera => ikonice[razmera] = ikonice[razmera] || L.icon({
  iconUrl: 'slike/obelisk.png',
  iconSize: [Math.round(14 * razmera), Math.round(50 * razmera)],
  iconAnchor: [Math.round(7 * razmera), Math.round(50 * razmera)],
  popupAnchor: [0, -Math.round(46 * razmera)],
})

export default class Marker {

  constructor(spomen) {
    const pozicija = [spomen.koordinate.lat, spomen.koordinate.lng]
    this.vazan = vazneKategorije.includes(spomen.type)
    // name namerno sadrzi HTML linkove, pa se ne escape-uje
    const sadrzaj = `
        <h3>${escapeHtml(spomen.title)}</h3>
        <p>${spomen.name || ''}</p>
        <p class="akcije">
          <a href="${escapeHtml(navigacijaUrl(spomen.koordinate))}" target="_blank" class="glavna">Navigate</a>
          <a href="${escapeHtml(mestoUrl(spomen.koordinate))}">Find place</a>
          ${spomen.info ? `<a href="${escapeHtml(spomen.info)}" target="_blank">Read more</a>` : ''}
        </p>
        ${spomen.slika ? `<p><img src="${escapeHtml(umanjenaSlika(spomen.slika, 'l'))}" onerror="this.remove()"></p>` : ''}
        ${spomen.author ? `<p>Author: ${escapeHtml(spomen.author)}</p>` : ''}
      `

    this.element = L
      .marker(pozicija, {icon: dajIkonicu(1), zIndexOffset: this.vazan ? 1000 : 0})
      .bindPopup(sadrzaj)
  }

  prilagodi(zum) {
    const razmera = (razmeraZuma[zum] || 1) * (this.vazan ? razmeraVaznih : 1)
    this.element.setIcon(dajIkonicu(razmera))
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    this.element.openPopup()
  }
}
