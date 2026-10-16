---
name: spomenici-zetva
description: Dobavljanje podataka za projekat Spomenici iz spoljnih izvora — novi spomenici, lokacije, fotografije, autori, godine i posvete sa Google mapa, Commons-a, OSM-a (Overpass, Nominatim), Vikipedije i Wikidate, registara i sajtova. Pravila prema serverima, postupci koji rade, pregled fotografija i obuhvat (samo NOB i Drugi svetski rat). Koristi ga uvek kad korisnik pošalje link ili članak o spomeniku, traži „dodaj“, „nađi sliku“, „nađi lokaciju“, „dopuni“, „posvećen je…“, ili kad prolaziš kroz `data/bez_lokacije.json` ili neki spisak spomenika.
---

# Žetva podataka

Standard zapisa (polja, nazivi, vrste, obuhvat) je u `references/standard.md`. Nazive određuje skil `spomenici-nazivi`, a posle svake izmene proveru radi skil `spomenici-provera`. Zapis se upisuje preko `poredaj` iz `alati/zapis.py`. Obrađeni izvori i nalazi se zapisuju u beleške projekta, da se posao ne ponavlja.

## Pravila prema serverima

- **Zahtevi:**
  - šalju se jedan po jedan, sa pauzom od najmanje 3 s (Wikidata `wbgetentities` 10 s, Google mape 8 s);
  - nose User-Agent `spomeniks/1.0 (https://mudroljub.github.io/spomeniks)`;
  - kad postoji zbirni upit, koristi se on: Wikimedia `titles=` i Commons `prop=coordinates|imageinfo` do 50 naslova; duge liste idu POST-om, jer GET vraća 414.
- **Greške:** na 429, 504 ili captcha odmah stani. Nastavi tek posle duže pauze, sporije, ili lakšim upitom (npr. po državama).
- **Više od oko 500 zahteva** ka istom serveru traži pitanje korisniku.
- **spomenikdatabase.org** blokira posle oko 70 brzih zahteva, pa se čita samo pojedinačna stranica.
- **Overpass:**
  - `overpass-api.de` često vraća 502 ili 504;
  - rezerva je `overpass.kumi.systems`, ili ranije preuzeti OSM podaci sa diska;
  - posle greške probaj ponovo samo jednom.
- **Commons pretraga** (geosearch, cirrussearch) zna da vrati „too busy“; zbirni upiti preko `titles` rade.
- **Nominatim:** najviše jedan zahtev u sekundi. Dobar je za ulicu, trg ili selo, ali tačka trga nije tačka spomenika.

## Postupci koji rade

- **Google link od korisnika:**
  - `alati/proveri.py` iz linka čita ime, koordinate i id (heksadecimalni CID posle `0x…:0x`) i nalazi najbliže naše spomenike;
  - `alati/upisi_cid.py` i `alati/dodaj_google.py` upisuju podatke.
  - Kratak link `maps.app.goo.gl` se otvara sa `curl -s -o /dev/null -w "%{redirect_url}"`. Proveri da li link vodi na traženi spomenik: zna da pokazuje na drugi.
- **Google mape bez linka:** samo preko Chrome-a bez prozora (CDP), jer bez pregledača pretraga nema rezultata.
  - `maps?cid=<id>` otvara mesto, a `maps/search/<naziv, mesto>` pretragu;
  - kad pretraga vodi pravo na `/maps/place/`, koordinate su posle `!3d` i `!4d`;
  - glavna fotografija je prva `img` sa `googleusercontent.com/(gps-cs-s|grass-cs|p)/` šira od 200 px, a pun oblik se dobija sa `=w800-k-no` na kraju adrese;
  - potpis je „Google Maps“; Street View se ne koristi;
  - primer je `alati/google_slike.mjs`. Istoimena mesta su česta (Trg mladih u Ćićevcu i u drugom mestu), pa proveri koordinate.
- **Commons:**
  - GPS fotografije dolaze preko `prop=coordinates`, `coprimary=all` i `imageinfo` (autor, licenca, `iiurlwidth=640`);
  - `alati/commons_dodaj.py` traži naslove sa prefiksom `File:`.
- **Wikipedija i Wikidata:**
  - Q-id članka daje `prop=pageprops` (`wikibase_item`);
  - nazive i linkove daje `wbgetentities` sa `props=labels|sitelinks/urls`, po 50 id-ova;
  - `P31 = Q5` znači da je članak o osobi.
- **Prolaz kroz `data/bez_lokacije.json`:** obavezno po verovatnoći uspeha, ne redom. Prednost imaju konkretni objekti (muzej, škola, dom), savremene adrese i precizne tačke; uklonjeni spomenici se preskaču. Hrvatski kandidati pre dodavanja prolaze [proveru opstanka](../../../docs/PLAN_KNJIGE.md#7-provera-opstanka-hrvatskih-spomenika--prioritet-pre-novih-unosa).
- **Lokacija bez Google id-a**, redom:
  1. GPS fotografije na Commons-u;
  2. jedan Overpass upit `nwr(around:2000,lat,lon)[historic~"memorial|monument"]` oko sela iz `alati/naselja_osm.json`;
  3. uparivanje po imenu;
  4. sajt opštine ili lokalne vesti često imaju godinu, autora i tačno mesto („ispred biblioteke“).

## Fotografije

- Svaka nova fotografija prolazi pregled u montaži:
  `magick montage -label '%t' <fajlovi> -tile 5x3 -geometry 220x165+3+3 pregled.png`, pa pogledaj sliku.
- **Odbacuje se:**
  - fotografija bez vidljivog spomenika (pejzaž, zgrada, crkva, automobil, životinje);
  - kolaž;
  - fotografija sa čovekom u prvom planu;
  - spomenik išaran grafitima;
  - drugo mesto;
  - natpis koji pokazuje drugi rat, npr. ploča udruženja solunskih dobrovoljaca.
- **Redosled alata posle upisa:** `slike_odnos.py`, `bez_metapodataka.py --upisi`, `male_slike.py`.
- Potpis u stavci je „Autor, licenca“, bez posebnih fajlova sa licencama.
- Prazno nebo i višak se seku pre umanjivanja na 400 px.

## Posvete

- Spomeniku posvećenom događaju, logoru, bici ili ličnosti upisuje se Q-id u `posveta`, a stavka u `data/posvete.json`:
  - `naziv` je naslov sh članka;
  - `name` je engleski naziv sa Wikidate, kad se razlikuje;
  - `wiki` i `wikiEn` su linkovi.
- Bez članka na Vikipediji nema posvete; tada samo izvor u `izvor`.
- Posveta koju više nijedan spomenik ne koristi briše se iz `posvete.json`.
- Opšte posvete („palim borcima“, Drugi svetski rat) se ne upisuju.

## Obuhvat u praksi

- Pre dodavanja proveri rat. Ovo nije bilo NOB:
  - Mojkovačka bitka (1916);
  - Neznani junak na Avali (Prvi svetski rat);
  - železničke nesreće;
  - manastiri, iako su nekad mesto događaja (Prohor Pčinjski; tu važi Memorijalni centar ASNOM-a u Pelincu).
- Spomenik posvećen svim ratovima, sa delom za NOB, ostaje (Trubjela).
- Mesto u polju `mesto` uzima se iz samog izvora ili iz OSM-a, a ne iz najbližeg sela u alatu: tako je česma u Rakovici bila upisana kao Pinosava.
