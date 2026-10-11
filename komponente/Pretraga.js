const css = `
  position: absolute;
  right: 10px;
  top: 4px;
  z-index: 1;
`

const polja = ['title', 'name', 'author', 'year']

const kategorije = {
  '': 'All',
  kompleks: 'Complexes',
  spomenik: 'Monuments',
  muzej: 'Museums',
}

const praviTekst = spomenik => polja
  .map(polje => spomenik[polje] || '')
  .join(' ')
  .replace(/<[^>]*>/g, '')
  .toLowerCase()

export default class Pretraga extends HTMLElement {
  constructor(stavke, callback) {
    super()
    this.style.cssText = css
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
    this.append(this.polje, this.kategorija)
  }

  pretrazi(stavke, callback) {
    const fraza = this.polje.value.toLowerCase()
    const kategorija = this.kategorija.value
    const filtrirano = stavke.filter(({spomenik}) =>
      (!kategorija || spomenik.type === kategorija) && praviTekst(spomenik).includes(fraza)
    )
    callback(filtrirano)
  }
}

customElements.define('polje-pretraga', Pretraga)
