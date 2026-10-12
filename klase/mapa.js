import {promene} from '../utils/oznake.js'

const konfigMape = {
  zoom: 8,
  minZoom: 6,
  center: [44.341667, 17.269444],
  scrollWheelZoom: false,
  maxBounds: [
    [39, 10], // jug zapad
    [49, 26]  // sever istok
  ],
  maxBoundsViscosity: 1.0 // sprecava odskakanje
}

export const mapa = L.map('mapa', konfigMape) // singlton

// touchpad: dva prsta pomeraju mapu, a stipanje (wheel sa ctrlKey) zumira oko kursora
const pragZuma = 40
let zbirZuma = 0

mapa.getContainer().addEventListener('wheel', e => {
  e.preventDefault()
  const korak = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1
  if (!e.ctrlKey) return mapa.panBy([e.deltaX * korak, e.deltaY * korak], {animate: false})

  zbirZuma += e.deltaY * korak
  if (Math.abs(zbirZuma) < pragZuma) return
  const tacka = mapa.mouseEventToContainerPoint(e)
  mapa.setZoomAround(tacka, mapa.getZoom() + (zbirZuma < 0 ? 1 : -1))
  zbirZuma = 0
}, {passive: false})

// pozicija korisnika iznad markera, da je ne prekriju
mapa.createPane('korisnik').style.zIndex = 650

const sloj = L.layerGroup().addTo(mapa)
let prikazani = []
let izabran = null

// izdaleka su obelisci manji, da se manje preklapaju; ikonica pokazuje i oznake
const osveziIkonice = () => prikazani.forEach(marker => marker.osvezi(mapa.getZoom(), izabran))

mapa.on('zoomend', osveziIkonice)
promene.addEventListener('promena', osveziIkonice)

mapa.on('izbor', ({marker}) => {
  izabran = marker
  osveziIkonice()
})

export const postaviMarkere = markeri => {
  prikazani = markeri
  sloj.clearLayers()
  markeri.forEach(marker => sloj.addLayer(marker.element))
  osveziIkonice()
}

// spomenici default
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// })

// obična geografija
// L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// })

// prazna priroda
// L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.{ext}', {
// 	minZoom: 0,
// 	maxZoom: 18,
// 	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	ext: 'png'
// })
// granice i natpisi
// L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
// 	minZoom: 0,
// 	maxZoom: 18,
// 	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	ext: 'png'
// })

// stari atlas
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
  maxZoom: 12,
})

.addTo(mapa)

// izbliza detaljna mapa sa svim putevima, jer atlas ide samo do zuma 12
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  minZoom: 13,
  maxZoom: 18,
  referrerPolicy: 'strict-origin-when-cross-origin', // OSM odbija plocice bez referer-a, a stranica ga inace ne salje
}).addTo(mapa)
