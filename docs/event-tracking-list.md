# Event Tracking List

Final event inventory for GTM / GA4 / Meta review.

## Conventions

- Keep the same event name for auth starts.
- Use `trigger_mode=manual` when the user clicked to open auth.
- Use `trigger_mode=auto` when the product auto-opened auth.
- Separate `/get-started` and `/onboard` with `entry_route`, not separate event names.

## Required Parameters

### `cta_get_started_click`

| Param | Example values | Meaning |
|-------|----------------|---------|
| `source` | `home_header_cta`, `home_hero_primary_cta`, `home_setup_cta`, `home_bottom_cta` | Which Get Started button was clicked |
| `destination` | `/get-started` | Where the CTA sends the user |

### Onboarding and Auth Events

| Param | Example values | Meaning |
|-------|----------------|---------|
| `entry_route` | `get-started`, `onboard` | Which onboarding entry path the user came from |
| `trigger_mode` | `manual`, `auto` | Whether auth opened by click or auto-open |

## Done

| Event name | Description | Key params |
|------------|-------------|------------|
| `cta_get_started_click` | User clicked a Get Started CTA that leads into onboarding. | `source`, `destination` |
| `onboarding_started` | User entered onboarding on `/get-started` or `/onboard`. | `entry_route` |
| `signup_started` | Google auth opened or started. Use `trigger_mode=manual` for click, `trigger_mode=auto` for auto-open. | `entry_route`, `trigger_mode` |
| `signup_success` | Google auth completed successfully and the user became authenticated. | `entry_route` |
| `signup_failed` | Google auth failed or was denied. | `entry_route` |
| `slack_connect_started` | Slack auth opened or started. Use `trigger_mode=manual` for click, `trigger_mode=auto` for auto-open. | `entry_route`, `trigger_mode` |
| `slack_connect_success` | Slack connected successfully. | `entry_route` |
| `slack_connect_failed` | Slack auth failed. | `entry_route` |
| `home_viewed` | User viewed the homepage. | — |
| `slack_step_viewed` | User reached the Slack connection step before starting Slack auth. | `entry_route` |
| `all_set_viewed` | User reached the all-set / success screen after Slack connection. | `entry_route` |
| `slack_open_clicked` | User opened Slack from the onboarding success flow. | `entry_route` |
| `extension_install_prompt_viewed` | User saw the Chrome extension install step. | `entry_route` |
| `extension_install_clicked` | User clicked through to the Chrome Web Store. | `entry_route`, `source` |
| `onboarding_completed` | User completed the onboarding flow. | `entry_route` |
| `virtual_page_view` | SPA route change counted as a page view for GTM/GA4. | `page_path` |

## Todo

None right now. Add new events only if marketing wants more breakdown than the current funnel and CTA sources.

## Recommended Funnel

1. `home_viewed`
2. `cta_get_started_click`
3. `onboarding_started`
4. `signup_started`
5. `signup_success`
6. `slack_step_viewed`
7. `slack_connect_started`
8. `slack_connect_success`
9. `all_set_viewed`
10. `slack_open_clicked`
11. `extension_install_prompt_viewed`
12. `extension_install_clicked`
13. `onboarding_completed`

## Retargeting Logic

Do not create separate "left without X" events. Build audiences as:

- `onboarding_started` but not `signup_success`
- `signup_success` but not `slack_connect_success`
- `slack_connect_success` but not `slack_open_clicked`
- `extension_install_prompt_viewed` but not `extension_install_clicked`
