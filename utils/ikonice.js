import {nestao, ruine} from './helpers.js'

const velicine = {kompleks: [34, 50], groblje: [29, 32], lokalni: [20, 28], muzej: [34, 38], ploca: [22, 16], bista: [22, 35], statua: [22, 42]}

export const izgledMarkera = ({type, stanje}) => {
  const varijanta = nestao(stanje) ? 'uklonjen' : ruine(stanje) ? 'rusevina' : 'postoji'
  const velicina = velicine[type]
  return velicina
    ? {slika: `slike/markeri/${type}-${varijanta}.svg`, sirina: velicina[0], visina: velicina[1]}
    : {slika: `slike/obelisk${varijanta === 'postoji' ? '' : '-' + varijanta}.png`, sirina: 14, visina: 50}
}
