import {mapa} from './modules/mapa.js'
import {$, otvori} from './modules/helpers.js'
const {LatLng, InfoWindow, Marker} = google.maps
import Slika from './komponente/Slika.js'
import './komponente/PunEkran.js'
import './komponente/Slajder.js'
import './komponente/Lokator.js'

/* FUNKCIJE */

function noviProzor(spom, url) {
  const content = `
    <h3>${spom.mesto}</h3>
    </p>${spom.naziv || ''}</p>
    <a href="${url}">Find place</a>
    ${spom.info ? `<a href="${spom.info}" target="_blank">Read more</a>` : ''}
  `
  return new InfoWindow({content})
}

function noviMarker(infoWindow, spom) {
  return new Marker({
    map: mapa,
    infoWindow,
    position: new LatLng(spom.koordinate.lat, spom.koordinate.lng),
    title: spom.naziv || spom.mesto,
    icon: 'slike/obelisk.png'
  })
}

function praviUrl(placeId, koord) {
  const placeUrl = `?q=place_id:${placeId}`
  const koordUrl = `${koord.lat},${koord.lng}`
  const androidUrl = `geo:${koord.lat},${koord.lng}`
  const browserUrl = `https://www.google.com/maps/place/${placeId ? placeUrl : koordUrl}`
  return /(android)/i.test(navigator.userAgent) ? androidUrl : browserUrl
}

function novaSlika(spom, prozor, marker) {
  const slika = new Slika(spom, marker, prozor)
  return slika
}

function pripremiSlike(spomenici) {
  const brojSlika = window.innerWidth / 50
  return spomenici
    .filter(spom => spom.slika)
    .map((spom, i) => {
      const url = praviUrl(spom.place_id, spom.koordinate)
      const prozor = noviProzor(spom, url)
      const marker = noviMarker(prozor, spom)
      marker.addListener('click', () => otvori(prozor, marker, spom.slika))
      const slika = novaSlika(spom, prozor, marker)
      if (i < brojSlika) slika.src = slika.dataset.src
      return slika
    })
}

function proslediSlajderu(slike) {
  slike.forEach(slika => {
    $('nav-slajder').shadowRoot.querySelector('#slike').appendChild(slika)
  })
}

function init(spomenici) {
  const slike = pripremiSlike(spomenici)
  proslediSlajderu(slike)
}

/* INIT */

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(init)
