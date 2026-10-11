import {normalizuj} from '../utils/helpers.js'

// font od 16px sprecava da iPhone uvecava stranicu pri kucanju
const style = document.createElement('style')
style.textContent = `
  polje-pretraga {
    display: flex;
    gap: 6px;
    left: 60px;
    position: absolute;
    right: 10px;
    top: calc(10px + var(--vrh));
    z-index: 1;
  }

  polje-pretraga input,
  polje-pretraga select {
    background: white;
    border: none;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    font: 16px system-ui, sans-serif;
    height: 40px;
    padding: 0 12px;
  }

  polje-pretraga input {
    flex: 1;
    min-width: 0;
  }

  @media (min-width: 600px) {
    polje-pretraga {
      left: auto;
      width: 400px;
    }
  }
`

const polja = ['title', 'name', 'author', 'year']

const kategorije = {
  '': 'All',
  kompleks: 'Complexes',
  spomenik: 'Monuments',
  groblje: 'Cemeteries',
  muzej: 'Museums',
}

const podrazumevanaKategorija = 'spomenik'

const praviTekst = spomenik => normalizuj(polja
  .map(polje => spomenik[polje] || '')
  .join(' ')
  .replace(/<[^>]*>/g, ''))

export default class Pretraga extends HTMLElement {
  constructor(stavke, callback) {
    super()
    this.polje = document.createElement('input')
    this.polje.id = 'pretraga'
    this.polje.placeholder = '🔍'
    this.kategorija = document.createElement('select')
    this.kategorija.title = 'Category'
    Object.entries(kategorije).forEach(([vrednost, naziv]) => this.kategorija.add(new Option(naziv, vrednost)))

    const pretrazi = () => this.pretrazi(stavke, callback)
    this.polje.addEventListener('input', pretrazi)
    this.kategorija.addEventListener('change', pretrazi)
  }

  connectedCallback() {
    this.append(style, this.polje, this.kategorija)
  }

  pretrazi(stavke, callback) {
    const fraza = normalizuj(this.polje.value)
    const kategorija = this.kategorija.value
    const filtrirano = stavke.filter(({spomenik}) =>
      (!kategorija || (spomenik.type || podrazumevanaKategorija) === kategorija) && praviTekst(spomenik).includes(fraza)
    )
    callback(filtrirano)
  }
}

customElements.define('polje-pretraga', Pretraga)
