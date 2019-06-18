const {ControlPosition, Map: Gmap} = google.maps

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

const konfigMape = {
  center: {
    'lat': 44.341667,
    'lng': 17.269444
  },
  zoom: 8,
  minZoom: 6,
  mapTypeControl: false,
  // fullscreenControl: false,
  zoomControlOptions: {
    position: ControlPosition.RIGHT_TOP
  },
  streetViewControl: false,
  styles: stilMape
}

export const mapa = new Gmap(document.getElementById('map-canvas'), konfigMape)
