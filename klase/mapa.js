export const mapa = L.map('mapid').setView([44.341667, 17.269444], 8)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  minZoom: 6,
}).addTo(mapa)
