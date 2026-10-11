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

- detaljna podloga za približavanje (npr. OpenStreetMap ili topografska), jer stari atlas ide samo do nivoa 12 i nema sitne puteve
- rad bez signala: keširati aplikaciju, podatke, slike i već pregledane delove mape
- detalji spomenika u panelu odozdo umesto uskog popupa na telefonu (slika, opis, pristup, dugmad navigiraj/sačuvaj/podeli)
- slike prebaciti sa imgur-a u repo kao umanjene (webp, ~400px): imgur je blokiran u Velikoj Britaniji i ne dozvoljava hotlinking, a lokalne slike rade i bez signala
- iPhone: slajder na dnu može da padne ispod trake za početni ekran kad je aplikacija instalirana (dodati `env(safe-area-inset-bottom)`, `viewport-fit=cover`), a `100%` visina ne prati traku pregledača (`100dvh`)
- sepia filter na celom `body` usporava pomeranje mape na slabijim telefonima; primeniti ga samo na podlogu i slike
- veliki providni naslov „Spomenici“ zauzima donji deo ekrana na telefonu; smanjiti ga ili skloniti
- bolji kontrast na suncu (providnost ikonica i sepia ga smanjuju)

### Ostalo

- ažurirati lokacije poređenjem sa google maps i drugim servisima
- dodaj novu kategoriju groblje
- kategorizovati ostale spomenike preko javnih podataka, a nejasne proveriti po fotografiji
- stanje spomenika: 36 su u nazivu označena kao srušena, oštećena ili u ruševinama; izdvojiti kao podatak i filter
- oznake „posetio sam“ i „na listi“, sačuvane na uređaju, sa filterom na mapi
- link za deljenje koji otvara mapu na izabranom spomeniku
- predefinisati spomeničke ture za obilaske? po republici, po vrsti spomenika i slično...
- planer rute: izabrati više spomenika i izvesti ih kao GPX (za Garmin, OsmAnd, Kurviger) ili kao Google Maps link sa usputnim tačkama (do 10)
- pretraga bez obzira na dijakritike („kadinjaca“ treba da nađe „Kadinjača“) i ćirilicu
- podaci za putnike: pristup (asfalt, makadam, pešačenje X min), parking, radno vreme i ulaznica za muzeje, država (izračunati iz koordinata)
- dugme „prijavi grešku“ (npr. unapred popunjen GitHub issue) za pogrešne koordinate i stanje spomenika
- najbliži: ispod 1 km prikazivati metre umesto „0 km“ i naznačiti da je razdaljina vazdušna
- jezici: srpski i engleski

otvorena pitanja:
- slajder da prikazuje samo spomenike u vidljivom delu mape?
