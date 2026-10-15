# Plan optimizacije — stari telefoni i spor internet

Ažurirano 2026-10-15. Plan je napisan tako da po njemu može da radi i drugi agent. Sadrži merenja polaznog stanja, korake poređane po koristi, pravila koja se ne smeju prekršiti i merila po kojima se zna da je posao gotov.

## 1. Polazno stanje (izmereno)

**Procesor.** Merenja su urađena u headless Chrome-u, na ekranu od 390 px, sa procesorom usporenim 6 puta, što približno odgovara slabom Android telefonu. Za uzrok je korišćen profajler.

| Radnja | Blokira telefon | Uzrok |
|---|---|---|
| Prvo otvaranje, do prvih obeliska | 6,2 s, uz duge zadatke od 2,9 s i 1,5 s; meri se na lokalnom serveru, bez kašnjenja mreže | `postaviMarkere` → `osvezi`: svaki obelisk dobija ikonicu dva puta, pri dodavanju i odmah posle toga kroz `setIcon` |
| Jedan korak zuma oko nivoa 11 | 1,1–1,4 s po koraku | Posle zuma 11 u DOM-u je svih 4.463 obeliska, i oni van ekrana; `osvezi` svakom od njih pravi novu sliku |
| Prvo slovo u pretrazi | **14,7 s** | `render` briše sve obeliske pa ih ponovo dodaje; pošto je skup sužen, vidljivi su svi pogođeni; Leaflet `_listens` pri svakom dodavanju pretražuje sve slušaoce mape, pa trošak raste kvadratno |
| Drugo slovo | 4,4 s | Isto, na manjem skupu |

**Mreža.** Merenje je hladno otvaranje objavljenog sajta, posmatrano prvih 15 s.

| Šta | Zahteva | Preneto |
|---|---|---|
| Sličice u traci na dnu | 30 | 454 KB, slike od 400 px prikazane u visini 58 px |
| Pločice mape (NatGeo) | 12 | 433 KB |
| Podaci (`spomeniks.json` i ostali) | 5 | 300 KB, gzip |
| Leaflet sa unpkg.com | 2 | 46 KB, sa posebnog domena |
| Naš JS | 19 | 35 KB, učitava se lancem uvoza dubine oko 5 |
| **Ukupno** | | **oko 1,3 MB** |

Na sporoj vezi od oko 400 kb/s to je oko 26 s. Service worker uzima aplikaciju i podatke prvo sa mreže, pa i telefon koji ih već ima čeka mrežu pri svakom otvaranju. Na vezi koja je spora, ali nije prekinuta, to čekanje nema gornju granicu.

## 2. Pravila koja važe za svaki korak

- **Izgled i ponašanje ostaju isti.** Markeri su uvek obelisci, skalirani po zumu, bez grupisanja i tačkica. Kucanje i izbor filtera ne pomeraju mapu. Nema novih kontrola.
- **Bez alata za pakovanje (bundler-a).** Aplikacija ostaje vanilla JS sa ES modulima i radi direktno sa GitHub Pages-a. Korak za objavljivanje može se uvesti samo uz dogovor sa korisnikom.
- **Svaki korak se meri pre i posle**, istim alatom i pod istim uslovima (odeljak 4), a brojevi se upisuju u odeljak 5 ovog plana. Korak koji ne donosi merljivo poboljšanje se vraća.
- **Provera u emulaciji nije dokaz da UI radi na telefonu.** Na kraju svakog koraka korisnik proverava na pravom telefonu. Dotad se izmena ne prijavljuje kao gotova.
- Jedan korak, jedna izmena. Korisnik komituje.

## 3. Koraci, redom

### 0. Alat za merenje — urađeno

`node alati/merenje.mjs [url]`, uz `python -m http.server 8765` u korenu. Alat simulira telefon od 390 px sa procesorom usporenim 6 puta (`CPU=` menja usporenje, a `MREZA=1` dodaje vezu od 400 kb/s i 400 ms). Meri sledeće:

- vreme do prvih obeliska i duge zadatke pri otvaranju;
- zum 9–12 i pomeranje mape prevlačenjem;
- otvaranje spomenika;
- pretragu;
- prenete bajtove po grupi.

Isti zapis varira oko 20–30% između pokretanja, pa se porede samo razlike veće od toga.

### 1. Crtati samo obeliske na ekranu — urađeno, čeka proveru na telefonu

