// random neke slike umesto markera
  // na klik otvara lokaciju ili marker
// dizajn beograd pamti
// stecke umesto markera?
// ograniciti sliku u markeru?
// ograniciti mapu
// proveriti koje nemaju sliku

const nasumicnost = 60

function initialize(spomenici) {
  const map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    center: {
      'lat': 44.7304796,
      'lng': 20.4889539
    },
    zoom: 8
  })

  spomenici.map((s, i) => {
    const placeUrl = `https://www.google.com/maps/place/?q=place_id:${s.place_id}`
    const koordUrl = `https://www.google.com/maps/place/${s.koordinate.lat},${s.koordinate.lng}`
    const url = s.place_id ? placeUrl : koordUrl

    let sablon = `
      <h3>${s.mesto}</h3>
      </p>${s.naziv || ''}</p>
      <a href="${url}">Find place</a>
    `
    if (s.info) sablon += `<a href="${s.info}" target="_blank">Read more</a>`

    const prozor = new google.maps.InfoWindow({content: sablon})
    const marker = new google.maps.Marker({
      map,
      infoWindow: prozor,
      position: new google.maps.LatLng(s.koordinate.lat, s.koordinate.lng),
      title: s.naziv || s.mesto
    })

    marker.addListener('click', () => {
      prozor.open(map, marker)
      if (s.slika)
        prozor.setContent(prozor.getContent() + `<br><img src="${s.slika}">`)
    })
    marker.addListener('dblclick', () => window.open(url, '_self'))

    if (!s.slika || i % Math.ceil(Math.random() * nasumicnost) != 0) return

    const slika = document.createElement('img')
    slika.src = s.slika
    document.body.appendChild(slika)
  })
}

fetch('../spomenici.json')
  .then(response => response.json())
  .then(data => initialize(data))
