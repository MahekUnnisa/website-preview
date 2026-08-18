import React, { useEffect, useMemo, useState } from 'react';
import { completeOnboardOAuthError, readOAuthErrorFromUrl } from '@/lib/complete-onboard-oauth-error';
import { resolveAuthErrorCopy } from '@/lib/auth-error-codes';
import { leaveOAuthCallback } from '@/lib/onboard-oauth';
import { OnboardOAuthTab } from '@/components/onboarding/OnboardOAuthTab';

const AUTO_LEAVE_SECONDS = 5;

export default function OnboardOAuthError() {
    const [countdown, setCountdown] = useState(AUTO_LEAVE_SECONDS);
    const { title, description, tone } = useMemo(() => {
        const { code, title: titleOverride, message: messageOverride } = readOAuthErrorFromUrl();
        const fromCode = resolveAuthErrorCopy(code);
        return {
            title: titleOverride || fromCode.title,
            description: messageOverride || fromCode.description,
            tone: fromCode.tone
        };
    }, []);

    useEffect(() => {
        void completeOnboardOAuthError();
    }, []);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    window.clearInterval(timer);
                    leaveOAuthCallback();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="dark min-h-dvh bg-background">
            <OnboardOAuthTab
                status="error"
                countdown={countdown}
                errorTitle={title}
                errorDescription={description}
                errorTone={tone}
                onClose={leaveOAuthCallback}
            />
        </div>
    );
}
