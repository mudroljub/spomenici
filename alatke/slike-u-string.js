const request = require('request').defaults({ encoding: null })
const sharp = require('sharp')
const fs = require('fs')
const spomenici = require('../data/spomenici.json')

let uspesno = 0

const saSlikom = spomenici.filter(s => s.slika)

spomenici.forEach(s => {
  request.get(s.slika, async(err, res, body) => {
    if (!err && res.statusCode == 200) {
      const data = await sharp(body)
        .resize(280)
        .toBuffer()
     
      const slikaString = 'data:image/jpeg;base64,' + data.toString('base64')
      s.slikaString = slikaString
      console.log(uspesno++)
      if (uspesno === saSlikom.length - 2) {
        console.log('sve uspelo')
        fs.writeFileSync('spomenici2.json', JSON.stringify(spomenici, null, 2))
      }
    }
  })
})
  