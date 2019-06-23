import {mapa} from './mapa.js'
const {Marker, LatLng} = google.maps

export default class Stecak extends Marker{
  constructor(infoWindow, spomen) {
    super({
      map: mapa,
      infoWindow,
      position: new LatLng(spomen.lokacija.lat, spomen.lokacija.lon),
      title: spomen.opis || spomen.naslov,
      icon: 'slike/obelisk.png'
    })
    this.addListener('click', () => otvoriProzor(infoWindow, marker, spomen.slika))
  }
}
