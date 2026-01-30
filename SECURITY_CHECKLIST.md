# Security Review Checklist

Use this checklist for security audits and before releases. Run it when adding features (auth, API, forms), changing dependencies, or updating deployment. Mark each item as you verify it.

---

## 1. React & Frontend Security

| ☐ | Item | Criteria |
|---|------|----------|
| | 1.1 | No `dangerouslySetInnerHTML`; no raw HTML injection from user or external data. |
| | 1.2 | No `eval()`, `new Function()`, or other dynamic code execution from user/external input. |
| | 1.3 | No `javascript:`, `data:`, or `vbscript:` in `href`; links use `https:`, `#`, or `mailto:` only. |
| | 1.4 | Every `<a target="_blank">` has `rel="noopener noreferrer"`. |
| | 1.5 | No open redirect: no user-controlled or URL-param–driven redirects. |
| | 1.6 | User input and external content are not rendered as HTML; use text or safe components only. |
| | 1.7 | Components that spread props onto native DOM elements strip dangerous props (e.g. `dangerouslySetInnerHTML`, `suppressContentEditableWarning`, `suppressHydrationWarning`) before spreading. |
| | 1.8 | No `console.log` or other console output of user data, PII, or secrets in production code. |
| | 1.9 | Client-side routes are defined explicitly; no user-controlled route or redirect from URL. |

---

## 2. Dependencies & Supply Chain

| ☐ | Item | Criteria |
|---|------|----------|
| | 2.1 | `npm audit` shows no high or critical vulnerabilities (or they are accepted and documented). |
| | 2.2 | Lock file (`package-lock.json`) is committed; `npm ci` is used in CI and Docker. |
| | 2.3 | Node and npm versions are pinned (e.g. `.nvmrc`, `engines` in `package.json`, `engine-strict=true` in `.npmrc`). |
| | 2.4 | Runtime deps in `dependencies`; build/tooling only in `devDependencies`. |
| | 2.5 | Version strategy is documented; dependency updates are reviewed periodically. |

---

## 3. Secrets & Configuration

| ☐ | Item | Criteria |
|---|------|----------|
| | 3.1 | No API keys, tokens, or secrets in source or config files. |
| | 3.2 | CI/CD uses pipeline or environment variables for secrets; required vars are validated before use. |
| | 3.3 | `.env` and `.env.*` are in `.gitignore` and `.dockerignore` (or equivalent). |
| | 3.4 | Secrets are not logged or echoed (e.g. use `--password-stdin` for login). |

---

## 4. HTTP & Security Headers (Nginx)

| ☐ | Item | Criteria |
|---|------|----------|
| | 4.1 | `X-Content-Type-Options: nosniff` is set. |
| | 4.2 | `X-Frame-Options: DENY` (or equivalent) is set. |
| | 4.3 | `X-XSS-Protection: 1; mode=block` is set (legacy; optional but harmless). |
| | 4.4 | `Strict-Transport-Security` (HSTS) is set with appropriate `max-age` and options. |
| | 4.5 | `Content-Security-Policy` is set; `default-src`, `script-src`, and `frame-ancestors` are restrictive. |
| | 4.6 | If `style-src` includes `'unsafe-inline'`, document why; consider nonce-based CSP when feasible. |
| | 4.7 | `Referrer-Policy` is set; tighten (e.g. `strict-origin-when-cross-origin`) if privacy is a concern. |

---

## 5. Build & Dev Server

| ☐ | Item | Criteria |
|---|------|----------|
| | 5.1 | Production build does not emit source maps (or they are not served in prod). |
| | 5.2 | Dev server is not used as production server; `host: true` (or similar) is dev-only. |
| | 5.3 | Production build is minified. |

---

## 6. Docker & Runtime

| ☐ | Item | Criteria |
|---|------|----------|
| | 6.1 | Multi-stage build is used; final image does not contain build tools or source. |
| | 6.2 | `.dockerignore` excludes `.env`, `.git`, and unneeded files. |
| | 6.3 | File permissions in the image are restrictive (e.g. 755 dirs, 644 files). |
| | 6.4 | Optional: Runtime runs as non-root user where supported. |

---

## 7. Forms & Data Handling

| ☐ | Item | Criteria |
|---|------|----------|
| | 7.1 | If forms submit to a backend: input is validated and sanitized; HTTPS is used; consider rate limiting and CSRF protection. |
| | 7.2 | No secrets or tokens stored in client state without secure handling (e.g. httpOnly cookies for session). |

---

## 8. HTML & Static Assets

| ☐ | Item | Criteria |
|---|------|----------|
| | 8.1 | No inline scripts or inline event handlers in `index.html`; scripts loaded via safe attributes. |
| | 8.2 | If third-party scripts are loaded, Subresource Integrity (SRI) is used where possible. |
| | 8.3 | Web manifest (if present) has no sensitive or misleading metadata. |

---

## 9. CI/CD

| ☐ | Item | Criteria |
|---|------|----------|
| | 9.1 | Pipeline validates required secrets/variables and fails fast if missing. |
| | 9.2 | No secrets in plaintext in pipeline config or logs. |
| | 9.3 | Dependency audit (e.g. `npm audit`) runs in CI; policy on failing for high/critical is defined and followed. |

---

## 10. Documentation & Maintenance

| ☐ | Item | Criteria |
|---|------|----------|
| | 10.1 | Security audit plan (e.g. `SECURITY_AUDIT_PLAN.md`) exists and is updated with review cycles. |
| | 10.2 | `SECURITY.md` (or equivalent) exists with supported versions and how to report vulnerabilities. |

---

*After each review, record results and next steps in `SECURITY_AUDIT_PLAN.md`.*
