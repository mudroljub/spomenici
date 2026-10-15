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

`data/bez_lokacije.json` (2026-10-14) je radni spisak poznatih spomenika koje još ne možemo da smestimo na mapu (162): 96 redova iz sr spiskova „Списак споменика НОБ у …“ bez našeg spomenika u istom mestu, 13 iz hrvatskog registra, 31 članak kategorije „Споменици НОБ у Србији“ bez koordinata (naziv je ceo naslov, jer je mesto u padežu), 7 članaka sa drugih Wikipedija i 15 sela sa hr popisa antifašističkih spomenika bez OSM obeležja. Polja su naziv, mesto, drzava, author, year, izvor, slika (ime fajla na Wikipediji) i kandidati (moguće lokacije koje još nisu potvrđene: `lat`, `lng`, `izvor`, `opis`). Fajl je radni sto: spomenik se tu sklapa iz više izvora (lokacija iz jednog, slika iz drugog, naziv i autor iz trećeg), dok ne bude dovoljno pouzdan za mapu. Aplikacija ga ne učitava. Kad se spomeniku nađe tačna lokacija (Google link, OSM, fotografija sa GPS-om), prebacuje se u `spomeniks.json` i briše odavde.

2026-10-15, prvi prolaz kroz 174 stavke: GPS fotografija sa Commons-a (77 fajlova, 15 sa koordinatama), koordinate članaka i Wikidate (tri) i GPS slika iz članaka. Od 20 pogođenih, 17 smo već imali na mapi pod drugim nazivom (npr. Smetovi, „Sila, slava i pobeda“, Deli Jovan, Pleso), pa su samo obrisani sa spiska; dodati su spomen-ploče u Kusatku, kosturnica u Rošcima i spomen-obeležje Peri Nakovu i Panču Peševu u Skoplju (natpis kaže da su tu bili sastanci NOP-a). Preskočeno: Krvavec (koordinate fotografije su kod Banjšica, a kategorija je Ambrož pod Krvavcem) i „Spomenik otpora i slobode“ (stoji u parku Šumarice, sporno od ranije). Ostalo je 154 stavke bez ikakvog izvora lokacije.

2026-10-15, drugi prolaz: svakoj stavci je dodeljena tačka naselja (`naselja_osm.json`, a za dvosmislena imena Nominatim sa kodom države, oko 60 zahteva), pa je oko svake tačke urađen Commons geosearch (selo 2 km, grad 3 km, oko 100 zahteva) i jedan Overpass upit za `historic=memorial|monument` u krugu od 1,5 km. Dodato je 5: kuriri Dolomitskog odreda na Toškom Čelu (Keržič i Šlajmer, 1961), Veštrski mlin, spomenik u Velikoj Moštanici, spomenik Lazaru Koliševskom u Svetom Nikolu i „Spomen partizanima Razmine“ (spisak ga ne pominje, a stavka „Solila“ je ostala). Pet stavki smo već imali (Železna Reka, Bistriški jarek, Javorski pil, Lipa, Trnovo), a „Mala partizanka“ je lokomotiva, pa je obrisana. OSM obeležja bez imena i fotografije (Bobota, Blato, Martinšćica, Peroj, Susak, Majstori, Moravac, Stranice, Trnovska vas, Uršlja gora, Molat) nisu dodata: ne zna se da li su iz NOB-a, a seoski `war_memorial` u Srbiji često je iz Prvog svetskog rata. Ploča sa natpisom 1941–1945 kod Koprivne (OSM n4396047939) nije dodata jer nema naziv. Ostalo je 144 stavke; neimenovana OSM obeležja i ploča upisani su kao `kandidati` uz svoje stavke.

2026-10-15, treći prolaz, bez novih lokacija: Commons kategorije sa koordinatama oko sela (geosearch, imenski prostor 14) i Commons pretraga po nazivu i mestu, latinicom i ćirilicom (oko 250 zahteva). Pogoci su bili crkve, spomenici ratovima 1912–1918, spomenici iz projekta „Skoplje 2014“ ili istoimena mesta drugde (npr. Brod kod Novaca umesto Makedonskog Broda). Korisnik je odbio preuzimanje spomenicinob.info.

