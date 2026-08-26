import React, { useEffect } from 'react';

import OnboardingV2 from '@/components/onboarding/OnboardingV2';
import { preloadOnboardingIcons } from '@/components/onboarding/OnboardingImage';
import { markOnboardReturnPath } from '@/lib/onboard-oauth';

export default function GetStarted() {
    useEffect(() => {
        preloadOnboardingIcons();
        markOnboardReturnPath('get-started');
    }, []);

    return (
        <div className="dark min-h-dvh overflow-x-hidden bg-background">
            <OnboardingV2 entry="get-started" />
        </div>
    );
}
