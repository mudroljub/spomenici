# python -I upisi_cid.py <id> <kratak ili pun google link>
# upisuje Google id i lokaciju sa Google mapa kad se razlikuje za vise od 5 m
import json, math, re, sys, urllib.error, urllib.request
sys.stdout.reconfigure(encoding='utf-8')
sid, url = sys.argv[1:3]
if 'goo.gl' in url:
    class Bez(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None
    try:
        urllib.request.build_opener(Bez).open(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}))
    except urllib.error.HTTPError as e:
        url = e.headers['Location']
heks = re.search(r'!1s0x[0-9a-f]+:0x([0-9a-f]+)', url).group(1)
lat, lng = map(float, re.search(r'!3d(-?[\d.]+)!4d(-?[\d.]+)', url).groups())
p = 'data/spomeniks.json'
d = json.load(open(p, encoding='utf8'))
POLJA = ['id', 'koordinate', 'googleCid', 'title', 'info', 'wiki', 'wikiEn', 'slika', 'slikaOdnos', 'slikaAutor', 'naziv', 'name']
def m(a, b, c, e):
    return 6371000 * math.acos(min(1, math.sin(math.radians(a)) * math.sin(math.radians(c)) + math.cos(math.radians(a)) * math.cos(math.radians(c)) * math.cos(math.radians(e - b))))
n = 0
for i, s in enumerate(d):
    if s['id'] == sid:
        s['googleCid'] = str(int(heks, 16)); n += 1
        razlika = m(s['koordinate']['lat'], s['koordinate']['lng'], lat, lng)
        if razlika > 5:
            s['koordinate'] = {'lat': lat, 'lng': lng}
        print(sid, 'id', s['googleCid'], 'pomereno', round(razlika), 'm')
        d[i] = {**{k: s[k] for k in POLJA if k in s}, **{k: v for k, v in s.items() if k not in POLJA}}
assert n == 1
open(p, 'w', encoding='utf8', newline='').write(json.dumps(d, indent=2, ensure_ascii=False).replace('\n', '\r\n') + '\r\n')
