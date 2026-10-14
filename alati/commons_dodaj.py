# python -I alati/commons_dodaj.py <spisak.json> <fajlovi.json>: dodaje spomenike sa geotagovanih fotografija na Commons-u
# spisak: [{fajl, id, naziv, name, type, drzava, [title]}] ili [{fajl, postojeci}] za fotografiju postojecem spomeniku
# zahtevi: imageinfo zbirno po 50, pa po jedna umanjena slika sa pauzom od 3 s
import json, math, os, re, subprocess, sys, time, urllib.parse, urllib.request
sys.stdout.reconfigure(encoding='utf-8')
SPISAK, FAJLOVI = sys.argv[1:]
A = os.path.dirname(os.path.abspath(__file__))  # naselja_osm.json je pored alata
UA = {'User-Agent': 'spomenici-wiki/1.0 (https://mudroljub.github.io/spomeniks)'}
RED = ['id', 'koordinate', 'googleCid', 'title', 'info', 'wiki', 'wikiEn', 'slika', 'slikaOdnos', 'slikaAutor', 'naziv', 'name', 'year', 'author', 'stanje', 'type', 'drzava']
LAT = dict(zip('абвгдђежзијклљмнњопрстћуфхцчџшѓќѕ', ['a', 'b', 'v', 'g', 'd', 'đ', 'e', 'ž', 'z', 'i', 'j', 'k', 'l', 'lj', 'm', 'n', 'nj', 'o', 'p', 'r', 's', 't', 'ć', 'u', 'f', 'h', 'c', 'č', 'dž', 'š', 'gj', 'kj', 'dz']))
def latinica(t):
    return ''.join((LAT[z.lower()].capitalize() if z.isupper() else LAT[z]) if z.lower() in LAT else z for z in t)

spisak = json.load(open(SPISAK, encoding='utf8'))
fajlovi = json.load(open(FAJLOVI, encoding='utf8'))
naselja = [(e['lat'], e['lon'], e['tags'].get('name:sr-Latn') or latinica(e['tags']['name'])) for e in json.load(open(A + '/naselja_osm.json', encoding='utf8'))['elements']
           if e.get('tags', {}).get('name') and e['tags'].get('place') in ('city', 'town', 'village', 'suburb', 'hamlet', 'neighbourhood', 'quarter')]
dist = lambda a, b, c, e: math.hypot((a - c) * 111000, (b - e) * 111000 * math.cos(math.radians(a)))

info = {}
naslovi = [s['fajl'] for s in spisak]
for k in range(0, len(naslovi), 50):
    time.sleep(3)
    data = urllib.parse.urlencode({'action': 'query', 'titles': '|'.join(naslovi[k:k + 50]), 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|user', 'iiurlwidth': 640, 'format': 'json', 'formatversion': 2}).encode()
    for p in json.loads(urllib.request.urlopen(urllib.request.Request('https://commons.wikimedia.org/w/api.php', data=data, headers=UA), timeout=90).read())['query']['pages']:
        ii = p['imageinfo'][0]; m = ii['extmetadata']
        autor = re.sub(r'<[^>]+>', '', m.get('Artist', {}).get('value', '')).strip() or ii['user']
        info[p['title']] = (ii['thumburl'], f"{autor[:60]}, {m.get('LicenseShortName', {}).get('value', '')}")

d = json.load(open('data/spomeniks.json', encoding='utf8'))
po_id = {s['id']: s for s in d}
for s in spisak:
    url, potpis = info[s['fajl']]
    cilj = s.get('postojeci') or s['id']
    putanja = f'slike/spomenici/{cilj}.webp'
    time.sleep(3)
    sirovo = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
    subprocess.run(['magick', '-', '-resize', '400x', '-quality', '75', putanja], input=sirovo, check=True)
    if s.get('postojeci'):
        z = po_id[s['postojeci']]; z['slika'] = putanja; z['slikaAutor'] = potpis
        print('slika', cilj, flush=True)
        continue
    a, b = fajlovi[s['fajl']]['k']
    title = s.get('title') or min(naselja, key=lambda n: dist(a, b, n[0], n[1]))[2]
    z = {'id': s['id'], 'koordinate': {'lat': round(a, 7), 'lng': round(b, 7)}, 'title': title, 'info': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(s['fajl'].replace(' ', '_')),
         'slika': putanja, 'slikaAutor': potpis, 'naziv': s['naziv'], 'name': s['name'], 'type': s['type'], 'drzava': s['drzava']}
    assert z['id'] not in po_id, z['id']
    d.append(z); po_id[z['id']] = z
    print('novi', z['id'], title, flush=True)
d = [{k: s[k] for k in RED if k in s} for s in d]
open('data/spomeniks.json', 'w', encoding='utf8', newline='\r\n').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
