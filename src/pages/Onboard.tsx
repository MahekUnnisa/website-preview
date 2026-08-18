import React, { useEffect } from 'react';

import OnboardingV2 from '@/components/onboarding/OnboardingV2';
import { preloadOnboardingIcons } from '@/components/onboarding/OnboardingImage';

export default function Onboard() {
    useEffect(() => {
        preloadOnboardingIcons();
    }, []);

    return (
        <div className="dark min-h-dvh overflow-x-hidden bg-background">
            <OnboardingV2 />
        </div>
    );
}
