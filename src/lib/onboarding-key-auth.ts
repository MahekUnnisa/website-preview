import { Storage } from '@/lib/storage';
import { normalizeFlowData, type OnboardingKeyAuthProvider } from '@/lib/onboarding-flow';
import {
    readLegacyGlobalOnboardingState,
    readLegacyOwnerUserId,
    readOnboardingState,
    saveGlobalOnboardingState,
    saveOnboardingState,
} from '@/lib/onboarding-storage';

export type { OnboardingKeyAuthProvider };
export type OnboardingKeyAuthStatus = 'success' | 'failed';

/** Temporary pending OAuth attempt while the popup callback resolves. */
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

function mapAuthCallbackProvider(provider: string | null | undefined): OnboardingKeyAuthProvider | null {
    if (!provider) {
        return null;
    }
    if (provider === 'google') {
        return 'google';
    }
    if (provider === 'slack') {
        return 'slack';
    }
    if (provider === 'msteams' || provider === 'teams' || provider === 'microsoft') {
        return 'msteams';
    }
    return null;
}

/** Prefer pending provider; fall back to auth-callback provider string. */
export function resolveOnboardingKeyAuthProvider(
    pending: OnboardingPendingKeyAuth | null,
    callbackProvider?: string | null
): OnboardingKeyAuthProvider | null {
    return pending?.provider ?? mapAuthCallbackProvider(callbackProvider);
}

/**
 * Write keyAuth success/failed onto existing onboarding state (same storage key),
 * then clear the pending attempt.
 */
export async function applyOnboardingKeyAuthResult(
    provider: OnboardingKeyAuthProvider,
    status: OnboardingKeyAuthStatus
): Promise<void> {
    try {
        const ownerUserId = await readLegacyOwnerUserId();
        if (ownerUserId) {
            const prev = await readOnboardingState(ownerUserId);
            const flowData = normalizeFlowData(prev?.flowData);
            await saveOnboardingState(ownerUserId, {
                flowData: {
                    ...flowData,
                    keyAuth: {
                        ...flowData.keyAuth,
                        [provider]: status,
                    },
                },
            });
        } else {
            const prev = await readLegacyGlobalOnboardingState();
            const flowData = normalizeFlowData(prev?.flowData);
            await saveGlobalOnboardingState({
                flowData: {
                    ...flowData,
                    keyAuth: {
                        ...flowData.keyAuth,
                        [provider]: status,
                    },
                },
            });
        }
    } finally {
        await clearPendingOnboardingKeyAuth();
    }
}
