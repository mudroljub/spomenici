const spomenici = require('../data/spomenici.json')
// const fs = require('fs')

const kategorije = new Set(spomenici.map(s => s.kategorija))
console.log(kategorije)

// const rezultat = spomenici
//   .map(s => {
//     if (s.opis && s.opis.toLowerCase().includes('groblj'))
//       s.kategorija = 'groblje'
//     return s
//   })
//
// fs.writeFileSync('spomenici2.json', JSON.stringify(rezultat, null, 2))
