# Plan žetve podataka — uputstvo za agenta

Ažurirano 2026-10-15. Ovaj dokument je dovoljan za samostalan rad: šta se radi, kojim redom, kojim alatima, šta se ne sme i kad je zadatak gotov. Istorija izvora i iskustva sa serverima su u `docs/BELESKE.md`; pročitaj je pre početka.

## 1. Kontekst

- **Aplikacija:** Spomeniks, mapa spomenika NOB-a sa prostora Jugoslavije (vanilla JS + Leaflet). Putanje su relativne u odnosu na koren repozitorijuma, osim onih sa `$A`.
- **Podaci:** `data/spomeniks.json`, niz od oko 4.150 objekata. Slike su u `slike/spomenici/<id>.webp`.
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

**Stanje 2026-10-15:** završeni zadaci A, B, C i F su uklonjeni iz plana, a njihova istorija je u `docs/BELESKE.md`. D je u toku: Srbiju obrađuje drugi agent u `docs/FOTOGRAFIJE_SRBIJA.md`. E je delimično urađen. G (Wiki Loves Monuments) je sledeći. Novi kandidat je spomenicinob.info (popis spomenika NOB-a u BiH, bez koordinata), ali tek posle dogovora sa korisnikom. Spomenici bez lokacije se skupljaju u `data/bez_lokacije.json`.

Posle svakog zadatka: `integritet.py` bez novih grešaka, `slike_odnos.py` ako ima novih slika, kratak unos u `docs/BELESKE.md` (šta je urađeno, brojevi, šta je preskočeno i zašto), brisanje stavke iz `## TODO` u `README.md`.

### D. Fotografije za spomenike bez slike, van Slovenije

- **Ulaz:** naši spomenici bez `slika`, a `drzava != Slovenia` (oko 270).
- **Koraci:** za svaki po jedan Commons `list=geosearch` (`gscoord`, `gsradius=100`, `gsnamespace=6`, `gslimit=10`), sa pauzom od 3 s. Kandidat mora imati u imenu ili opisu reč spomenik/spomen/memorial/NOB/partizan ili ime mesta. Posle toga dolazi `commons_dodaj.py` (`postojeci`) i obavezna montaža. Fotografija parka koja prikazuje spomenik sa posebnim unosom se ne uzima.
- **Procena:** oko 270 zahteva.

### E. Hrženjak, „Rušenje antifašističkih spomenika u Hrvatskoj 1990–2000“

**Dopuna 2026-10-15:** pronađen je dostupan [indeks srušenih, oštećenih i uklonjenih spomenika](https://plusportal.hr/media/images/old_sb/Files/180319164051354/popis%20uklonjenih%20bisti%20i%20spomenika%20iz%20NOB-a.pdf) (63 PDF strane, autori indeksa Zrnka Novak i Relja Bosanac, 2.120 evidentiranih spomenika). Pun tekst knjige i bibliografska veza još nisu potvrđeni. Tema više nije bez dostupnog spiska: prvo ciljano proveriti postojeće hrvatske stavke iz `data/bez_lokacije.json`; opis i staro stanje čuvati uz izvor, a unos na mapu zahteva potvrđenu lokaciju. Ne prepisivati istorijsko stanje preko današnjeg bez novije potvrde. Svih 37 tadašnjih hrvatskih stavki ciljano je pregledano 2026-10-15: dodati su Peroj i grobnica na Senjaku, uklonjen duplikat Anke Butorac, ostale su 34 hrvatske stavke bez tačke. Detalji su u `docs/BELESKE.md`, odeljak „Provera hrvatskih stavki u indeksu“; preostale lokacije i širi popis nisu završeni.

- **Cilj:** srušeni i oštećeni spomenici u Hrvatskoj (oko 3.000), sa `stanje` `uklonjen` ili `ostecen`.
- **Koraci:** prvo pronađi dostupan tekst knjige (izdanje SABA RH 2002; Documenta, scribd, archive.org) i zabeleži izvor. Ako je dostupan, parsiraj spisak po opštinama i mestima. Upari sa postojećim (po mestu), i postojećima samo dopuni `stanje`. Nove dodaj samo kad postoji tačna lokacija (OSM, Commons); ostale ne dodaji na centar sela bez dogovora sa korisnikom.

### G. Wiki Loves Monuments: Srbija i Republika Srpska

- **Zašto:** WLM u Srbiji ne pokriva samo zaštićena dobra nego i seoske spomenike, a sve fotografije su na Commonsu. `Category:Images from Wiki Loves Monuments in Serbia` ima oko 25.900 fajlova (potkategorije po godinama, npr. `… 2024 in Serbia` sa 4.038), a `Category:Images from Wiki Loves Monuments 2021 in the Republika Srpska` pokriva RS. Ranija provera (Srbija, 2026-10-14) gledala je samo spiskove znamenitih mesta i spomenika kulture, ne same fotografije.
- **Koraci:**
  1. Za svaku godišnju kategoriju po jedan zbirni upit: `generator=search`, `gsrsearch=deepcat:"Images from Wiki Loves Monuments <godina> in Serbia"` (odnosno RS), `gsrnamespace=6`, `gsrlimit=500`, `prop=coordinates`, uz `gsroffset` dok ima rezultata. Podela po godinama je potrebna jer pretraga ne ide dalje od 10.000 rezultata. Rezultat (naslov, koordinate) sačuvati na disku, da se ne preuzima ponovo.
  2. Fajlove bez koordinata u fajlu ne nagađati; preskočiti ih.
  3. **Postojeći bez slike:** fajlovi na manje od 80 m od naših spomenika bez `slika` u Srbiji i BiH. Za kandidate jedan zbirni `imageinfo` sa `extmetadata` (opis, autor, licenca) po 50 fajlova, pa obavezna montaža. Kandidate za Srbiju upisati u `docs/FOTOGRAFIJE_SRBIJA.md` (posebno odeljak „WLM kandidati“) za agenta koji obrađuje Srbiju, a ne upisivati ih sam; BiH upisati preko `commons_dodaj.py` (`postojeci`).
  4. **Novi spomenici:** fajlovi dalje od 300 m od svih naših spomenika čiji naslov ili opis ima reč spomenik/споменик, NOB/НОБ, palim/палим, borcima/борцима, partizan/партизан, grupisani po 100 m. Posle provere opisa i montaže dodati preko `commons_dodaj.py`, uz pravila obuhvata iz odeljka 2 (bez Prvog svetskog i starijih ratova, bez ratova 1990-ih).
  5. Unos u `docs/BELESKE.md` i ažuriranje `README.md`.
- **Procena:** oko 55 zahteva za Srbiju i nekoliko za RS, plus po jedan `imageinfo` na 50 kandidata.

## 6. Kad je posao gotov

- `integritet.py` ne pokazuje nove greške.
- Aplikacija se otvara: `node alati/snimi.mjs proba.png "document.querySelectorAll('.leaflet-marker-icon').length"` vraća broj veći od nule, bez `EXC` u izlazu.
- `docs/BELESKE.md` i `README.md` (`## TODO`) su ažurirani.
- Korisniku se javlja u najviše dve rečenice, na srpskom: koliko je dodato i šta je sledeće.
