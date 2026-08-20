export const ANALYTICS_EVENTS = {
    ONBOARDING: {
        COMPLETED: 'onboarding_completed',
        SKIPPED: 'onboarding_skipped',
    },
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS.ONBOARDING)[keyof typeof ANALYTICS_EVENTS.ONBOARDING];
