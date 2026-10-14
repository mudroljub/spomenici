# Plan žetve podataka — uputstvo za agenta

Ažurirano 2026-10-14. Ovaj dokument je dovoljan za samostalan rad: šta se radi, kojim redom, kojim alatima, šta se ne sme i kad je zadatak gotov. Istorija izvora i iskustva sa serverima su u `docs/BELESKE.md`; pročitaj je pre početka.

## 1. Kontekst

- **Aplikacija:** Spomeniks, mapa spomenika NOB-a sa prostora Jugoslavije (vanilla JS + Leaflet). Putanje su relativne u odnosu na koren repozitorijuma, osim onih sa `$A`.
- **Podaci:** `data/spomeniks.json`, niz od oko 4.150 objekata. Slike su u `slike/spomenici/<id>.webp`.
- **Alati:** `alati/` u repozitorijumu: `integritet.py`, `slike_odnos.py`, `commons_dodaj.py`, `proveri.py`, `upisi_cid.py`, `dodaj_google.py`, `snimi.mjs` i `naselja_osm.json`. Pokreću se **iz korena repozitorijuma**, sa `python -I alati/<alat>.py`.
- **Jednokratni alati i preuzeti ulazi:** folder `nazivi-alati` u Claude Code memoriji projekta, `~/.claude/projects/<putanja repozitorijuma, sa crticama umesto / \ i :>/nazivi-alati` (u daljem tekstu `$A`): `osm_dodaj.py`, `rnpd_*.py`, `spisak.py`, `koraci.mjs`, `pregledac_json.mjs`, `spomenici_osm.json` i `ulaz/`. Nisu u repozitorijumu, pa na drugom računaru postoje samo ako se prenesu ručno.
- **Ulazi koji su već preuzeti:** `$A/ulaz/` (videti zadatke).
- **Korisnik:** piše na srpskom i želi kratke odgovore, najviše dve rečenice. Sporne slučajeve rešavaš sam ili ih preskačeš, bez spiskova za korisnika. Ne komituješ; to radi korisnik.

## 2. Standard zapisa (obavezno za svaki novi ili izmenjen spomenik)

- **Redosled polja:** `id, koordinate{lat,lng}, googleCid, title, info, wiki, wikiEn, slika, slikaOdnos, slikaAutor, naziv, name, year, author, stanje, type, drzava`. Prazna polja se izostavljaju.
- **Fajl:** UTF-8, CRLF, uvlačenje 2, `ensure_ascii=False`, sa CRLF na kraju. Upis uvek ovako:
  `open(P,'w',encoding='utf8',newline='').write(json.dumps(d,ensure_ascii=False,indent=2).replace('\n','\r\n')+'\r\n')`