### Ciljani pregled Kosova i BiH (2026-10-15)

- Dodata su dva spomenika: uklonjeni Spomenik palim borcima na današnjem trgu Škelzena Haradinaja u Peći (`pec-spomenik-palim-borcima`, 42.6593889, 20.2896944) i zasebna skulptura posvećena Franji Kluzu i Rudiju Čajavecu ispred lovačkog doma u Uremovcu (`medjuvodje-uremovac-spomenik-kluzu-i-cajavecu`, 45.1111111, 16.7618056). Izvori sa izričitim koordinatama pročitani su pojedinačno u pregledaču: [Peć](https://www.spomenikdatabase.org/peje-pec) i [Gornji Jelovac, odeljak o Međuvođu i Uremovcu](https://www.spomenikdatabase.org/gornji-jelovac). Najbliži postojeći unosi udaljeni su oko 500 m, odnosno 4,35 km. Nove stavke nemaju fotografiju; slike sa sajta nisu preuzimane.
- Karagač nije zasebno naselje sa drugim spomenikom: izvor izričito smešta Spomenik revoluciji u gradski park na brdu Karagač u Peći. Stavka iz `bez_lokacije.json` je uklonjena kao duplikat `peje-pec`; postojećem spomeniku dopunjen je arhitekta Dragoljub Momčilović uz vajara Antu Gržetića. Godina 1972. ostala je prema stranici o Peći, iako stariji spisak navodi 1974. Posle ovog pregleda baza ima 4.412 spomenika, a radni spisak 143 stavke.
- Obelisk pilotima u Međuvođu i skulptura u Uremovcu su različiti spomenici. [Istorijski muzej BiH i partneri, Wer ist Walter](https://weristwalter.eu/bs/project/rudi-cajavec-i-partizanska-eskadrila/) potvrđuju obelisk iz 1951. i razlikuju ga od aviona postavljenog 1985. Koordinate 45.1275833, 16.7493611 sa stranice o Gornjem Jelovcu odnose se na memorijalni lokalitet kod aviona; nisu potvrđena tačka obeliska na uzvišenju. Sačuvane su samo kao kandidat u radnom spisku, sa upozorenjem. Zbirno proverena tri Commons fajla (`Међувође Аеродром.JPG`, `Међувође споменик аеродрому.jpg`, `Razglednica Međuvođe.jpg`): nijedan nema koordinate. Pregledane prve dve fotografije; obelisk je jasno odvojen od aviona. Za skulpturu u Uremovcu godina i autor nisu upisani: stranica o Gornjem Jelovcu navodi šezdesete, dok pretraga drugog popisa vraća 1987. i Dragoljuba Đokića; taj popis nije pojedinačno preuziman.
- Novi tragovi bez potvrđene tačke, za sledeći nastavak: [Vučitrn, stari popis spomenika Srbije, odeljak Opština Vučitrn](https://skulptura-hronologijaizlaganja.rs/h-content/uploads/2022/08/Spomenici-narodnooslobodilacke-borbe-i-revolucije-SR-Srbije1941-45.-Part2-hronologijaizlaganja.pdf) u rezultatima pretrage navodi park osnovne škole, 1960. i arhitektu L. Starčevića (sam PDF nije uspešno otvoren); [Cazin](https://www.cazin.net/vijesti/u-cazinu-sam-triput-slusao-tita) navodi da je spomenik 2011. premešten u park ispod Starog grada, iza opštinske zgrade; [Kneževo](https://bljesak.info/magazin/putujte-s-nama/knezevo-skender-vakuf-od-ceste-koju-treba-izbrisati-s-karti-do-slavskog-zita/313501) smešta spomenik iz 1986. pored Ugra, a ne u centar grada. [Rakovačke Bare](https://www.glassrpske.com/lat/novosti/drustvo/Spomenik-rakovackim-rudarima/170504) odnose se na rudare rudnika Rakovac, žrtve iz 1942; ne mešati sa memorijalom Druge krajiške brigade iz rata devedesetih. Rakoš, Baraći, Solila, Kostajnica, Ljubačevo i Mašići nisu dobili potvrđenu tačku. Naselja i školska dvorišta nisu korišćeni kao zamenske lokacije.
- **Novi izvor za ranije zatvorenu temu Hrženjak:** otvoren je [PDF „Indeks srušenih, oštećenih i uklonjenih spomenika NOB po županijama odnosno naseljima“](https://plusportal.hr/media/images/old_sb/Files/180319164051354/popis%20uklonjenih%20bisti%20i%20spomenika%20iz%20NOB-a.pdf), 63 PDF strane, počinje štampanom stranom 351, autori indeksa Zrnka Novak i Relja Bosanac. Uvod navodi 2.120 evidentiranih spomenika i objašnjava oznake stanja i obnove. Ovo je dostupan indeks sa dodatnim opisima, a ne potvrđen pun tekst knjige; bibliografsku vezu sa Hrženjakom još treba proveriti. Nije masovno obrađen i stanje iz starog popisa ne treba automatski upisivati kao današnje. Sledeći korak je ciljana provera hrvatskih stavki iz `bez_lokacije.json` u ovom PDF-u.
- Provera posle unosa: `python -I alati/integritet.py` daje samo istih 16 ranije poznatih parova na manje od 30 m, bez novih grešaka. Oba nova linka proverena su preko lokalnog servera u skrivenom Chrome-u: Uremovac na telefonu 390 × 844 i Peć na desktopu 1440 × 900; prikazani su detalji i markeri, a Peć je označena kao uklonjen spomenik. U izlazu pregledača nije bilo `EXC`. Sačuvane su prethodne korisnikove izmene; ništa nije komitovano.

### Provera hrvatskih stavki u indeksu (2026-10-15)

Pregledano je svih 37 hrvatskih stavki iz tadašnjeg spiska bez lokacije, po imenima mesta, ulica i opisima u indeksu. PDF je preuzet jednom i lokalno pretražen; redovi za Senjak, Peroj, Ivanović Jarak, Gajevo i Anku Butorac provereni su i na slici strane. Brojevi niže su PDF strane, a štampana strana je za 350 veća. Odsustvo odgovarajućeg reda znači rezultat ove pretrage, ne dokaz da spomenik nije u knjizi.

**Rezultat:** dodata su dva zapisa, a jedan postojeći prepoznat kao duplikat radnog spiska; baza ima 4.414 spomenika, bez lokacije ostaje 140 (Hrvatska 34).

- **Peroj:** `peroj-palim-borcima-i-zrtvama-fasizma`, 44.9508810, 13.7983370. [OSM n8994177443](https://www.openstreetmap.org/node/8994177443) je neposredno zapadno od crkve sv. Spiridona i groblja. [Putopis Hrvoja Jurića, 2022](https://www.jergovic.com/ajfelov-most/histeriografija-i-onomanija/) izričito smešta ćirilični spomenik borcima i žrtvama fašističkog terora preko puta te crkve i groblja. [Milo Jukić, 2019](https://bljesak.info/magazin/putujte-s-nama/peroj-istarska-crna-gora-i-sveta-foska-cudotvorka/279164) potvrđuje NOB i zasebno opisuje spomenik Prvom svetskom ratu unutar groblja. Drugi kandidat, n3102370129, nalazi se kod katoličke crkve sv. Stjepana i nije iskorišćen. Pregledana [Commons fotografija](https://commons.wikimedia.org/wiki/File:Peroj_Memorial.jpg) jasno pokazuje petokraku i natpis borcima NOR-a i žrtvama fašističkog terora; dodata je kao 400 px webp, Annebethmi, CC BY-SA 3.0. Istorijska oznaka oštećenja iz indeksa nije preneta kao današnje stanje.
- **Požega, Senjak:** `pozega-senjak-spomen-grobnica-logorasa`, 45.3627170, 17.6867831, središte granica izričito imenovanog [OSM lokaliteta w1468105548](https://www.openstreetmap.org/way/1468105548), ne središte naselja. Naziv mesta Senjak i autori G. Knežević / Z. Žagar podudaraju se sa radnim zapisom iz registra (1960). [Terenski prilog iz 2018](https://antifasisticki-vjesnik.org/hr/spomenici/3/Spomenici_propadaju_zrtve_fasizma_se_zaboravljaju_a_Vlada_vas_novac_salje_u_Kanadu_/296/) opisuje srušeni spomenik i zapušten lokalitet; stanje danas nije potvrđeno, pa polje `stanje` nije dodato. Grobnica i postojeća ploča `alaginci-spomen-ploca-zrtvama-fasizma-na-senjaku` ostaju zasebni objekti: novi par na oko 9 m je nameran. Na grobnicu nije preneta fotografija ploče.
- **Anka Butorac, Zagreb:** stavka za Laginjinu ulicu već je `zagreb-butorac` (45.8130298, 15.9925246), sa istom [Commons fotografijom i koordinatama](https://commons.wikimedia.org/wiki/File:Bista_Anke_Butorac-Zagreb.JPG) kao [OSM n6236109235](https://www.openstreetmap.org/node/6236109235). Indeks navodi Laginjinu 13; [pregled zagrebačkih spomenika iz 2017](https://www.vecernji.hr/zagreb/bista-ive-lole-ribara-bit-ce-30-partizanski-spomenik-1192637) izričito pominje Anku Butorac u Laginjinoj. Uklonjen je samo duplikat radnog spiska; istorijsko uklanjanje nije upisano na sadašnji zapis.
- **Dopune bez izmišljanja tačke:** Siget je dobio Ivana Sabolića i 1972. prema [Zagrebačkom kutku](https://zagrebacki-kutak.hr/siget-veceslav-holjevac/); to je drugo delo od postojećeg `zagreb-holjevac` kod Nacionalne biblioteke. Drivenik je dobio Zvonka Cara prema [opisu Commons fotografije](https://commons.wikimedia.org/wiki/File:Spomen_palim_NOB_Drivenik.jpg). Gajevo je vezano za Koprivničku bb i godinu 1962. preko [opisa spomenika](https://zagrebacki-kutak.hr/koprivnicka-bb-spomenik-palim-borcima-i-zrtvama-fasizma/). Novska je dobila vezu ka [službenom registru Z-7324](https://registar.kulturnadobra.hr/api/kulturno-dobro/detail/Z-7324): zajednička grobnica u pravoslavnom delu groblja, ne postojeći spomenik u centru. Tačne tačke ovih objekata nisu potvrđene i ostaju u radnom spisku.

| Stavka radnog spiska | Nalaz u indeksu i ishod |
|---|---|
| Pučišća | Nije nađen odgovarajući red. |
| Gornje Dubrave | Str. 10 i opis str. 47: razlikovati spomenik diverzantima K. A. Radovanija od kosturnice; nije potvrđena tačka. |
| Požega | Str. 20, Senjak, Knežević i Žagar; grobnica dodata po OSM lokalitetu. |
| Lipovljani | Nije nađen odgovarajući red. |
| Noskovačka Dubrava | Nije nađen odgovarajući red. |
| Kamanje | Nije nađen odgovarajući red. |
| Novska | Str. 24, groblje; zasebno od srušenog spomenika u centru, tačka nije potvrđena. |
| Trojvrh | Nije nađen odgovarajući red. |
| Budačka Rijeka, Čukur | Pogoci za Čukur kod Hrvatske Kostajnice nisu dokaz za ovu stavku. |
| Donji Budački, Ivanović Jarak | Str. 10, grobnica sa obeliskom, 350 civila ubijenih 19. VII 1941; bez tačke. |
| Zlarin | Str. 31 govori o NOB spomeniku, ne potvrđuje tačku bivšeg logora. |
| Molat | Nije nađen odgovarajući red; neimenovan OSM kandidat nije potvrđen. |
| Draškovec | Nije nađen odgovarajući red. |
| Split, bivša Vojna bolnica | Nije nađen odgovarajući red za Kneževićeva dela. |
| Bobota | Str. 33, više ploča; nisu potvrda da je metalna statua iz radnog spiska isti objekat. |
| Trpinja | Str. 34, spomenik za 73 borca i 191 civilnu žrtvu; bez tačke. |
| Blato | Nije nađen odgovarajući red. |
| Peroj | Str. 10; tačka potvrđena opisom položaja i OSM-om, spomenik dodat. |
| Ston | Str. 9, borci i Baldo Mekišić; bez tačke. |
| Kuna | Str. 8, ploča Konavoskom partizanskom odredu; ne poistovećivati Kunu Konavosku i Kunu na Pelješcu. |
| Županje | Nije nađen odgovarajući red. |
| Drivenik | Str. 22, Z. Car; autor potvrđen fotografijom, tačka nije potvrđena. |
| Vrbovsko | Nije nađen odgovarajući red za ovu stavku. |
| Martinšćica | Nije nađen odgovarajući red; OSM kandidat ostaje nepotvrđen. |
| Susak | Nije nađen odgovarajući red; OSM kandidat ostaje nepotvrđen. |
| Ilovik | Nije nađen odgovarajući red. |
| Postira | Nije nađen odgovarajući red. |
| Sreser | Nije nađen odgovarajući red. |
| Šidski Banovci | Str. 34, bista Slobodana Bajića; opšti naziv radne stavke nije dovoljan za poistovećivanje. |
| Zagreb, Veterinarski fakultet | Nije nađen odgovarajući red. |
| Zagreb, Ulica Božidara Adžije | Nije nađen odgovarajući red za ovaj spomenik. |
| Zagreb, Gajevo | Str. 39, Koprivnička ul., T. Ostoja; adresa dopunjena iz drugog izvora, bez tačke. |
| Zagreb, Trg siječanjskih žrtava | Str. 40, Kustošija, premešten i prenamenjen spomenik; razlikovati od novijeg spomenika ratu 1990-ih, bez tačke. |
| Zagreb, Anka Butorac | Str. 39, Laginjina 13; već imamo bistu, duplikat uklonjen. |
| Zagreb, Park Ribnjak | Nije nađen odgovarajući red za Kovačića. |
| Zagreb, Knežija | Nije nađen odgovarajući red za Dragicu Končar. |
| Zagreb, Siget | Red str. 38 za Aveniju Holjevca nije dokaz za Siget; Sabolićevo delo iz 1972. kod škole je zasebno i ostaje bez tačke. |

Provera: `slike_odnos.py` upisao je odnos jedino novoj fotografiji; `integritet.py` prijavljuje 17 bliskih parova, od kojih je jedini novi grobnica/ploča na Senjaku, bez drugih grešaka. Novi detalji provereni su u skrivenom Chrome-u: Peroj na telefonu 390 × 844 sa slikom i potpisom, Senjak na desktopu 1440 × 900 sa autorima i godinom; učitana su 4.414 markera, bez `EXC`. Ostale zatečene izmene nisu vraćane; ništa nije komitovano.

Registar i geoportal kulturnih dobara pregledani su ciljano, bez masovnog preuzimanja: javni detalj Z-7324 potvrđuje Novsku, ali njegov odgovor za geometriju vraća `null`. Ne pretvarati adresu škole, groblja ili ceo trg u koordinate spomenika. spomenicinob.info nije preuziman.

### Nastavak lociranja: Drivenik i Bobota (2026-10-15)

Dodate su dve prethodno nerešene hrvatske stavke: baza ima 4.416 spomenika, bez lokacije ostaje 138 (Hrvatska 32). Pregled je bio ciljan, sa pojedinačnim zahtevima i lokalnim čuvanjem odgovora; raniji neuspeli masovni upiti nisu ponavljani.

- **Drivenik:** `drivenik-spomenik-palim-borcima-i-zrtvama-fasizma`, 45.2403160, 14.6493950. [Foto-vodič HR-CRO, posebna stranica „Drivenik – Spomenik NOB“](https://hr-cro.com/croatia/drivenik-monument-spomenik-nob/slo) objavljuje marker baš ovog spomenika (`data-map-marker-lat/lng`), dok opšta stranica Drivenika ima drugu tačku, 45.240606, 14.649767, koja nije upotrebljena. Fotografija vodiča `DSC_4899_drivenik_spomenik_nob_big.jpg` vizuelno je upoređena sa [Commons fotografijom Roberte F.](https://commons.wikimedia.org/wiki/File:Spomen_palim_NOB_Drivenik.jpg): isti partizan, postolje i natpis za borce NOB-a i žrtve fašističkog terora. Commons opis izričito potvrđuje autora Zvonka Cara. Godina nije dodata: indeks autora sam po sebi ne potvrđuje godinu, a dostupnost ranije pronađene teze na riječkom repozitorijumu nije potvrđena (404). U aplikaciji je samo slobodna Commons fotografija, 400 px webp, CC BY-SA 3.0; fotografija HR-CRO služila je za poređenje.
- **Bobota:** `bobota-spomenik-borcima-i-zrtvama-fasizma`, 45.4222214, 18.8574213. Ranije sačuvan [OSM kandidat n10579249216](https://www.openstreetmap.org/node/10579249216), metalna statua, nalazi se ispred južne strane školskog prostora OŠ Bobota (w1134826023), u Mitrovićevoj ulici 8. [Službena Strategija razvoja Općine Trpinja, PDF str. 9, tabela 2](https://www.opcinatrpinja.hr/files/2021/strategija_razvoja_opcine_trpinja.pdf#page=9) izričito razlikuje spomenik borcima i žrtvama fašističkog terora ispred škole od biste Bogoljubu Vukajloviću Lali u centru. Pregledane su obe Commons fotografije: [Spomenik borcima NOB-a.jpg](https://commons.wikimedia.org/wiki/File:Spomenik_borcima_NOB-a.jpg) prikazuje figuru sa podignutom rukom ispred škole i čitljiv datum 13. april 1955. na glavnoj ploči; [Споменик борцима НОБ-а у Боботи.jpg](https://commons.wikimedia.org/wiki/File:Споменик_борцима_НОБ-а_у_Боботи.jpg) prikazuje drugi objekat, bistu sa pločama ispred prodavnice. Upotrebljena je prva, MirkoS18, CC BY-SA 3.0, 400 px webp. Godina 1955. potiče sa glavnog natpisa, a 1961. sa zasebne donje ploče nije godina podizanja statue. Autor nije potvrđen.
- **Siget:** preko Nominatima pronađena je prava škola Većeslava Holjevca (w315220213, školski prostor oko 45.7724457, 15.9715821). Mali OSM izvod tog prostora nema zasebnu tačku biste ili spomenika; upit iz prethodne provere zahvatio je prostor kod MSU-a, ne ovu školu. Centar škole nije upisan kao lokacija spomenika. Stavka ostaje otvorena sa već potvrđenim autorom i godinom.
- **Trpinja:** službeni dokument iz iste tabele potvrđuje NOB spomenik u centru, a Commons fotografija postoji bez koordinata. To i dalje nije dovoljno za tačnu tačku; ne koristiti centar naselja.

Provere nastavka: `slike_odnos.py` dopunio je samo dve nove fotografije; `integritet.py` prijavljuje istih 17 poznatih bliskih parova, bez novih grešaka. Oba nova linka i fotografije provereni su u mobilnom prikazu 390 × 844, sa 4.416 učitanih markera i bez `EXC`. Poređenje sa snimkom neposredno pre upisa potvrđuje da nijedan postojeći spomenik nije promenjen i da su iz radnog spiska uklonjene samo Bobota i Drivenik. Ništa nije komitovano.

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
- **Slike iz članaka, OSM-a i Wikidate, 2026-10-15:** 23 spomenika su dobila fotografiju posle pregleda na montaži. Izvori: glavna slika povezanog članka na Wikipediji (6: Bela Crkva, Danica, Dotrščina, Jajinci, Velika Moštanica, Veštrski mlin), OSM obeležja sa `wikimedia_commons` ili `wikidata` (P18) na manje od 60 m (16, npr. Gustinčič, Volarje, Kućište, Kidrič, Internacionalne brigade, Bagljaš) i Wikidata spomen-obeležja sa P18 na manje od 80 m (Dravograd dobija fotografiju iz Košenjaka). Overpass po `area` za Srbiju i Crnu Goru vraća 502/500, a upit po pravougaoniku `(41.8,18.4,46.2,23.0)` prolazi. Preskočene su slike parkova koje prikazuju spomenik sa posebnim unosom (Brezovica, Borik/Bakić, Čačak/Megaron, Crna Ćuprija, Jasenovac/Cvet, Bubanj/pesnice) i slike sa sajtova van Commons-a (partizanstvo.si, kraji.eu, Google Photos), jer licenca nije poznata.
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
