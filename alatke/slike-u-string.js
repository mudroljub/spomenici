const request = require('request').defaults({ encoding: null })
const spomenici = require('../data/spomenici.json')

spomenici.forEach((s, i) => {
  if (i > 10) return
  if (!s.slika) return

  request.get(s.slika, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      // prevelicati sliku
      // azurirati fajl kad se sve obavi
      const data = 'data:' + res.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64')
      s.slikaString = data
      console.log(s)
    }
  })

})
