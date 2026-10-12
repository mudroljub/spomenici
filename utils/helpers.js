Element.prototype.on = Element.prototype.addEventListener

export const $ = s => document.querySelectorAll(s).length > 1
  ? document.querySelectorAll(s)
  : document.querySelector(s)


export const naziviStanja = {
  rusevine: 'In ruins',
  srusen: 'Destroyed',
  uklonjen: 'Removed',
  ostecen: 'Damaged',
  zatvoren: 'Closed',
}

// izvorni naziv kad je poznat, inace engleski opis, ponekad sa linkovima
export const nazivSpomenika = ({naziv, name}) => naziv || (name || '').replace(/<[^>]*>/g, '')

// uklonjen spomenik vise nema sta da se obidje; od srusenog obicno ostanu delovi
export const nestao = stanje => stanje === 'uklonjen'

// srusen se racuna kao ruine, jer obicno ostanu postolje ili delovi
export const ruine = stanje => stanje === 'rusevine' || stanje === 'srusen'

export function mestoUrl({koordinate: {lat, lng}, googleCid}) {
  if (googleCid) return `https://maps.google.com/?cid=${googleCid}`
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

const cirilica = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'dj', е: 'e', ж: 'z', з: 'z', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj',
  м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't', ћ: 'c', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'c',
  џ: 'dz', ш: 's', ѓ: 'g', ќ: 'k', ѕ: 'dz',
}

// za pretragu: mala slova, latinica, bez dijakritika (Kadinjača = kadinjaca = Кадињача)
export const normalizuj = tekst => tekst
  .toLowerCase()
  .replace(/[а-шѓќѕђјљњћџ]/g, z => cirilica[z] || z)
  .replace(/đ/g, 'dj')
  .normalize('NFD')
  .replace(/\p{M}/gu, '') // uklanja kvacice i akcente

const entiteti = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'}

export const escapeHtml = tekst => String(tekst).replace(/[&<>"']/g, z => entiteti[z])
