const css = `
  position: absolute;
  right: 10px;
  top: 4px;
  z-index: 1;
`

const polja = ['title', 'name', 'author', 'year']

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
    this.polje.addEventListener('input', e => this.pretrazi(e, stavke, callback))
  }

  connectedCallback() {
    this.appendChild(this.polje)
  }

  pretrazi(e, stavke, callback) {
    const fraza = e.target.value.toLowerCase()
    const filtrirano = stavke.filter(({spomenik}) => praviTekst(spomenik).includes(fraza))
    callback(filtrirano)
  }
}

customElements.define('polje-pretraga', Pretraga)
