# Beleške o dobavljanju podataka (Spomenici)

Ažurirano 2026-10-14. Svi alati se pokreću iz korena repozitorijuma sa `python -I`. Alati koji se i dalje koriste su u `alati/`; jednokratni alati i sirovi podaci pominjani niže su van repozitorijuma, u `~/.claude/projects/<putanja repozitorijuma>/nazivi-alati`.

## Plan žetve (2026-10-14)

Detaljno uputstvo za izvršenje, i za drugog agenta, je u `docs/PLAN_ZETVE.md`.

Stanje: 3.703 spomenika (Slovenija 2.257, Hrvatska 524, Srbija 481, BiH 197, Makedonija 132, Crna Gora 88, Kosovo 22), a 1.450 bez slike. Redosled je po odnosu prinosa i broja zahteva.

1. **OSM sa diska (`spomenici_osm.json`) — urađeno 2026-10-14:** od 858 kandidata dodato je 447 (`osm_dodaj.py`; Hrvatska 226, Slovenija 98, Srbija 73, BiH 35). Odbačeni su ratovi 1990-ih (u BiH „palim/poginulim borcima“ bez jasne NOB reči), Prvi svetski i stariji ratovi, posleratne žrtve, partizanske bolnice, domovi i staze, Holokaust posle 1990. i obeležja van Jugoslavije. Filteri se primenjuju i na latinični prepis, jer su mnoga imena ćirilicom. Naslov dela grada je „Grad (deo)“, a ime sela se skida sa kraja naziva („Spomenik NOB Dežanovac“ -> „Spomenik NOB“).
2. **Commons geotagovane fotografije — urađeno 2026-10-14:** od 369 mesta dalje od 300 m od naših (`$A/ulaz/commons_grupe.json`) ručno je izabrano 244 i dodato preko `alati/commons_dodaj.py` (Makedonija 143, Srbija 64, Hrvatska 24, BiH 11), sa nazivom na jeziku države i slikom. Posle pregleda svih slika uklonjena su tri unosa (lokomotiva „Proleterka“, zgrada u Palači i obeležje u Vešali koje nije iz NOB-a), a dvema je skinuta slika. Odbačeni su delovi parkova koje već imamo (Šumarice, Kadinjača, Iriški venac), kuće, škole, crkve i manastiri, opšti snimci sela, biste iz Ilindenskog ustanka i obične česme.
3. **Fotografije za spomenike bez slike van Slovenije (269):** Commons geosearch oko svake tačke (269 zahteva), pa pregled na montaži.
4. **Hrženjak — zatvoreno 2026-10-14:** knjiga (SABA RH 2002; 2.964 srušena, oštećena ili uklonjena spomenika) nije dostupna na mreži, a Documentina „Unwanted heritage“ (2013) nema spisak. Za Zagreb postoji knjiga Šimunković i Delač, „Sjećanje je borba“ (2013: od 423 spomenika i ploče ostalo 189), a sh „Lista antifašističkih spomenika u Zagrebu“ (40 redova) je obrađena: dopunjeni su autori Grobnice narodnih heroja (Kavurić) i „Plamena revolucije“ (Sabolić), a 9 spomenika bez lokacije je u `data/bez_lokacije.json`. Prvobitni plan: „Rušenje antifašističkih spomenika u Hrvatskoj 1990–2000“:** oko 3.000 srušenih i oštećenih spomenika, sa lokacijom samo na nivou sela, i sa stanjem „uklonjen“. Prvo treba pronaći dostupan tekst knjige.
5. **Wikipedije — sr spiskovi „Списак споменика НОБ у …“ urađeni 2026-10-14:** `$A/sr_spiskovi.py` parsira 458 redova i uparuje ih po članku ili po mestu i nazivu (rezultat `$A/ulaz/sr_spiskovi_upareno.json`). Pouzdano je upareno 112; prazni autor i godina dopunjeni su kod 7 (Brezovica, Vječna vatra, Kraljevački oktobar, Boško Buha, Terazije, obalski radnici, Skela), a parkovi sa delima više autora (Jajinci, Bela Crkva) preskočeni su. Sličnost naziva 0,5 daje pogrešne parove („Gramozna jama“), a kolona autora ponekad sadrži mesto („Novom groblju“). Od 101 reda bez našeg spomenika u mestu skoro nijedan nema OSM obeležje u blizini, pa nisu dodati. Spisak za Niš ima drugačiji format i nije parsiran. mk kategorije su male (36 članaka).
5a. **Wiki Loves Monuments Srbija — urađeno 2026-10-14:** iz „Списак знаменитих места у Србији“ (81 sa koordinatama, `$A/ulaz/zm.json`) dodato je 7 mesta iz NOB-a kojih nema (Stevanske livade, „Hotel Milo“, baza „Centar“ u Vrbasu, logor u Zrenjaninu, Kalakača, Inđija, bista u Ašanji); ostala su iz drugih epoha ili ih već imamo. Iz 36 spiskova „Списак споменика културе у …“ (`$A/ulaz/sr_sk/`, šablon `{{споменици ред|ИД=…|Слика=…|гшир=…|гдуж=…}}`) NOB-u pripada 76 dobara, uglavnom rodne kuće narodnih heroja, koje ne dodajemo; dodate su partizanske baze („Veliki Lublin“, Novi Sad, Botoš) i spomen-kuća u Sakaru, a kosturnica u Priboju je uklonjena, jer slika prikazuje crkvu i nije sigurno da je iz NOB-a. Tri bez koordinata su u `data/bez_lokacije.json`. Fotografije po broju iz registra ne vredi tražiti: naši srpski spomenici retko imaju status spomenika kulture.
6. **SANU „Споменици културе у Србији“ — zatvoreno 2026-10-14:** `http://spomenicikulture.mi.sanu.ac.rs/list.php?tip=7` („Споменик из НОБ-а“) ima samo 33 dobra, ista kao državni registar, koja već imamo; vrsta 41 i 35 su takođe male. Prvobitni plan: potrebno je istražiti da li ima znamenita mesta NOB-a sa lokacijom i fotografijom.

