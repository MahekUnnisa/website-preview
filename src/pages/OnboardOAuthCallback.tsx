import React, { useEffect, useState } from 'react';
import { completeOnboardOAuthCallback } from '@/lib/complete-onboard-oauth-callback';
import { leaveOAuthCallback } from '@/lib/onboard-oauth';
import { OnboardOAuthTab } from '@/components/onboarding/OnboardOAuthTab';

export default function OnboardOAuthCallback() {
    const [stuck, setStuck] = useState(false);

    useEffect(() => {
        void completeOnboardOAuthCallback();
        const timer = window.setTimeout(() => setStuck(true), 400);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div className="dark min-h-dvh bg-background">
            <OnboardOAuthTab
                status={stuck ? 'success' : 'loading'}
                canClose={stuck}
                onClose={leaveOAuthCallback}
            />
        </div>
    );
}
