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

const centerMap = e => {
  const sidro = mapa.project(e.popup._latlng) // projektuje koordinate u pikselima
  sidro.y -= e.popup._container.clientHeight / 2
  mapa.panTo(mapa.unproject(sidro), {animate: true})
}

mapa.on('popupopen', centerMap)

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