- **id:** mala ASCII slova, cifre i crtice, jedinstven, najviše oko 50 znakova (npr. `slug(mesto + naziv)`).
- **koordinate:** 7 decimala.
- **title:** samo mesto, latinicom, u obliku „Grad (deo grada)“, npr. „Beograd (Banjica)“. Bez engleskih reči.
- **naziv:** izvorni naziv. Srbija, Hrvatska, BiH, Crna Gora i Kosovo: sh latinicom (ćirilicu preslovi). Slovenija: slovenački. Makedonija: makedonska ćirilica. `integritet.py` proverava pismo.
- **name:** engleski, samo kad se razlikuje od naziva.
- **type:** `istaknut` (samo kad postoji stranica na spomenikdatabase), `spomenik` (umetničko delo poznatog autora ili veći spomenik), `lokalni` (spomen-obeležje, podrazumevano za nove), `kompleks` (spomen-park), `groblje`, `muzej` (i spomen-kuća), `bista`, `ploca`.
- **stanje:** samo `rusevine`, `uklonjen`, `ostecen`, `zatvoren`, `srusen`; kad je spomenik očuvan, polje se izostavlja.
- **drzava:** `Slovenia, Croatia, Bosnia and Herzegovina, Serbia, Montenegro, Macedonia, Kosovo, Italy`.
- **info:** izvor (OSM link `https://www.openstreetmap.org/node/…`, Commons fajl, registar). **wiki:** domaći članak (redom sh, sr, hr, bs, pa jezik države). **wikiEn:** engleski članak.
- **slika:** 400 px širine, webp kvaliteta 75 (`magick - -resize 400x -quality 75 out.webp`). **slikaAutor:** „Autor, licenca“. **slikaOdnos:** posle svake nove slike pokreni `slike_odnos.py`.
- **author:** više autora se spaja sa „ & “. Park dobija autora samo ako su sva dela u njemu jednog autora.
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
| `alati/integritet.py` | Provera celog fajla (polja, pismo, slike, duplikati na manje od 30 m). Pokreni posle svake izmene; 16 parova „manje od 30 m“ su namerni (park i spomenik u njemu). |
| `alati/slike_odnos.py` | Upisuje `slikaOdnos` svim slikama. Pokreni posle dodavanja slika. |
| `alati/commons_dodaj.py <spisak.json> <fajlovi.json>` | Dodaje spomenike ili slike sa Commons-a: preuzima sliku, pravi webp, potpis i naslov iz najbližeg naselja. Spisak: `[{fajl,id,naziv,name,type,drzava,[title]}]` ili `[{fajl,postojeci}]`; `fajlovi.json`: `{fajl: {"k": [lat,lng]}}`. |
| `$A/osm_dodaj.py <alati> <osm_kand.json> [--upisi]` | Primer filtera za NOB (`JEZGRO`, `NE`, `RUCNO`), naslova „Grad (deo)“ i vrste po imenu. Bez `--upisi` samo ispisuje. |
| `$A/rnpd_dodaj.py`, `$A/rnpd_slike.py` | Slovenački registar (završeno). |
| `alati/upisi_cid.py`, `alati/dodaj_google.py <vrsta> <link> <naziv> …`, `alati/proveri.py` | Rad sa Google linkovima koje šalje korisnik. |
| `$A/spisak.py <wikitext> <drzava>` | Redovi wiki spiska upoređeni sa našim spomenicima po mestu (polazna tačka za zadatak B). |
| `alati/snimi.mjs`, `$A/koraci.mjs` | Headless Chrome za proveru aplikacije (`python -m http.server 8765` u korenu repozitorijuma; `W`/`H` za desktop, `HASH=#<id>` za otvaranje spomenika). |
| `$A/pregledac_json.mjs <url> <izlaz.json>` | Jedno učitavanje stranice uz čuvanje JSON odgovora koje ona sama povuče (Flickr, spomenikdatabase). |
| `alati/naselja_osm.json` | Naselja za naslove (`place` = city/town/village/suburb…). |

Pregled slika: `magick montage -label '%t' <fajlovi> -tile 5x3 -geometry 220x165+3+3 pregled.png`, pa pogledaj sliku. Svaka nova slika mora proći ovakav pregled.

## 5. Zadaci, redom

Posle svakog zadatka: `integritet.py` bez novih grešaka, `slike_odnos.py` ako ima novih slika, kratak unos u `docs/BELESKE.md` (šta je urađeno, brojevi, šta je preskočeno i zašto), brisanje stavke iz `## TODO` u `README.md`.

### A. Commons: geotagovana mesta koja nemamo

- **Ulaz:** `$A/ulaz/commons_ww2_geo.json` (1.586 fajlova iz 243 kategorije „World War II memorials in …“ i „Monuments to the Yugoslav Partisans in …“, sa koordinatama i kategorijom).
- **Koraci:**
  1. Izdvoj fajlove dalje od 300 m od svih naših spomenika i grupiši ih po 100 m (oko 383 mesta: Makedonija oko 340 fajlova, Srbija 260, Hrvatska 62).
  2. Po kategoriji i imenu fajla odbaci one koji nisu spomenici NOB-a (npr. Almaški krst, spomen-kuće poznatih ljudi, groblja iz Prvog svetskog rata, NATO).
  3. Za svako mesto izaberi jedan fajl i naziv. Naziv uzmi iz imena kategorije ili fajla, a za Makedoniju ćirilicom. Za proveru opisa koristi jedan zbirni `imageinfo` sa `extmetadata` (ImageDescription) po 50 fajlova.
  4. Pokreni `commons_dodaj.py`; type je `lokalni`, osim kad je očigledno bista, ploča ili groblje.
  5. Napravi montažu svih novih slika i ukloni pogrešne (spomenik i slika ostaju samo ako slika prikazuje spomen-obeležje).
- **Procena:** oko 380 zahteva za slike (3 s), 15 zahteva za opise. Rezultat je oko 250 do 350 novih spomenika sa slikom.

### B. sr Wikipedija: spiskovi spomenika NOB

