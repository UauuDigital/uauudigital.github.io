# Configurador de Pressupostos UAUU

Aplicació web estàtica pensada per a GitHub Pages.

## Estructura

- `index.html`: redirect cap al configurador principal.
- `source/pressupostos-uauu/index.html`: pàgina principal del projecte.
- `source/pressupostos-uauu/scripts/`: lògica separada en fitxers.
- `source/pressupostos-uauu/styles.css`: maquetació i components.
- `build/pressupostos-uauu-standalone.html`: exportació d'un sol fitxer, si cal distribuir una versió empaquetada.
- `docs/adaptacio-menu-sense-gluten.pdf`: document de suport.

## On editar

### Configuració i dades
- **Preus i mínims**: `source/pressupostos-uauu/scripts/config/pricing.js`
- **Dades de les finques**: `source/pressupostos-uauu/scripts/config/venues.js`

### Lògica de negoci
- **Dades & Configuració**: `source/pressupostos-uauu/scripts/data.js` (preus, finques i funcions de càlcul)
- **Formatadors (EUR)**: `source/pressupostos-uauu/scripts/lib/formatters.js`
- **Generador PDF**: `source/pressupostos-uauu/scripts/lib/pdfGenerator.js`

### Utilitats i components
- **Utilitats d'entrada**: `source/pressupostos-uauu/scripts/utils/input.js`
- **Components UI**: `source/pressupostos-uauu/scripts/components/`
  - `GuestsControl.jsx` - Control de nombre de convidats
  - `VenueCards.jsx` - Selector de finques
  - `Toggle.jsx` - Botó de selecció
  - `DateInfoStrip.jsx` - Informació de data i preus
  - `ExtrasSection.jsx` - Secció de serveis addicionals
  - `SummaryPanel.jsx` - Panell de resum i exportació
- **App principal**: `source/pressupostos-uauu/scripts/App.jsx`

### Estils i recursos
- Shell principal: `source/pressupostos-uauu/index.html`
- Estils compartits: `source/pressupostos-uauu/colors_and_type.css`
- Estil de la interfície: `source/pressupostos-uauu/styles.css`
- Logos i imatges: `source/pressupostos-uauu/assets/`
- Tipografies: `source/pressupostos-uauu/fonts/`

## GitHub Pages

Si el repositori publica l'arrel, `index.html` redirigeix al configurador que viu a `source/pressupostos-uauu/index.html`. La resta de carpetes queden organitzades per separar publicació, documentació i font.

## Prova local

- `node serve.js`
- `node serve.js source/pressupostos-uauu`

## Web

Més informació: [www.uauu.cat](https://www.uauu.cat)
