// koristi globalnu css var visina-slajdera, proslediti kao props
import {mapa} from '../klase/mapa.js'

const boja = '#1a73e8'

class Lokator extends HTMLElement {
  constructor() {
    super()
    this.oznaka = L.circleMarker([0, 0], {radius: 8, color: '#fff', weight: 2, fillColor: boja, fillOpacity: 1})
    this.preciznost = L.circle([0, 0], {radius: 0, color: boja, weight: 1, fillOpacity: 0.1, interactive: false})
    this.addEventListener('click', this.locirajMe)
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        #lokator {
          bottom: var(--visina-slajdera);
          right: 0;
          padding: 8px;
        }
      </style>
      <img src="slike/ui/lokator.svg" width="32" class="ikonica" id="lokator" alt="lociraj me" title="Locate me">
    `
  }

  locirajMe() {
    if (!navigator.geolocation) return alert('Location is not supported')

    this.trebaCentrirati = true
    if (this.pozicija) return this.centriraj()
    if (this.pracenje !== undefined) return

    this.pracenje = navigator.geolocation.watchPosition(
      polozaj => this.osvezi(polozaj),
      () => this.prekini(),
      {enableHighAccuracy: true}
    )
  }

  osvezi({coords}) {
    this.pozicija = L.latLng(coords.latitude, coords.longitude)
    this.oznaka.setLatLng(this.pozicija).addTo(mapa)
    this.preciznost.setLatLng(this.pozicija).setRadius(coords.accuracy).addTo(mapa)
    mapa.fire('pozicija', {latlng: this.pozicija})
    if (this.trebaCentrirati) this.centriraj()
  }

  // greska posle prvog polozaja je obicno kratak gubitak signala, pa se oznaka zadrzava
  prekini() {
    if (this.pozicija) return
    navigator.geolocation.clearWatch(this.pracenje)
    this.pracenje = undefined
    alert('Location is not available')
  }

  centriraj() {
    this.trebaCentrirati = false
    if (!L.latLngBounds(mapa.options.maxBounds).contains(this.pozicija))
      return alert('Your location is outside the map')
    mapa.panTo(this.pozicija)
  }
}

customElements.define('dugme-lokator', Lokator)