- **Ulaz:** `$A/ulaz/sr_spiskovi/*.txt`, wikitext spiskova: Србија (117 redova), БиХ (96), Македонија (130), Словенија (124), Црна Гора (44), Косово и Метохија (29), Ниш (17). Kolone su slika, naziv (često link na članak), mesto, posveta, „autor i godina“ i napomena. Koordinata nema.
- **Koraci:**
  1. Parsiraj redove (`|-` deli redove, `| align="center" |` ćelije). Iz kolone autora izvuci imena i godinu: „вајар X и архитекта Y, 1961.“ daje `X & Y` i `1961`.
  2. Upari sa našim spomenicima po mestu (naslov) i sličnosti naziva. Kod uparenih dopuni samo prazna polja `author`, `year` i `wiki` (ako je naziv link na postojeći članak); ništa postojeće ne prepisuj.
  3. Za neuparene potraži OSM obeležje u `spomenici_osm.json` u krugu od 3 km od naselja (`naselja_osm.json`) sa sličnim imenom. Dodaj samo kad je par jasan; inače preskoči.
  4. Slika iz kolone „Слика“ se uzima samo ako nije `Spomenik NOB-bez slike.jpg`, i to preko `commons_dodaj.py`.
- **Napomena:** spiskovi za Vojvodinu i Hrvatsku su već obrađeni.

### C. Wiki Loves Monuments Srbija

- **Ulaz:** `$A/ulaz/sr_spiskovi/Списак_знаменитих_места_у_Србији.txt` (81 mesto sa `{{coord|lat|lng}}`, oznake ZM).
- **Koraci:**
  1. Parsiraj mesta i koordinate. Zadrži ona koja su vezana za NOB (stratišta, logori, partizanske baze, spomen-parkovi), a odbaci Prvi srpski ustanak, srednji vek i slično.
  2. Upari sa našim spomenicima na manje od 300 m. Kod nas dodaj samo nova mesta, kao `kompleks` ili `lokalni`.
  3. Fotografije: Commons fajlovi nose `{{Cultural Heritage Serbia|<ID>}}` (26.605 fajlova). Za ID-ove iz spiska traži `hastemplate:"Cultural Heritage Serbia" insource:/Heritage Serbia\|(ID1|ID2|…)\}/` po 100 do 150 ID-ova u jednom upitu, pa zbirno pročitaj wikitext pogođenih fajlova (po 50) i upari po ID-u. Isti postupak je za Sloveniju opisan u `docs/BELESKE.md`.
  4. Slike dodaj preko `commons_dodaj.py` (`postojeci`), pa ih pregledaj na montaži.

### D. Fotografije za spomenike bez slike, van Slovenije

- **Ulaz:** naši spomenici bez `slika`, a `drzava != Slovenia` (oko 270).
- **Koraci:** za svaki po jedan Commons `list=geosearch` (`gscoord`, `gsradius=100`, `gsnamespace=6`, `gslimit=10`), sa pauzom od 3 s. Kandidat mora imati u imenu ili opisu reč spomenik/spomen/memorial/NOB/partizan ili ime mesta. Posle toga dolazi `commons_dodaj.py` (`postojeci`) i obavezna montaža. Fotografija parka koja prikazuje spomenik sa posebnim unosom se ne uzima.
- **Procena:** oko 270 zahteva.

### E. Hrženjak, „Rušenje antifašističkih spomenika u Hrvatskoj 1990–2000“

- **Cilj:** srušeni i oštećeni spomenici u Hrvatskoj (oko 3.000), sa `stanje` `uklonjen` ili `ostecen`.
- **Koraci:** prvo pronađi dostupan tekst knjige (izdanje SABA RH 2002; Documenta, scribd, archive.org) i zabeleži izvor. Ako je dostupan, parsiraj spisak po opštinama i mestima. Upari sa postojećim (po mestu), i postojećima samo dopuni `stanje`. Nove dodaj samo kad postoji tačna lokacija (OSM, Commons); ostale ne dodaji na centar sela bez dogovora sa korisnikom.

### F. SANU „Споменици културе у Србији“

- **Cilj:** istraži `spomenicikulture.mi.sanu.ac.rs`: da li ima znamenita mesta NOB-a sa lokacijom, fotografijom i licencom koja dozvoljava upotrebu. Napiši nalaz u `docs/BELESKE.md`. Masovno preuzimanje ide tek posle dogovora sa korisnikom.

## 6. Kad je posao gotov

- `integritet.py` ne pokazuje nove greške.
- Aplikacija se otvara: `node alati/snimi.mjs proba.png "document.querySelectorAll('.leaflet-marker-icon').length"` vraća broj veći od nule, bez `EXC` u izlazu.
- `docs/BELESKE.md` i `README.md` (`## TODO`) su ažurirani.
- Korisniku se javlja u najviše dve rečenice, na srpskom: koliko je dodato i šta je sledeće.
