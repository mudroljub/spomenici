# Alati (fascikla `alati/`)

Pokreću se iz korena repozitorijuma: Python sa `python -I alati/<alat>.py`, a Node sa `node alati/<alat>.mjs`.

| Alat | Namena |
|---|---|
| `integritet.py` | Provera celog `data/spomeniks.json`: polja, pismo, slike, duplikati na manje od 30 m. Pokreće se posle svake izmene podataka. |
| `zapis.py` | Redosled polja zapisa (`poredaj`), zajednički za sve alate koji pišu u `data/spomeniks.json`. |
| `commons_dodaj.py <spisak.json> <fajlovi.json>` | Dodaje spomenike ili fotografije sa Commons-a: preuzima sliku, pravi webp, potpis i mesto iz najbližeg naselja. |
| `proveri.py <link>` | Iz Google linka čita ime, koordinate i id i nalazi najbliže spomenike u bazi. |
| `upisi_cid.py <id> <link>` | Upisuje Google id i lokaciju postojećem spomeniku. |
| `dodaj_google.py <vrsta> <link> <naziv> …` | Dodaje nove spomenike sa Google linkova. |
| `google_slike.mjs <izlaz.json>` | Za spomenike bez slike sa Google id-om pamti adresu glavne fotografije sa Google mapa. |
| `slike_odnos.py`, `bez_metapodataka.py --upisi`, `male_slike.py` | Posle dodavanja slika, ovim redom: odnos širine i visine, izbacivanje EXIF-a i XMP-a, male slike za traku. |
| `naselja_osm.json` | Naselja iz OSM-a, za polje `mesto`. |
| `test.mjs` | `node --test alati/test.mjs`: glavni tokovi aplikacije u Chrome-u bez prozora. |
| `snimi.mjs <izlaz.png> [js] [ms]` | Snimak aplikacije na ekranu telefona. |
| `merenje.mjs [url]` | Brzina aplikacije na sporom telefonu i sporoj vezi. |
| `pregledac.mjs` | Zajednički kod za upravljanje Chrome-om, za `snimi.mjs`, `merenje.mjs` i `test.mjs`. |
