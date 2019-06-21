import {mapa} from './mapa.js'
const {InfoWindow, Marker, LatLng} = google.maps

Element.prototype.on = Element.prototype.addEventListener

export const $ = s => document.querySelectorAll(s).length > 1
  ? document.querySelectorAll(s)
  : document.querySelector(s)

function praviUrl(gmapPlaceId, koord) {
  const placeUrl = `?q=place_id:${gmapPlaceId}`
  const koordUrl = `${koord.lat},${koord.lon}`
  const androidUrl = `geo:${koord.lat},${koord.lon}`
  const browserUrl = `https://www.google.com/maps/place/${gmapPlaceId ? placeUrl : koordUrl}`
  return /(android)/i.test(navigator.userAgent) ? androidUrl : browserUrl
}

function dodajSlikuProzoru(prozor, slika) {
  if (!slika || prozor.imaSliku) return
  prozor.setContent(prozor.getContent() + `<p><img src="${slika}"></p>`)
  prozor.imaSliku = true
}

export function otvoriProzor(prozor, marker, slika) {
  prozor.open(mapa, marker)
  dodajSlikuProzoru(prozor, slika)
}

export function praviProzor(spomen) {
  const url = praviUrl(spomen.gmapPlaceId, spomen.lokacija)
  const content = `
    <h3>${spomen.naslov}</h3>
    </p>${spomen.opis || ''}</p>
    <a href="${url}">Find place</a>
    ${spomen.info ? `<a href="${spomen.info}" target="_blank">Read more</a>` : ''}
  `
  return new InfoWindow({content})
}

export function praviMarker(infoWindow, spomen) {
  const marker = new Marker({
    map: mapa,
    infoWindow,
    position: new LatLng(spomen.lokacija.lat, spomen.lokacija.lon),
    title: spomen.opis || spomen.naslov,
    icon: 'slike/obelisk.png'
  })
  marker.addListener('click', () => otvoriProzor(infoWindow, marker, spomen.slika))
  return marker
}
