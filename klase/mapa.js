// https://github.com/leaflet-extras/leaflet-providers
export const mapa = L.map('mapid', {
  minZoom: 6,
  maxBounds: [
    // south west
    [39, 10],
    // north east
    [48, 26]
  ],
})
  .setView([44.341667, 17.269444], 8)

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(mapa)

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
  maxZoom: 12,
}).addTo(mapa)
