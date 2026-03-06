# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm start          # Start local dev server (hot reload)
npm run build      # Build static output to /build
npm run serve      # Serve the built site locally
npm run clear      # Clear Docusaurus cache
```

## Architecture

This is a personal portfolio built with **Docusaurus 3.7** (React-based static site generator).

Key configuration:
- `docusaurus.config.js` — site config, navbar, footer, i18n (en + pt-br)
- `sidebars.json` — sidebar structure (loaded via `sidebars.js`); add new doc IDs here to make them appear in the nav
- `src/css/custom.css` — global CSS overrides using Infima CSS variables

Content structure:
- `docs/` — documentation pages; the docs section is mounted at `/` (root) via `routeBasePath: '/'`
- `blog/` — blog posts; authors defined in `blog/authors.yml`, tags in `blog/tags.yml`
- `static/` — static assets served as-is (images, favicon, etc.)

## Deployment

Two CI/CD workflows run on push to `main`:
- `.github/workflows/deploy.yml` — deploys to GitHub Pages (`deflaimun.github.io`)
- `.github/workflows/deploy-cf.yml` — deploys to Cloudflare Pages (project: `my-docusaurus`); requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets

## Adding Content

- **New doc page**: create a `.md` file in `docs/`, then add its ID to `sidebars.json` under `tutorialSidebar`
- **New blog post**: create a `.md` file in `blog/` with a date-prefixed filename (e.g., `2025-06-01-title.md`)
- `onBrokenLinks` is set to `throw` — broken internal links will fail the build