7. **spomenicinob.info (BiH):** popis svih spomenika NOB-a u BiH po opštinama, npr. `https://www.spomenicinob.info/spomenicinob/public/sanskimost` sa 61 redom. Kolone su selo, adresa, naziv, vrsta, godina, autor, „još postoji“, datum mapiranja i opis, ali nema koordinata ni fotografija. Sajt je mali i privatan („Copyright © Spomenicinob“), pa se preuzima polako i tek posle dogovora sa korisnikom. Korisno je za autore, godine i stanje naših spomenika u BiH i za `data/bez_lokacije.json`.
8. **Kultura sjećanja (kulturasjecanja.org, Documenta):** stranice spomenika iz svih ratova u Hrvatskoj i BiH, sa podacima o podizanju, natpisu i datumu fotografisanja, ali bez koordinata (polje mape je slika). Hrženjakova knjiga nije dostupna na mreži; Documenta ima srodnu publikaciju „Unwanted heritage“ (2013, PDF).

Iskorišćeni izvori: spomenikdatabase (2026-10-14 jedno učitavanje početne strane u pregledaču, `sdb.mjs`: Wix podaci sadrže spisak svih 235 stranica, a od stranica o mestima nedostajala je samo „kumanovo“, sada povezana sa Spomenikom revoluciji; koordinate su samo u tekstu pojedinačnih stranica, pa ih masovno ne treba tražiti), Flickr (samo poznati spomenici), Wikidata (iscrpljena), registri Slovenije, Srbije i Hrvatske. Bosna, Crna Gora i Makedonija nemaju otvoren registar.

## Spomenici bez lokacije

`data/bez_lokacije.json` (2026-10-14) je radni spisak poznatih spomenika koje još ne možemo da smestimo na mapu (162): 96 redova iz sr spiskova „Списак споменика НОБ у …“ bez našeg spomenika u istom mestu, 13 iz hrvatskog registra, 31 članak kategorije „Споменици НОБ у Србији“ bez koordinata (naziv je ceo naslov, jer je mesto u padežu), 7 članaka sa drugih Wikipedija i 15 sela sa hr popisa antifašističkih spomenika bez OSM obeležja. Polja su naziv, mesto, drzava, author, year, izvor i slika (ime fajla na Wikipediji). Aplikacija ga ne učitava. Kad se spomeniku nađe tačna lokacija (Google link, OSM, fotografija sa GPS-om), prebacuje se u `spomeniks.json` i briše odavde.

