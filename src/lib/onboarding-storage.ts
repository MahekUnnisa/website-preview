import { Storage } from '@/lib/storage';
import {
    ONBOARDING_V2_OWNER_USER_ID_KEY,
    ONBOARDING_V2_STATE_KEY,
    isOnboardingActive,
    type OnboardingV2State,
    type OnboardingV2Status,
} from '@/data/static/onboarding';

export const ONBOARDING_V2_STATE_KEY_PREFIX = 'zero_onboarding_v2_state';

const storageLocal = () => new Storage({ area: 'local' });

export function getOnboardingStateStorageKey(userId: string): string {
    return `${ONBOARDING_V2_STATE_KEY_PREFIX}:${userId}`;
}

function inferStatus(state: Partial<OnboardingV2State>): OnboardingV2Status | undefined {
    if (state.status) {
        return state.status;
    }
    if (state.stage && state.completed === false) {
        return 'in_progress';
    }
    if (state.completed === true) {
        return 'completed';
    }
    return undefined;
}

export function normalizeOnboardingState(
    state: Partial<OnboardingV2State> | undefined | null
): OnboardingV2State | undefined {
    if (state == null) {
        return undefined;
    }

    const status = inferStatus(state) ?? 'not_started';
    const completed = status === 'completed';

    return {
        version: 2,
        ...state,
        status,
        completed: status === 'skipped' ? false : completed,
        updatedAt: state.updatedAt ?? new Date().toISOString(),
    };
}

export function buildOnboardingState(
    prev: OnboardingV2State | undefined,
    patch: Partial<OnboardingV2State>
): OnboardingV2State {
    const merged = { ...(prev ?? {}), ...patch, version: 2 as const };
    const status = patch.status ?? prev?.status ?? inferStatus(merged) ?? 'not_started';
    const completed =
        status === 'skipped' ? false : status === 'completed' ? true : (patch.completed ?? prev?.completed ?? false);

    return normalizeOnboardingState({
        ...merged,
        status,
        completed,
        updatedAt: new Date().toISOString(),
    })!;
}

export function isTerminalOnboardingStatus(status?: OnboardingV2Status): boolean {
    return status === 'skipped' || status === 'completed';
}

export function isDefaultNotStarted(state?: OnboardingV2State | null): boolean {
    if (!state) {
        return false;
    }

    return (
        state.status === 'not_started' &&
        !state.stage &&
        state.onboardingStartTime == null &&
        state.currentStep == null
    );
}

function parseOnboardingRaw(raw: unknown): OnboardingV2State | undefined {
    if (raw == null) {
        return undefined;
    }

    if (typeof raw === 'string') {
        try {
            return normalizeOnboardingState(JSON.parse(raw) as OnboardingV2State);
        } catch {
            return undefined;
        }
    }

    return normalizeOnboardingState(raw as OnboardingV2State);
}

export async function readLegacyGlobalOnboardingState(): Promise<OnboardingV2State | undefined> {
    const raw = await storageLocal().get<OnboardingV2State>(ONBOARDING_V2_STATE_KEY);
    return parseOnboardingRaw(raw);
}

export async function readLegacyOwnerUserId(): Promise<string | null> {
    const viaStorage = await storageLocal().get<string | number>(ONBOARDING_V2_OWNER_USER_ID_KEY);
    if (viaStorage == null) {
        return null;
    }
    return String(viaStorage);
}

function isLegacyGlobalOwnedBy(ownerUserId: string | null, userId: string): boolean {
    return ownerUserId == null || ownerUserId === String(userId);
}

async function persistPerUserAndLegacy(userId: string, state: OnboardingV2State): Promise<void> {
    const storage = storageLocal();
    const normalizedUserId = String(userId);
    const normalized = normalizeOnboardingState(state)!;

    await storage.set(getOnboardingStateStorageKey(normalizedUserId), normalized);
    await storage.set(ONBOARDING_V2_STATE_KEY, normalized);
    await storage.set(ONBOARDING_V2_OWNER_USER_ID_KEY, normalizedUserId);
}

