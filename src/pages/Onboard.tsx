import React, { useEffect } from 'react';

import OnboardingV2 from '@/components/onboarding/OnboardingV2';
import { preloadOnboardingIcons } from '@/components/onboarding/OnboardingImage';
import { ANALYTICS_EVENTS } from '@/data/static/analytics-events';
import { trackEventOnce } from '@/lib/analytics';
import { markOnboardReturnPath } from '@/lib/onboard-oauth';

export default function Onboard() {
    useEffect(() => {
        preloadOnboardingIcons();
        markOnboardReturnPath('onboard');
        trackEventOnce('onboarding_started_onboard', ANALYTICS_EVENTS.ONBOARDING.STARTED, {
            entry: 'onboard',
        });
    }, []);

    return (
        <div className="dark min-h-dvh overflow-x-hidden bg-background">
            <OnboardingV2 entry="onboard" />
        </div>
    );
}