## Izvori koji su već obrađeni

- **sr Wikipedija, „Списак споменика НОБ у Војводини“:** obrađen. Nazivi su uzeti po vajaru i godini.
- **sr Wikipedija, kategorija „Споменици НОБ у Србији“ (126 članaka):** uzeto je 19 + 23 + 6 spomenika i veza.
  - Oko 45 članaka nema lokaciju.
  - Fajlovi: `kat_srbija*.json`.
- **sr Wikipedija, kategorija „Споменици и музеји Народноослободилачке борбе“, rekurzivno (16 kategorija, 275 članaka):**
  - 104 su već bila povezana, a 43 su povezana preko članaka na drugim jezicima.
  - Povezano je još 8 i dodato 8 novih.
  - 92 članka nemaju lokaciju.
  - Alati: `kat_rekurzivno.py`, `kat_podaci.py`, `kat_upari.py`, `kat_upisi.py`.
- **sr Wikipedija, „Списак споменика НОБ у Хрватској“ i hr popisi „Dodatak:Popis antifašističkih spomenika u …“:**
  - Obrađeni su popis za celu Hrvatsku i županije Primorsko-goranska, Osječko-baranjska, Splitsko-dalmatinska, Istarska, Dubrovačko-neretvanska i Grad Zagreb.
  - Ostalih 13 županijskih popisa ne postoji (404).
  - Neobrađeno je oko 15 sela bez imenovanog OSM obeležja: Bobota, Trpinja, Blato, Peroj, Ston, Kuna, Županje, Drivenik, Vrbovsko, Martinšćica, Susak, Ilovik, Postira, Sreser i Šidski Banovci.
- **OSM, biste i statue na prostoru Jugoslavije (`biste_osm.json`):** upareno sa herojima; dodata 63 spomenika.
- **OSM, groblja, spomenici bratstvu i jedinstvu i spomen-parkovi (`tri_vrste_osm.json`), i brigade (`brigade_osm.json`):** obrađeno.
- **Slovenački Register nepremične kulturne dediščine (RNPD), 2026-10-14:** otvoreni podaci (CC BY 4.0), jedan CSV sa podatki.gov.si; X i Y su već WGS84. Od 3.859 jedinica „memorialna dediščina“ 2.686 su NOB, a dodato je 1.781 (`rnpd_dodaj.py`). Preskočene su jedinice na manje od 150 m od naših, pojedinačni grobovi, kuće, bunkeri i mesta događaja. „Više“ vodi na stranicu registra (eid.gov.si/S/<ESD>). Autori su u opisu, ali u padežima („delo Toneta Svetine“), pa nisu upisani. Fotografije su na ised.gov.si (PHOTOURL, FOTOAVTOR), ali bi za njih trebalo 1.781 zahtev, pa nisu preuzete.
  - Fotografije (`rnpd_slike.py`): pravu fotografiju ima 697 jedinica (FOTOAVTOR nije prazan), a ostale imaju zamensku `kf_eid.jpg`. Sve 697 su preuzete, po jedna na 3 s, bez odbijanja servera; potpis je „Ime Prezime, CC BY 4.0“.
  - Autori: imena poznatih autora iz naše baze traže se u rečenicama opisa sa „delo/avtor/kipar/arhitekt“, po osnovi reči (prvo i poslednje slovo se odbacuje zbog padeža). Tako je upisano 33 autora; parkovi sa više dela i delimični nalazi su preskočeni ili dopunjeni ručno.
  - Goli brojevi 1941–1945 u filteru hvatali su i spomenike pesnicima i naučnicima umrlim tih godina, kao i „žrtvama komunističkog nasilja“; uklonjeno je 18 takvih, a filter sada traži „druga svetovna vojna“.
