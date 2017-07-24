const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const http = require('http')

const config = {
  url: 'https://sr.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%B0%D0%BA_%D1%81%D0%BF%D0%BE%D0%BC%D0%B5%D0%BD%D0%B8%D0%BA%D0%B0_%D0%9D%D0%9E%D0%91_%D1%83_%D0%A1%D1%80%D0%B1%D0%B8%D1%98%D0%B8#.D0.9C.D0.B5.D0.BC.D0.BE.D1.80.D0.B8.D1.98.D0.B0.D0.BB.D0.BD.D0.B8_.D0.BA.D0.BE.D0.BC.D0.BF.D0.BB.D0.B5.D0.BA.D1.81.D0.B8'
}

const spomenici = []

class Spomenik {
  constructor(slika, naziv, lokacija, posvecen, autor) {
    this.slika = slika
    this.naziv = naziv
    this.lokacija = lokacija
    this.posvecen = posvecen
    this.autor = autor
  }
}

/** FUNKCIJE **/

const pasirajStranu = (error, response, page) => {
  const $ = cheerio.load(page)
  $('.wikitable').first().find('tr').each(function() {
    const slika = $(this).find('td:nth-child(1) img')[0]
    let naziv = $(this).find('td:nth-child(2)').text()
    if (!naziv) return

    naziv = naziv.replace(/„/g, "");
    naziv = naziv.replace(/“/g, "");
    const spomenik = new Spomenik(
      typeof slika == 'object' && slika.attribs.src,
      naziv,
      $(this).find('td:nth-child(3)').text(),
      $(this).find('td:nth-child(4)').text(),
      $(this).find('td:nth-child(5)').text()
    )
    // const nazivZaMape = naziv.replace(/ /g, "+");
    // const geoUrl = `http://maps.google.com/maps/api/geocode/json?address=${nazivZaMape}`
    spomenici.push(spomenik)
  })
  fs.writeFile(
    'podaci.json',
    JSON.stringify(spomenici),
    'utf8',
    () => console.log('Snimljeno!')
  )
}

request(config.url, pasirajStranu)
