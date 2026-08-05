# ZeroAI Website

Marketing and partner-onboarding site for **ZeroAI** — a Chrome assistant for notes, tasks, meetings, summaries, and quick web actions.

A static single-page app built with React and Tailwind CSS, bundled by Vite and hosted on **Cloudflare Pages**. There is no server, no API layer and no container — the build output in `dist/` is served directly as static files.

## Tech stack

- React 19.2.8 + React Router 8.3.0 (`BrowserRouter`, client-side routing)
- Vite 8.2.0 (Rolldown bundler)
- Tailwind CSS 4.3.3 via `@tailwindcss/vite` (CSS-first config, no PostCSS)
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
npm run dev                 # http://localhost:5173

# optional — only to point at a local API instead of production:
# cp .env.example .env.local
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

All config is **build-time**: Vite inlines `VITE_*` into the bundle, so changing a value requires a rebuild. None are secrets — every value is readable in the shipped JavaScript.

**All three are optional.** Each falls back to its production value in `src/lib/env.js`, so a build with nothing configured works against live infrastructure. Set them only to point a build elsewhere.

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Partner API base, used by `/claim` and `/partner/success`. Must include the version segment. | `https://api.zeroai.co.in/v2` |
| `VITE_EXTENSION_ID` | Target of `chrome.runtime.sendMessage` for one-click sync | the published extension ID |
| `VITE_CHROME_WEBSTORE_URL` | Install CTA target | the live store listing |

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

**Environment variables:** `NODE_VERSION=24.13.0` is required. The three `VITE_*` variables are optional — set them (for both Production *and* Preview) only to override the production defaults, for example to point a preview build at a staging API.

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
└── vite.config.js
```

## Theming

Tailwind v4 is configured in CSS, not JavaScript — there is no `tailwind.config.js`
and no `postcss.config.js`.

- Design tokens (purple/orange scales, `Hauora` font family, radius, keyframes):
  the `@theme` block in `src/styles/index.css`
- Shared component classes (`btn-primary`, `card-base`, …): `@utility` blocks in
  the same file
- Global styles: `src/styles/index.css`
- Theme colours: `src/styles/themes.css`

## Licence

ISC. Created by **Mahek Unnisa**.
