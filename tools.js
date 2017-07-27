const sortiraj = niz => niz.sort((a, b) => a.mesto.localeCompare(b.mesto))

const prevedi = data => new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'})

fetch('../spomenici2.json')
  .then(response => response.json())
  .then(data => saveAs(prevedi(sortiraj(data))), "spomenici.json")
