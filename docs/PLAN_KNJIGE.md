# Plan: podaci iz knjiga o spomenicima

Ažurirano 2026-10-16. Plan je pisan tako da po njemu može da radi i drugi agent: šta su izvori, šta iz njih uzimamo, kojim redom, kako i kako se proverava. Pravila zapisa su u [standardu](PLAN_ZETVE.md#2-standard-zapisa-obavezno-za-svaki-novi-ili-izmenjen-spomenik), a postupak provere u skilu `spomenici-provera`.

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
5. **C — Hrženjak.** Poslednja: uglavnom opisuje srušene spomenike, koji putniku ne trebaju; traži preuzimanje 436 slika, a korisni su samo spomenici koji i dalje stoje.

## 5. Otvorene odluke (korisnik)

Nema; odluke su upisane uz pravila (tekst i fotografije sa izvorom, polje `natpis`, stanje iz C).

## 6. Kad je posao gotov

Svih pet knjiga je izvučeno u `data/knjige/`, upareni zapisi su upisani ili navedeni kao sporni u beleškama, `integritet.py`, `tsc` i `node --test alati/test.mjs` prolaze, a stavka je skinuta iz `## TODO` u `README.md`.