Ovo je najveća korist, za otvaranje, zum, pomeranje i pretragu.

- U `klase/mapa.js`, `osvezi` dodaje samo obeliske čija je pozicija u `mapa.getBounds().pad(0.5)` i koji prolaze postojeće pravilo `vidljiv`. Ostale uklanja. Izabrani i označeni (posetio, lista) se, kao i sada, ne skrivaju po zumu, ali se i oni crtaju samo na ekranu.
- Osvežavanje ide na `moveend` i `zoomend`, a ne na svaki pokret.
- U `klase/Marker.js` ikonica se postavlja **pre** dodavanja na mapu, a `setIcon` se zove samo kad se ikonica stvarno promeni. Treba zapamtiti trenutnu ikonicu: kad je ista, ne dirati je.
- **Očekivano:** na zumu 11 u DOM-u je nekoliko stotina obeliska umesto 4.463, korak zuma traje ispod 200 ms, a otvaranje se ubrzava za oko polovinu.

### 2. Pretraga bez ponovnog crtanja svega — urađeno, čeka proveru na telefonu

- `praviTekst(spomenik)` se računa jednom, pri učitavanju, i čuva uz stavku (`komponente/Pretraga.js`).
- `postaviMarkere` ne briše sloj, nego dodaje i uklanja samo razliku između starog i novog skupa. Uz korak 1 to je ionako samo ono što je na ekranu.
- Nije rađeno, jer merenje posle prve dve izmene ne opravdava dodatni kod: ponovno pravljenje trake sa slikama traje oko 1 ms (traka učitava slike postepeno), a slovo je već na oko 100 ms, pa odlaganje crtanja (debounce) ne bi donelo vidljivu razliku.
- **Očekivano:** slovo blokira telefon manje od 100 ms, umesto 14,7 s.

### 3. Male sličice za traku — urađeno, čeka proveru na telefonu

- Alat `alati/male_slike.py` pravi `slike/male/<id>.webp`, visine 116 px (dvostruko od prikazanih 58 px), webp kvaliteta 70, bez metapodataka. Prosek je 3,6 KB po slici, ukupno 9,6 MB u repozitorijumu. Sa metapodacima prosek bi bio 10 KB, jer EXIF, ICC i XMP često zauzimaju više od same slike. Standard podataka (`docs/PLAN_ZETVE.md`, odeljak 2) dobija pravilo da svaka nova slika dobija i malu verziju, a `integritet.py` proverava da mala postoji.
- Traka (`komponente/Slika.js`) i spisak tura (`komponente/Ruta.js`) koriste malu sliku, preko `malaSlika` iz `utils/helpers.js`. Prozor spomenika koristi veliku, kao i ranije.
- Uzrok viška nije bilo pravilo „još jedan ekran unapred“, nego slike bez dimenzija: pre učitavanja su bile široke 0 px, pa je traka dodavala nove sve dok se ne učitaju. Sada `img` dobija `width` i `height` iz `slikaOdnos`, a CSS `width: auto`.
- **Izmereno:** traka pri otvaranju učitava 12 sličica, ukupno 36 KB, umesto 30 slika od 454 KB.

### 4. Brže prvo učitavanje — urađeno, čeka proveru na telefonu

- Leaflet 1.9.4 (js, css i slike kontrola) premestiti u repozitorijum, u `lib/leaflet/`. Tako otpadaju poseban domen, DNS i TLS, što na sporoj vezi iznosi 1–2 s, a fajlovi idu istom HTTP/2 vezom kao ostatak. U `sw.js` ažurirati spisak fajlova i pravilo za unpkg.
- U `index.html` dodati `<link rel="modulepreload">` za sve module i `<link rel="preload" href="data/spomeniks.json" as="fetch" crossorigin>`. Tako se lanac uvoza i podaci preuzimaju odjednom, a ne jedan za drugim.
- SRI otisci preuzetih fajlova poklapaju se sa onima koji su bili u `index.html`.
- **Izmereno** preko lokalnog servera sa gzip-om, kao na GitHub Pages, po dva merenja:
  - na vezi od 1,6 Mb/s i 300 ms prvi obelisci stižu za 8,4–10,0 s, a pre izmene za 10,3–11,6 s;
  - na vezi od 400 kb/s i 400 ms razlike nema (oko 24 s), jer tada sve čeka propusnost: pločice od 433 KB i podaci od 282 KB dele istu vezu.

