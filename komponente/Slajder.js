// TODO: proslediti visina-slajdera kao props
const style = document.createElement('style')

let dirnutX = 0
let pustenX = 0
const paketSlika = window.innerWidth / 60

style.textContent = `
  :host {
    align-items: center;
    bottom: 0;
    display: flex;
    position: fixed;
    width: 100%;
  }

  span {
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

  div {
    display: flex;
    overflow: hidden;
    transition: margin-left 0.4s ease;
  }

  div img {
    height: var(--visina-slajdera);
    cursor: all-scroll;
  }
`

export default class Slajder extends HTMLElement {
  constructor(slike) {
    super()
    this.slike = slike

    this.strelicaLeva = document.createElement('span')
    this.strelicaLeva.innerText = '‹'
    this.strelicaDesna = document.createElement('span')
    this.strelicaDesna.innerText = '›'
    this.strelicaDesna.id = 'strelica-desna'
    this.traka = document.createElement('div')

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(this.strelicaLeva)
    this.shadowRoot.appendChild(this.strelicaDesna)
    this.shadowRoot.appendChild(this.traka)
    this.shadowRoot.appendChild(style)

    this.traka.style.marginLeft = 0 // pocetni polozaj
    this.dodajDogadjaje()
  }

  connectedCallback() {
    this.dodajSlikeAkoTreba()
  }

  dodajDogadjaje() {
    this.mrdajAkoTreba = this.mrdajAkoTreba.bind(this)
    this.mrdajDesno = this.mrdajDesno.bind(this)
    this.mrdajLevo = this.mrdajLevo.bind(this)

    this.strelicaLeva.addEventListener('click', this.mrdajDesno)
    this.strelicaDesna.addEventListener('click', this.mrdajLevo)

    this.traka.addEventListener('touchstart', e => dirnutX = e.changedTouches[0].screenX)
    this.traka.addEventListener('mousedown', e => dirnutX = e.clientX)
    this.traka.addEventListener('touchend', this.mrdajAkoTreba)
    this.traka.addEventListener('mouseup', this.mrdajAkoTreba)
  }

  dodajSlikeAkoTreba() {
    const brojUnetihSlika = this.traka.querySelectorAll('img').length
    if (brojUnetihSlika == this.slike.length) return
    this.slike.forEach((slika, i) => {
      if (i < brojUnetihSlika + paketSlika) this.traka.appendChild(slika)
    })
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
    this.dodajSlikeAkoTreba()
    this.mrdaj(false)
  }
}

customElements.define('nav-slajder', Slajder)
