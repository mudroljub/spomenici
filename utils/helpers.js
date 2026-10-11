Element.prototype.on = Element.prototype.addEventListener

export const $ = s => document.querySelectorAll(s).length > 1
  ? document.querySelectorAll(s)
  : document.querySelector(s)


export function praviUrl(koord) {
  const koordUrl = `${koord.lat},${koord.lng}`
  const androidUrl = `geo:${koord.lat},${koord.lng}`
  const browserUrl = `https://www.google.com/maps/place/${koordUrl}`
  return /(android)/i.test(navigator.userAgent) ? androidUrl : browserUrl
}

const entiteti = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'}

export const escapeHtml = tekst => String(tekst).replace(/[&<>"']/g, z => entiteti[z])
