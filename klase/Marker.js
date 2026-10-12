import {mapa} from './mapa.js'
import {dajOznaku} from '../utils/oznake.js'
import {nestao} from '../utils/helpers.js'

const razmeraZuma = {6: 0.5, 7: 0.55, 8: 0.65, 9: 0.8} // ostali zumovi pun obelisk
const razmeraVaznih = 1.25

const ikonice = {}
const dajIkonicu = (razmera, klasa) => ikonice[razmera + klasa] = ikonice[razmera + klasa] || L.icon({
  iconUrl: 'slike/obelisk.png',
  iconSize: [Math.round(14 * razmera), Math.round(50 * razmera)],
  iconAnchor: [Math.round(7 * razmera), Math.round(50 * razmera)],
  className: klasa,
})

export default class Marker {

  constructor(spomen) {
    this.spomen = spomen
    this.vazan = Boolean(spomen.istaknut)
    this.element = L
      .marker([spomen.koordinate.lat, spomen.koordinate.lng], {icon: dajIkonicu(1, ''), zIndexOffset: this.vazan ? 1000 : 0})
      .on('click', () => this.otvoriProzor())
  }

  // velicina zavisi od zuma, a izgled od oznaka
  osvezi(zum, izabran) {
    const razmera = (razmeraZuma[zum] || 1) * (this.vazan ? razmeraVaznih : 1)
    const oznaka = dajOznaku(this.spomen.id)
    const klasa = [
      izabran === this && 'izabran',
      nestao(this.spomen.stanje) && 'nestao',
      oznaka === 'posetio' && 'posecen',
      oznaka === 'lista' && 'na-listi',
    ].filter(Boolean).join(' ')
    this.element.setIcon(dajIkonicu(razmera, klasa))
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    mapa.fire('izbor', {marker: this})
  }
}
