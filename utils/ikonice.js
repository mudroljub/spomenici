import {nestao, ruine} from './helpers.js'

const velicine = {kompleks: [28, 50], groblje: [34, 38], muzej: [34, 38], ploca: [21, 32]}

export const izgledMarkera = ({type, stanje}) => {
  const varijanta = nestao(stanje) ? 'uklonjen' : ruine(stanje) ? 'rusevina' : 'postoji'
  const velicina = velicine[type]
  return velicina
    ? {slika: `slike/markeri/${type}-${varijanta}.svg`, sirina: velicina[0], visina: velicina[1]}
    : {slika: `slike/obelisk${varijanta === 'postoji' ? '' : '-' + varijanta}.png`, sirina: 14, visina: 50}
}
