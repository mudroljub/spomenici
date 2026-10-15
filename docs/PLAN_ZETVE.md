# Plan žetve podataka — uputstvo za agenta

Ažurirano 2026-10-15. Ovaj dokument je dovoljan za samostalan rad: šta se radi, kojim redom, kojim alatima, šta se ne sme i kad je zadatak gotov. Istorija izvora i iskustva sa serverima su u `docs/BELESKE.md`; pročitaj je pre početka.

## 1. Kontekst

- **Aplikacija:** Spomeniks, mapa spomenika NOB-a sa prostora Jugoslavije (vanilla JS + Leaflet). Putanje su relativne u odnosu na koren repozitorijuma, osim onih sa `$A`.
- **Podaci:** `data/spomeniks.json`, niz od 4.464 objekta pri proveri 2026-10-15. Slike su u `slike/spomenici/<id>.webp`.
- **Alati:** `alati/` u repozitorijumu: `integritet.py`, `slike_odnos.py`, `commons_dodaj.py`, `proveri.py`, `upisi_cid.py`, `dodaj_google.py`, `snimi.mjs` i `naselja_osm.json`. Pokreću se **iz korena repozitorijuma**, sa `python -I alati/<alat>.py`.
- **Jednokratni alati i preuzeti ulazi:** folder `nazivi-alati` u Claude Code memoriji projekta, `~/.claude/projects/<putanja repozitorijuma, sa crticama umesto / \ i :>/nazivi-alati` (u daljem tekstu `$A`): `osm_dodaj.py`, `rnpd_*.py`, `spisak.py`, `koraci.mjs`, `pregledac_json.mjs`, `spomenici_osm.json` i `ulaz/`. Nisu u repozitorijumu, pa na drugom računaru postoje samo ako se prenesu ručno.
- **Korisnik:** piše na srpskom i želi kratke odgovore, najviše dve rečenice. Sporne slučajeve rešavaš sam ili ih preskačeš, bez spiskova za korisnika. Ne komituješ; to radi korisnik.

## 2. Standard zapisa (obavezno za svaki novi ili izmenjen spomenik)

- **Redosled polja:** `id, koordinate{lat,lng}, googleCid, title, info, wiki, wikiEn, slika, slikaOdnos, slikaAutor, naziv, name, year, author, posveta, stanje, type, drzava`. Prazna polja se izostavljaju.
- **Fajl:** UTF-8, CRLF, uvlačenje 2, `ensure_ascii=False`, sa CRLF na kraju. Upis uvek ovako:
  `open(P,'w',encoding='utf8',newline='').write(json.dumps(d,ensure_ascii=False,indent=2).replace('\n','\r\n')+'\r\n')`
- **id:** mala ASCII slova, cifre i crtice, jedinstven, najviše oko 50 znakova (npr. `slug(mesto + naziv)`).
- **koordinate:** 7 decimala.
- **title:** samo mesto, latinicom, u obliku „Grad (deo grada)“, npr. „Beograd (Banjica)“. Bez engleskih reči.
- **naziv:** izvorni naziv. Srbija, Hrvatska, BiH, Crna Gora i Kosovo: sh latinicom (ćirilicu preslovi). Slovenija: slovenački. Makedonija: makedonska ćirilica. `integritet.py` proverava pismo.
- **name:** engleski, samo kad se razlikuje od naziva.
- **type:** `istaknut` (samo kad postoji stranica na spomenikdatabase), `spomenik` (umetničko delo poznatog autora ili veći spomenik), `lokalni` (spomen-obeležje, podrazumevano za nove), `kompleks` (spomen-park), `groblje`, `muzej` (i spomen-kuća), `statua` (cela figura čoveka ili grupa figura), `bista`, `ploca`.
- **stanje:** samo `rusevine`, `uklonjen`, `ostecen`, `zatvoren`, `srusen`; kad je spomenik očuvan, polje se izostavlja.
- **drzava:** `Slovenia, Croatia, Bosnia and Herzegovina, Serbia, Montenegro, Macedonia, Kosovo, Italy`.
- **info:** izvor (OSM link `https://www.openstreetmap.org/node/…`, Commons fajl, registar). **wiki:** domaći članak (redom sh, sr, hr, bs, pa jezik države). **wikiEn:** engleski članak.
- **slika:** 400 px širine, webp kvaliteta 75 (`magick - -resize 400x -quality 75 out.webp`). **slikaAutor:** „Autor, licenca“. **slikaOdnos:** posle svake nove slike pokreni `slike_odnos.py`.
- **author:** više autora se spaja sa „ & “. Park dobija autora samo ako su sva dela u njemu jednog autora.
- **posveta:** spisak Wikidata stavki (ličnost, jedinica, događaj) kojima je spomenik posvećen, npr. `["Q9161"]`; svaka mora postojati u `data/posvete.json` (`naziv`, `name`, `wiki`, `wikiEn`). Opšte posvete („palim borcima“, „žrtvama fašizma“, Drugi svetski rat, NOVJ) se ne upisuju.
- **Obuhvat:** samo spomenici NOB-a i Drugog svetskog rata iz jugoslovenske perspektive. **Ne dodaju se:** Prvi svetski i stariji ratovi, ratovi 1991–1999 (branitelji, VRS, ARBiH, HVO, šehidi, „otadžbinski rat“), četnici i domobranci, „žrtve komunizma“ i posleratnih pokolja (Bleiburg, Križni put, „zamolčane žrtve“), NATO bombardovanje, Holokaust-obeležja postavljena posle 1990, partizanske bolnice, tehnike, staze, domovi i bunkeri bez spomenika, ulice i obeležja van Jugoslavije.

