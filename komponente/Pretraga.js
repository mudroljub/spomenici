const css = `
  position: absolute;
  right: 10px;
  top: 4px;
  z-index: 1;
`

export default class Pretraga extends HTMLInputElement {

  constructor(spomenici, callback) {
    super()
    this.id = 'pretraga'
    this.placeholder = '🔍'
    this.style.cssText = css
    this.addEventListener('input', e => this.pretrazi(e, spomenici, callback))
  }

  pretrazi(e, spomenici, callback) {
    const fraza = e.target.value.toLowerCase()
    if (fraza.length < 1) return
    const filtrirano = spomenici.filter(x =>
      x.naslov.toLowerCase().includes(fraza) ||
      (x.opis && x.opis.toLowerCase().includes(fraza))
    )
    callback(filtrirano)
  }
}

customElements.define('polje-pretraga', Pretraga, { extends: 'input' })
