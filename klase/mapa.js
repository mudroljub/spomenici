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

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(mapa)

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
  maxZoom: 12,
}).addTo(mapa)

// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
//   subdomains: 'abcd',
//   maxZoom: 20
// }).addTo(mapa)

// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
//   attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
//   subdomains: 'abcd',
//   maxZoom: 20
// }).addTo(mapa)