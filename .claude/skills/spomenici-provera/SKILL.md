---
name: spomenici-provera
description: Proverava projekat Spomenici posle izmene, pre nego što se izmena javi kao gotova — integritet podataka (alati/integritet.py), tipove (tsc preko jsconfig.json), izgled i rad aplikacije na ekranu telefona (snimak u Chrome-u bez prozora) i, kad je bitno, brzinu (alati/merenje.mjs). Koristi ga uvek kad menjaš data/spomeniks.json, data/bez_lokacije.json, slike, JS ili CSS aplikacije, ili alate koji upisuju podatke, i kad korisnik pita „radi li“, „proveri“ ili „jel sve u redu“, čak i ako ne pominje proveru izričito.
---

# Provera posle izmene

Korisnik komituje sam i oslanja se na to da je izmena proverena kad kažeš da je gotova. Zato pokreni korake koji se odnose na izmenu, iz korena repozitorijuma (Python uvek sa `python -I`), i javi šta je provereno i kako.

| Izmena | Koraci |
|---|---|
| podaci (`data/*.json`) | 1, a 3 ako se menja nešto što aplikacija prikazuje |
| nove slike | 1, sa alatima za slike |
| JS, CSS, HTML aplikacije | 2 i 3; 4 ako može da uspori |
| polja podataka (dodato, preimenovano) | 1, 2 i 3, plus `data/tipovi.d.ts` |

## 1. Podaci

```
python -I alati/integritet.py
```

Prolazi kad ispiše samo 17 poznatih parova „manje od 30 m“ (park i spomenik u njemu, grobnica i ploča na Senjaku) i `spomenika N`. Svaka druga kategorija je nova greška koju si uneo.

Nove slike idu ovim redom, jer svaki korak čita rezultat prethodnog: `alati/bez_metapodataka.py --upisi`, `alati/male_slike.py`, `alati/slike_odnos.py`, pa ponovo `integritet.py`.

JSON se upisuje u formatu koji čuva čiste razlike u gitu (UTF-8, CRLF, uvlačenje 2):

```python
open(P, 'w', encoding='utf8', newline='').write(json.dumps(d, ensure_ascii=False, indent=2).replace('\n', '\r\n') + '\r\n')
```

Posle upisa `git diff --stat` treba da pokaže samo redove koje si menjao; hiljade izmenjenih redova znače da je format pokvaren.

## 2. Tipovi

```
npx -y -p typescript tsc -p jsconfig.json
```

Prolazi bez ispisa. Provera hvata pristup polju koje ne postoji (npr. ostatak preimenovanog polja), pa posle svake izmene polja ažuriraj `data/tipovi.d.ts`. Globalne najave (Leaflet, `Element.on`, `querySelector` vraća `HTMLElement`) su u `data/globalno.d.ts`; `sw.js` je izostavljen jer service worker ima drugo globalno okruženje.

Kod je pisan bez tačke-zareza. Red koji počinje zagradom, npr. oznaka tipa `/** @type {X} */ (izraz)`, JavaScript čita kao poziv prethodnog reda i aplikacija pada; takav izraz dodeli promenljivoj.

## 3. Aplikacija

Aplikacija se koristi samo na telefonu, pa se gleda na ekranu telefona (390 × 844, dodir):

```
bash .claude/skills/spomenici-provera/scripts/aplikacija.sh <scratchpad>/proba.png "<JS izraz>" [čekanje ms]
```

Skripta pokreće lokalni server, otvara aplikaciju, izvršava izraz, snima ekran i gasi server. `HASH=#<id>` otvara prozor spomenika, a `W=1440 H=900` daje širinu računara. Prolazi kad nema `EXC` u ispisu, kad `EVAL` vrati očekivanu vrednost i kad snimak izgleda kako treba; snimak zato uvek pogledaj.

Za izraz:
- prozori su web komponente sa shadow DOM-om, npr. `document.querySelector('detalji-spomenika').shadowRoot`;
- filteri se iscrtavaju tek kad se otvore, pa ih prvo otvori dugmetom „Filteri“;
- tooltip na prelazak mišem ne postoji uz dodir; za njega treba Chrome bez emulacije dodira i `Input.dispatchMouseEvent`.

Emulacija ne zamenjuje pravi telefon: za izmene izgleda reci korisniku da ih proveri na svom.

## 4. Brzina

```
bash -c 'python -m http.server 8765 >/dev/null 2>&1 & s=$!; sleep 2; node alati/merenje.mjs; kill $s'
```

Uporedi sa ciljevima u `docs/PLAN_OPTIMIZACIJE.md`, odeljak 4. Isto merenje varira 20–30%, pa su značajne samo veće razlike. Ako server ostane upaljen, ugasi ga kao u `scripts/aplikacija.sh`.

## Javljanje

Kratko, na srpskom: šta je izmenjeno, koji koraci su prošli i, ako neki nije urađen ili nije prošao, koji i zašto.
