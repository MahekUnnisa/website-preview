export const ANALYTICS_EVENTS = {
    CTA: {
        GET_STARTED_CLICK: 'cta_get_started_click',
    },
    ONBOARDING: {
        STARTED: 'onboarding_started',
        SIGNUP_STARTED: 'signup_started',
        SIGNUP_SUCCESS: 'signup_success',
        SIGNUP_FAILED: 'signup_failed',
        SLACK_CONNECT_STARTED: 'slack_connect_started',
        SLACK_CONNECT_SUCCESS: 'slack_connect_success',
        SLACK_CONNECT_FAILED: 'slack_connect_failed',
        SLACK_OPEN_CLICKED: 'slack_open_clicked',
        EXTENSION_INSTALL_CLICKED: 'extension_install_clicked',
        COMPLETED: 'onboarding_completed',
        SKIPPED: 'onboarding_skipped',
    },
    PAGE: {
        VIRTUAL_PAGE_VIEW: 'virtual_page_view',
    },
} as const;

type NestedValues<T> = T extends string ? T : { [K in keyof T]: NestedValues<T[K]> }[keyof T];

export type AnalyticsEventName = NestedValues<typeof ANALYTICS_EVENTS>;
