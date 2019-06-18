import {mapa} from '../data/konfigMape.js'
import {$} from '../utils/helpers.js'
const {LatLng, InfoWindow, Marker} = google.maps

const slike = []
const pomak = 200
const brojSlika = window.innerWidth / 45

let ucitaneSlike = false

/* FUNKCIJE */

function noviProzor(s, url) {
  const content = `
    <h3>${s.mesto}</h3>
    </p>${s.naziv || ''}</p>
    <a href="${url}">Find place</a>
    ${s.info ? `<a href="${s.info}" target="_blank">Read more</a>` : ''}
  `
  return new InfoWindow({content})
}

function noviMarker(infoWindow, s) {
  return new Marker({
    map: mapa,
    infoWindow,
    position: new LatLng(s.koordinate.lat, s.koordinate.lng),
    title: s.naziv || s.mesto,
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

function otvori(prozor, marker, s) {
  prozor.open(mapa, marker)
  if (!s.slika || prozor.dodataSlika) return
  prozor.setContent(prozor.getContent() + `<p><img src="${s.slika}"></p>`)
  prozor.dodataSlika = true
}

function nadjiMe() {
  navigator.geolocation.getCurrentPosition(({coords}) => {
    mapa.setCenter(new LatLng(coords.latitude, coords.longitude))
  })
}

function init(spomenici) {
  spomenici.map((s, i) => {
    const url = praviUrl(s.place_id, s.koordinate)
    const prozor = noviProzor(s, url)
    const marker = noviMarker(prozor, s)
    marker.addListener('click', () => otvori(prozor, marker, s))

    if (!s.slika) return
    const slika = document.createElement('img')
    slika.addEventListener('click', () => {
      otvori(prozor, marker, s)
      mapa.panTo(marker.getPosition())
    })
    slike.push(slika)
    $('#slike').appendChild(slika)
    slika.izvor = s.slika // za kasnije
    if (i < brojSlika) slika.src = s.slika
  })
}

/* INIT */

fetch('data/spomenici.json')
  .then(response => response.json())
  .then(init)

$('#slike').style.marginLeft = 0 // set start position

/* INIT */

$('#strelica-leva').on('click', () => {
  if (parseInt($('#slike').style.marginLeft) + pomak > 0) return
  $('#slike').style.marginLeft = `${parseInt($('#slike').style.marginLeft) + pomak}px`
})

$('#strelica-desna').on('click', () => {
  if (!ucitaneSlike) slike.map(slika => slika.src = slika.izvor)
  $('#slike').style.marginLeft = `${parseInt($('#slike').style.marginLeft) - pomak}px`
  ucitaneSlike = true
})

$('#lokator').on('click', nadjiMe)
