export const ONBOARDING_V2_STATE_KEY = 'zero_onboarding_v2_state';
export const ONBOARDING_V2_OWNER_USER_ID_KEY = 'zero_onboarding_v2_owner_user_id';

export type OnboardingV2Status = 'not_started' | 'in_progress' | 'skipped' | 'completed';

export type OnboardingFlowData = {
    selectedRole?: 'focus' | 'commitments' | 'meetings';
    workspace?: 'slack' | 'msteams';
    selectedTools?: string[];
    wrapUpTime?: string;
    wrapUpFromTimePicker?: boolean;
    keyAuth?: Partial<Record<'google' | 'slack' | 'msteams', 'success' | 'failed'>>;
};

export type OnboardingV2State = {
    version?: number;
    status?: OnboardingV2Status;
    stage?: string;
    currentStep?: number;
    onboardingStartTime?: string;
    updatedAt?: string;
    completed?: boolean;
    flowData?: OnboardingFlowData;
};

export const isOnboardingActive = (state?: OnboardingV2State | null): boolean => {
    if (!state) {
        return false;
    }

    if (state.status === 'skipped' || state.status === 'completed') {
        return false;
    }

    if (state.status === 'not_started' || state.status === 'in_progress') {
        return true;
    }

    if (state.stage && state.completed === false) {
        return true;
    }

    if (typeof state.completed === 'boolean') {
        return !state.completed;
    }

    return false;
};
