// pokupiti rucno samo place_id ostalo ce automatski (naziv, koordinate...)

fetch('../spomenici.json')
  .then(response => response.json())
  .then(data => initialize(data))

function initialize(spomenici) {
  const map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    center: {
      "lat": 44.7304796,
      "lng": 20.4889539
    },
    zoom: 8
  });
  spomenici.map(spomenik => {
    if (!spomenik.koordinate) return
    const placeUrl = `https://www.google.com/maps/place/?q=place_id:${spomenik.place_id}`
    const koordUrl = `https://www.google.com/maps/place/${spomenik.koordinate.lat},${spomenik.koordinate.lng}`
    const mapUrl = spomenik.place_id ? placeUrl : koordUrl
    const content = `
      <h3>${spomenik.mesto}</h3>
      </p>${spomenik.naziv || ''}</p>
      <a href="${mapUrl}">See place</a>
      <a href="${spomenik.database || spomenik.wiki}" target="_blank">Find more</a>
    `
    const infoWindow = new google.maps.InfoWindow({content})
    const marker = new google.maps.Marker({
      map,
      infoWindow,
      position: new google.maps.LatLng(
        spomenik.koordinate.lat, spomenik.koordinate.lng),
      title: spomenik.naziv || spomenik.mesto
    })
    marker.addListener('dblclick', () => window.open(mapUrl, "_self"))
    marker.addListener('click', () => infoWindow.open(map, marker))
  })
  // localStorage.spomenici = JSON.stringify(spomenici)
}
