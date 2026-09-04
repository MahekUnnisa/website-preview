import { ANALYTICS_EVENTS } from '@/data/static/analytics-events';

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined | null>;

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}

/** Drop null/undefined so GTM does not see stale empty keys. */
export function cleanAnalyticsParams(
    params?: AnalyticsEventParams
): Record<string, string | number | boolean> {
    if (!params) {
        return {};
    }
    const out: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) {
            continue;
        }
        out[key] = value;
    }
    return out;
}

/** Push a GTM custom event. Safe when window is missing. */
export function trackEvent(eventName: string, eventParams?: AnalyticsEventParams): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: eventName,
        ...cleanAnalyticsParams(eventParams),
    });
}

/**
 * Fire once per browser tab session (survives StrictMode double-mount).
 * ponytail: sessionStorage ceiling = one hit per tab; upgrade = server-side identity if needed.
 */
export function trackEventOnce(
    onceKey: string,
    eventName: string,
    eventParams?: AnalyticsEventParams
): void {
    const storageKey = `zero_analytics_once_${onceKey}`;
    try {
        if (sessionStorage.getItem(storageKey)) {
            return;
        }
        sessionStorage.setItem(storageKey, '1');
    } catch {
        /* private mode / blocked storage — still push */
    }
    trackEvent(eventName, eventParams);
}

/** SPA route change for GTM virtual page tags. */
export function trackVirtualPageView(pagePath: string): void {
    if (typeof window === 'undefined') {
        return;
    }
    const path = pagePath || window.location.pathname;
    trackEvent(ANALYTICS_EVENTS.PAGE.VIRTUAL_PAGE_VIEW, {
        page_path: path,
        page_location: `${window.location.origin}${path}`,
        page_title: document.title,
    });
}

if (import.meta.env.DEV) {
    console.assert(
        Object.keys(cleanAnalyticsParams({ a: 1, b: undefined, c: null })).join() === 'a',
        'cleanAnalyticsParams drops empty values'
    );
    console.assert(
        ANALYTICS_EVENTS.ONBOARDING.SLACK_CONNECT_SUCCESS === 'slack_connect_success',
        'slack win event name'
    );
    console.assert(
        ANALYTICS_EVENTS.ONBOARDING.EXTENSION_INSTALL_CLICKED === 'extension_install_clicked',
        'extension win event name'
    );
}
