Element.prototype.on = Element.prototype.addEventListener

export const $ = s => document.querySelectorAll(s).length > 1
  ? document.querySelectorAll(s)
  : document.querySelector(s)

export function praviUrl(gmapPlaceId, koord) {
  const placeUrl = `?q=place_id:${gmapPlaceId}`
  const koordUrl = `${koord.lat},${koord.lon}`
  const androidUrl = `geo:${koord.lat},${koord.lon}`
  const browserUrl = `https://www.google.com/maps/place/${gmapPlaceId ? placeUrl : koordUrl}`
  return /(android)/i.test(navigator.userAgent) ? androidUrl : browserUrl
}

export const jeRazvoj = () =>
  location.hostname === 'localhost'
  || location.hostname === '127.0.0.1'
  || location.hostname === ''

export const sadrziFrazu = (spomenik, fraza) =>
  spomenik.naslov.toLowerCase().includes(fraza)
  || (spomenik.opis && spomenik.opis.toLowerCase().includes(fraza))
