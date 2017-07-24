const fetch = require('node-fetch')
const spomenici = {}

fetch('../pages.json')
  .then(response => response.json())
  .then(pages => {
    pages.map(page => {
      const url = `https://static.wixstatic.com/sites/${page.pageJsonFileName}.z?v=3`
      // console.log(url);
      getUrl(url)
    })
  })

function getUrl(url) {
  fetch(url)
    .then(response => response.json())
    .then(response => {
      // console.log(response);
      const id = response.pageUriSEO
      const spomenik = spomenici[id] = {}
      spomenik.naziv = response.title
      spomenik.html = ''
      searchObj(response.data.document_data, 'text', spomenik)
      const text = $(spomenik.html).text()
      const start = text.indexOf("Coordinates:")
      const end = text.indexOf("(click for map)")
      if (start < 0 || end < 0) return

      var koord = text.substring(
        start + "Coordinates:".length,
        end
      )
      // razdvoj na zarezu
      spomenik.koordinate = koord.trim()
      delete spomenik.html
      if (!spomenik.koordinate) delete spomenici[id]
      console.log(spomenik)
    })
}

function searchObj(obj, query, spomenik) {
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === 'object') searchObj(value, query, spomenik)
    if (key == query) spomenik.html += value
  }
}