### 5. Service worker: keš ne čeka sporu mrežu — urađeno, čeka proveru na telefonu

- Aplikacija i podaci idu prvo sa mreže, ali sa rokom od 3 s. Kad rok istekne, odgovor dolazi iz keša, a mrežni zahtev se završava u pozadini i osvežava keš za sledeće otvaranje. Mapa i slike ostaju „prvo keš“, kao i sada.
- Da se ne pomešaju fajlovi stare i nove verzije: kad stranica dođe iz keša (rok je istekao ili mreže nema), service worker pamti tu stranicu (`resultingClientId`), pa i svi njeni ostali zahtevi idu prvo iz keša.
- **Izmereno** sa serverom koji kasni 10 s: mapa se pojavi za 3,4 s, iz keša. Kad server ponovo odgovara brzo, sledeće otvaranje je sa mreže, za 0,7 s. Lokalni server radi preko HTTP/1.1, sa najviše 6 veza, pa zaostali zahtevi iz pozadine mogu da uspore sledeće otvaranje dok se ne završe. GitHub Pages radi preko HTTP/2, gde tog ograničenja nema.

### 6. Manji podaci — odloženo, merenje ne opravdava

- Polje `slika` uvek je `slike/spomenici/<id>.webp`, pa bi moglo postati logička vrednost. Izmereno: to štedi samo 13 KB gzip-a (5%), a menja model podataka i alate.
- Upis bez uvlačenja štedi oko 10% preuzimanja (262 umesto 290 KB gzip), ali kvari pregledne razlike u gitu. Zato samo uz korak objavljivanja, što traži dogovor (odeljak 2).
- Podela na lak indeks (mapa i pretraga, oko 198 KB) i detalje koji se učitavaju naknadno štedi oko 65 KB, ali dodaje drugi fajl i čekanje pri otvaranju prozora. Verovatno se ne isplati.
- Ovo pogađa samo prvo otvaranje, jer posle toga podatke čuva service worker.

### 7. Stari pregledači — pregledano, čeka proveru na najstarijem telefonu

- **Najstariji podržan pregledač:** Chrome 85, Safari 14 (iOS 14) i Firefox 79.
  - Granicu postavljaju `??=` u `klase/Marker.js` i `Promise.any` u `sw.js`.
  - Na starijem pregledaču `??=` je sintaksna greška, pa se aplikacija uopšte ne otvara.
  - Zamena za `??=` spustila bi granicu samo na Chrome 80 i Safari 13.1, zbog `?.`.
  - Telefoni zaglavljeni na iOS 12 (iPhone 5s i 6) traže prevođenje koda (transpiling), odnosno korak objavljivanja, pa nisu obuhvaćeni.
- **Svojstva koja imaju zamenu:**
  - `dvh`: pre njega stoji `height: 100%` za `html, body, #mapa`, koji važi kad `100dvh` nije podržan.
  - `aspect-ratio` i `cqw` u prozoru spomenika: bez njih okvir slike nema unapred zadat oblik i prozor jednom poskoči pri učitavanju slike, ali radi.
- Ostaje provera na najstarijem telefonu koji korisnik ima.

### 8. Metapodaci velikih slika — urađeno

- Izmereno: EXIF i XMP zauzimali su 14,6 MB od 80 MB velikih slika. Pogođeno je 690 slika, i one su se pri otvaranju prozora spomenika preuzimale oko trećinu sporije.
- `alati/bez_metapodataka.py --upisi` izbacuje EXIF i XMP direktno iz WebP kontejnera, bez ponovnog sažimanja. `magick compare` potvrđuje da su svi pikseli isti, a Chrome učitava sve izmenjene slike.
- ICC profil ostaje, jer 30-ak slika nije u sRGB-u (Display P3, Adobe RGB), pa bi im se bez njega promenile boje. Ostao bi i EXIF koji okreće sliku (Orientation 2–8), ali takvih slika trenutno nema.
- U standard podataka (`docs/PLAN_ZETVE.md`) dodato je da se alat pokreće posle dodavanja slika, pre `male_slike.py`.

### 9. Filter preko cele stranice (za proveru na telefonu)

