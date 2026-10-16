// Tip podataka u data/*.json. Pravila pisanja vrednosti (jezik naziva, pravopis, slike): docs/PLAN_ZETVE.md, odeljak 2.
// U JS fajlu: /** @type {import('../data/tipovi').Spomenik} */

export type Drzava = 'Slovenia' | 'Croatia' | 'Bosnia and Herzegovina' | 'Serbia' | 'Montenegro' | 'Macedonia' | 'Kosovo' | 'Italy'

export type Vrsta = 'istaknut' | 'spomenik' | 'lokalni' | 'kompleks' | 'groblje' | 'muzej' | 'statua' | 'bista' | 'ploca'

/** prazno: nema podatka da spomenik nije očuvan (može biti i nepoznato) */
export type Stanje = 'rusevine' | 'uklonjen' | 'ostecen' | 'zatvoren' | 'srusen'

export interface Koordinate {
  lat: number
  lng: number
}

/** data/spomeniks.json */
export interface Spomenik {
  /** jedinstven ključ: mala ASCII slova, cifre i crtice, npr. "banja-luka-maslesa" */
  id: string
  /** 7 decimala */
  koordinate: Koordinate
  /** ID Google mesta, samo cifre */
  googleCid?: string
  /** mesto, „Grad (deo grada)“, npr. "Beograd (Banjica)" */
  mesto: string
  /** URL izvora podataka: OSM, Commons, registar, spomenicinob.info */
  izvor?: string
  /** domaći članak na Vikipediji */
  wiki?: string
  /** engleski članak na Vikipediji */
  wikiEn?: string
  /** "slike/spomenici/<id>.webp" */
  slika?: string
  /** širina / visina slike; postoji uvek uz `slika` */
  slikaOdnos?: number
  /** „Autor, licenca“ */
  slikaPotpis?: string
  /** domaći naziv, na jeziku i pismu države */
  naziv?: string
  /** engleski naziv, samo kad se razlikuje od domaćeg */
  nazivEn?: string
  /** godina podizanja: "1961", raspon "1958-1960", ili približno "pre 1960", "posle 1960", "oko 1960", "1960-ih" */
  godina?: string
  /** autori spojeni sa „ & “ */
  autor?: string
  /** Wikidata stavke iz data/posvete.json, npr. ["Q82914"] */
  posveta?: string[]
  stanje?: Stanje
  vrsta: Vrsta
  drzava: Drzava
}

/** moguća, nepotvrđena lokacija spomenika bez lokacije */
export interface Kandidat extends Koordinate {
  izvor: string
  opis: string
}

/** data/bez_lokacije.json: poznat spomenik koji još ne možemo da smestimo na mapu.
 * Ista polja kao Spomenik, bez koordinata, uz podatke koji pomažu da se spomenik pronađe.
 * Spisak ovom tipu još ne odgovara u svemu; koraci su u README, odeljak TODO. */
export interface SpomenikBezLokacije extends Omit<Spomenik, 'koordinate'> {
  /** adresa ili opis položaja sa izvora, engleski */
  adresa?: string
  /** moguće, nepotvrđene lokacije */
  kandidati?: Kandidat[]
}
