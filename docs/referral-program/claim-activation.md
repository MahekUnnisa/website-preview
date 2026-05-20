# Partner Claims and Extension Sync Flow

This document details the end-to-end flow for the "Claims" feature, which handles activating partner rewards (e.g., from ZeroAI) and automatically logging the user into the Chrome extension.

## 1. Landing on the Claim Page
- **Path:** `/claim?token=<TOKEN>`
- **Component:** `src/pages/Claim.jsx`
- **Process:**
  - The user receives a reward email with a link containing a unique claim `token`.
  - Upon visiting the page, `Claim.jsx` extracts the `token` from the URL.
  - A background API call is made to `GET /partner-access/claim/status?token=<TOKEN>` to verify if the token is valid, active, or expired.
  - The UI updates to reflect the token's status (e.g., valid, expired, already activated).
  - If the token is valid, the user is presented with a "Continue with Google" button.

## 2. Google OAuth and Token Verification
- **Process:**
  - When the user clicks "Continue with Google", they are redirected to the API's OAuth endpoint: `GET /partner-access/login/google?state=claim_<TOKEN>`.
  - The backend handles the Google sign-in flow and verifies that the Google account matches the email that received the reward (or satisfies the claim conditions).
  - After successful authentication on the backend, the user is redirected back to the frontend's success page.
  - The redirect URL includes the result as a URL fragment (or query string fallback), for example: `/partner/success#token=<JWT>&error=<ERROR_CODE>`.

## 3. Partner Success Page & JWT Extraction
- **Path:** `/partner/success`
- **Component:** `src/pages/PartnerSuccess.jsx`
- **Process:**
  - `PartnerSuccess.jsx` mounts and reads the `token` (a JWT) and any `error` from the URL fragment (hash) or query string.
  - *Security Measure:* Immediately after reading the values, the app scrubs the sensitive JWT and error parameters from the address bar using `window.history.replaceState`.
  - If an error occurred (e.g., `email_mismatch` or `claim_expired`), the user is shown the relevant error message and prompted to try again.

## 4. Extension Detection and Polling
- **Process:**
  - If the user has a valid JWT, the application begins looking for the Chrome extension.
  - A polling mechanism starts (`setInterval` running every 2.5 seconds, up to 5 minutes).
  - It uses `chrome.runtime.sendMessage(extensionId, { type: 'PING' })` to check if the extension is installed and active.
  - Listeners for `visibilitychange` and `focus` are also attached to trigger detection instantly if the user installs the extension and switches back to the tab.
  - If the extension is **not** installed, the user is presented with an installation guide component (`ExtensionInstallGuide`) and prompted to install it from the Chrome Web Store.

## 5. Exchanging JWT for Sync Code
- **Process:**
  - Once the extension responds to the `PING` (indicating it is installed), the frontend prepares to sync the authentication state.
  - The app calls the backend to exchange the JWT for a short-lived sync code: `POST /partner-access/exchange-code` (with `Authorization: Bearer <JWT>`).
  - The API returns a short-lived `code`.

## 6. Syncing with the Chrome Extension
- **Process:**
  - The frontend sends the retrieved `code` directly to the Chrome extension via `chrome.runtime.sendMessage(extensionId, { type: 'SYNC', code: <CODE> })`.
  - The Chrome extension receives this message, consumes the `code` against the API to retrieve its own session/credentials, and responds with `{ ok: true }`.
  - Once the frontend receives confirmation (`ok: true`), the sync is considered complete.
  - A `sessionStorage` flag (`zeroai_partner_post_sync_tab`) is set so it doesn't open tabs multiple times, and a new tab (`/`) is automatically opened for the user to start using the extension and application right away.
