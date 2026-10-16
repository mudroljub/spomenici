import {mapa} from './mapa.js'
import {dajOznaku} from '../utils/oznake.js'
import {izgledMarkera, senka} from '../utils/ikonice.js'
import {nazivSpomenika, escapeHtml} from '../utils/helpers.js'

const razmeraZuma = {6: 0.5, 7: 0.55, 8: 0.65, 9: 0.8} // ostali zumovi pun obelisk
const vazneVrste = ['istaknut', 'kompleks', 'groblje']
const sitneVrste = ['lokalni', 'ploca']
// bista je umetnicko delo kao spomenik, pa se vidi kad i on, samo je malo manja
const razmeraVrste = {istaknut: 1.25, kompleks: 1.25, groblje: 1.25, bista: 0.8, lokalni: 0.6, ploca: 0.6}

// ruine i uklonjeni imaju sliku iste velicine, da se razlikuju po obliku, a ne samo po boji:
// prelomljen obelisk i isprekidan obris onoga cega vise nema
const ikonice = {}
const dajIkonicu = ({slika, sirina, visina}, razmera, klasa) => {
  const px = vrednost => Math.round(vrednost * razmera)
  return ikonice[slika + razmera + klasa] ??= L.icon({
    iconUrl: slika,
    iconSize: [px(sirina + senka.levo + senka.desno), px(visina + senka.dole)],
    iconAnchor: [px(senka.levo + sirina / 2), px(visina)],
    tooltipAnchor: [0, -px(visina)],
    className: klasa,
  })
}

// na dodirnom ekranu nema prelaska misem, a dodir odmah otvara spomenik
const imaMis = matchMedia('(hover: hover)').matches

const opis = spomen => {
  const naziv = nazivSpomenika(spomen)
  const mesto = `<b>${escapeHtml(spomen.mesto)}</b>`
  return naziv ? `${mesto}<br>${escapeHtml(naziv)}` : mesto
}

export default class Marker {

  constructor(spomen) {
    this.spomen = spomen
    this.vazan = vazneVrste.includes(spomen.vrsta)
    this.sitan = sitneVrste.includes(spomen.vrsta)
    this.razmera = razmeraVrste[spomen.vrsta] || 1
    this.izgled = izgledMarkera(spomen)
    this.element = L
      .marker([spomen.koordinate.lat, spomen.koordinate.lng], {icon: dajIkonicu(this.izgled, 1, ''), zIndexOffset: this.vazan ? 1000 : 0})
      .on('click', () => this.otvoriProzor())
    if (imaMis) this.element.bindTooltip(() => opis(spomen), {direction: 'top', className: 'naziv-spomenika'})
  }

  // velicina zavisi od zuma, a izgled od oznaka
  osvezi(zum, izabran) {
    const razmera = (razmeraZuma[zum] || 1) * this.razmera
    const oznaka = dajOznaku(this.spomen.id)
    const klasa = [
      izabran === this && 'izabran',
      oznaka === 'posetio' && 'posecen',
      oznaka === 'lista' && 'na-listi',
    ].filter(Boolean).join(' ')
    const ikonica = dajIkonicu(this.izgled, razmera, klasa)
    // nova ikonica pravi novu sliku u DOM-u, pa samo kad se promeni
    if (ikonica !== this.element.options.icon) this.element.setIcon(ikonica)
  }

  dajPoziciju() {
    return this.element.getLatLng()
  }

  otvoriProzor() {
    mapa.fire('izbor', {marker: this})
  }
}
