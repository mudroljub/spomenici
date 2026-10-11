# Spomenici

Yugoslav monuments travel app.

Visit: [mudroljub.github.io/spomenici](https://mudroljub.github.io/spomenici/)

[![](screen.png)](https://mudroljub.github.io/spomenici/)

## Development

```
live-server
```

## TODO

### Telefon (prioritet)

- rad bez signala: keširati aplikaciju, podatke, slike i već pregledane delove mape
- detalji spomenika u panelu odozdo umesto uskog popupa na telefonu (slika, opis, pristup, dugmad navigiraj/sačuvaj/podeli)
- slike prebaciti sa imgur-a u repo kao umanjene (webp, ~400px): imgur je blokiran u Velikoj Britaniji i ne dozvoljava hotlinking, a lokalne slike rade i bez signala

### Ostalo

- BUG: ispod nav slajdera ima bela traka, što ne treba
- ažurirati lokacije poređenjem sa google maps i drugim servisima
- kategorizovati ostale spomenike preko javnih podataka, a nejasne proveriti po fotografiji
- stanje spomenika: 36 su u nazivu označena kao srušena, oštećena ili u ruševinama; izdvojiti kao podatak i filter
- oznake „posetio sam“ i „na listi“, sačuvane na uređaju, sa filterom na mapi
- link za deljenje koji otvara mapu na izabranom spomeniku
- predefinisati spomeničke ture za obilaske? po republici, po vrsti spomenika i slično...
- planer rute: izabrati više spomenika i izvesti ih kao GPX (za Garmin, OsmAnd, Kurviger) ili kao Google Maps link sa usputnim tačkama (do 10)
- podaci za putnike: pristup (asfalt, makadam, pešačenje X min), parking, radno vreme i ulaznica za muzeje, država (izračunati iz koordinata)
- jezici: srpski i engleski

otvorena pitanja:
- slajder da prikazuje samo spomenike u vidljivom delu mape?
- kosturnice (21, npr. Kumanovo, Kavadarci, Doboj, Travnik) prebaciti u groblja? sada su spomenici/kompleksi, jer su uglavnom spomenik sa kriptom
- sepia filter na celom `body`: da li usporava pomeranje mape na slabijim telefonima? proveriti na pravom uređaju pre izmene
