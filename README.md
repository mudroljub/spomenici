# Spomenici

Yugoslav monuments travel app.

Visit: [mudroljub.github.io/spomenici](https://mudroljub.github.io/spomenici/)

[![](screen.png)](https://mudroljub.github.io/spomenici/)

## Development

```
live-server
```

## TODO

### Ostalo

- ažurirati lokacije poređenjem sa google maps i drugim servisima
- za svaki spomenik upisati `googleCid`, broj Google mesta, iz koga se pravi trajni link `https://maps.google.com/?cid=…` sa komentarima, slikama i radnim vremenom
- kategorizovati ostale spomenike preko javnih podataka, a nejasne proveriti po fotografiji
- podaci za putnike: pristup (asfalt, makadam, pešačenje X min), parking, radno vreme i ulaznica za muzeje
- jezici: srpski i engleski

otvorena pitanja:
- slajder da prikazuje samo spomenike u vidljivom delu mape?
- kosturnice (21, npr. Kumanovo, Kavadarci, Doboj, Travnik) prebaciti u groblja? sada su spomenici/kompleksi, jer su uglavnom spomenik sa kriptom
- sepia filter na celom `body`: da li usporava pomeranje mape na slabijim telefonima? proveriti na pravom uređaju pre izmene

## Ocene

- loše je koristiti istu ikonicu za ruševinu i čitav spomenik, promena boje nije dovoljna. treba uvesti različite ikonice
- loše iskustvo kada klik na Want to visit promeni širinu dugmeta
- imena spomenika su izmešana, neka na srpskom neka na engleskom. treba da budu sva na istom jeziku. podrazumevano je to srpski, odnosno sh.
- navigate otvara novi prozor, find place ne. treba oba da otvaraju novi prozor