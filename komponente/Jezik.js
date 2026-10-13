import {jezik, promeniJezik} from '../utils/jezik.js'

// dugme pokazuje jezik na koji se prelazi
class Jezik extends HTMLElement {
  connectedCallback() {
    const drugi = jezik === 'sh' ? 'en' : 'sh'
    this.innerHTML = `
      <style>
        #jezik {
          border: 0;
          color: #822323;
          font: bold 12px system-ui, sans-serif;
          height: 32px;
          left: 10px;
          padding: 0;
          top: calc(134px + var(--vrh));
        }
      </style>
      <button class="ikonica" id="jezik" title="${drugi === 'sh' ? 'Srpskohrvatski' : 'English'}">${drugi.toUpperCase()}</button>
    `
    this.querySelector('button').addEventListener('click', () => promeniJezik(drugi))
  }
}

customElements.define('dugme-jezik', Jezik)
