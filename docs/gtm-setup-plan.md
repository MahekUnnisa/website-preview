# ZeroAI GTM setup plan

Track progress here while setting up Google Tag Manager for funnel measurement and retargeting (Meta + Reddit now; GA4/Google Ads as needed).

**GTM container:** `GTM-N2WMKH9C`  
**Site snippet:** already in `index.html` + `public/gtm.js`  
**Status:** nothing configured in the GTM UI yet; `useAnalytics` is still a stub (events do not reach `dataLayer`).

---

## Goals

- [ ] Measure the full onboarding funnel (signup → Slack → Slack open → Chrome Web Store)
- [ ] Retarget drifted users at every drop-off
- [ ] Load Meta + Reddit (and later Google) **only via GTM** — never hardcode pixels in the app

**Primary ad wins:** Slack connected · Extension install click (Web Store)  
**Main entry paths:** `/get-started`, `/onboard` (rarely `/slack`)  
**Slack:** required  
**Extension:** Web Store click is enough (no confirmed install required)  
**Consent banner:** skip for now  
**Retargeting window:** undecided — start with 14d mid-funnel / 30d “started, no signup”

---

## Mental model

```
User action on site
      ↓
dataLayer.push({ event: '…' })
      ↓
GTM hears the event
      ↓
GTM tells Meta + Reddit (+ GA4 / Google Ads)
      ↓
Audiences: “did X but not Y” → retarget
```

| Layer | Job |
|-------|-----|
| Code | What happened (events) |
| GTM | Who gets told (tags) and when (triggers) |
| Ads platforms | Audiences + campaigns |

New pixel later = new GTM tag only. New user action = code event + GTM trigger/tag.

---

## Phase 0 — Accounts

| Account | Have it? | Notes |
|---------|----------|-------|
| GTM `GTM-N2WMKH9C` | Yes | Hub |
| Meta Pixel ID | Yes | Paste into GTM when tagging |
| Reddit Pixel ID | Yes | Paste into GTM when tagging |
| GA4 (`G-XXXX`) | [ ] Create | Funnels + drop-off reports; link to Google Ads later |
| Google Ads | [ ] When buying | Import conversions from GA4 |

- [ ] Create GA4 property and save Measurement ID here: `G-________`
- [ ] Confirm Meta Pixel ID is handy: `________________`
- [ ] Confirm Reddit Pixel ID is handy: `________________`

---

## Phase 1 — Event names (freeze these)

Do not rename after code + GTM are live.

| # | Event name | When | Priority |
|---|------------|------|----------|
| 1 | `onboarding_started` | Land on `/get-started` or `/onboard` | Required |
| 2 | `signup_started` | Click Google sign-in | Required |
| 3 | `signup_success` | Google signup worked | Required |
| 4 | `slack_connect_started` | Start Slack OAuth | Required |
| 5 | `slack_connect_success` | Slack connected | **Win A** |
| 6 | `slack_open_clicked` | Open Slack from All Set | Required |
| 7 | `extension_install_clicked` | Open Chrome Web Store | **Win B** |
| 8 | `onboarding_completed` | Thank-you / All Set complete | Required |
| — | `cta_get_started_click` | Homepage / marketing CTA | Optional later |

Drop-offs are **not** separate events. Measure as: had earlier event, missing later event.

- [x] Event list agreed (no renames without updating code + GTM + ads)

---

## Phase 2 — Code (`dataLayer`)

Until this ships, GTM only sees page loads — not Slack or Web Store.

- [x] Wire `useAnalytics` → `window.dataLayer.push({ event, … })`
- [x] Expand `src/data/static/analytics-events.ts` with the names above
- [x] Fire `onboarding_started` on `/get-started` and `/onboard`
- [x] Fire `signup_started` / `signup_success` (and failure if easy)
- [x] Fire `slack_connect_started` / `slack_connect_success`
- [x] Fire `slack_open_clicked` from All Set handoff
- [x] Fire `extension_install_clicked` on Web Store CTA
- [x] Keep / fix `onboarding_completed` (currently stubbed)
- [x] SPA: History Change in GTM **or** `virtual_page_view` on route change
- [x] Guard against double-fires (React Strict Mode / session flag on signup)

**Implemented in:** `src/lib/analytics.ts`, `src/hooks/useAnalytics.ts`, onboarding + landing call sites.

