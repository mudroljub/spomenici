import {mapa} from './mapa.js'
import {dajOznaku} from '../utils/oznake.js'
import {nestao, ruine} from '../utils/helpers.js'

const razmeraZuma = {6: 0.5, 7: 0.55, 8: 0.65, 9: 0.8} // ostali zumovi pun obelisk
const razmeraVaznih = 1.25

// ruine i uklonjeni imaju sliku iste velicine, da se razlikuju po obliku, a ne samo po boji:
// prelomljen obelisk i isprekidan obris onoga cega vise nema
const ikonice = {}
const dajIkonicu = (slika, razmera, klasa) => ikonice[slika + razmera + klasa] ??= L.icon({
  iconUrl: slika,
  iconSize: [Math.round(14 * razmera), Math.round(50 * razmera)],
  iconAnchor: [Math.round(7 * razmera), Math.round(50 * razmera)],
  className: klasa,
})

export default class Marker {

  constructor(spomen) {
    this.spomen = spomen
    this.vazan = Boolean(spomen.istaknut)
    this.slika = nestao(spomen.stanje) ? 'slike/obelisk-uklonjen.png'
      : ruine(spomen.stanje) ? 'slike/obelisk-rusevina.png'
      : 'slike/obelisk.png'
    this.element = L
      .marker([spomen.koordinate.lat, spomen.koordinate.lng], {icon: dajIkonicu(this.slika, 1, ''), zIndexOffset: this.vazan ? 1000 : 0})
      .on('click', () => this.otvoriProzor())
  }

  // velicina zavisi od zuma, a izgled od oznaka
  osvezi(zum, izabran) {
    const razmera = (razmeraZuma[zum] || 1) * (this.vazan ? razmeraVaznih : 1)
    const oznaka = dajOznaku(this.spomen.id)
    const klasa = [
      izabran === this && 'izabran',
      oznaka === 'posetio' && 'posecen',
      oznaka === 'lista' && 'na-listi',
    ].filter(Boolean).join(' ')
    this.element.setIcon(dajIkonicu(this.slika, razmera, klasa))
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    mapa.fire('izbor', {marker: this})
  }
}
