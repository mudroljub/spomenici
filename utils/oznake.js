// svaki spomenik ima najvise jednu oznaku, 'lista' ili 'posetio'; cuva se samo na ovom uredjaju
const kljuc = 'spomenici-poseta'

const ucitaj = () => {
  try {
    return new Map(Object.entries(JSON.parse(localStorage.getItem(kljuc)) || {}))
  } catch (e) {
    return new Map()
  }
}

const oznake = ucitaj()

const sacuvaj = () => {
  try {
    localStorage.setItem(kljuc, JSON.stringify(Object.fromEntries(oznake)))
  } catch (e) {
    // privatni rezim i slicno: oznake vaze do zatvaranja stranice
  }
}

export const promene = new EventTarget()

export const dajOznaku = id => oznake.get(id)

export const postaviOznaku = (id, oznaka) => {
  if (oznaka) oznake.set(id, oznaka)
  else oznake.delete(id)
  sacuvaj()
  promene.dispatchEvent(new Event('promena'))
}