**Suggested payload shape:**

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'slack_connect_success',
  event_category: 'onboarding',
  entry: 'get-started', // or 'onboard'
  workspace: 'slack',
});
```

---

## Phase 3 — GTM UI setup

Work in [tagmanager.google.com](https://tagmanager.google.com). Base pixels + custom event triggers are in progress in the GTM UI.

### Step 1 — Base tags (every page)

- [x] GA4 Google Tag → `G-XXXX` → trigger: All Pages
- [x] Meta Pixel base (PageView) → Pixel ID → All Pages
- [ ] Reddit Pixel base → Pixel ID → All Pages
- [ ] Preview on live/staging site — PageView fires
- [ ] Publish version: `v1-base-pixels`

### Step 2 — Custom Event triggers

One trigger per event (Event name = exact string):

- [x] `CE - onboarding_started`
- [x] `CE - signup_started`
- [x] `CE - signup_success`
- [x] `CE - slack_connect_started`
- [x] `CE - slack_connect_success`
- [x] `CE - slack_open_clicked`
- [x] `CE - extension_install_clicked`
- [x] `CE - onboarding_completed`

### Step 3 — Event tags (start with 3, then rest)

**First wave (ship these first):**

- [ ] `signup_success` → GA4 Event + Meta (`CompleteRegistration`) + Reddit
- [ ] `slack_connect_success` → GA4 + Meta (custom `SlackConnect` or `Subscribe`) + Reddit
- [ ] `extension_install_clicked` → GA4 + Meta (custom `ExtensionInstallClick`) + Reddit

**Second wave:**

- [ ] `onboarding_started` → GA4 + Meta (`Lead`) + Reddit
- [ ] `signup_started`
- [ ] `slack_connect_started`
- [ ] `slack_open_clicked`
- [ ] `onboarding_completed`

### Step 4 — SPA page views

- [x] Code already pushes `virtual_page_view` on route change (`ScrollManager`)
- [ ] GTM: Custom Event trigger `CE - virtual_page_view`
- [ ] Fire GA4 / Meta / Reddit page view on that trigger (GA4 alone is enough at first)
- [ ] Confirm `/` → `/get-started` counts as a new view

### Step 5 — Verify & publish

- [ ] GTM Preview: full journey get-started → Google → Slack → Web Store
- [ ] Each custom event appears in the left panel
- [ ] Matching Meta / Reddit / GA4 tags fire
- [ ] GA4 DebugView shows events
- [ ] Meta Pixel Helper shows PageView + conversions
- [ ] Reddit debugger / network shows pixel hits
- [ ] Publish version: `v2-conversion-events`

---

## Phase 4 — Funnel + retargeting audiences

### GA4 funnel

Explore → Funnel exploration, steps in order:

1. `onboarding_started`
2. `signup_success`
3. `slack_connect_success`
4. `slack_open_clicked`
5. `extension_install_clicked`

- [ ] Funnel report saved / bookmarked

### Meta Custom Audiences

| Audience | Include | Exclude | Window | Done |
|----------|---------|---------|--------|------|
| No signup | `onboarding_started` | `signup_success` | 30d (start) | [ ] |
| No Slack | `signup_success` | `slack_connect_success` | 14d | [ ] |
| No Slack open | `slack_connect_success` | `slack_open_clicked` | 14d | [ ] |
| No extension | `slack_connect_success` or `onboarding_completed` | `extension_install_clicked` | 14d | [ ] |
| Converters (exclude from cold) | `slack_connect_success` OR `extension_install_clicked` | — | 180d | [ ] |

### Reddit audiences

- [ ] Mirror the same include/exclude audiences in Reddit

### Google Ads (when ready)

- [ ] Link GA4 ↔ Google Ads
- [ ] Import `slack_connect_success` + `extension_install_clicked` as conversions
- [ ] Sync remarketing audiences

---

## Phase 5 — Turn on ads

- [ ] Meta retargeting campaigns using drift audiences
- [ ] Optimize toward Slack connect / extension click once volume is enough (~50+/week comfort zone)
- [ ] Reddit campaigns on same events/audiences
- [ ] Exclude converters from cold/prospecting campaigns
- [ ] Google Ads when budget allocates

---

## Suggested order this week

1. [x] Phase 0 — create GA4; note all IDs above *(GA4 + Meta in GTM; Reddit still pending)*
2. [x] Phase 3 Step 1 — base pixels (GA4 + Meta All Pages done; Reddit optional)
3. [x] Phase 1 — lock event names
4. [x] Phase 2 — implement `dataLayer` in the site
5. [ ] Phase 3 Steps 3–5 — event tags → Preview journey → `v2-conversion-events` *(Step 2 triggers done)*
6. [ ] Phase 4 — GA4 funnel + Meta/Reddit audiences
7. [ ] Phase 5 — retargeting ads

---

## Meta event mapping (quick ref)

| Our event | Meta |
|-----------|------|
| `onboarding_started` | `Lead` |
| `signup_success` | `CompleteRegistration` |
| `slack_connect_success` | Custom `SlackConnect` (or `Subscribe`) |
| `extension_install_clicked` | Custom `ExtensionInstallClick` |
| `onboarding_completed` | Custom `OnboardingCompleted` |
| others | Custom, same name as `dataLayer` |

---

## One-liner to remember

**GTM = traffic cop · Code events = truth · Pixels in GTM = who hears · Audiences = who you remessage.**

---

## Session notes

_Add dates / blockers / decisions here as you go._

| Date | Note |
|------|------|
| 2026-09-04 | Plan written. GTM empty; analytics stub; Meta + Reddit pixels on hand; primary wins = Slack + extension click. |
| 2026-09-04 | Phase 2 code shipped: `dataLayer` events + SPA `virtual_page_view`. Next: GTM Phase 3 (base pixels + triggers). |
| 2026-09-04 | GTM: GA4 + Meta All Pages tags live; all Custom Event triggers (Step 2) created. Next: Step 3 event tags → Preview/DebugView → publish. |
