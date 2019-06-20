// koristi globalnu css var visina-slajdera, proslediti kao props

class Slajder extends HTMLElement {
  // constructor() {
  //   super()
  //   this.addEventListener('click', this.obrniSlajder)
  // }

  connectedCallback() {
    this.innerHTML = `
      <style>
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
      </style>
      <div class="okvir-slika">
        <span class="strelica" id="strelica-leva">‹</span>
        <span class="strelica" id="strelica-desna">›</span>
        <div id="slike"></div>
      </div>
    `
  }
}

customElements.define('nav-slajder', Slajder)
