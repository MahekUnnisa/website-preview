export function useAnalytics(): {
    trackEvent: (eventName: string, eventParams?: Record<string, string | number | boolean | undefined>) => void;
    isEnabled: boolean;
} {
    return {
        trackEvent: () => {
            /* Analytics stub — add later */
        },
        isEnabled: false,
    };
}
