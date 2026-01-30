## Security Audit Plan

## Phases & Status (Checklist)

- Phase 1 – Establish Node.js LTS compatibility
- Phase 2 – Security audit & vulnerability remediation
- Phase 3 – Dependency management best practices
- Phase 5 – CI/CD security enhancements
- Phase 6 – Documentation & maintenance

---

## Phase 1 – Establish Node.js LTS compatibility

**Goals**

- Standardize on a **single LTS Node.js major version** for local development, CI, and Docker.
- Ensure tooling (npm) versions are compatible and documented.

**Decisions**

- Use **Node.js 24.x (active LTS as of Jan 2026)** as the primary runtime.
- Use `node:lts-*` images in Docker which currently resolve to **Node 24.x**.

---

## Phase 2 – Security audit & vulnerability remediation

- Identify and remediate known vulnerabilities in npm dependencies.

---

## Phase 3 – Dependency management best practices

- Ensure reproducible, deterministic installs across local development, CI, and production.
- Maintain a clear separation between runtime dependencies and dev-only tooling.
- Use a versioning strategy that balances stability with timely security updates.

---

## Phase 5 – CI/CD security enhancements

- Make security checks (dependency audits, builds) part of every CI run.
- Ensure CI uses the supported Node.js LTS and npm versions defined for the project.
- Fail the pipeline on unresolved high/critical security issues so they cannot be deployed unnoticed.

---

## Phase 6 – Documentation & maintenance

- Keep Node.js/npm requirements and security posture clearly documented for contributors and operators.
- Provide a simple, documented path for reporting and triaging vulnerabilities.
- Regularly review and update security documentation and this plan as the stack or practices evolve.

---

## Security Review Cycles

Use this section to track recurring security work by cycle.

### Cycle 2026-01-29 (Completed)

**Infrastructure & dependencies**

- [x] Add `.nvmrc` and `.npmrc` to pin the Node.js LTS major version for local development.
- [x] Declare an `engines` field in `package.json` to require Node.js LTS in all environments.
- [x] Declare a minimum npm version in `engines` for consistent tooling.
- [x] Run `npm audit` and review the report.
- [x] Update dependencies with known security issues (especially build chain: Vite, PostCSS, Tailwind, Terser).
- [x] Re-run `npm audit` to confirm no remaining high/critical vulnerabilities.
- [x] Ensure a lock file (e.g. `package-lock.json`) is generated and committed.
- [x] Use `npm ci` in CI and Docker builds (already used in Dockerfile).
- [x] Review version ranges (`^` vs pinned) and tighten where appropriate.
- [x] Verify prod vs dev dependencies are properly classified.
- [x] Add `npm audit` (or similar) to the CI pipeline.
- [x] Enforce Node.js LTS version in CI.
- [x] Documented Node.js and npm version requirements in `README.md` prerequisites.
- [x] Updated `CONTRIBUTING.md` with Node/npm prerequisites and guidelines for dependency updates and security checks.
- [x] Added `SECURITY.md` describing how vulnerabilities are reported, supported versions, and regular review cadence.

**React & frontend security**

- [x] Ensured no `dangerouslySetInnerHTML`, `eval`, or unsafe hrefs; external links use `rel="noopener noreferrer"`.
- [x] Button and Card strip dangerous props (`dangerouslySetInnerHTML`, `suppressContentEditableWarning`, `suppressHydrationWarning`) before spreading onto native elements.
- [x] Confirmed no sensitive data in console; no PII logging in app.
- [x] Removed unused code: About and Contact pages, `components/index.js`, to reduce surface and keep routing explicit.
- [x] Added catch-all route and `NotFound` (404) page so undefined paths return a proper 404 instead of blank or incorrect content.

---

### Next Cycle (Planned)

Carry out the next security review when: a new major feature lands (e.g. auth, API, forms), dependencies are upgraded, or at least once per quarter—whichever comes first.

**Dependencies & supply chain**

- [ ] Run `npm audit` and `npm outdated`; address any new high/critical issues and review minor/patch updates.
- [ ] Confirm lock file is still committed and `npm ci` is used in Docker and CI.
- [ ] Re-check that Node/npm versions in `.nvmrc`, `package.json` engines, and CI match the chosen LTS.

**React & frontend**

- [ ] Re-run `SECURITY_CHECKLIST.md` (sections 1–10) after any new pages, components, or forms.
- [ ] If new forms or API calls are added: ensure input validation/sanitization, HTTPS, and consider rate limiting and CSRF (e.g. same-site cookies or tokens).
- [ ] If third-party scripts are added to `index.html`: consider Subresource Integrity (SRI).

**HTTP & deployment**

- [ ] Optionally tighten CSP: evaluate nonce-based `style-src` to remove `'unsafe-inline'` if feasible with the build setup.
- [ ] Optionally tighten Referrer-Policy (e.g. `strict-origin-when-cross-origin` or `no-referrer`) in `nginx/default.conf` if desired for privacy.
- [ ] Optionally run nginx as a non-root user in the Docker image if the base image supports it (defense in depth).
- [ ] Confirm security headers (CSP, HSTS, X-Frame-Options, etc.) are still present and correct in nginx config.

**CI/CD & ops**

- [ ] Confirm pipeline still validates required secrets and fails on missing vars.
- [ ] Ensure `npm audit` (or equivalent) remains in CI and that the pipeline fails on unresolved high/critical vulnerabilities if that policy is adopted.

**Documentation**

- [ ] Update this plan with a new “Cycle YYYY-MM-DD (Completed)” section and move “Next Cycle” items into it as they are done.
- [ ] Add new “Next Cycle” tasks for the following review period.
