// Leaflet se učitava kao skripta (lib/leaflet/leaflet.js), bez svojih tipova.
declare const L: any

// skraćenica iz utils/helpers.js: element.on(...) je element.addEventListener(...)
interface Element {
  on: Element['addEventListener']
  // u aplikaciji su svi elementi HTML, pa pretraga podrazumevano vraća HTMLElement
  closest<E extends Element = HTMLElement>(selectors: string): E | null
}

interface ParentNode {
  querySelector<E extends Element = HTMLElement>(selectors: string): E | null
  querySelectorAll<E extends Element = HTMLElement>(selectors: string): NodeListOf<E>
}
