import { Storage } from '@/lib/storage';

export type OnboardingKeyAuthProvider = 'google' | 'slack' | 'msteams';
export type OnboardingKeyAuthStatus = 'success' | 'failed';

export const ONBOARDING_PENDING_KEY_AUTH_STORAGE_KEY = 'zero_onboarding_pending_key_auth';

export type OnboardingPendingKeyAuth = {
    provider: OnboardingKeyAuthProvider;
    startedAt: string;
};

const storageLocal = () => new Storage({ area: 'local' });

export async function setPendingOnboardingKeyAuth(provider: OnboardingKeyAuthProvider): Promise<void> {
    await storageLocal().set(ONBOARDING_PENDING_KEY_AUTH_STORAGE_KEY, {
        provider,
        startedAt: new Date().toISOString(),
    } satisfies OnboardingPendingKeyAuth);
}

export async function getPendingOnboardingKeyAuth(): Promise<OnboardingPendingKeyAuth | null> {
    const raw = await storageLocal().get<OnboardingPendingKeyAuth>(ONBOARDING_PENDING_KEY_AUTH_STORAGE_KEY);
    if (!raw || typeof raw !== 'object') {
        return null;
    }
    if (raw.provider !== 'google' && raw.provider !== 'slack' && raw.provider !== 'msteams') {
        return null;
    }
    return raw;
}

export async function clearPendingOnboardingKeyAuth(): Promise<void> {
    await storageLocal().remove(ONBOARDING_PENDING_KEY_AUTH_STORAGE_KEY);
}

/**
 * Records the last key-auth outcome. Flow-state merge lands when onboarding storage is ported.
 */
export async function applyOnboardingKeyAuthResult(
    provider: OnboardingKeyAuthProvider,
    status: OnboardingKeyAuthStatus
): Promise<void> {
    try {
        await storageLocal().set('zero_onboarding_key_auth_last', { provider, status });
    } finally {
        await clearPendingOnboardingKeyAuth();
    }
}
