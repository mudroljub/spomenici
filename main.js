import {mapa} from './modules/mapa.js'
import {$} from './modules/helpers.js'
const {LatLng, InfoWindow, Marker} = google.maps

const slike = []
const korak = 200
const brojSlika = window.innerWidth / 45

let dirnutX = 0
let pustenX = 0
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

function otvoriPunEkran() {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function praviSlajder(s, prozor, marker, i) {
  if (!s.slika) return
  const slika = document.createElement('img')
  slika.on('click', () => {
    otvori(prozor, marker, s.slika)
    mapa.panTo(marker.getPosition())
  })
  slike.push(slika)
  $('#slike').appendChild(slika)
  slika.dataset.izvor = s.slika // za kasnije
  if (i < brojSlika) slika.src = s.slika
}

function mrdajDesno() {
  if (parseInt($('#slike').style.marginLeft) + korak > 0) return
  $('#slike').style.marginLeft = `${parseInt($('#slike').style.marginLeft) + korak}px`
}

function mrdajLevo() {
  if (!ucitaneSlike) slike.map(slika => slika.src = slika.dataset.izvor)
  $('#slike').style.marginLeft = `${parseInt($('#slike').style.marginLeft) - korak}px`
  ucitaneSlike = true
}

function init(spomenici) {
  spomenici.forEach((s, i) => {
    const url = praviUrl(s.place_id, s.koordinate)
    const prozor = noviProzor(s, url)
    const marker = noviMarker(prozor, s)
    marker.addListener('click', () => otvori(prozor, marker, s.slika))
    praviSlajder(s, prozor, marker, i)
  })
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

$('#punekran').on('click', otvoriPunEkran)

$('#slike').on('touchstart', e => {
  dirnutX = e.changedTouches[0].screenX
})

$('#slike').on('touchend', e => {
  pustenX = e.changedTouches[0].screenX
  if (pustenX > dirnutX) mrdajDesno()
  if (pustenX < dirnutX) mrdajLevo()
})
