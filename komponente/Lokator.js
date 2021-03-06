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
    navigator.geolocation.getCurrentPosition(({coords}) => {
      mapa.panTo(new L.LatLng(coords.latitude, coords.longitude))
    })
  }
}

customElements.define('dugme-lokator', Lokator)
