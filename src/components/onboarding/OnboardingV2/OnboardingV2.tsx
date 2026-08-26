import React from 'react';
import OnboardingV2Flow from '../OnboardingV2Flow';

interface OnboardingV2Props {
    showOnboardingV2?: boolean;
    setShowOnboardingV2?: (show: boolean) => void;
    entry?: 'onboard' | 'get-started';
}

const OnboardingV2: React.FC<OnboardingV2Props> = ({ setShowOnboardingV2, entry = 'onboard' }) => (
    <OnboardingV2Flow setShowOnboardingV2={setShowOnboardingV2} entry={entry} />
);

export default OnboardingV2;
