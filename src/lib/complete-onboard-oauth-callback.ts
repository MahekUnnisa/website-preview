import { applyOnboardingKeyAuthResult, getPendingOnboardingKeyAuth } from '@/lib/onboarding-key-auth';
import { getAuthToken, setAuthSession } from '@/lib/auth-session';
import { leaveOAuthCallback, postOnboardOAuthResult } from '@/lib/onboard-oauth';

/** Survives StrictMode remount and the page effect so persist+close runs once. */
let oauthCallbackStarted = false;

function isOAuthCallbackPath(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.location.pathname.includes('/onboard/oauth/callback');
}

function readOAuthResultFromUrl(): { token: string; error: string } {
    if (typeof window === 'undefined') {
        return { token: '', error: '' };
    }

    const fragment = (window.location.hash || '').replace(/^#/, '');
    const fragmentParams = fragment ? new URLSearchParams(fragment) : null;
    const search = new URLSearchParams(window.location.search || '');

    const token = (fragmentParams?.get('token') || search.get('token') || '').trim();
    const error = (fragmentParams?.get('error') || search.get('error') || '').trim();

    const hadSensitive =
        Boolean(fragmentParams?.get('token')) ||
        Boolean(fragmentParams?.get('error')) ||
        Boolean(search.get('token'));

    if (hadSensitive) {
        try {
            window.history.replaceState(null, '', window.location.pathname);
        } catch {
            /* ignore */
        }
    }

    return { token, error };
}

/** Persist JWT, tell the opener, close the popup. Skip network so close is not blocked on /me. */
export async function completeOnboardOAuthCallback(): Promise<void> {
    if (!isOAuthCallbackPath() || oauthCallbackStarted) {
        return;
    }
    oauthCallbackStarted = true;

    const pending = await getPendingOnboardingKeyAuth();
    const provider = pending?.provider ?? null;
    const { token, error: urlError } = readOAuthResultFromUrl();

    if (urlError || !token) {
        const existingToken = !urlError ? await getAuthToken() : null;
        if (existingToken) {
            if (provider) {
                await applyOnboardingKeyAuthResult(provider, 'success');
            }
            postOnboardOAuthResult({ status: 'success', provider });
            leaveOAuthCallback();
            return;
        }
        if (provider) {
            await applyOnboardingKeyAuthResult(provider, 'failed');
        }
        postOnboardOAuthResult({ status: 'failed', provider });
        leaveOAuthCallback();
        return;
    }

    await setAuthSession({ token });
    if (provider) {
        await applyOnboardingKeyAuthResult(provider, 'success');
    }
    postOnboardOAuthResult({ status: 'success', provider });
    leaveOAuthCallback();
}
