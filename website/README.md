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
├── index.html          Homepage (Omra packages + all request forms)
├── umrah.html          Omra page (details + Omra request form)
├── voyages.html        Voyages, billets, hôtels & visas (request forms)
├── apropos.html        À propos / من نحن (story, values, contact)
├── css/
│   ├── tokens.css      Design system: colors, type, spacing, radius (CSS variables)
│   └── styles.css      Components, layout, responsive rules, RTL mirroring
├── js/
│   ├── main.js         Language switch, mobile nav, booking modal
│   └── forms.js        Request-form tabs, validation & WhatsApp message builder
├── assets/
│   └── logo.webp        ← ADD YOUR LOGO HERE (referenced by navbar + footer)
└── README.md
```

## Request forms → WhatsApp

Each service (Omra, Voyages, Billets, Hôtels, Visas) has a form. The visitor
fills it, then chooses an office — **Bureau 1** or **Bureau 2** — and the
filled message opens in WhatsApp ready to send.

Office numbers live in one place, at the top of `js/forms.js`:

```js
var OFFICES = {
  "1": "213661417571",   // 0661 41 75 71
  "2": "213656281747"    // 0656 28 17 47
};
```

Edit those values to change the WhatsApp destinations (international format,
no `+`). Arabic uses classical Arabic for Omra and Algerian darija for the
other services.

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
