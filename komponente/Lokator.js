// koristi globalnu css var visina-slajdera, proslediti kao props
import {mapa} from '../klase/mapa.js'

class Lokator extends HTMLElement {
  constructor() {
    super()
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

    navigator.geolocation.getCurrentPosition(({coords}) => {
      const pozicija = L.latLng(coords.latitude, coords.longitude)
      if (!L.latLngBounds(mapa.options.maxBounds).contains(pozicija))
        return alert('Your location is outside the map')
      mapa.panTo(pozicija)
    }, () => alert('Location is not available'))
  }
}

customElements.define('dugme-lokator', Lokator)
