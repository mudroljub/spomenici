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
polymer-bundler --inline-scripts original.html > index.html
```

## TODO

- ukloniti data atribut nakon dodele slike
- prevesti url slike u base64 https://stackoverflow.com/questions/17124053/node-js-get-image-from-web-and-encode-with-base64
- utovariti podatke u bazu
- bug: kada nije omogucena lokacija na telefonu, ne radi lociranje, cak iako te browser pita i prihvatis
- url routes for monuments
