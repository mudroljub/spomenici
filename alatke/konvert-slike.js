const request = require('request').defaults({ encoding: null })
const sharp = require('sharp')

const url = 'https://upload.wikimedia.org/wikipedia/sr/3/33/Aleja_narodnih_heroja_Novo_groblje_Bg3.jpg'

request.get(url, async(err, res, body) => {
  if (!err && res.statusCode == 200) return
  const data = await sharp(body)
    .resize(280)
    .toBuffer()

  const slikaString = 'data:image/jpeg;base64,' + data.toString('base64')
  console.log(slikaString)
})
