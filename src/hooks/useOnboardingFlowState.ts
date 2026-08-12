import { useCallback, useEffect, useState } from 'react';
import { Storage } from '@/lib/storage';
import { ONBOARDING_V2_STATE_KEY, type OnboardingV2State } from '@/data/static/onboarding';
import {
    getOnboardingStateStorageKey,
    migrateGlobalOnboardingToUser,
    migrateOnboardingStateIfNeeded,
    normalizeOnboardingState,
    readLegacyGlobalOnboardingState,
    readOnboardingState,
    saveGlobalOnboardingState,
    saveOnboardingState
} from '@/lib/onboarding-storage';

type SetOnboardingFlowStateArg =
    | Partial<OnboardingV2State>
    | OnboardingV2State
    | ((previous: OnboardingV2State | undefined) => Partial<OnboardingV2State> | OnboardingV2State);

export function useOnboardingFlowState(userId: string | null | undefined) {
    const [state, setState] = useState<OnboardingV2State | undefined>(undefined);
    const [isHydrated, setIsHydrated] = useState(false);
    const storageKey = userId ? getOnboardingStateStorageKey(String(userId)) : ONBOARDING_V2_STATE_KEY;

    useEffect(() => {
        let cancelled = false;
        let unwatch: (() => void) | undefined;

        const hydrate = async () => {
            setIsHydrated(false);

            if (userId) {
                const migrated = await migrateOnboardingStateIfNeeded(String(userId));
                if (cancelled) {
                    return;
                }
                setState(migrated);
                setIsHydrated(true);
            } else {
                const globalState = await readLegacyGlobalOnboardingState();
                if (cancelled) {
                    return;
                }
                setState(globalState);
                setIsHydrated(true);
            }

            const storage = new Storage({ area: 'local' });
            unwatch = storage.watch({
                [storageKey]: (newValue) => {
                    if (!cancelled) {
                        setState(normalizeOnboardingState(newValue as OnboardingV2State | undefined));
                    }
                }
            });
        };

        void hydrate();

        return () => {
            cancelled = true;
            unwatch?.();
        };
    }, [storageKey, userId]);

    const setOnboardingFlowState = useCallback(
        async (value: SetOnboardingFlowStateArg): Promise<OnboardingV2State | undefined> => {
            if (userId) {
                const uid = String(userId);
                const patch =
                    typeof value === 'function' ? value(await readOnboardingState(uid)) : value;
                const next = await saveOnboardingState(uid, patch);
                setState(next);
                return next;
            }

            const patch =
                typeof value === 'function' ? value(await readLegacyGlobalOnboardingState()) : value;
            const next = await saveGlobalOnboardingState(patch);
            setState(next);
            return next;
        },
        [userId]
    );

    const syncAfterLogin = useCallback(async (nextUserId: string) => {
        const merged = await migrateGlobalOnboardingToUser(nextUserId);
        setState(merged);
        return merged;
    }, []);

    return [state, setOnboardingFlowState, isHydrated, syncAfterLogin] as const;
}

export default useOnboardingFlowState;
