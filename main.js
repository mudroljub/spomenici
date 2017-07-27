// slike karusel
  // na klik otvara lokaciju ili marker
  // bug: dodaje sliku svaki put kad kliknem!
// dizajn sa znaka
// proveriti koje nemaju sliku

const nasumicnost = 30

const stilMape = [

  {
    'featureType': 'administrative.land_parcel',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'administrative.neighborhood',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  }
]

function praviMapu() {
  return new google.maps.Map(document.getElementById('map-canvas'), {
    center: {
      'lat': 44.341667,
      'lng': 17.269444
    },
    zoom: 8,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    streetViewControl: false,
    styles: stilMape
  })
}

function praviProzor(s, url) {
  let sablon = `
    <h3>${s.mesto}</h3>
    </p>${s.naziv || ''}</p>
    <a href="${url}">Find place</a>
  `
  if (s.info) sablon += `<a href="${s.info}" target="_blank">Read more</a>`
  return new google.maps.InfoWindow({content: sablon})
}

function praviMarker(map, prozor, s) {
  return new google.maps.Marker({
    map,
    infoWindow: prozor,
    position: new google.maps.LatLng(s.koordinate.lat, s.koordinate.lng),
    title: s.naziv || s.mesto,
    icon: 'obelisk.png'
  })
}

function initialize(spomenici) {
  const map = praviMapu()

  spomenici.map((s, i) => {
    const placeUrl = `https://www.google.com/maps/place/?q=place_id:${s.place_id}`
    const koordUrl = `https://www.google.com/maps/place/${s.koordinate.lat},${s.koordinate.lng}`

    const url = s.place_id ? placeUrl : koordUrl
    const prozor = praviProzor(s, url)
    const marker = praviMarker(map, prozor, s)

    function otvori() {
      prozor.open(map, marker)
      if (!s.slika || prozor.ubacenaSlika) return
      prozor.setContent(prozor.getContent() + `<p><img src="${s.slika}"></p>`)
      prozor.ubacenaSlika = true
    }

    marker.addListener('click', otvori)
    marker.addListener('dblclick', () => window.open(url, '_self'))

    if (!s.slika || i % Math.ceil(Math.random() * nasumicnost) != 0) return
    const slika = document.createElement('img')
    slika.src = s.slika
    slika.addEventListener('click', otvori)
    document.getElementById('slike').appendChild(slika)
  })
}

fetch('../spomenici.json')
  .then(response => response.json())
  .then(data => initialize(data))
