import {mapa} from './mapa.js'
const {InfoWindow} = google.maps

function praviUrl(gmapPlaceId, koord) {
  const placeUrl = `?q=place_id:${gmapPlaceId}`
  const koordUrl = `${koord.lat},${koord.lon}`
  const androidUrl = `geo:${koord.lat},${koord.lon}`
  const browserUrl = `https://www.google.com/maps/place/${gmapPlaceId ? placeUrl : koordUrl}`
  return /(android)/i.test(navigator.userAgent) ? androidUrl : browserUrl
}

class Prozor extends InfoWindow {
  constructor(spomen) {
    const url = praviUrl(spomen.gmapPlaceId, spomen.lokacija)
    const content = `
      <h3>${spomen.naslov}</h3>
      </p>${spomen.opis || ''}</p>
      <a href="${url}">Find place</a>
      ${spomen.info ? `<a href="${spomen.info}" target="_blank">Read more</a>` : ''}
    `  
    super({content})
  }

  otvori(marker, slika) {
    this.open(mapa, marker)
    this.dodajSliku(slika)
  }  

  dodajSliku(slika) {
    if (!slika || this.imaSliku) return
    this.setContent(this.getContent() + `<p><img src="${slika}"></p>`)
    this.imaSliku = true
  }  
}

export default Prozor
