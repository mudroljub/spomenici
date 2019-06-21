import {mapa} from './mapa.js'
const {InfoWindow, Marker, LatLng} = google.maps

Element.prototype.on = Element.prototype.addEventListener

export const $ = s => document.querySelectorAll(s).length > 1
  ? document.querySelectorAll(s)
  : document.querySelector(s)

function praviUrl(placeId, koord) {
  const placeUrl = `?q=place_id:${placeId}`
  const koordUrl = `${koord.lat},${koord.lng}`
  const androidUrl = `geo:${koord.lat},${koord.lng}`
  const browserUrl = `https://www.google.com/maps/place/${placeId ? placeUrl : koordUrl}`
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
  const url = praviUrl(spomen.place_id, spomen.koordinate)
  const content = `
    <h3>${spomen.mesto}</h3>
    </p>${spomen.naziv || ''}</p>
    <a href="${url}">Find place</a>
    ${spomen.info ? `<a href="${spomen.info}" target="_blank">Read more</a>` : ''}
  `
  return new InfoWindow({content})
}

export function praviMarker(infoWindow, spomen) {
  const marker = new Marker({
    map: mapa,
    infoWindow,
    position: new LatLng(spomen.koordinate.lat, spomen.koordinate.lng),
    title: spomen.naziv || spomen.mesto,
    icon: 'slike/obelisk.png'
  })
  marker.addListener('click', () => otvoriProzor(infoWindow, marker, spomen.slika))
  return marker
}
