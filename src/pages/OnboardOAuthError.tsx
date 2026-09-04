import React, { useEffect, useMemo, useState } from 'react';
import { completeOnboardOAuthError, readOAuthErrorFromUrl } from '@/lib/complete-onboard-oauth-error';
import { resolveAuthErrorCopy } from '@/lib/auth-error-codes';
import { leaveOAuthCallback } from '@/lib/onboard-oauth';
import { getPendingOnboardingKeyAuth } from '@/lib/onboarding-key-auth';
import { ANALYTICS_EVENTS } from '@/data/static/analytics-events';
import { trackEventOnce } from '@/lib/analytics';
import { OnboardOAuthTab } from '@/components/onboarding/OnboardOAuthTab';

const AUTO_LEAVE_SECONDS = 5;

export default function OnboardOAuthError() {
    const [countdown, setCountdown] = useState(AUTO_LEAVE_SECONDS);
    const { code, title, description, tone } = useMemo(() => {
        const { code: errorCode, title: titleOverride, message: messageOverride } = readOAuthErrorFromUrl();
        const fromCode = resolveAuthErrorCopy(errorCode);
        return {
            code: errorCode,
            title: titleOverride || fromCode.title,
            description: messageOverride || fromCode.description,
            tone: fromCode.tone
        };
    }, []);

    useEffect(() => {
        void (async () => {
            const pending = await getPendingOnboardingKeyAuth();
            const provider = pending?.provider ?? 'unknown';
            await completeOnboardOAuthError();
            trackEventOnce(
                `oauth_failed_${provider}_${code || 'generic'}`,
                provider === 'google'
                    ? ANALYTICS_EVENTS.ONBOARDING.SIGNUP_FAILED
                    : ANALYTICS_EVENTS.ONBOARDING.SLACK_CONNECT_FAILED,
                { provider, code: code || 'generic' }
            );
        })();
    }, [code]);

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
