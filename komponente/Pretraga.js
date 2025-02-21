const css = `
  position: absolute;
  right: 10px;
  top: 4px;
  z-index: 1;
`

const containsText = (obj, txt) => 
  Object.values(obj).some(value => 
      typeof value === "string" && value.toLowerCase().includes(txt.toLowerCase())
  )

export default class Pretraga extends HTMLInputElement {
  constructor(spomenici, callback) {
    super()
    this.id = 'pretraga'
    this.placeholder = '🔍'
    this.style.cssText = css
    this.addEventListener('input', e => this.pretrazi(e, spomenici, callback))
  }

  pretrazi(e, spomenici, callback) {
    const fraza = e.target.value
    const filtrirano = spomenici.filter(obj => containsText(obj, fraza))
    callback(filtrirano)
  }
}

customElements.define('polje-pretraga', Pretraga, { extends: 'input' })
