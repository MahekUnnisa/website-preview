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

### Latest Cycle – 2026-01-29
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
