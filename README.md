# Spomeniks

Yugoslav WWII monuments travel app.

Visit: [mudroljub.github.io/spomeniks](https://mudroljub.github.io/spomeniks/)

[![](screen.png)](https://mudroljub.github.io/spomeniks/)

## Development

```
live-server
```

Pri budućem lociranju **obavezno prioritizovati po verovatnoći uspeha, ne ići redom**; prednost imaju konkretni objekti, savremene adrese i precizne tačke, a uklonjeni spomenici se preskaču. Hrvatski kandidati zahtevaju [proveru opstanka](docs/PLAN_KNJIGE.md#7-provera-opstanka-hrvatskih-spomenika--prioritet-pre-novih-unosa). [Ciljani prolaz lociranja je završen](docs/BELESKE.md#zatvaranje-ciljanog-prolaza-lociranja-2026-10-16).

## TODO

- **obustavljeno po nalogu korisnika:** šira provera rizičnih hrvatskih unosa prema Hrženjaku i kasnijim dokazima; ograničeni [prenos za 70 već povezanih spomenika je završen](docs/BELESKE.md#ograničen-prenos-stanja-za-70-povezanih-spomenika-2026-10-16); [početna trijaža i 60 obrađenih slučajeva](docs/BELESKE.md#nastavak-provere-hrvatske-dokazi-odvojeni-od-izvora-podataka-2026-10-16); [provera prvih 49 završena](docs/BELESKE.md#provera-49-hrvatskih-unosa-2026-10-16), [plan nastavka](docs/PLAN_KNJIGE.md#7-provera-opstanka-hrvatskih-spomenika--prioritet-pre-novih-unosa).
- sepija preko cele stranice koči pomeranje mape na telefonu; filter staviti samo na pločice, a boje markera i prozora prilagoditi
- traka na dnu pravi svih 2.656 sličica pri otvaranju; praviti ih tek kad uđu u traku (oko 0,3 s brže na slabom telefonu)
- proveriti aplikaciju na najstarijem telefonu (podržani su Chrome 85, Safari 14 i Firefox 79)
- neki spomenici imaju predugačak naziv koji je verovatno natpis spomenika. pronađi najduže naslove da rešimo