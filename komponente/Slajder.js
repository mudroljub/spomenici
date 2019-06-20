// koristi globalnu css var visina-slajdera, proslediti kao props
// proslediti slike preko atributa
const template = document.createElement('template')
const style = document.createElement('style')

style.textContent = `
  .okvir-slika {
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

  #slike {
    display: flex;
    overflow: hidden;
    transition: margin-left 0.4s ease;
  }

  #slike img {
    height: var(--visina-slajdera);
    cursor: all-scroll;
  }
`

template.innerHTML = `
  <div class="okvir-slika">
    <span class="strelica" id="strelica-leva">‹</span>
    <span class="strelica" id="strelica-desna">›</span>
    <div id="slike"></div>
  </div>
`

let dirnutX = 0
let pustenX = 0
let ucitaneSlike = false

class Slajder extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content)
    this.shadowRoot.appendChild(style)

    this.slike = this.shadowRoot.querySelector('#slike')
    this.strelicaLeva = this.shadowRoot.querySelector('#strelica-leva')
    this.strelicaDesna = this.shadowRoot.querySelector('#strelica-desna')

    this.mrdajDesno = this.mrdajDesno.bind(this)
    this.mrdajLevo = this.mrdajLevo.bind(this)
    this.slike.style.marginLeft = 0

    this.strelicaLeva.addEventListener('click', this.mrdajDesno)
    this.strelicaDesna.addEventListener('click', this.mrdajLevo)

    this.slike.addEventListener('touchstart', e => {
      dirnutX = e.changedTouches[0].screenX
    })

    this.slike.addEventListener('touchend', e => {
      pustenX = e.changedTouches[0].screenX
      this.mrdaj(pustenX > dirnutX)
    })

    this.slike.addEventListener('mousedown', e => {
      dirnutX = e.clientX
    })

    this.slike.addEventListener('mouseup', e => {
      pustenX = e.clientX
      this.mrdaj(pustenX > dirnutX)
    })
  }

  mrdaj(smer) {
    const korak = smer ? 200 : -200
    if (parseInt(this.slike.style.marginLeft) + korak > 0) return
    if (!ucitaneSlike)
      this.shadowRoot.querySelectorAll('#slike img').forEach(slika => slika.src = slika.dataset.src)
    this.slike.style.marginLeft = `${parseInt(this.slike.style.marginLeft) + korak}px`
    ucitaneSlike = true
  }

  mrdajDesno() {
    this.mrdaj(true)
  }

  mrdajLevo() {
    this.mrdaj(false)
  }
}

customElements.define('nav-slajder', Slajder)
