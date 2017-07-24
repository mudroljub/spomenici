import urllib, json

with open('podaci.json') as json_podaci:
    podaci = json.load(json_podaci)

for i, podatak in enumerate(podaci):
    naziv = podaci[i]["naziv"]
    geonaziv = naziv.replace(' ', '+')
    geourl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + geonaziv
    utfurl = geourl.encode("UTF-8")
    odgovor = urllib.urlopen(utfurl)
    geojson = json.loads(odgovor.read())

    if len(geojson["results"]) == 0:
        print naziv
    if len(geojson["results"]) == 0: continue

    spomenik = geojson["results"][0]
    podaci[i]["koordinate"] = spomenik["geometry"]["location"]
    podaci[i]["adresa"] = spomenik["formatted_address"]
    podaci[i]["place_id"] = spomenik["place_id"]

with open('podaci2.json', 'w') as ciljanifajl:
    json.dump(podaci, ciljanifajl)
