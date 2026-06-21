# Djen-Djen Travel — Website

Marketing & booking site for **Djen-Djen Travel** (وكالة جن جن للسياحة والأسفار),
a tourism agency in Jijel, Algeria, specialising in Omra & Hajj since 2017.

## Tech stack

Plain **HTML + CSS + JavaScript** — no build step, no dependencies.
Deploy by uploading the `website/` folder to any static host
(Netlify, Vercel, GitHub Pages, or classic cPanel hosting).

## Folder structure

```
website/
├── index.html          Homepage (bilingual FR/AR, fully responsive)
├── css/
│   ├── tokens.css      Design system: colors, type, spacing, radius (CSS variables)
│   └── styles.css      Components, layout, responsive rules, RTL mirroring
├── js/
│   └── main.js         Language switch, mobile nav, booking modal, form validation
├── assets/
│   └── logo.webp        ← ADD YOUR LOGO HERE (referenced by navbar + footer)
└── README.md
```

## ⚠️ Add the logo

Drop your logo file into `website/assets/logo.webp`.
The navbar and footer already reference it at that path.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
cd website
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Bilingual FR / AR

- Default language is **French (LTR)**. The **FR / ع** switch in the navbar flips
  to **Arabic (RTL)** — text, fonts, layout direction and line-height all change.
- The choice is remembered via `localStorage`.
- Translatable elements carry `data-fr` / `data-ar` attributes; placeholders use
  `data-ph-fr` / `data-ph-ar`. Numerals, prices and phone numbers are wrapped in
  `<bdi>` so they stay left-to-right inside Arabic lines.

## Design system (quick reference)

- **Blue leads** (`--blue-500 #1488C2`) — trust, calm, sky.
- **Gold** marks premium moments only (Hajj card, deposit box).
- **Red** is reserved for a single sharp CTA (Réserver / urgency badges).
- 8px spacing scale, soft radii (8/12/16/100px pill), 1180px max grid.
- Fonts: Cormorant Garamond + Manrope (Latin), Amiri + Tajawal (Arabic).

## Editing packages

Each offer is an `<article class="card">` block in `index.html`. Copy one to add
a package; update the title, nights, stars, price and `data-package` attribute.

## Next steps (not built yet)

Homepage only, per request. Future pages can reuse `tokens.css` + `styles.css`:
dedicated Omra / Hajj / About pages, a real booking backend, and a map embed.
