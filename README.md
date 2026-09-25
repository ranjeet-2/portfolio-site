# Ranjeet Gupta — Geospatial AI Portfolio

An interactive personal portfolio presenting research, internships, coursework, leadership and achievements across geospatial engineering, remote sensing, computer vision and quantitative research.

## Highlights

- Detailed project workflows with mathematical and conceptual explanations
- Interactive figures, evidence galleries and responsive navigation
- Case studies covering GeoAI, Sentinel-1 flood mapping, photogrammetry, satellite QA/QC and practical coursework
- Responsive static website built with HTML, CSS and JavaScript

## Project structure

```text
dist/
├── assets/       Project figures and profile media
├── index.html    Website content and structure
├── styles.css    Responsive visual design
├── script.js     Navigation, search and theme behaviour
└── visuals.js    Interactive diagrams and galleries
```

## Run locally

Serve the `dist` directory with any static web server. For example:

```bash
python -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Deployment

For Cloudflare Pages, connect this repository and use:

- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `dist`

Every future push to `main` can automatically publish the latest website version.
