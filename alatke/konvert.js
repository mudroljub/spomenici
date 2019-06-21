const request = require('request').defaults({ encoding: null })
const sharp = require('sharp')
// const fs = require('fs')

const url = 'https://www.bastina.ba/images/stories/sadrzaj/2014/20140414/2/SDC13151.JPG'

request.get(url, async(err, res, body) => {
  if (!err && res.statusCode == 200) {
    const data = await sharp(body)
      .resize(280)
      .toBuffer()

    const slikaString = 'data:image/jpeg;base64,' + data.toString('base64')
    console.log(slikaString)
    // fs.writeFileSync('spomenici2.json', JSON.stringify(spomenici, null, 2))
  }
})
