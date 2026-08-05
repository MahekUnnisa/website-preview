# ZeroAI Website

Marketing and partner-onboarding site for **ZeroAI** — a Chrome assistant for notes, tasks, meetings, summaries, and quick web actions.

A static single-page app built with React and Tailwind CSS, bundled by Vite and hosted on **Cloudflare Pages**. There is no server, no API layer and no container — the build output in `dist/` is served directly as static files.

## Tech stack

- React 19.2.8 + React Router DOM 7.18.2 (`BrowserRouter`, client-side routing)
- Vite 8.2.0 (Rolldown bundler)
- Tailwind CSS 3.4.19 + PostCSS + Autoprefixer
- Node.js 24.13.0 (pinned via `.nvmrc` / `.node-version`)

## Pages

| Route | Component |
| --- | --- |
| `/` | Home |
| `/slack` | SlackLanding |
| `/support` | Support |
| `/claim` | Claim — partner access claim, starts Google OAuth |
| `/partner/success` | PartnerSuccess — OAuth return, syncs token to the extension |
| `/partner/success/demo` | PartnerSuccessDemo |
| `/privacy` | Privacy |
| `/terms` | Terms |
| `/about` | About |
| `*` | NotFound |

The partner claim flow is specified in [`docs/referral-program/claim-activation.md`](docs/referral-program/claim-activation.md).

## Local development

```bash
nvm use                     # Node 24.13.0, per .nvmrc
npm ci
cp .env.example .env.local  # then fill in VITE_API_BASE_URL
npm run dev                 # http://localhost:5173
```

### Scripts

- `npm run dev` — dev server on port 5173
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the build on port 4173

Both ports are pinned with `strictPort` in `vite.config.js`, so a clash fails
loudly rather than drifting to another port — the dev origin has to match the
API's CORS allowlist and the Google OAuth redirect URI. Port 3000 is left free
for the local API.

> `npm run preview` does **not** apply `_headers` or `_redirects`. To test those (SPA deep links, security headers) exactly as Cloudflare serves them:
> ```bash
> npm run build && npx wrangler pages dev dist
> ```

## Environment variables

All config is **build-time**: Vite inlines `VITE_*` into the bundle, so changing a value requires a rebuild. See `.env.example` for the full list.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Partner API base URL used by `/claim` and `/partner/success` |
| `VITE_EXTENSION_ID` | Chrome extension ID, for one-click sync from `/partner/success` |
| `VITE_CHROME_WEBSTORE_URL` | Install CTA target (optional; defaults to the live listing) |

Locally these come from `.env.local`. In production they are set in the Cloudflare Pages project settings.

## Deployment — Cloudflare Pages

Pushing to the production branch triggers a build via the Cloudflare Pages Git integration. No CI config lives in this repo.

**Project settings:**

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | `/` |
| Production branch | `master` |

**Environment variables** (set for both Production *and* Preview): `NODE_VERSION=24.13.0`, `VITE_API_BASE_URL`, `VITE_EXTENSION_ID`, `VITE_CHROME_WEBSTORE_URL`.

### Routing and headers

Two files in `public/` are copied verbatim into `dist/` and read by Cloudflare Pages:

- **`public/_redirects`** — `/* /index.html 200`. Required so deep links like `/partner/success/demo` resolve instead of 404ing. The `200` rewrite preserves the query string and hash fragment that `/partner/success` reads the OAuth token from.
- **`public/_headers`** — security headers (CSP, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy`) and cache policy. Content-hashed JS/CSS and fonts are immutable for a year; unhashed favicons are capped at a day.

Compression is handled by Cloudflare and needs no configuration.

### Origin allowlists

The site's origin is allowlisted in three places outside this repo. All must include the production domain (and any `*.pages.dev` preview origin used for testing), or the partner claim flow breaks:

1. Partner API **CORS** allowlist
2. **Google OAuth** authorised redirect URIs
3. Chrome extension `externally_connectable.matches` (`chrome.runtime.sendMessage` silently no-ops from an unlisted origin)

## Project structure

```
zeroai-website/
├── docs/referral-program/claim-activation.md
├── public/
│   ├── _headers            # Cloudflare Pages response headers
│   ├── _redirects          # Cloudflare Pages SPA fallback
│   ├── assets/icons/       # favicons, webmanifest
│   └── fonts/Hauora/
├── src/
│   ├── components/         # Navbar, Footer, Button, Card, ...
│   ├── lib/env.js          # VITE_* accessors
│   ├── pages/
│   ├── styles/             # index.css, themes.css, fonts.css
│   ├── App.jsx
│   └── index.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Theming

- Global styles: `src/styles/index.css`
- Theme colours: `src/styles/themes.css`
- Tailwind config (custom purple scale, `Hauora` font family, keyframes): `tailwind.config.js`

## Licence

ISC. Created by **Mahek Unnisa**.