`body { filter: sepia(31%) }` u `style.css` boji celu aplikaciju, i mapu i prozore. Filter na elementu koji sadrži mapu koja se pomera može da natera pregledač da pri svakom pomeranju ponovo iscrta ceo ekran kroz filter. Na slabom grafičkom čipu to znači seckanje. U headless Chrome-u bez grafičkog čipa ovo se ne može pouzdano izmeriti, pa ga treba proveriti na pravom telefonu: Chrome na računaru, `chrome://inspect`, panel Performance, pomeranje mape sa filterom i bez njega. Ako je razlika velika, filter primeniti samo na pločice mape (`.leaflet-tile-pane`), a boje markera i prozora prilagoditi tako da izgled ostane isti, uz dogovor sa korisnikom.

### Rezerva: obelisci na canvasu

Ako posle koraka 1 i 2 zum na usporenom procesoru i dalje traje duže od 200 ms, obeliske crtati na jednom canvas sloju umesto kao stotine `<img>` elemenata. To je veća izmena: Leaflet nema canvas sloj za slike, pa bi se klik i izgled izabranog morali napraviti ponovo. Ne započinjati bez merenja koje to opravdava.

## 4. Merila za kraj

Mere se alatom iz koraka 0, sa procesorom usporenim 6 puta i ekranom od 390 px.

| Merilo | Sada | Cilj |
|---|---|---|
| Prvi obelisci (lokalno, bez kašnjenja mreže) | 6,2 s | < 2,5 s |
| Najduži zadatak pri otvaranju | 2,9 s | < 0,5 s |
| Korak zuma | 1,1–1,4 s | < 0,2 s |
| Slovo u pretrazi | 14,7 s | < 0,1 s |
| Preneto pri hladnom otvaranju | oko 1,3 MB | < 0,8 MB, uglavnom pločice i podaci |
| Ponovno otvaranje na sporoj vezi | čeka mrežu | mapa iz keša za oko 1 s |

Posao je gotov kad su svi ciljevi postignuti ili je za svaki promašen upisan razlog u odeljku 5, kad korisnik potvrdi da na svom telefonu nema razlike u izgledu i ponašanju i kad je stavka uklonjena iz `## TODO` u `README.md`.

## 5. Rezultati

Najduži zadatak, u ms, merenje `alati/merenje.mjs` sa procesorom usporenim 6 puta.

| Radnja | Pre | Posle koraka 1 | Posle koraka 2 |
|---|---|---|---|
| Otvaranje | 2.659 | 1.692–2.444 | 3.415–4.636 (rasipanje merenja; profajler pokazuje da tekst za pretragu dodaje oko 30 ms bez usporenja) |
| Zum na 9 / 10 / 11 | 1.139 / 1.470 / 1.000 | 559–866 / 195–648 / 108–260 | 1.017 / 226 / 158 |
| Pomeranje mape na zumu 11 | — | 93–104 | 142–148 |
| Otvaranje spomenika | 3.816 | 0–256 | 0 |
| Slovo u pretrazi | 13.521 / 5.337 | 248–490 / 194–485 | 55–57 / 84–140 |
| Brisanje pretrage | 10.018 | 190–313 | 116–333 |
| Obeliska u DOM-u na zumu 11 | 4.463 | 17 u centru BiH, 112 u Beogradu | isto |

**Stanje posle koraka 1–8.** Pretraga, zum od nivoa 10 naviše, pomeranje mape i otvaranje spomenika su na cilju ili blizu njega.

Otvaranje nije na cilju. Merenje otvaranja jako varira sa opterećenjem računara: u istom satu prvi obelisci su stizali za 7–8,8 s, a najduži zadatak trajao je 2,2–4,6 s. Isti raspon važi sa najavom fajlova iz koraka 4 i bez nje, pa ta najava otvaranje ne usporava.

Profajler bez usporenja pokazuje gde ide vreme pri otvaranju:

| Deo otvaranja | Trajanje |
|---|---|
| Naš kod ukupno | oko 260 ms |
| 508 obeliska na ekranu | oko 90 ms |
| `praviStavku` za 4.463 spomenika, od toga 2.656 elemenata trake (`Slika`) | 96 ms, od toga 56 ms |
| `Pretraga` (filteri i tekst za pretragu) | 55 ms |
| Raščlanjivanje stranice i podataka, stilovi i raspored (`program`) | oko 270 ms |

Sledeći mogući korak je da se elementi trake prave tek kad uđu u traku, a ne svih 2.656 unapred. Procena uštede je oko 0,3 s na slabom telefonu.

Zum na 9 i dalje traje 0,5–1 s, jer odjednom crta oko 200 obeliska.
