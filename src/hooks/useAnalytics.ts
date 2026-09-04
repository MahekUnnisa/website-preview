import { trackEvent } from '@/lib/analytics';
import type { AnalyticsEventParams } from '@/lib/analytics';

export function useAnalytics(): {
    trackEvent: (eventName: string, eventParams?: AnalyticsEventParams) => void;
    isEnabled: boolean;
} {
    return {
        trackEvent,
        isEnabled: typeof window !== 'undefined',
    };
}
