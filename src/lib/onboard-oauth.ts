import type { OnboardingKeyAuthProvider } from '@/lib/onboarding-key-auth';

export const ONBOARD_OAUTH_MESSAGE_TYPE = 'ZERO_ONBOARD_OAUTH';

export type OnboardOAuthMessage = {
    type: typeof ONBOARD_OAUTH_MESSAGE_TYPE;
    status: 'success' | 'failed';
    provider: OnboardingKeyAuthProvider | null;
};

const POPUP_NAME = 'zero-onboard-oauth';
const POPUP_FEATURES = 'width=500,height=600,scrollbars=yes,resizable=yes';

export function createOnboardOAuthState(): string {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    return `onboard_${id}`;
}

export function openOAuthPopup(url: string): Window | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.open(url, POPUP_NAME, POPUP_FEATURES);
}

export function postOnboardOAuthResult(message: Omit<OnboardOAuthMessage, 'type'>): void {
    if (typeof window === 'undefined') {
        return;
    }
    const payload: OnboardOAuthMessage = { type: ONBOARD_OAUTH_MESSAGE_TYPE, ...message };
    window.opener?.postMessage(payload, window.location.origin);
}

export function isOnboardOAuthMessage(data: unknown): data is OnboardOAuthMessage {
    if (!data || typeof data !== 'object') {
        return false;
    }
    const message = data as OnboardOAuthMessage;
    return (
        message.type === ONBOARD_OAUTH_MESSAGE_TYPE &&
        (message.status === 'success' || message.status === 'failed')
    );
}
