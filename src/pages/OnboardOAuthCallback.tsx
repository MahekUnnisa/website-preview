import React, { useEffect, useState } from 'react';
import { fetchAuthMe } from '@/api/auth';
import { applyOnboardingKeyAuthResult, getPendingOnboardingKeyAuth } from '@/lib/onboarding-key-auth';
import { setAuthSession } from '@/lib/auth-session';
import { postOnboardOAuthResult } from '@/lib/onboard-oauth';

/** Survives React StrictMode remount so the callback runs once per page load. */
let oauthCallbackStarted = false;

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

export default function OnboardOAuthCallback() {
    const [status, setStatus] = useState<'working' | 'done' | 'error'>('working');

    useEffect(() => {
        if (oauthCallbackStarted) {
            return;
        }
        oauthCallbackStarted = true;

        const run = async () => {
            const pending = await getPendingOnboardingKeyAuth();
            const provider = pending?.provider ?? null;
            const { token, error } = readOAuthResultFromUrl();

            if (error || !token) {
                if (provider) {
                    await applyOnboardingKeyAuthResult(provider, 'failed');
                }
                postOnboardOAuthResult({ status: 'failed', provider });
                setStatus('error');
                window.setTimeout(() => window.close(), 800);
                return;
            }

            try {
                await setAuthSession({ token });
                const me = await fetchAuthMe();
                if (me?.id) {
                    await setAuthSession({ token, userId: me.id });
                }
                if (provider) {
                    await applyOnboardingKeyAuthResult(provider, 'success');
                }
                postOnboardOAuthResult({ status: 'success', provider });
                setStatus('done');
            } catch {
                if (provider) {
                    await applyOnboardingKeyAuthResult(provider, 'failed');
                }
                postOnboardOAuthResult({ status: 'failed', provider });
                setStatus('error');
            }

            window.setTimeout(() => window.close(), 800);
        };

        void run();
    }, []);

    const label =
        status === 'error' ? 'Sign-in did not complete. You can close this window.' : 'Signing you in…';

    return (
        <div className="dark min-h-dvh bg-background flex items-center justify-center px-6">
            <p className="text-sm text-foreground-muted">{label}</p>
        </div>
    );
}
