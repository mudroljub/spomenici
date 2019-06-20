class PunekranDugme extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('click', this.obrniPunEkran)
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        #ikonica {
          top: 10px;
          left: 10px;
          background: white;
          padding: 4px;
        }
      </style>
      <img src="slike/punekran.svg" class="ikonica" id="ikonica" width="32" alt="pun ekran" title="Full screen">
    `
  }

  obrniPunEkran() {
    if (!document.fullscreenElement) document.body.requestFullscreen()
    else document.exitFullscreen()
  }
}

customElements.define('punekran-dugme', PunekranDugme)