## 3. Pravila prema serverima

- Zahtevi idu jedan po jedan, sa pauzom od najmanje 3 s (Wikidata `wbgetentities` 10 s), sa User-Agent zaglavljem `spomeniks/1.0 (https://mudroljub.github.io/spomeniks)`.
- Na 429 ili 504 odmah stani. Nastavi tek posle duže pauze, sporije, ili lakšim upitom (npr. podela po državama).
- Zbirni zahtevi su obavezni gde postoje: Wikimedia API `titles=` do 50 naslova, Commons `prop=coordinates|imageinfo` do 50 fajlova.
- **spomenikdatabase.org se ne dira masovno:** jednom nas je blokirao. Dozvoljeno je samo pojedinačno učitavanje stranice u pregledaču.
- Pre posla koji traži više stotina zahteva ka istom serveru, procena se upisuje u `docs/BELESKE.md`; za više od oko 500 zahteva pitaj korisnika.
- Overpass često vraća 504, pa se koriste OSM podaci sa diska (`spomenici_osm.json` i ostali `*_osm.json`).

## 4. Alati

| Alat | Namena |
|---|---|
| `alati/integritet.py` | Provera celog fajla (polja, pismo, slike, duplikati na manje od 30 m). Pokreni posle svake izmene; 17 parova „manje od 30 m“ su namerni (park i spomenik u njemu, odnosno grobnica i ploča na Senjaku). |
| `alati/slike_odnos.py` | Upisuje `slikaOdnos` svim slikama. Pokreni posle dodavanja slika. |
| `alati/commons_dodaj.py <spisak.json> <fajlovi.json>` | Dodaje spomenike ili slike sa Commons-a: preuzima sliku, pravi webp, potpis i naslov iz najbližeg naselja. Spisak: `[{fajl,id,naziv,name,type,drzava,[title]}]` ili `[{fajl,postojeci}]`; `fajlovi.json`: `{fajl: {"k": [lat,lng]}}`. |
| `$A/osm_dodaj.py <alati> <osm_kand.json> [--upisi]` | Primer filtera za NOB (`JEZGRO`, `NE`, `RUCNO`), naslova „Grad (deo)“ i vrste po imenu. Bez `--upisi` samo ispisuje. |
| `alati/upisi_cid.py`, `alati/dodaj_google.py <vrsta> <link> <naziv> …`, `alati/proveri.py` | Rad sa Google linkovima koje šalje korisnik. |
| `alati/snimi.mjs`, `$A/koraci.mjs` | Headless Chrome za proveru aplikacije (`python -m http.server 8765` u korenu repozitorijuma; `W`/`H` za desktop, `HASH=#<id>` za otvaranje spomenika). |
| `$A/pregledac_json.mjs <url> <izlaz.json>` | Jedno učitavanje stranice uz čuvanje JSON odgovora koje ona sama povuče (Flickr, spomenikdatabase). |
| `alati/naselja_osm.json` | Naselja za naslove (`place` = city/town/village/suburb…). |

Pregled slika: `magick montage -label '%t' <fajlovi> -tile 5x3 -geometry 220x165+3+3 pregled.png`, pa pogledaj sliku. Svaka nova slika mora proći ovakav pregled.

## 5. Zadaci, redom

**Stanje 2026-10-15:** završeni zadaci A, B, C, D, E, F i G su uklonjeni iz plana, a njihova istorija je u `docs/BELESKE.md`. U završnoj proveri Srbije u okviru zadatka D obrađena su sva 132 tadašnja zapisa bez slike: dodata je 21 fotografija, a 111 zapisa ostaje bez odgovarajuće potvrđene slike za dodavanje. [Rezultat za svaki zapis](FOTOGRAFIJE_SRBIJA.md) sadrži izvore i razloge; ovaj prolaz pretrage je završen. Otvorene provere države, koordinata i mogućeg duplikata vode se zasebno u `README.md`, odeljak TODO. Kod zadatka E obrađeno je sve što dostupni izvori potvrđuju; preostale hrvatske stavke čekaju nov izvor. Novi kandidat je spomenicinob.info (popis spomenika NOB-a u BiH, bez koordinata), ali tek posle dogovora sa korisnikom. Spomenici bez lokacije se skupljaju u `data/bez_lokacije.json`.

Posle svakog zadatka: `integritet.py` bez novih grešaka, `slike_odnos.py` ako ima novih slika, kratak unos u `docs/BELESKE.md` (šta je urađeno, brojevi, šta je preskočeno i zašto), brisanje stavke iz `## TODO` u `README.md`.

## 6. Kad je posao gotov

- `integritet.py` ne pokazuje nove greške.
- Aplikacija se otvara: `node alati/snimi.mjs proba.png "document.querySelectorAll('.leaflet-marker-icon').length"` vraća broj veći od nule, bez `EXC` u izlazu.
- `docs/BELESKE.md` i `README.md` (`## TODO`) su ažurirani.
- Korisniku se javlja u najviše dve rečenice, na srpskom: koliko je dodato i šta je sledeće.
