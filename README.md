# Configurador de Pressupostos UAUU

Aplicació web estàtica pensada per a GitHub Pages.

## Estructura

- `index.html`: redirect cap al configurador principal.
- `source/pressupostos-uauu/index.html`: pàgina principal del projecte.
- `source/pressupostos-uauu/scripts/`: lògica separada en fitxers.
- `source/pressupostos-uauu/styles.css`: maquetació i components.
- `build/pressupostos-uauu-standalone.html`: exportació d'un sol fitxer.
- `docs/adaptacio-menu-sense-gluten.pdf`: document de suport.

## On editar

- Shell principal: `source/pressupostos-uauu/index.html`
- Dades i càlcul: `source/pressupostos-uauu/scripts/data.js`
- Components i app: `source/pressupostos-uauu/scripts/ui.jsx`
- Estils compartits: `source/pressupostos-uauu/colors_and_type.css`
- Estil de la interfície: `source/pressupostos-uauu/styles.css`
- Component de proves: `source/pressupostos-uauu/tweaks-panel.jsx`
- Logos i imatges: `source/pressupostos-uauu/assets/`
- Tipografies: `source/pressupostos-uauu/fonts/`
- Fitxers penjats o captures: `source/pressupostos-uauu/uploads/`

## GitHub Pages

Si el repositori publica l'arrel, `index.html` redirigeix al configurador que viu a `source/pressupostos-uauu/index.html`. La resta de carpetes queden organitzades per separar publicació, documentació i font.

## Prova local

- `node serve.js`
- `node serve.js source/pressupostos-uauu`

## Web

Més informació: [www.uauu.cat](https://www.uauu.cat)
