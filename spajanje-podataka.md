# Spajanje podataka

Spajanje starog skupa `data/spomenici.json` (253 spomenika) sa glavnim skupom `data/spomeniks.json` (842 spomenika).

## Urađeno

- 215 spomenika iz starog skupa je na manje od 2 km od nekog spomenika u glavnom skupu i nisu dodati.
- Dodata su 23 spomenika koja su više od 2 km od svakog postojećeg spomenika, a njihovo naselje se nigde ne pominje u glavnom skupu: Baćina, Bajina Bašta, Beočin, Beograd (Banovo Brdo), Bojčinska šuma, Dramalj, Drča (Vrhnika), Kal nad Kanalom (Nova Gorica), Komarna Vas, Kred (Kobarid), Loznica, Mokrin, Nevesinje, Novi Banovci, Novi Karlovci, Podbela (Breginj), Pševo (Kranj), Radanovci, Selenča, Skela (Obrenovac), Šolta, Tenja, Vrbas.
- Uz njih su preneti samo živi linkovi i slike; Wikimedia sličice su prebačene na standardnu širinu 330px, jer nestandardne širine Wikimedia više ne služi. Glavni skup sada ima 865 spomenika.

## Za pregled: 15 mogućih duplikata

| # | Stari skup | Najbliži u glavnom skupu | Razdaljina | Procena |
|---|---|---|---|---|
| 1 | Petrova Gora: Spomenik ustanku naroda Banije i Korduna | Petrova Gora: Monument to the Uprising (isti link) | 8,3 km | isti |
| 2 | Šašinci: Susret kurira | Šašinci: „Meeting of the Couriers“ | 2,8 km | isti |
| 3 | Tičan: Spomen područje Tičan | Štuti: The Tičan Memorial Area | 2,3 km | isti |
| 4 | Iriški Venac: Spomenik Sloboda | Iriški Venac: Monument to Freedom | 1,8 km | isti |
| 5 | Štip: Spomenik palim borcima (link spomenikdatabase/stip) | Štip: Partisan's Necropolis (isti link) | 24,8 km | isti |
| 6 | Sefkerin: Spomenik palim borcima | Sefkerin: Monument to Fallen Fighters | 2,6 km | verovatno isti |
| 7 | Jabukovac (Negotin), bez opisa | Jabukovac: Monument to Fallen Fighters | 3,2 km | verovatno isti |
| 8 | Makarska, kompleks | Makarska: Monument to the Revolution | 1,9 km | verovatno isti |
| 9 | Neštin, obala Dunava | Neštin: Monument to the Victims of Fascism | 2,0 km | verovatno isti |
| 10 | Štip: Spomenik deportovanim Jevrejima | Štip: Partisan's Necropolis | 24,8 km | različit |
| 11 | Valjevo: Spomen groblje na Krušiku | Valjevo: Monument to Stjepan Filipović | 2,2 km | različit |
| 12 | Poreč: Spomenik Joakimu Rakovcu | Poreč: „???“ (1969, Edo Murtić) | 2,8 km | nejasno |
| 13 | Skopje: Skopski partizanski odred | Skopje: Monument to the Liberators of Skopje | 2,6 km | nejasno |
| 14 | Trstenik, bez opisa | Popina Monument Park | 3,4 km | nejasno |
| 15 | Maribor, bez opisa | Maribor: Monument at Volkmer's Crossing | 1,7 km | nejasno |

Predlog: 1–9 ne dodavati (duplikati), 10 i 11 dodati kao nove, 12–15 pregledati ručno.

## Otvoreno

- Prenos vrste iz starog skupa (kompleks, spomenik, muzej) na postojeće spomenike nije urađen.
- `data/spomeniks-backup.json` ima 19 zapisa više od glavnog skupa i još nije upoređen.
