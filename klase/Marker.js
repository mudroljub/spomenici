import {mapa} from './mapa.js'
import {dajOznaku} from '../utils/oznake.js'
import {izgledMarkera} from '../utils/ikonice.js'

const razmeraZuma = {6: 0.5, 7: 0.55, 8: 0.65, 9: 0.8} // ostali zumovi pun obelisk
const razmeraVaznih = 1.25
const razmeraSitnih = 0.6
const sitneVrste = ['lokalni', 'ploca', 'bista']

// ruine i uklonjeni imaju sliku iste velicine, da se razlikuju po obliku, a ne samo po boji:
// prelomljen obelisk i isprekidan obris onoga cega vise nema
const ikonice = {}
const dajIkonicu = ({slika, sirina, visina}, razmera, klasa) => {
  const sirinaPrikaza = Math.round(sirina * razmera)
  const visinaPrikaza = Math.round(visina * razmera)
  return ikonice[slika + razmera + klasa] ??= L.icon({
    iconUrl: slika,
    iconSize: [sirinaPrikaza, visinaPrikaza],
    iconAnchor: [Math.round(sirinaPrikaza / 2), visinaPrikaza],
    className: klasa,
  })
}

export default class Marker {

  constructor(spomen) {
    this.spomen = spomen
    this.vazan = Boolean(spomen.istaknut)
    this.sitan = sitneVrste.includes(spomen.type)
    this.izgled = izgledMarkera(spomen)
    this.element = L
      .marker([spomen.koordinate.lat, spomen.koordinate.lng], {icon: dajIkonicu(this.izgled, 1, ''), zIndexOffset: this.vazan ? 1000 : 0})
      .on('click', () => this.otvoriProzor())
  }

  // velicina zavisi od zuma, a izgled od oznaka
  osvezi(zum, izabran) {
    const razmera = (razmeraZuma[zum] || 1) * (this.vazan ? razmeraVaznih : this.sitan ? razmeraSitnih : 1)
    const oznaka = dajOznaku(this.spomen.id)
    const klasa = [
      izabran === this && 'izabran',
      oznaka === 'posetio' && 'posecen',
      oznaka === 'lista' && 'na-listi',
    ].filter(Boolean).join(' ')
    this.element.setIcon(dajIkonicu(this.izgled, razmera, klasa))
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    mapa.fire('izbor', {marker: this})
  }
}
