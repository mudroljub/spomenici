Element.prototype.on = Element.prototype.addEventListener

export const $ = s => document.querySelectorAll(s).length > 1
  ? document.querySelectorAll(s)
  : document.querySelector(s)


export function mestoUrl({lat, lng}) {
  return /android/i.test(navigator.userAgent)
    ? `geo:${lat},${lng}`
    : `https://www.google.com/maps/place/${lat},${lng}`
}

export function navigacijaUrl({lat, lng}) {
  const odrediste = `${lat},${lng}`
  return /iPhone|iPad|iPod/.test(navigator.userAgent)
    ? `https://maps.apple.com/?daddr=${odrediste}`
    : `https://www.google.com/maps/dir/?api=1&destination=${odrediste}`
}

const entiteti = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'}

export const escapeHtml = tekst => String(tekst).replace(/[&<>"']/g, z => entiteti[z])
