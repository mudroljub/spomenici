import {mapa} from './mapa.js'
import {praviUrl} from '../utils/helpers.js'
const {marker} = L

export default class Marker {
  constructor(prozor, spomen) {
    const url = praviUrl(spomen.gmapPlaceId, spomen.lokacija)
    marker([spomen.lokacija.lat, spomen.lokacija.lon])
      .addTo(mapa)
      .bindPopup(`
        <h3>${spomen.naslov}</h3>
        </p>${spomen.opis || ''}</p>
        <a href="${url}">Find place</a>
        ${spomen.info ? `<a href="${spomen.info}" target="_blank">Read more</a>` : ''}
        <p><img src="${spomen.slika}"></p>
      `)
  }
}
