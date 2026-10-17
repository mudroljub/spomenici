# Žetva: Crna Gora

Plan prikupljanja spomenika NOB-a u Crnoj Gori. Izvori su pronađeni i provereni za dostupnost 2026-10-16; sistematska žetva još nije rađena. Pravila (obuhvat, ploče, opstanak, fotografije) su u skilu `spomenici-zetva`; rezultati obrade upisuju se u [IZVORI.md](IZVORI.md) i [LOCIRANJE_SPOMENIKA.md](LOCIRANJE_SPOMENIKA.md).

## Stanje

Na mapi je 96 crnogorskih spomenika, a u `data/bez_lokacije.json` još 12. SUBNOR procenjuje oko 1.700 spomenika i spomen-obeležja u Crnoj Gori ([Istorijski zapisi](https://istorijskizapisi.me/wp-content/uploads/2022/04/31-D-Vlahovic-387-394.pdf)), pa je pokrivenost mala. Jedinstven otvoren državni registar sa koordinatama ne postoji; Uprava za zaštitu kulturnih dobara objavljuje samo pojedinačne odluke u Službenom listu.

## Redosled rada

Po verovatnoći uspeha. Pre svakog koraka dati korisniku procenu tokena.

1. ~~**StoryMap mapa NOB spomenika**~~ — urađeno 2026-10-17 (izvor 10): 28 tačaka, jedan nov spomenik na mapi, pet novih stavki i jedna dopuna u `data/bez_lokacije.json`.
2. **Biste u Pljevljima:** OSM ima pet bista oko 400 m od spomenika Pljevaljske bitke kojih nema u bazi (Božidar Žugić n4310633591, Mile Peruničić n4310864689, Ljubomir Medenica n8990548346, Đorđije Peruničić n8993686211, Mirko Pejatović n8995975457). Proveriti da li su narodni heroji NOB-a, pa ih upisati sa OSM tačkom; nekoliko zahteva.
3. **Registar Herceg Novog:** tekst se izvlači bez čitanja slika; izdvojiti NOB objekte koji nisu ploče, upariti sa bazom i locirati jasne parove po mikrolokaciji.
4. **Danilovgrad:** 94 strane sa čitljivim tekstom i fotografijama.
5. **Budva:** 37 skenova sa OCR slojem; podatke proveravati na skenu.
6. **Katalog Narodni heroji Crne Gore:** samo za identitet, autora i godinu; koordinate su približne.

Knjige bez javnog PDF-a (Pljevlja, Kotor, Kolašin) i mape Nikšića i Bara ostaju dok se ne pribave.

## Izvori

| # | Izvor | Šta daje | Ograničenje |
|---|---|---|---|
| 1 | [Registar spomen-obilježja Opštine Herceg Novi](https://www.hercegnovi.me/downloads/Kultura/REGISTAR%20SPOMEN%20OB%20O%20HN.pdf), 2016 ([opštinska stranica](https://hercegnovi.me/sr-yu/meni/meni-kultura/meni-dokumenta)) | 85 strana, 64 registarska broja, tekst se dobro izvlači. Mikrolokacija, ponekad katastarska parcela, opis, godina i autor; npr. Bezmetković: Savinska dubrava, južno od Gradskog groblja, K.O. Topla, K.P. 2236. | Sve epohe, ne samo NOB. Parcela nije koordinata objekta; stanje je iz 2016. |
| 2 | [Spomenici i spomen-obilježja NOR-a 1941–1945 u opštini Danilovgrad](https://www.spomenikdatabase.org/_files/ugd/e73a14_0bc2984a2f72446b9f40641ff26a558f.pdf), 2017 | 94 strane, 12,4 MB, čitljiv tekst, fotografije i natpisi; sela, groblja, škole, parkovi. Priredili Momčilo Šaletić i Drago Knežević (SUBNOR CG i UBNOR Danilovgrad), ISBN 978-9940-645-07-6. | Spomenik Database kao autora navodi Zuvdiju Hodžića, koji je u impresumu samo „za izdavače“. Beleži i ukradene ili pohranjene biste (str. 85 Miladin Pavličić, str. 90 Vasilije-Žarko Đurović, ranije Čanj): ne mapirati ih na starom mestu. |
| 3 | [Registar spomen-obilježja Opštine Budva](https://api.budva.me/media/files/PDF/Informacije/spomen_obiljezja-2023.pdf), 2014/2015 | 37 skenova sa OCR slojem; odeljci za ploče, biste, grobnice, spomenike i komplekse. | „2023“ u adresi nije godina popisa (overa 1. 12. 2015). Sve epohe. |
| 4 | [Narodni heroji Crne Gore — katalog spomenika](https://www.narodniheroji.me/index.php/istrazi/spomenici) | 115 zapisa iz 19 opština (59 potvrđenih registrom): lokalitet, vrsta, godina, autor, veze ka registrima. | Tačke su približne, po opštini ([primer Nikole Đurkovića](https://www.narodniheroji.me/index.php/istrazi/spomenici?view=monument&id=51:bista-nikoli-djurkovicu-cg-nob-0051)): ne preuzimati ih. Ima i predratnih obeležja. |
| 5 | [Slavica Stamatović Vučković: Spomenici II svjetskog rata u Crnoj Gori](https://www.shop.expeditio.org/wp-content/uploads/2020/06/KNJIGA-NOR-za-sajt.pdf), EXPEDITIO 2020 | Autori, istorijat i bibliografija za 25 objekata, 11 detaljno. | Javno je samo odlomak od 17 strana; veći spomenici su verovatno već u bazi. |
| 6 | Znamenja slobode — spomenici NOR-a u pljevaljskom kraju, 2020 ([COBISS](https://plus-legacy.cobiss.net/cobiss/cg/cnr_latn/bib/40101904), [predstavljanje](https://tvpljevlja.me/2020/07/30/knjiga-znamenja-slobode/)) | 73 obeležja sa fotografijom, godinom i položajem; dopunjeno izdanje knjige Radovana Vujadinovića „Na vječnoj straži“ (1988). | Nema javnog PDF-a; primerci u bibliotekama u Pljevljima, Podgorici i Cetinju. |
| 7 | Jovo M. Bećir: Spomenici ne umiru — spomenici i spomen-obilježja NOR-a u opštini Kotor, 2025 ([izdavač](https://subnora.me/izdavastvo/), [promocija](https://kckotor.me/2025/12/10/vece-sjecanja-i-slobode-promocija-knjige-spomenici-ne-umiru-u-kotoru/)) | Najnoviji opštinski popis, 104 strane. | Nema javnog PDF-a. |
| 8 | Spomenici i spomen-obilježja NOR-a 1941–1945 u opštini Kolašin, 2021 ([izdavač](https://subnora.me/izdavastvo/)) | 124 strane. | Nema javnog PDF-a. |
| 9 | [Antifašističke mape Nikšića i Bara](https://www.ucg.ac.me/objava/blog/1279/objava/15187-antifasisticke-mape-niksica-i-bara), 2017 | Raspored objekata, za prepoznavanje na terenu. | Nema čitljivog skena; događaj na mapi nije nužno spomen-obeležje. |
| 10 | [StoryMap „Mapa spomenika Narodnooslobodilačke borbe“](https://uploads.knightlab.com/storymapjs/d68e44a5a6fd5fe5aa97d31f7b027ae3/mapa-spomenika-narodnooslobodilacke-borbe/index.html) (podaci u `published.json` na istoj adresi) | Obrađeno 2026-10-17: 28 spomenika sa tačkom, naslovom, kratkim opisom i fotografijom čitalaca Vijesti. 18 već imamo; nov na mapi je spomenik žrtvama bombardovanja u Podgorici (tačka iz OSM n5494528889); u spisak bez lokacije dodati Šekulari, Doli (Piva), Trubjela, braća Radulović u Milojevićima i Donje Crkvice, a Majstorima dodat kandidat. Nesigurno, nije upisano: Krstac na Goliji (1,1 km od našeg u Gornjem Čarađu), „Voda Partizanka“ u Stravču (bistijerna); Stražica kod Pljevalja je verovatno naš `pljevlja-fallen-fighters`, ali tačka izvora je pogrešna. | Tačke su približne: Carine i Trubjela imaju istu tačku, Risan ima tačku Velimlja, Stražica dužinu 3,0. Zato su upisane samo kao kandidati. Fotografije su od čitalaca; uzimaju se uz potpis „Čitalac Vijesti, StoryMap Mapa spomenika NOB“ (Podgorica je dobila fotografiju). |
| 11 | [Vijesti: „Mapa spomenika u Crnoj Gori: probudimo dobre priče“](https://www.vijesti.me/vijesti/490503/mapa-spomenika-u-crnoj-gori-probudimo-dobre-price) | Nije otvarano; verovatno članak o istoj mapi. | |
| 12 | [Tragovima maršala: Crna Gora](https://tragovimamarsala.rs/crna-gora/) | Nije otvarano. | |
| 13 | [Facebook „Spomenici NOB u Crnoj Gori“](https://www.facebook.com/spomenicinobucrnojgori/?locale=sr_RS) | Po korisniku dragocen neformalan izvor fotografija i opisa. Plan: korisnik, prijavljen, ručno sačuva stranicu (cela stranica, posle pomeranja do kraja) ili snimke ekrana, pa se fajl čita lokalno; nije zakazano. | Bez prijave nedostupno: 2026-10-16 anonimni zahtevi na `mbasic.facebook.com` i `m.facebook.com` vratili su 400; ne ponavljati, a prijavu ne automatizovati. Licence fotografija nepoznate; fotografije se uzimaju uz izvor. |
| 14 | [CdM forum „Spomenici Narodnooslobodilačke borbe“](https://forum.cdm.me/showthread.php?203141-Spomenici-Narodnooslobodila%C4%8Dke-borbe/page2) | Nije otvarano; fotografije i mesta od korisnika foruma. | Licence fotografija nepoznate; fotografije se uzimaju uz izvor. |

Preuzeti izvori (PDF-ovi i izvučen tekst Herceg Novog, Budve, Danilovgrada i odlomka EXPEDITIO, HTML kataloga) su u `izvori/cg/`, koja se ne objavljuje.
