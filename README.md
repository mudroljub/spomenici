# Spomenici

Yugoslav monuments map.

Visit: [mudroljub.github.io/spomenici](https://mudroljub.github.io/spomenici/)

[![](screen.png)](https://mudroljub.github.io/spomenici/)

## Development

Open `original.html` in the browser.

## Build

(build is not necessary but it is good for optimization)

```
npm install -g polymer-bundler
polymer-bundler --inline-scripts ulaz.html > izlaz.html
```

## TODO

- isprobati na telefonu
  - bug: kada nije omogucena lokacija na telefonu, ne radi lociranje, cak iako te browser pita i prihvatis
- dodati novu kategoriju spomen-groblje  
- utovariti podatke u bazu
- dodati pretragu
- dodati prijavu
- preci na open street maps
