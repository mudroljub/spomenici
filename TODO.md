# TODO

1. **Spajanje podataka: 15 nesigurnih spomenika.** Iz `data/spomenici.json` dodata su 23 spomenika čijeg naselja nema u glavnom skupu. Ostalih 15 su u naseljima koja glavni skup već ima (npr. Petrova Gora, Tičan, Šašinci, Sefkerin, Jabukovac, Valjevo, Skopje, Štip, Poreč, Trstenik), pa mogu biti duplikati; treba ih pregledati jedan po jedan. Prenos vrste (kompleks/spomenik/muzej) na postojeće spomenike još nije urađen.
2. **Stari podaci.** Kad se spajanje završi, `data/spomenici.json` i `data/spomeniks-backup.json` (1,3 MB) mogu da se obrišu, ali backup ima 19 zapisa više od glavnog skupa, pa ga prvo treba uporediti.
3. **Proveriti Safari.** Ispravka za Safari je proverena samo u Chromium-u; isprobati na iPhone-u.