export async function readOnboardingState(userId: string): Promise<OnboardingV2State | undefined> {
    const raw = await storageLocal().get<OnboardingV2State>(getOnboardingStateStorageKey(String(userId)));
    return parseOnboardingRaw(raw);
}

export async function migrateOnboardingStateIfNeeded(userId: string): Promise<OnboardingV2State | undefined> {
    const normalizedUserId = String(userId);
    const perUser = await readOnboardingState(normalizedUserId);
    const globalState = await readLegacyGlobalOnboardingState();
    const globalOwner = await readLegacyOwnerUserId();
    const globalOwned = isLegacyGlobalOwnedBy(globalOwner, normalizedUserId);
    const normalizedGlobal = globalOwned ? globalState : undefined;

    if (normalizedGlobal && isTerminalOnboardingStatus(normalizedGlobal.status)) {
        const shouldUpgradePerUser =
            !perUser || isDefaultNotStarted(perUser) || !isTerminalOnboardingStatus(perUser.status);

        if (shouldUpgradePerUser) {
            await persistPerUserAndLegacy(normalizedUserId, normalizedGlobal);
            return normalizedGlobal;
        }
    }

    if (perUser && !isDefaultNotStarted(perUser)) {
        return perUser;
    }

    if (normalizedGlobal) {
        await persistPerUserAndLegacy(normalizedUserId, normalizedGlobal);
        return normalizedGlobal;
    }

    return perUser;
}

export async function saveOnboardingState(
    userId: string,
    patch: Partial<OnboardingV2State>
): Promise<OnboardingV2State> {
    const normalizedUserId = String(userId);
    await migrateOnboardingStateIfNeeded(normalizedUserId);
    const prev = await readOnboardingState(normalizedUserId);

    if (prev && isTerminalOnboardingStatus(prev.status) && !isTerminalOnboardingStatus(patch.status)) {
        return prev;
    }

    const next = buildOnboardingState(prev, patch);
    await persistPerUserAndLegacy(normalizedUserId, next);
    return next;
}

export async function saveGlobalOnboardingState(patch: Partial<OnboardingV2State>): Promise<OnboardingV2State> {
    const prev = await readLegacyGlobalOnboardingState();
    if (prev && isTerminalOnboardingStatus(prev.status) && !isTerminalOnboardingStatus(patch.status)) {
        return prev;
    }

    const next = buildOnboardingState(prev, patch);
    await storageLocal().set(ONBOARDING_V2_STATE_KEY, next);
    return next;
}

function isLegacyOnboardingStage(stage?: string): boolean {
    return Boolean(stage && ['signup', 'calendar', 'chat', 'loading', 'final'].includes(stage));
}

function isOnboardingFlowStep(stage?: string): boolean {
    return Boolean(
        stage &&
            [
                'welcome',
                'priority',
                'role-plan',
                'keys-first',
                'keys-second',
                'keys-complete',
                'work-tools',
                'wrap-up-confirm',
                'wrap-up-time',
                'calendar-insight',
                'thank-you',
            ].includes(stage)
    );
}

export async function migrateGlobalOnboardingToUser(userId: string): Promise<OnboardingV2State | undefined> {
    const globalState = await readLegacyGlobalOnboardingState();
    if (!globalState || !isOnboardingActive(globalState)) {
        return readOnboardingState(userId);
    }

    const perUser = await readOnboardingState(userId);
    const shouldMerge =
        !perUser ||
        isDefaultNotStarted(perUser) ||
        isLegacyOnboardingStage(perUser.stage) ||
        (perUser.status === 'in_progress' && !isOnboardingFlowStep(perUser.stage));

    if (!shouldMerge) {
        return perUser;
    }

    const merged = buildOnboardingState(perUser, {
        status: 'in_progress',
        stage: globalState.stage,
        flowData: globalState.flowData ?? perUser?.flowData,
        onboardingStartTime: globalState.onboardingStartTime ?? perUser?.onboardingStartTime,
    });

    await persistPerUserAndLegacy(String(userId), merged);
    return merged;
}
