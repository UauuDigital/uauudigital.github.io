# Configurador de Pressupostos UAUU

Aplicació web estàtica pensada per a GitHub Pages.

## Estructura

- `index.html`: pàgina publicada a GitHub Pages.
- `source/pressupostos-uauu/`: codi font editable i recursos del projecte.
- `build/pressupostos-uauu-standalone.html`: exportació d'un sol fitxer.
- `docs/adaptacio-menu-sense-gluten.pdf`: document de suport.

## On editar

- Lògica i interfície principal: `source/pressupostos-uauu/index.html`
- Estils compartits: `source/pressupostos-uauu/colors_and_type.css`
- Component de proves: `source/pressupostos-uauu/tweaks-panel.jsx`
- Logos i imatges: `source/pressupostos-uauu/assets/`
- Tipografies: `source/pressupostos-uauu/fonts/`
- Fitxers penjats o captures: `source/pressupostos-uauu/uploads/`

## GitHub Pages

Si el repositori publica l'arrel, cal mantenir `index.html` al nivell principal. La resta de carpetes queden organitzades per separar publicació, documentació i font.

## Prova local

- `node serve.js`
- `node serve.js source/pressupostos-uauu`

## Web

Més informació: [www.uauu.cat](https://www.uauu.cat)
