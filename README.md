# Spomeniks

Yugoslav monuments travel app.

Visit: [mudroljub.github.io/spomeniks](https://mudroljub.github.io/spomeniks/)

[![](screen.png)](https://mudroljub.github.io/spomeniks/)

## Development

```
live-server
```

## Data sources

Slovenian memorials: [Register nepremične kulturne dediščine](https://podatki.gov.si/dataset/register-nepremicne-kulturne-dediscine), Ministrstvo za kulturo RS, CC BY 4.0.

Fotografija spomenika u Starim Banovcima: Andrija1234567, GFDL 1.2 ili kasnija; [izvor, izmene i licenca](docs/licence/STARI_BANOVCI.md).

Provera fotografija za svih 132 tadašnja zapisa bez slike u Srbiji završena je 2026-10-15: dodata 21 slika, preostalo 111 bez potvrđene upotrebljive slike; [rezultat za svaki zapis](docs/FOTOGRAFIJE_SRBIJA.md).

## TODO

- srediti nazive u data/bez_lokacije.json. mnogi imaju samo engleski oblik
  - ujednačiti tip podataka i atribute sa spomeniks.json: spisak ima ista polja kao baza, bez koordinata ([tipovi](data/tipovi.d.ts))
    - slika u spisku (54): ime fajla na Vikipediji, a u bazi je `slika` putanja do naše slike → sliku preuzeti tek pri prebacivanju u bazu
    - izvor u spisku: tekstualni opisi („sr Wikipedija, Списак споменика НОБ“) → URL članka, kao u bazi
    - id: svaka stavka dobija `id` po pravilu baze („mesto-naziv“), da se pri prebacivanju u bazu ne menja
    - mesto u spisku: samo selo ili grad → oblik „Grad (deo grada)“ kao u bazi, gde adresa to kaže
- ukloniti ostatke engleskog iz domaćih naziva, npr. Plitvice Lakes
- na osnovu dosadašnjeg rada na projektu napraviti neke skilove ako je potrebno
- možda dodati unit i integracione testove ako ima smisla
- u tooltip mesto treba da bude istaknuto
- analizirati knjige o spomenicima i izvući sve korisne podatke (dodati nove atribute ako treba):
 - https://znaci.org/00003/736.php
 - https://znaci.org/00003/667.pdf
 - https://znaci.org/00003/679.pdf
 - https://znaci.org/00003/7xx.php?bk=905
 - https://znaci.org/00003/920.pdf


