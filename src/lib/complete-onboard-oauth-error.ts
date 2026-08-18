import { applyOnboardingKeyAuthResult, getPendingOnboardingKeyAuth } from '@/lib/onboarding-key-auth';
import { postOnboardOAuthResult } from '@/lib/onboard-oauth';

/** Survives StrictMode remount so persist+notify runs once. */
let oauthErrorStarted = false;

export function isOAuthErrorPath(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.location.pathname.includes('/onboard/oauth/error');
}

export function readOAuthErrorFromUrl(): { code: string; title: string; message: string } {
    if (typeof window === 'undefined') {
        return { code: '', title: '', message: '' };
    }

    const search = new URLSearchParams(window.location.search || '');
    const fragment = (window.location.hash || '').replace(/^#/, '');
    const fragmentParams = fragment ? new URLSearchParams(fragment) : null;

    const code = (search.get('code') || fragmentParams?.get('error') || search.get('error') || '').trim();
    const title = (search.get('title') || '').trim();
    const message = (search.get('message') || '').trim();

    return { code, title, message };
}

/** Mark the pending key as failed and tell the opener. Do not close — the error page stays visible. */
export async function completeOnboardOAuthError(): Promise<void> {
    if (!isOAuthErrorPath() || oauthErrorStarted) {
        return;
    }
    oauthErrorStarted = true;

    const pending = await getPendingOnboardingKeyAuth();
    const provider = pending?.provider ?? null;
    if (provider) {
        await applyOnboardingKeyAuthResult(provider, 'failed');
    }
    postOnboardOAuthResult({ status: 'failed', provider });
}
