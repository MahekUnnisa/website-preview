import React from 'react';
import OnboardingV2Flow from '../OnboardingV2Flow';

interface OnboardingV2Props {
    showOnboardingV2?: boolean;
    setShowOnboardingV2?: (show: boolean) => void;
}

const OnboardingV2: React.FC<OnboardingV2Props> = ({ setShowOnboardingV2 }) => (
    <OnboardingV2Flow setShowOnboardingV2={setShowOnboardingV2} />
);

export default OnboardingV2;
