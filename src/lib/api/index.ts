export const routes = {
    auth: {
        google: '/auth/google',
        me: '/auth/me',
        oauthV2Start: (provider: string) => `/auth/${encodeURIComponent(provider)}`,
    },
    integrations: {
        list: '/integrations',
    },
    onboarding: {
        v3: '/onboarding',
        calendarAnalyze: '/onboarding/calendar/analyze',
        calendarAnalyzeJob: (jobId: string) => `/onboarding/calendar/analyze/${encodeURIComponent(jobId)}`,
        executeFirstJob: '/onboarding/execute/first/job',
    },
} as const;
