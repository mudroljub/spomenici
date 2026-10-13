// podrazumevano sh, a engleski se bira; izbor se pamti na uredjaju
const kljuc = 'spomenici-jezik'

const sacuvan = () => {
  try {
    return localStorage.getItem(kljuc)
  } catch (e) {
    return null
  }
}

export const jezik = sacuvan() === 'en' ? 'en' : 'sh'

// novi jezik vazi od ponovnog ucitavanja, pa nijedna komponenta ne mora da se osvezava
export const promeniJezik = novi => {
  try {
    localStorage.setItem(kljuc, novi)
  } catch (e) {
    return // bez skladista (privatni rezim i slicno) izbor ne bi preziveo ponovno ucitavanje
  }
  location.reload()
}

const tekstovi = {
  navigacija: {sh: 'Navigacija', en: 'Navigate'},
  mesto: {sh: 'Pronađi mesto', en: 'Find place'},
  ruta: {sh: 'Ruta', en: 'Route'},
  mojaRuta: {sh: 'Moja ruta', en: 'My route'},
  lista: {sh: 'Želim da posetim', en: 'Want to visit'},
  posetio: {sh: 'Posećeno', en: 'Visited'},
  filteri: {sh: 'Filteri', en: 'Filters'},
  pretraga: {sh: 'Pretraga', en: 'Search'},
  obrisi: {sh: 'Obriši', en: 'Clear'},
  uBlizini: {sh: 'U blizini', en: 'Nearby'},
}

export const t = kljuc => tekstovi[kljuc][jezik]