- **Srpski registar (data.gov.rs „Непокретна културна добра“, opendata.geosrbija.rs), 2026-10-14:** objavljena su samo dobra od velikog i izuzetnog značaja (oko 500, sa koordinatama). Svi spomenici NOB-a iz njih već su u bazi. Server odbija upit ako je ćirilica kodirana drugačije nego u linku sa portala („Request Rejected“), pa link treba koristiti tačno.
- **Hrvatski Registar kulturnih dobara (data.gov.hr „kulturna-dobra“, CSV), 2026-10-14:** 7.950 dobara sa autorima, ali bez koordinata, a NOB spomenika je tridesetak, jer je većina posle 1990. izgubila zaštitu. Preko OSM-a dodata su kosturnica u Prkosu Lasinjskom (Freudenreich), kosturnica u Lipiku i dečje groblje u Sisku (Lah i Wenzler), a „Zastavi“ na Viktorovcu upisan je Augustinčić. Ostali (Pučišća, Gornje Dubrave, Požega, Lipovljani, Noskovačka Dubrava, Kamanje, Kordun) nemaju lokaciju.
- **Bosna, Crna Gora i Makedonija, 2026-10-14:** nijedna nema otvoren registar sa lokacijama. KONS objavljuje pojedinačne odluke (npr. kosturnica u Lukavcu, „Husinski rudar“ u Tuzli), Crna Gora samo rešenja u Službenom listu, a za Makedoniju postoji katalog „Преглед на спомениците и спомен-обележјата во СР Македонија“ (1986, 260 strana skeniranog PDF-a na spomenikdatabase.org) sa natpisima, ali bez koordinata.
- **Wikidata, spomen-obeležja sa koordinatama po državama, 2026-10-14:** jedan upit za ceo prostor pada (504, 60 s), a upit po državi sa samo `?item ?coord ?tip` prolazi (Q215, Q224, Q225, Q403, Q236, Q221, Q1246). Ukupno 1.654 objekta, od kojih je 977 dalje od 150 m od naših. `wbgetentities` po 50 posle 13 paketa sa pauzom 3 s vraća 429, a sa `maxlag=5` vraća prazno; bez maxlag i sa pauzom 10 s prolazi. Slovenački objekti su uvoz iz registra (već obrađen), a od ostalih su nova bila samo tri: Beška, Borča (Pančevo) i spomen-kuća odreda „Dame Gruev“ u Zlatarima. Za Bor, Obrenovac, Zlatibor i Valjevo (Filipović) koordinate na Wikidati odstupaju 1–4 km od naših, pa nisu dirane.
- **Fotografije za spomenike bez slike, 2026-10-14:**
  - Slovenija: Commons fajlovi nose šablon `{{Cultural Heritage Slovenia|EŠD}}` (oko 10.100 fajlova). Pretraga `hastemplate:"Cultural Heritage Slovenia" insource:/Heritage Slovenia\|(id1|id2|…)\}/` po 150 EŠD-ova radi bez greške; od 1.066 naših bez slike pokrivenost je samo 13. Wikidata P1587 + P18 daje tek dve.
  - Ostale države: 243 kategorije („World War II memorials in …“, „Monuments to the Yugoslav Partisans in …“, do dubine 2) daju 1.586 geotagovanih fajlova. Na manje od 80 m od naših bez slike bilo je 17, a posle pregleda je ostalo 11. Vraćene su fotografije parkova koje prikazuju spomenik sa posebnim unosom (Brezovica, Borik), pejzaž Bubnja i bista Save Žebeljana kod spomenika u Crepaji.
  - Usput je otkriveno 29 slovenačkih unosa koji nisu NOB (Prvi svetski rat, „zamolčane žrtve“, grobnica Burbona); uklonjeni su, a `rnpd_dodaj.py` ih sada preskače.
