export const routes = {
    auth: {
        google: '/auth/google',
        me: '/auth/me',
        apps: '/auth/apps',
        oauthV2Start: (provider: string) => `/auth/${encodeURIComponent(provider)}`,
    },
    integrations: {
        list: '/integrations',
    },
    onboarding: {
        v3: '/onboarding',
        executeFirstJob: '/onboarding/execute/first/job',
    },
} as const;
