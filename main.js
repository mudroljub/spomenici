import {mapa} from './modules/mapa.js'
import {$} from './modules/helpers.js'
const {LatLng, InfoWindow, Marker} = google.maps
import './komponente/PunEkran.js'

let dirnutX = 0
let pustenX = 0
let ucitaneSlike = false

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

function dodajSliku(prozor, slika) {
  if (!slika || prozor.imaSliku) return
  prozor.setContent(prozor.getContent() + `<p><img src="${slika}"></p>`)
  prozor.imaSliku = true
}

function otvori(prozor, marker, slika) {
  prozor.open(mapa, marker)
  dodajSliku(prozor, slika)
}

function locirajMe() {
  navigator.geolocation.getCurrentPosition(({coords}) => {
    mapa.setCenter(new LatLng(coords.latitude, coords.longitude))
  })
}

function novaSlika(spom, prozor, marker) {
  const slika = document.createElement('img')
  slika.ondragstart = () => false
  slika.on('click', () => {
    otvori(prozor, marker, spom.slika)
    mapa.panTo(marker.getPosition())
  })
  slika.dataset.src = spom.slika // za kasnije
  return slika
}

function pripremiSlike(spomenici) {
  return spomenici
    .filter(spom => spom.slika)
    .map(spom => {
      const url = praviUrl(spom.place_id, spom.koordinate)
      const prozor = noviProzor(spom, url)
      const marker = noviMarker(prozor, spom)
      marker.addListener('click', () => otvori(prozor, marker, spom.slika))
      const slika = novaSlika(spom, prozor, marker)
      return slika
    })
}

function praviSlajder(slike) {
  const brojSlika = window.innerWidth / 50
  slike.forEach((slika, i) => {
    if (i < brojSlika) slika.src = slika.dataset.src
    $('#slike').appendChild(slika)
  })
}

function init(spomenici) {
  const slike = pripremiSlike(spomenici)
  praviSlajder(slike)
}

function mrdaj(smer) {
  const korak = smer ? 200 : -200
  if (parseInt($('#slike').style.marginLeft) + korak > 0) return
  if (!ucitaneSlike) [...$('#slike img')].map(slika => slika.src = slika.dataset.src)
  $('#slike').style.marginLeft = `${parseInt($('#slike').style.marginLeft) + korak}px`
  ucitaneSlike = true
}

function mrdajDesno() {
  mrdaj(true)
}

function mrdajLevo() {
  mrdaj(false)
}

/* INIT */

$('#slike').style.marginLeft = 0 // set start position

fetch('data/spomenici.json')
  .then(res => res.json())
  .then(init)

/* DOGADJAJI */

$('#strelica-leva').on('click', mrdajDesno)

$('#strelica-desna').on('click', mrdajLevo)

$('#lokator').on('click', locirajMe)

$('#slike').on('touchstart', e => {
  dirnutX = e.changedTouches[0].screenX
})

$('#slike').on('touchend', e => {
  pustenX = e.changedTouches[0].screenX
  mrdaj(pustenX > dirnutX)
})

$('#slike').on('mousedown', e => {
  dirnutX = e.clientX
})

$('#slike').on('mouseup', e => {
  pustenX = e.clientX
  mrdaj(pustenX > dirnutX)
})