- **Commons geosearch za spomenike bez slike, 2026-10-15:** `$A/commons_blizu_slike.py` (krug od 100 m, jedan zahtev na 3 s) za Hrvatsku, BiH, Makedoniju, Crnu Goru i Kosovo: 456 spomenika, od toga 70 sa bilo kakvim fajlom u blizini, a posle pregleda 8 novih fotografija (Raotince, Tuzla, Korenita, Jasenovac, biste u Banjaluci, Grožnjan, Starjak, Dubrava). Ostalo su crkve, pejzaži i slike sa panoramio-a. Prinos je oko 2%, pa Srbiju (156) ne vredi raditi ovako. Commons povremeno vraća „cirrussearch-too-busy“, a skripta tada samo preskoči spomenik.
- **Narodni heroji:** 448 je sa Wikidate (P166 = Orden narodnog heroja), a 364 iz sh kategorije, ukupno oko 800 od 1.320. Potpun spisak još nije nađen; sr stranica „Списак народних хероја Југославије“ ne postoji.

## Strategije koje rade

1. **Lokacija bez Google id-a:**
   - Prvo GPS podaci fotografije na Commons-u, preko `prop=coordinates`, `coprimary=all` i imageinfo, u zbirnom POST zahtevu do 50 fajlova.
   - Zatim jedan Overpass upit `nwr(around:2000,lat,lon)[historic~"memorial|monument"]` za sva sela odjednom, a centre sela daje `naselja_osm.json`.
   - Na kraju uparivanje po imenu.
2. **Kategorije fotografija na Commons-u** otkrivaju da je nešto već u bazi, npr. kategorija „Podhum (Jelenje)“ za Platak.
3. **Nazivi naselja i država:** iz `naselja_osm.json`, bez zahteva. Ako je u krugu od 12 km grad (city), naslov je grad.
4. **Wikidata `wbgetentities`** po 50 id-ova odjednom daje P625, P18 i P31. Po P31 = Q5 izbacuju se članci o ljudima.
5. **Kratki Google link:** `proveri.py` iz njega čita ime, koordinate i id (heksadecimalni CID posle `0x…:0x`) i nalazi najbliže spomenike u bazi. Za upis služe `upisi_cid.py <id> <link>`, koji upisuje id i lokaciju, i `dodaj_google.py <alati> <vrsta> <link> <naziv> …`. Tu su i `spisak.py`, koji parsira wiki tabele, i `integritet.py`, koji proverava podatke.
6. **Odnos slike:** posle svakog dodavanja slike pokreće se `slike_odnos.py`, koji svakoj slici upisuje `slikaOdnos` (širina / visina). Prozor spomenika po tom broju unapred pravi okvir slike, da ne skoči kad se slika učita. `integritet.py` javlja sliku bez odnosa.

- **Commons, kategorije „Monuments to the People's Heroes of Yugoslavia“ i „Monuments to the Yugoslav Partisans in Serbia“ (2026-10-14):**
  - 1.098 fajlova, od kojih 204 imaju GPS. Dodato je 69 spomenika, uglavnom bista heroja u Vojvodini i Makedoniji, a 6 postojećih je dobilo fotografiju.
  - Alat `commons_dodaj.py` radi po ručno pregledanom spisku; mesto (title) uzima iz `naselja_osm.json`.
  - Preskočeno: spomen-ploče i opšte fotografije sela bez jasnog spomenika (Akmačići, Roge, Slatina, Bogatić, Novi Kozarci).
  - Fajlovi bez GPS-a (418): kategorije su u `commons_kat_bez_gps.json` u scratchpad-u te sesije. Upareni su po mestu i imenu heroja, pa je 7 spomenika dobilo fotografiju. Fotografija u Jabuci je bista, a ne statua, i vraćena je.

## Ograničenja servera

- **spomenikdatabase.org:** blokira posle oko 70 brzih zahteva. Ne zasipati ga.
- **Overpass:** overpass-api.de i maps.mail.ru povremeno vraćaju 504. Posle greške stati, pa probati kasnije, samo jednom.
- **Commons pretraga (geosearch, cirrussearch):** zna da vrati „too busy“. Zbirni upiti preko `titles` rade.
- **Google mape:** bez pregledača ne daju rezultate pretrage, pa se id dobija samo iz linka koji korisnik pošalje.
- **Duge liste naslova** šalju se POST zahtevom, inače server vraća 414 URI Too Long.

