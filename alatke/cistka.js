const spomenici = require('../data/spomenici.json')
const fs = require('fs')

const rezultat = spomenici.map(spomen => {
  if (spomen.info && spomen.info.startsWith('http://www.skulpture-srbija')) {
    delete spomen.info
  }
  return spomen
})

fs.writeFileSync('spomenici2.json', JSON.stringify(rezultat, null, 2))
