// rad bez signala: aplikacija i podaci se cuvaju odmah, a delovi mape i slike kad se jednom pogledaju
const APLIKACIJA = 'spomenici-aplikacija'
const MAPA = 'spomenici-mapa'
const SLIKE = 'spomenici-slike'

const najviseUnosa = {[MAPA]: 4000, [SLIKE]: 1500}

// cuvaju se pri instalaciji; ostali fajlovi aplikacije se sacuvaju kad se prvi put ucitaju
const fajlovi = [
  './',
  'index.html',
  'main.js',
  'style.css',
  'manifest.json',
  'favicon.ico',
  'data/spomeniks.json',
  'data/autori.json',
  'klase/Marker.js',
  'klase/mapa.js',
  'komponente/Detalji.js',
  'komponente/Filteri.js',
  'komponente/Lokator.js',
  'komponente/Najblizi.js',
  'komponente/Pretraga.js',
  'komponente/PunEkran.js',
  'komponente/Slajder.js',
  'komponente/Slika.js',
  'utils/helpers.js',
  'utils/oznake.js',
  'slike/obelisk.png',
  'slike/ui/lokator.svg',
  'slike/ui/punekran.svg',
  'slike/ikone/logo-192.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(APLIKACIJA).then(kes => kes.addAll(fajlovi)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

const jeMapa = url => /tile\.openstreetmap\.org|server\.arcgisonline\.com/.test(url.hostname)
const jeSlika = url => url.origin === location.origin && url.pathname.includes('/slike/spomenici/')

// brise najstarije unose kad ih ima previse
const skrati = async ime => {
  const kes = await caches.open(ime)
  const kljucevi = await kes.keys()
  const visak = kljucevi.length - najviseUnosa[ime]
  await Promise.all(kljucevi.slice(0, Math.max(visak, 0)).map(k => kes.delete(k)))
}

let dodato = 0

// mapa i slike se ne menjaju, pa prvo iz kesa
const prvoKes = async (zahtev, ime) => {
  const sacuvano = await caches.match(zahtev.url)
  if (sacuvano) return sacuvano
  // cors umesto no-cors, da bi odgovor mogao da se sacuva bez preteranog zauzimanja prostora
  const odgovor = await fetch(zahtev.url, {
    mode: 'cors',
    credentials: 'omit',
    referrer: zahtev.referrer,
    referrerPolicy: zahtev.referrerPolicy,
  }).catch(() => fetch(zahtev))
  if (odgovor.ok && odgovor.type === 'cors') {
    const kes = await caches.open(ime)
    await kes.put(zahtev.url, odgovor.clone())
    if (++dodato % 100 === 0) skrati(ime)
  }
  return odgovor
}

// aplikacija prvo sa mreze, da izmene stignu odmah, a bez signala iz kesa
const prvoMreza = async zahtev => {
  try {
    const odgovor = await fetch(zahtev)
    if (odgovor.ok) {
      const kes = await caches.open(APLIKACIJA)
      await kes.put(zahtev, odgovor.clone())
    }
    return odgovor
  } catch (e) {
    const sacuvano = await caches.match(zahtev, {ignoreSearch: true})
    if (sacuvano) return sacuvano
    throw e
  }
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  if (jeMapa(url)) e.respondWith(prvoKes(e.request, MAPA))
  else if (jeSlika(url)) e.respondWith(prvoKes(e.request, SLIKE))
  else if (url.origin === location.origin || url.hostname === 'unpkg.com') e.respondWith(prvoMreza(e.request))
})