## Autori

- `autori_wiki.py` traži članak o autoru na sh, hr, sr (ćirilicom), sl, mk i en Wikipediji, zbirno po 50 naslova. Članak prihvata samo ako je Wikidata P31 = Q5 i P106 je umetnik, vajar ili arhitekta.
- 2026-10-13 u `data/autori.json` upisano je 46 linkova.
- Bez članka je ostalo 16 autora, npr. Ante Kuduz, Belizar Bahorić, Lenko Pleština, Marijan Burger, Mirko Ostoja i Vuko Bombardelli.

- 2026-10-14, dela naših autora:
  - `autori_dela.py` traži na Wikidati dela sa P170/P84 i koordinatama: od 150 dela sva NOB dela su već bila u bazi.
  - `autori_clanci.py` uzima spiskove dela iz članaka o autorima, zbirno po jeziku.
  - Upisani su autori kod 15 postojećih spomenika i dodato je 8 novih: Zrenjanin (Žarko), Solkan, Pivka, Porezen, Lesce, Bojanja vas, Kozana i Špitalič.
  - Geopedia `_x…_y…` u slovenačkim člancima je D48/GK; `gk.py` je pretvara u WGS84 (Helmert TOWGS84 409.545,72.164,486.872,3.085957,5.469110,-11.020289,17.919665). Provereno na Poljčama: 21 m.
  - Preskočeno kao sporno: Erzelj (Svetinin spomenik je 2 km od našeg), Repče/Trebnje, Domžale 1975, Kovor, Rečica ob Savinji, Topola, Jesenice 1960, Našice, Grobnica herojev u Ljubljani (Mihevc ili Ravnikar), Kragujevac „Otpora i slobode“ i „Crvena zastava“, Bajina Bašta, Opovo, Đurđevo, Božurnja, Podgradci i Križe.
  - Usput nađeno u Zrenjaninu, a nedostaje: Spomenik streljanim rodoljubima (Berbakov, 1986, OSM n12886695370) i Spomenik palim crvenoarmejcima (Solodov, 1947, OSM n13653333363).

- 2026-10-14, spomen-parkovi (istaknuti, 94):
  - Lokacija, naziv i slika su skoro svuda opisivali sam spomenik, pa je 79 stavki prešlo u type „istaknut“.
  - Nove parkovske stavke sa OSM lokacijom dobili su Bubanj, Jasenovac, Brezovica, Čačalica, Čačak i Šumarice; članak o parku prelazi na park.
  - Kao parkovi je ostalo 15 stavki: Dudik, Popina, Garavice, Slobodište, Leskovac, Vraca, Bela Crkva, Dotršćina, Jajinci, Stratište, Stolice, Grahovo, Dola, Danica i Park Vide Jocić. 
  - Od ostala 84 parka 48 su bili spomenici ili spomen-domovi i prešli su u „spomenik“. Dodati su Spomen-park Vukosavci i Spomen-groblje u Donjoj Trnovi, a ostali su ostali parkovi.
  - Razdvojeni su i Borik („Poziv na ustanak“, Bakić) i Jajinci (Stojić). Kraljevo već ima glavni spomenik zasebno.
  - Grahovo je Živkovićevo delo kao celina (272 kubusa sa imenima), pa ostaje park. Dotrščina (Bakić, Ružić, Angeli Radovani, Luketić) i Danica (Pleštinina „Vješala“, Sabolićeva „Izvidnica“) imaju više dela koja se iz OSM-a ne mogu pouzdano smestiti, pa ostaju parkovi (hr članci „Spomen-park Dotrščina“ i „Sabirni logor Danica“).
  - Drugi pregled istog dana, po pravilu „park ima autora samo ako su sva dela u njemu jednog autora“: razdvojeni su Dotrščina (Bakićev „Put mučeništva“ i Ružićev spomenik po OSM-u), Danica („Vješala“ i Sabolićeva „Izvidnica“; tačno mesto „Vješala“ nije poznato, pa stoje kod „Izvidnice“), Bela Crkva (Bogdanovićeva „Simbolika u kamenu“; Bodnarovljeve biste iz 1951. i Stambolićeva grobnica ostaju u parku), Šubićevac (Radovani i arhitekta Kolacio, uz ploče iz 1978) i Crna Ćuprija (Soldatović; Rajčetićev lokvanj nema lokaciju). Sremski front je jedna celina: arhitekta Krstonošić i vajar Soldatović. Brdo mira (Maksimović i kosturnica) i Jadovno (Petrić) su preskočeni, jer nije sigurno šta je na slici i gde je spomenik. Dudik, Popina, Garavice, Slobodište, Leskovac, Knjaževac, Ljutotuk, Grahovo i Ploče su dela jednog autora kao celina, pa zadržavaju autora.
  - Overpass je 2026-10-14 vratio 504 na oba servera, pa je korišćen `spomenici_osm.json` (11.000 OSM spomenika sa celog prostora).

