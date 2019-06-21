const spomenici = require('../data/spomenici.json')
const fs = require('fs')

const rezultat = spomenici.map(spomen => {
  if (spomen.slika) {
    delete spomen.slika
  }
  return spomen
})

fs.writeFileSync('spomenici2.json', JSON.stringify(rezultat, null, 2))
