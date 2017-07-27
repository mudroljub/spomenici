// proveriti koje nemaju sliku

const $ = s => document.querySelectorAll(s).length > 1 ? document.querySelectorAll(s) : document.querySelector(s)
EventTarget.prototype.on = EventTarget.prototype.addEventListener

$('#slike').style.marginLeft = 0

const korak = 200
const slike = []
let ucitaneSlike = false
let brojacSlika = 0
const inicijalnoSlika = 20

const stilMape = [
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#f7f1df'
      }
    ]
  },
  {
    'featureType': 'landscape.natural',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#d0e3b4'
      }
    ]
  },
  {
    'featureType': 'landscape.natural.terrain',
    'elementType': 'geometry',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'poi.business',
    'elementType': 'all',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'poi.medical',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#fbd3da'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#bde6ab'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#ffe15f'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#efd151'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#ffffff'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': 'black'
      }
    ]
  },
  {
    'featureType': 'transit.station.airport',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#cfb2db'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#a2daf2'
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

  spomenici.map((s) => {
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

    if (!s.slika) return
    const slika = document.createElement('img')
    slika.addEventListener('click', otvori)
    slike.push(slika)
    $('#slike').appendChild(slika)
    slika.izvor = s.slika // za kasnije
    if (brojacSlika > inicijalnoSlika) return
    slika.src = s.slika
    brojacSlika++
  })
}

fetch('spomenici.json')
  .then(response => response.json())
  .then(data => initialize(data))

$('#strelica-leva').on('click', function() {
  if (parseInt($('#slike').style.marginLeft) + korak > 0) return
  $('#slike').style.marginLeft = `${parseInt($('#slike').style.marginLeft) + korak}px`
})

$('#strelica-desna').on('click', function() {
  if (!ucitaneSlike) slike.map(slika => slika.src = slika.izvor)
  $('#slike').style.marginLeft = `${parseInt($('#slike').style.marginLeft) - korak}px`
  ucitaneSlike = true
})