## Imenovanje vrsta (istraženo 2026-10-13, za kasniju odluku)

- U Jugoslaviji su spomenici deljeni po obliku (spomen-područje ili park, spomenik, bista, spomen-ploča, kosturnica ili grobnica, spomen-groblje, spomen-česma, spomen-dom ili muzej) i po značaju (savezni, republički, lokalni). Najviša zaštita bila je „znamenito mesto od izuzetnog značaja“.
- „Lokalni“ je pravni pojam značaja: u Sloveniji postoji „kulturni spomenik lokalnega pomena“ naspram „državnega pomena“ (Uradni list RS 2009/12, npr. spomenik NOB u Poljčanama).
- Zakon o proglašenju Vukovara mjestom posebnog domovinskog pijeteta (Hrvatska), crnogorski Zakon o spomen-obilježjima i nacrt zakona Republike Srpske o grobljima, spomenicima i spomen-obilježjima razlikuju „spomenik“ i „spomen-obilježje“, koje je manji znak sećanja.
- Kandidati za naš tip „lokalni“: „Spomen-obeležje“ (pravni i uobičajeni naziv za manji znak), „Spomenik od lokalnog značaja“ ili „Manji spomenik“. Odluka 2026-10-13: tip „lokalni“ se prikazuje kao „Spomen-obeležje“ (množina „Spomen-obeležja“, engleski „Memorial marker“), a ključ u podacima je ostao „lokalni“. Autorska dela se vode kao „spomenik“, a spomen-obeležje je jednostavan obelisk, stela ili kamen sa imenima palih.
- 2026-10-13 pregledane su sve fotografije tipova spomenik i lokalni (listovi po 30 preko `magick montage`), a za one bez slike OSM oznaka `memorial` (statue, bust, plaque, obelisk). Prebačeno je 79 u spomenik (figure, reljefi, apstraktne skulpture), 10 u bistu, 5 u ploču i 3 brigadna znamenja u lokalni. Neodlučeno je ostalo oko 12 brigadnih spomenika bez slike (Tjentište, Popov Most i dr.). Natpisi „TITO“ na brdima ostaju spomenici: korisnik kaže da su poređano kamenje, dakle skulpture u prostoru.
- Ranije: „Istaknuti spomenik“ (istaknut=true), „Spomenik“ (type spomenik) i „Lokalni spomenik“ (type lokalni: 844 spomenika, oko 720 u selima, 81 u varošicama i 43 u gradovima).

## Šta je ostalo

- `kamenica-spomenik-zdravku-jovanovicu` je u centru sela Kamenica (Valjevo), a stoji ispred seoske škole. Škole nema ni na OSM-u (Nominatim), ni na Google mapama (pretraga „школа“ oko sela u headless Chrome-u, `scratchpad/gmaps.mjs`). Korisnik neće tražiti link, pa lokacija ostaje približna.

- 25 spomenika bez izvornog naziva, uglavnom makedonski lokalni spomenici i manji spomenici.
- 58 spomenika herojima bez fotografije.
- Oko 520 heroja nije pokriveno.
- Kod oko 7 sitnih stavki spomenik je kod nas povezan sa člankom na drugom jeziku; korisnik je rekao da se to ne dira.
