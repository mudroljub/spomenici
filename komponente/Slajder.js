// TODO: proslediti visina-slajdera kao props
const template = document.createElement('template')
const style = document.createElement('style')

let dirnutX = 0
let pustenX = 0
let ucitaneSlike = false

style.textContent = `
  .okvir {
    align-items: center;
    bottom: 0;
    display: flex;
    position: fixed;
    width: 100%;
  }

  .strelica {
    -moz-user-select: none;
    color: #fff;
    cursor: pointer;
    font-size: calc(var(--visina-slajdera) * 1.6);
    padding: 0 8px;
    position: absolute;
    text-shadow: 2px 2px #000;
    user-select: none;
  }

  #strelica-desna {
    right: 0;
  }

  #traka {
    display: flex;
    overflow: hidden;
    transition: margin-left 0.4s ease;
  }

  #traka img {
    height: var(--visina-slajdera);
    cursor: all-scroll;
  }
`

template.innerHTML = `
  <div class="okvir">
    <span class="strelica" id="strelica-leva">‹</span>
    <span class="strelica" id="strelica-desna">›</span>
    <div id="traka"></div>
  </div>
`

export default class Slajder extends HTMLElement {
  constructor(slike) {
    super()
    this.slike = slike

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content)
    this.shadowRoot.appendChild(style)

    this.mrdajAkoTreba = this.mrdajAkoTreba.bind(this)
    this.mrdajDesno = this.mrdajDesno.bind(this)
    this.mrdajLevo = this.mrdajLevo.bind(this)
  }

  connectedCallback() {
    this.traka = this.shadowRoot.querySelector('#traka')
    this.strelicaLeva = this.shadowRoot.querySelector('#strelica-leva')
    this.strelicaDesna = this.shadowRoot.querySelector('#strelica-desna')

    this.traka.style.marginLeft = 0
    this.slike.forEach(slika => this.traka.appendChild(slika))
  
    this.strelicaLeva.addEventListener('click', this.mrdajDesno)
    this.strelicaDesna.addEventListener('click', this.mrdajLevo)

    this.traka.addEventListener('touchstart', e => dirnutX = e.changedTouches[0].screenX)
    this.traka.addEventListener('mousedown', e => dirnutX = e.clientX)

    this.traka.addEventListener('touchend', this.mrdajAkoTreba)
    this.traka.addEventListener('mouseup', this.mrdajAkoTreba)
  }

  ucitajAkoTreba() {
    if (ucitaneSlike) return
    this.traka.querySelectorAll('img').forEach(slika => slika.dodeliIzvor())
    ucitaneSlike = true
  }

  mrdaj(smer) {
    const korak = smer ? 200 : -200
    if (parseInt(this.traka.style.marginLeft) + korak > 0) return
    this.traka.style.marginLeft = `${parseInt(this.traka.style.marginLeft) + korak}px`
  }

  mrdajAkoTreba(e) {
    pustenX = e.clientX || e.changedTouches[0].screenX
    if (pustenX == dirnutX) return
    this.mrdaj(pustenX > dirnutX)
  }

  mrdajDesno() {
    this.mrdaj(true)
  }

  mrdajLevo() {
    this.ucitajAkoTreba()
    this.mrdaj(false)
  }
}

customElements.define('nav-slajder', Slajder)
