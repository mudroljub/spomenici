# Spomeniks

Yugoslav WWII monuments travel app.

Visit: [mudroljub.github.io/spomeniks](https://mudroljub.github.io/spomeniks/)

[![](screen.png)](https://mudroljub.github.io/spomeniks/)

## Development

```
live-server
```

## TODO

- Žetva podataka za Crnu Goru
[Pronađeni izvori za Crnu Goru i predlog obrade](docs/ZETVA_CRNA_GORA.md).

- Integritet projektnih skilova — nalazi provere 2026-10-17, za rešavanje redom:
  1. Dopuniti [standard zapisa](.claude/skills/spomenici-zetva/references/standard.md) poljem `stanjeIzvor`, njegovim oblikom i mestom u redosledu. Postoji u tipovima, `alati/zapis.py` i 40 zapisa; standard trenutno ne opisuje kako se čuva izvor istorijskog stanja.
  2. Dopuniti [postupak provere slika](.claude/skills/spomenici-provera/SKILL.md#obrada-novih-slika) za `slike/bez-lokacije/`: žetva sada nalaže i te lokalne slike, ali sva tri navedena alata obrađuju samo `slike/spomenici/`, a `slike_odnos.py` samo `data/spomeniks.json`. Navesti poseban način čišćenja i računanja odnosa za radne zapise; male slike praviti samo gde su potrebne prikazu.
  3. Ispraviti referencu na `autori_wiki.py` u [autorima i posvetama](.claude/skills/spomenici-zetva/references/autori-i-posvete.md): skripta nije pronađena ni u projektu ni u navedenom starom direktorijumu `nazivi-alati`. Sačuvati postupak kao opis ili obezbediti postojeću skriptu i tačnu putanju.
  4. Ograničiti gašenje servera u [aplikacija.sh](.claude/skills/spomenici-provera/scripts/aplikacija.sh) na proces koji je sama skripta pokrenula. Rezervno gašenje trenutno prekida svaki proces koji sluša na portu 8765, čak i kada pokretanje sopstvenog servera nije uspelo zbog već zauzetog porta.

  Proverena su sva tri projektna skila i osam pratećih fajlova: osnovni format zaglavlja, nazivi i dužine opisa, lokalne Markdown veze i sidra, JSON sa 43 formule, Python sintaksa i tri primera genitiva, kao i Bash sintaksa (`bash -n`). Sve ove provere prolaze. Puna YAML validacija alatom `quick_validate.py` nije pokrenuta jer nedostaje PyYAML; zaglavlja su proverena kao jednostavna polja `name` i `description`. Mrežni postupci i pokretanje aplikacije nisu deo ove statičke provere. Tokom same provere skilovi nisu menjani.
