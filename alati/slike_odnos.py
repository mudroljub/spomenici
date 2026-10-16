# upisuje slikaOdnos (sirina / visina) za svaku lokalnu sliku, da prozor spomenika unapred zna oblik slike
# pokretanje iz korena repozitorijuma: python <putanja>/slike_odnos.py
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # zapis.py je pored alata
from zapis import poredaj

PUT = 'data/spomeniks.json'

d = json.load(open(PUT, encoding='utf8'))
izlaz = subprocess.run(['magick', 'identify', '-format', '%i %w %h\n', 'slike/spomenici/*.webp'], capture_output=True, text=True, check=True).stdout
odnosi = {}
for red in izlaz.splitlines():
    putanja, w, h = red.rsplit(' ', 2)
    odnosi[putanja.replace('\\', '/')] = round(int(w) / int(h), 3)

promena = 0
for i, s in enumerate(d):
    odnos = odnosi.get(s.get('slika'))
    if s.get('slikaOdnos') != odnos:
        promena += 1
        s['slikaOdnos'] = odnos
    if odnos is None: s.pop('slikaOdnos', None)
    d[i] = poredaj(s)

tekst = json.dumps(d, ensure_ascii=False, indent=2).replace('\n', '\r\n') + '\r\n'
open(PUT, 'w', encoding='utf8', newline='').write(tekst)
print('promenjeno', promena)
