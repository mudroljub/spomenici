# Plan: podaci iz knjiga o spomenicima

Ažurirano 2026-10-16. Plan je pisan tako da po njemu može da radi i drugi agent: šta su izvori, šta iz njih uzimamo, kojim redom, kako i kako se proverava. Pravila zapisa su u [standardu](../.claude/skills/spomenici-zetva/references/standard.md), a postupak provere u skilu `spomenici-provera`.

## 1. Izvori

| # | Knjiga | Obim | Oblik na znaci.org | Kvalitet teksta | Pokriva |
|---|---|---|---|---|---|
| A | [„Inventarizacija i kategorizacija spomenika i spomen-obilježja radničkog pokreta i narodne revolucije u Zagrebu“](https://znaci.org/00003/679.pdf), Regionalni zavod za zaštitu spomenika kulture, Zagreb 1981 | 537 str. | PDF sa OCR slojem | loš (ABBYY 11, mnogo iskrivljenih reči) | Zagreb: svaka ploča i spomenik sa tačnom adresom, materijalom, dimenzijama, natpisom i godinom |
| B | [Gojko Jokić, „Jugoslavija — spomenici revolucije, turistički vodič“](https://znaci.org/00003/920.pdf), Turistička štampa, Beograd 1986 | 454 str. | PDF sa OCR slojem | dobar | cela Jugoslavija: veći spomenici i spomen-područja, autori, godine, kako se stiže |
| C | [„Rušenje antifašističkih spomenika u Hrvatskoj 1990–2000“](https://znaci.org/00003/736.php), Savez antifašističkih boraca Hrvatske (ur. J. Hrženjak), 2. izdanje | 436 str. | samo slike strana (`/images/736/736 - NNNN.jpg`) | oštar sken, čita se direktno | Hrvatska po županijama: spomenici, šta im se desilo 1990–2000, autori, godine; indeks po naseljima (str. 351–391) |
| D | [Antun Kozina, „Uspomene NOB uklesane u kamenu“](https://znaci.org/00003/667.pdf), Krapina 1966 | 50 str. | PDF sa OCR slojem | srednji | krapinsko-pregradski kraj: spomenici sa natpisima i položajem |
| E | [N. Bego, D. Berović, D. Brusić, T. Erak, „Spomenici revolucije — zbornik spomenika revolucije 1941–1945“](https://znaci.org/00003/7xx.php?bk=905), SUBNOR Šibenik 1980 ([PDF](https://znaci.org/00003/905.pdf)) | 471 str. | PDF sa OCR slojem; sadržaj po naseljima levo na stranici | dobar | šibenska opština: spomenici i ploče po naseljima (Šibenik, Banjevci, … Žirje), sa istorijatom |

## 2. Šta uzimamo

Činjenice, a uz navođenje izvora i tekst i fotografije (odluka korisnika 2026-10-16). Navođenje izvora nije dozvola nosioca prava, a aplikacija je javna, pa uz oprez:

- **Fotografija** samo za spomenik koji nema drugu sliku (Commons, Google mesto), isečena sa strane, 400 px, webp, sa potpisom `slikaPotpis`: „Knjiga, strana N“, npr. „Rušenje antifašističkih spomenika u Hrvatskoj 1990–2000, str. 7“.
- **Tekst**: natpis sa spomenika i kratki citati; ne prepisuju se celi opisi.

- **Novi spomenici**, kojih nema u bazi ni u `data/bez_lokacije.json`: u radni spisak, sa `izvor` = URL knjige i stranom.
- **Dopune postojećih**: prazni `autor` i `godina`; `naziv` kad knjiga daje natpis ili zvaničan naziv (natpis je autoritet, vidi skil `spomenici-nazivi`).
- **Položaj**: tačna adresa (A, delimično B i D) za lociranje preko OSM kućnih brojeva, kao kod spomenicinob.info.
- **Stanje**: aplikacija je za putnike, pa srušeni i uklonjeni spomenici nisu prioritet (odluka 2026-10-16). Stanje iz C (1990–2000) ne upisuje se u bazu; iz C se uzimaju spomenici koji i dalje stoje (oštećeni ili kasnije obnovljeni), a srušeni se preskaču.
- **Ploče**: spomen-ploče (i zgrade obeležene samo pločom) se preskaču (odluka 2026-10-16); izuzetak su veoma bitne. Kriterij za A: predlog Zavoda za I ili II kategoriju zaštite (rubrika VALORIZACIJA). Sirovi zapisi u `data/knjige/` ostaju potpuni.
- **Natpis** (polje `natpis`, opciono, odluka 2026-10-16): doslovno, novi red samo gde ima smisla (potpis, datum, ime i godine, stih), prazan red između ploča; redovi ploče, sa „ / “, ostaju samo u sirovim zapisima u `data/knjige/`; u bazu samo ceo pročitan (bez `[?]`). Prikazuje se u prozoru spomenika, sklopljen.
- **Druga nova polja** samo ako se podatak javlja u više knjiga i koristi aplikaciji ili lociranju.

## 3. Postupak, za svaku knjigu

1. **Preuzimanje.** PDF jednom; za C strane redom sa pauzom od 3 s (436 zahteva, oko 25 minuta; upisati u `docs/BELESKE.md`). Ulazi stoje van repozitorijuma, u fascikli jednokratnih alata.
2. **Izvlačenje u zapise.** Za svaku stranu nastaje niz zapisa `{strana, mesto, adresa, naziv, natpis, vrsta, autor, godina, stanje, godinaStanja, napomena}` na jeziku knjige. Kod A i D OCR je loš, pa pomoćnici čitaju slike strana (`pdftoppm -r 150`), a ne tekst; kod B tekst je dovoljan. Posao se deli na delove po 30–50 strana, sa zajedničkim pravilima u fajlu, kao kod prevoda naziva. Sirovi rezultat čuva se u `data/knjige/<oznaka>.json`; aplikacija ga ne učitava, ali je trajan i pregledan u gitu.
3. **Provera izvlačenja.** Na uzorku od 20 zapisa uporediti sa stranom; ako je više od 2 greške, ispraviti pravila i ponoviti deo.
4. **Uparivanje.** Isto mesto (naselje ili deo grada) i saglasna vrsta, pa ime osobe, jedinice ili godina; tačka do 150 m kad postoji. Jednoznačan par: dopuna praznih polja. Više mogućih parova: ništa, samo zapis u izveštaj.
5. **Upis.** Dopune u `data/spomeniks.json`, novi u `data/bez_lokacije.json`; obe vrste sa izvorom knjige. Lociranje novih ide postojećim putem (OSM obeležja, kućni brojevi, Google mesto od korisnika).
6. **Provera i beleška.** Skil `spomenici-provera`; kratak unos u `docs/BELESKE.md`: koliko zapisa, dopuna i novih, šta je preskočeno i zašto.

## 4. Redosled

Po odnosu koristi i truda:

1. **A — Zagreb (1981).** Urađeno 2026-10-16 (`data/knjige/zagreb-1981.json`, beleška u `docs/BELESKE.md`). Najviše gotovih adresa, pa i najviše spomenika koji se mogu odmah locirati; baza za Zagreb ima samo 35 spomenika (4 ploče, 22 bez autora), pa je većina knjige novo.
2. **D — Krapina (1966).** Obrađeno 2026-10-16: svih 50 strana, 35 sirovih zapisa u `data/knjige/krapina-1966.json`, godina dopunjena za Marince, 11 novih obeležja u `data/bez_lokacije.json`. Položaji novih nisu potvrđeni; sporna čitanja i izuzeci opisani su u `docs/BELESKE.md`.
3. **B — Jokić (1986).** Obrađeno 2026-10-16: svih 454 PDF strana, 615 sirovih zapisa/pomena u `data/knjige/jokic-1986.json`; dopunjeno 25 postojećih zapisa (22 autora, 4 godine), dodata 103 obeležja bez potvrđene tačke. Ponavljanja i 84 sporna identiteta označeni su u sirovim zapisima; postupak i provere u `docs/BELESKE.md`.
4. **E — Šibenik (1980).** Obrađeno 2026-10-16: svih 471 PDF strana, 199 sirovih zapisa u `data/knjige/sibenik-1980.json`; dopunjeno 7 postojećih zapisa (3 autora, 6 godina), dodato 80 obeležja bez potvrđene tačke. Devet nejasnih identiteta ostavljeno je za proveru; postupak, izuzeci i provere u `docs/BELESKE.md`.
5. **C — Hrženjak (2002).** Obrađeno 2026-10-16: svih 436 dostupnih skenova, 2.723 sirova zapisa/pomena u `data/knjige/hrzenjak-2002.json` (2.119 redova indeksa, od kojih je 519 spojeno sa opisima); dopunjeno 9 postojećih zapisa (8 autora, jedna godina), dodat jedan spomenik sa Lastova bez potvrđene tačke. Štampana strana 346 nedostaje u mrežnom izvoru; razlika između broja redova i uvodnog zbira 2.120, nejasni prepisi, istorijska stanja i sporni identiteti dokumentovani su u `docs/BELESKE.md` i sirovim zapisima.

## 5. Otvorene odluke (korisnik)

Nema; odluke su upisane uz pravila (tekst i fotografije sa izvorom, polje `natpis`, stanje iz C).

## 6. Završeno 2026-10-16

Svih pet knjiga je izvučeno u `data/knjige/`, upareni zapisi su upisani ili navedeni kao sporni u beleškama, `integritet.py`, `tsc` i `node --test alati/test.mjs` prolaze, a stavka je skinuta iz `## TODO` u `README.md`.

Obrada dostupnog materijala je završena uz navedena ograničenja izvora; ovo ne znači da je svaki pomen zaseban spomenik ili da je potvrđeno današnje stanje svih obeležja. Lociranje radnog spiska i razrešavanje spornih identiteta ostaju zaseban posao.

## 7. Provera opstanka hrvatskih spomenika — prioritet pre novih unosa

Plan dodat 2026-10-16 na zahtev korisnika. Problem: starije knjige i preneti opisi potvrđuju izgled i nekadašnje postojanje; novija Hrženjakova knjiga dokumentuje oštećenja, rušenje, uklanjanje i premeštanje tokom 1990–2000. U trenutku pisanja plana poslednjih 49 hrvatskih unosa nije bilo sistematski provereno prema toj knjizi; [provera je sada završena](BELESKE.md#provera-49-hrvatskih-unosa-2026-10-16): 19 zadržano uz datiran kasniji prikaz, 17 vraćeno na proveru i 13 ploča povučeno iz izbora. Za ostale je započeta [trijaža 792 unosa i pregled 60 slučajeva](BELESKE.md#nastavak-provere-hrvatske-dokazi-odvojeni-od-izvora-podataka-2026-10-16); provera cele Hrvatske nije završena. Ranije uspešne tehničke provere ne potvrđuju opstanak spomenika.

**Red rada:** prvo ovaj odeljak, zatim nastavak lociranja. Jedina lista otvorenih zadataka ostaje `README.md`, odeljak TODO. Sledećih šest koraka opisuje izvršenje tog prvog zadatka; ovaj plan sam po sebi nije izvršena provera niti nalaz o današnjem stanju 49 objekata.

**Izmena obuhvata po nalogu korisnika (2026-10-16):** šira provera je obustavljena. Naknadno je odobren i završen samo [prenos stanja za 70 već povezanih spomenika](BELESKE.md#ograničen-prenos-stanja-za-70-povezanih-spomenika-2026-10-16), bez novih potraga, uz preskakanje nejasnih veza i očuvanje poznatih obnova. Preneta oznaka fizičkog oštećenja ima zaseban izvor i vidljivu godinu izdanja 2002; ne predstavlja noviju terensku potvrdu. Koraci šire provere ispod ostaju dokumentovani, ali se ne izvršavaju samostalno.

**Naknadno odobreni pilot (2026-10-16):** korisnik je odobrio proveru20 preostalih rizičnih unosa, zatim procenu koristi. [Pilot je završen](BELESKE.md#ograničena-provera-20-hrvatskih-unosa-2026-10-16); to ne predstavlja odobrenje za nastavak cele trijaže niti potvrdu opstanka svih20 na terenu. O daljem radu odlučuje korisnik.

### Pravilo izvora i vremena

Prvobitni izvor podataka u glavnom zapisu sačuvati. Kasnije dokaze opstanka beležiti odvojeno u evidenciji provere (`kasnijiIzvori`, datum i ograničenja), bez zamene izvornog linka samo zato što je nađen noviji dokaz.

Za svaki objekat odvojiti četiri stvari: godinu podizanja, datum opisanog događaja/stanja, datum nastanka fotografije ili obilaska i godinu objavljivanja izvora. Unos na Partizanstvo iz 2025/2026. koji prenosi vodič iz 1978. nije noviji dokaz opstanka od Hrženjaka iz 2002. Nedatirana fotografija i aktivan marker na karti ne potvrđuju današnje postojanje. Isto važi za OSM objekat koji može ostati na karti posle uklanjanja.

Hrženjakov potvrđeni nalaz o rušenju ili uklanjanju ima prednost nad opisom nastalim pre tog događaja. Kasniji konkretan dokaz obnove, novog spomenika ili premeštanja može promeniti zaključak, ali mora se utvrditi šta je obnovljeno, kada i gde. Knjiga iz 2002. sama po sebi ne potvrđuje da obeležje nikada kasnije nije obnovljeno. Izostanak iz njenog indeksa ne znači da je spomenik očuvan: knjiga nije potpun popis današnjih objekata, a i sačuvani prepis ima poznate nejasnoće i nedostajuću štampanu stranu 346.

### Korak 1 — Upariti svih 49 sa knjigom i proveriti čitanje

- Koristiti lokalni `data/knjige/hrzenjak-2002.json` (2.723 zapisa/pomena). Indeks i opis istog objekta računati kao jedan dokaz, ne kao dva različita spomenika.
- Jednim lokalnim prolazom izdvojiti moguće parove po županiji, naselju i njegovim starim/alternativnim imenima; zatim suziti po vrsti, posveti, imenima, autoru, godini, natpisu, adresi i fotografiji. Isti naziv sela ili opšti naziv „palim borcima“ nije dovoljan.
- Čitati i samostalne redove indeksa i ugnježdeno polje `indeks` uz opis, kao i `napomena`, `pohranjen`, `obnovljen`, `nejasnoce` i postojeća povezivanja. Prepoznati raniji i zamenski spomenik, samostalnu bistu, grob i ploču na istom mestu.
- Legendu oznaka pročitati u knjizi. Odlučujući pogodak o stanju proveriti na originalnom skenu, sa tačnom štampanom stranom i brojem skena; ne odlučivati po skraćenom ili nejasnom OCR redu. Najpre koristiti već preuzete skenove, bez ponovnog preuzimanja cele knjige.
- U trajnom izveštaju u `docs/BELESKE.md` otvoriti po jedan red za svaki od 49 ID-jeva: ID, oznake zapisa iz knjige, štampana strana/sken, potvrđen ili sporan identitet, istorijsko stanje, datum tog stanja, kasniji dokaz i njegova stvarna datacija, potvrđena današnja lokacija, odluka i razlog. Bez pogotka napisati „nije pronađen odgovarajući zapis“, a ne „očuvan“.

### Korak 2 — Razvrstati rizik i napraviti hronologiju

Najpre rešavati potvrđene nalaze „srušen“, „uklonjen/otuđen“, „pohranjen“ i „premješten“; zatim oštećene i zamenjene objekte; potom stavke bez pouzdanog para i bez dokaza opstanka. Za svaki složiti najkraću proverljivu hronologiju: podizanje → nalaz knjige → eventualna kasnija obnova/premeštanje → poslednje potvrđeno stanje.

Ako se u istom selu jedan spomenik srušio, taj nalaz ne prenositi na drugi. Ako je naknadno napravljena replika ili novo delo, razlikovati ga od izvornog: stara godina, autor, fotografija i koordinata ne pripadaju automatski zameni. Oštećeno obeležje može i dalje biti vidljivo i dostupno putniku; oštećenje nije isto što i uklanjanje.

### Korak 3 — Ciljano pribaviti kasniji dokaz tamo gde je potreban

- Prvo iskoristiti već sačuvane opise i fotografije uz proveru njihovog izvornog porekla i datuma. Prednost imaju datiran neposredan obilazak, fotografija konkretnog objekta sa potvrđenim mestom, zvaničan izveštaj o obnovi ili komemoraciji na tom obeležju i lokalni konzervatorski/muzejski izvor koji opisuje konkretno stanje.
- Za sporni ili negativni nalaz knjige tražiti dokaz nastao posle opisanog oštećenja/uklanjanja. Posebno tražiti obnovu ili preseljenje nakon 2002, umesto ponavljanja opšte pretrage naziva spomenika.
- Prepoznatljiv izgled, natpis i okruženje moraju potvrditi identitet. Za preseljeni objekat potvrditi novu tačku; centar sela, škola, groblje ili stara tačka nisu zamena za koordinate samog obeležja.
- Fotografija sa poznatim datumom posle 2002. potvrđuje stanje tada, ne automatski 2026. Zabeležiti poslednji dokaz; za stariju fotografiju proveriti postoje li kasnije vesti o uklanjanju ili novijoj obnovi. Noviju tvrdnju o rušenju proveriti i kada postoji starija fotografija očuvanog spomenika.
- Ako dokaza nema ili su protivrečni, ostaviti zaključak neizvestan. Ne popravljati taj nedostatak još preciznijim koordinatama.

### Korak 4 — Ispraviti paket prema dokazima

| Utvrđeni ishod | Postupak pri izvršenju plana |
|---|---|
| Potvrđeno očuvano ili obnovljeno obeležje na tačnoj tački | Zadržati na mapi; sačuvati proverljiv noviji izvor i dataciju dokaza u izveštaju. |
| Oštećeno, ali postoji i dostupno je za posetu | Zadržati; `stanje: ostecen` samo uz dokaz za relevantno potvrđeno stanje, ne prepisivanjem istorijske oznake. |
| Potvrđeno premešteno | Koristiti potvrđenu današnju tačku i odgovarajući izvor; istorijsku tačku sačuvati u izveštaju, ne praviti drugi marker za isto obeležje. |
| Srušeno, uklonjeno ili u depou, bez kasnijeg dokaza povratka | Povući novi unos iz javne mape prema postojećem pravilu da se uklonjeni ne traže; sačuvati ID, izvor i razlog u izveštaju, a sirovi zapis knjige ostaviti potpun. Ne upisivati staro stanje kao provereno današnje. |
| Nema dovoljno dokaza za opstanak, identitet ili današnju tačku | Povući nepotvrđeni novi unos u radni spisak za proveru; ne označavati ga srušenim i ne proglašavati potvrđenim zato što ga nema u knjizi. |
| Drugi objekat ili potvrđen duplikat | Razdvojiti identitete ili povezati sa postojećim zapisom, uz očuvanje porekla podataka i veza knjiga. |

Pri povlačenju ili spajanju proveriti veze u svim `data/knjige/*.json`: ne ostaviti cilj ka nepostojećem ID-ju. Ako se menja `data/bez_lokacije.json`, pomeriti njegove numeričke indekse uz očuvanje ciljnog objekta. Slike i njihove putanje uklanjati samo ako više nisu potrebne drugim zapisima; ne dirati nepovezane korisničke izmene.

Primeniti i postojeći izbor iz odeljka 2: obične spomen-ploče se preskaču osim veoma bitnih. Paket sadrži **13 zapisa vrste `ploca`**; za svaki posebno proveriti osnov za izuzetak. Sam dokaz da ploča postoji ne rešava pitanje da li pripada izboru aplikacije. Nalaz o opstanku i odluka o uključivanju moraju ostati odvojeni.

### Korak 5 — Proširiti proveru na druge rizične hrvatske unose

Posle svih 49 pregledati ostale hrvatske zapise dodate na osnovu starih knjiga ili izvora bez datacije stanja. Najpre slučajeve koji već imaju negativno ili sporno povezivanje sa Hrženjakom, zatim ostale iz istih knjiga i krajeva. Ne tvrditi da je cela Hrvatska proverena samo zato što je završen paket od 49. Isto pravilo važi za buduće hrvatske kandidate: stariji izvor služi identifikaciji, a opstanak zahteva proveru hronologije i kasnijih promena.

### Korak 6 — Proveriti rezultat i ugraditi obaveznu proveru u nastavak

Za svih 49 mora postojati pojedinačna odluka i izvor ili izričito navedena neizvesnost. Brojevi zadržanih, premeštenih, povučenih, duplikata i ploča van izbora moraju zajedno obuhvatiti ceo paket, bez dvostrukog brojanja istog ID-ja. Proveriti da su svi raniji zapisi van potvrđenih izmena sačuvani.

Posle izmena pokrenuti `integritet.py`, proveru tipova i postojeće testove aplikacije; proveriti detalje izmenjenih i uklonjenih markera i očuvanje veza knjiga. Alate za slike pokrenuti samo ako se slike menjaju. Sačuvati izvore, datume i obrazloženja u `docs/BELESKE.md`, a ovaj prvi TODO ukloniti tek po završenoj proveri i dogovorenom proširenju na druge rizične hrvatske unose. Naredne ture ne najavljivati kao pouzdane na osnovu tehničkih testova ili same činjenice da su koordinate pronađene.

### Početni obuhvat — 49 proverenih ID-jeva

Spisak je utvrđen iz prethodne hrvatske ture i upoređen sa trenutnom bazom; spisak ispod čuva prvobitni obuhvat, dok su pojedinačni nalazi i odluke u [izveštaju provere](BELESKE.md#provera-49-hrvatskih-unosa-2026-10-16). Prvobitni izvor ostaje polazna tačka za poređenje sa novijim podacima o stanju.

| ID | Mesto | Vrsta | Polazni izvor |
|---|---|---|---|
| `jakovlje-spomenik-palim-borcima-i-zrtvama` | Jakovlje | spomenik | [Partizanstvo 10](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/10/) |
| `oborovo-bistransko-spomen-ploca-palim-borcima-i` | Oborovo Bistransko | ploca | [Partizanstvo 23](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/23/) |
| `luka-spomenik-palim-borcima-i-zrtvama-fasistickog` | Luka | lokalni | [Partizanstvo 134](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/134/) |
| `zejinci-spomenik-borbi-kalnickog-partizanskog` | Žejinci | spomenik | [Partizanstvo 180](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/180/) |
| `brod-na-kupi-spomenik-palim-borcima` | Brod na Kupi | statua | [Partizanstvo 220](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/220/) |
| `ljubosina-spomenik-ustanka-i-nor-a` | Ljubošina | statua | [Partizanstvo 245](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/245/) |
| `skrad-spomenik-palim-borcima-i-zrtvama-fasizma` | Skrad | statua | [Partizanstvo 247](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/247/) |
| `gerovo-spomenik-palim-borcima` | Gerovo | lokalni | [Partizanstvo 42](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/42/) |
| `zagreb-horvati-spomenik-palim-borcima-i-zrtvama` | Zagreb (Horvati) | statua | [Partizanstvo 7](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/7/) |
| `cabar-spomenik-nor-u` | Čabar | lokalni | [Partizanstvo 133](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/133/) |
| `kukuljanovo-spomenik-palim-borcima-i-zrtvama` | Kukuljanovo | lokalni | [Partizanstvo 208](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/208/) |
| `kostrena-spomenik-ubijenim-ucesnicima-nob-a` | Kostrena | lokalni | [Partizanstvo 210](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/210/) |
| `krasica-spomenik-palim-borcima-i-zrtvama-fasizma` | Krasica | lokalni | [Partizanstvo 264](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/264/) |
| `poropati-spomenik-palim-borcima` | Poropati | lokalni | [Partizanstvo 266](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/266/) |
| `nova-vas-brtonigla-spomenik-palim-borcima-i` | Nova Vas (Brtonigla) | lokalni | [Partizanstvo 292](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/292/) |
| `babici-umag-spomen-ploca-palim-borcima-i-zrtvama` | Babići (Umag) | ploca | [Partizanstvo 296](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/296/) |
| `kuzelj-spomen-ploca-stabu-ii-korpusa-novj` | Kuželj | ploca | [Partizanstvo 297](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/297/) |
| `igrisce-spomen-ploca-kotarskom-komitetu-kph-donja` | Igrišće | ploca | [Partizanstvo 12](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/12/) |
| `kraljev-vrh-grob-ivana-krkaca` | Kraljev Vrh | groblje | [Partizanstvo 14](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/14/) |
| `cavle-spomenik-palim-borcima` | Čavle | lokalni | [Partizanstvo 214](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/214/) |
| `crni-lug-spomenik-zrtvama-fasizma` | Crni Lug | lokalni | [Partizanstvo 216](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/216/) |
| `poljanica-bistranska-grob-ivice-catele` | Poljanica Bistranska | groblje | [Partizanstvo 24](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/24/) |
| `plesce-spomenik-palim-borcima-i-zrtvama-fasizma` | Plešce | lokalni | [Partizanstvo 41](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/41/) |
| `prodol-spomen-ploca-formiranju-partizanske-cete` | Prodol | ploca | [Partizanstvo 5](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/5/) |
| `prezid-spomen-ploca-formiranju-prve-organizacije` | Prezid | ploca | [Partizanstvo 50](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/50/) |
| `gerovo-mladje-spomenik-diverzantskoj-akciji-1941` | Gerovo (Mladje) | lokalni | [Partizanstvo 48](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/48/) |
| `kozji-vrh-spomen-ploca-napadu-na-talijanske` | Kozji Vrh | ploca | [Partizanstvo 51](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/51/) |
| `tajcari-spomenik-prvom-zboru-za-odlazak-u` | Tajčari | lokalni | [Partizanstvo 58](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/58/) |
| `prezid-zbitke-spomenik-danijelu-ozboltu` | Prezid (Zbitke) | lokalni | [Partizanstvo 59](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/59/) |
| `prezid-zbitke-spomenik-jakovu-kovacu` | Prezid (Zbitke) | lokalni | [Partizanstvo 62](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/62/) |
| `prezid-zbitke-spomenik-strijeljanim-partizanima` | Prezid (Zbitke) | lokalni | [Partizanstvo 63](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/63/) |
| `kavaliri-spomenik-strijeljanim-zrtvama-fasizma` | Kavaliri | lokalni | [Partizanstvo 65](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/65/) |
| `farjev-laz-spomen-ploca-formiranju-partizanskog` | Farjev laz | ploca | [Partizanstvo 66](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/66/) |
| `muhovci-spomenik-strijeljanim-partizanima` | Muhovci | lokalni | [Partizanstvo 67](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/67/) |
| `hrib-konjci-spomen-ploca-strijeljanim-rodoljubima` | Hrib (Konjci) | ploca | [Partizanstvo 68](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/68/) |
| `korosci-gorniki-spomen-ploca-zrtvama-fasizma` | Korošci (Gorniki) | ploca | [Partizanstvo 69](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/69/) |
| `brinjevi-dolci-spomen-ploca-obitelji-lautar` | Brinjevi dolci | ploca | [Partizanstvo 70](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/70/) |
| `hrib-spomenik-strijeljanim-aktivistima-nop-a` | Hrib | lokalni | [Partizanstvo 71](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/71/) |
| `gerovski-kraj-spomenik-ubijenim-prvoborcima` | Gerovski Kraj | lokalni | [Partizanstvo 78](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/78/) |
| `gerovo-spomenik-strijeljanim-borcima-nor-a` | Gerovo | lokalni | [Partizanstvo 103](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/103/) |
| `prezid-spomen-ploca-palim-borcima-i-zrtvama` | Prezid | ploca | [Partizanstvo 108](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/108/) |
| `sokoli-spomenik-formiranju-prve-istarske` | Sokoli | lokalni | [Partizanstvo 109](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/109/) |
| `parg-spomenik-ubijenim-partizanima` | Parg | lokalni | [Partizanstvo 120](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/120/) |
| `cabar-spomen-grobnica-zrtava-fasizma` | Čabar | groblje | [Partizanstvo 132](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/132/) |
| `ribnik-spomen-ploca-petru-maticicu-i-ankici` | Ribnik | ploca | [Partizanstvo 158](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/158/) |
| `kostanjica-spomenik-palim-borcima` | Kostanjica | lokalni | [Partizanstvo 170](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/170/) |
| `celovci-spomenik-vinku-ozboltu` | Celovci | lokalni | [Partizanstvo 79](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/79/) |
| `gerovski-kraj-jurjev-laz-spomenik-partizanskom` | Gerovski Kraj (Jurjev laz) | lokalni | [Partizanstvo 80](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/80/) |
| `jazbine-spomenik-partizanskom-stozeru` | Jazbine | lokalni | [Partizanstvo 99](https://partizanstvo.si/sl/podrobno/hrvaskipartizanskispomenik/99/) |
