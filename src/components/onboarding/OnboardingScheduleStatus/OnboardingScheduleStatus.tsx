import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { LoadingAnimation } from '@/components/onboarding/OnboardingLoadingIcon';
import {
    getOnboardingScheduleStatusMessages,
    ONBOARDING_SCHEDULE_STATUS_COUNT
} from '@/utils/onboarding-schedule-status-i18n';

export interface OnboardingScheduleStatusProps {
    className?: string;
    visible?: boolean;
    /** When set, show this fixed headline instead of rotating status messages. */
    headline?: string;
    /** Milliseconds between message rotations. */
    intervalMs?: number;
}

export const OnboardingScheduleStatus: React.FC<OnboardingScheduleStatusProps> = ({
    className,
    visible = true,
    headline,
    intervalMs = 5000
}) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const messages = useMemo(() => getOnboardingScheduleStatusMessages(), []);

    useEffect(() => {
        if (headline) {
            return undefined;
        }

        const interval = window.setInterval(() => {
            setIsVisible(false);

            window.setTimeout(() => {
                setCurrentMessageIndex((prev) => (prev + 1) % ONBOARDING_SCHEDULE_STATUS_COUNT);
                setIsVisible(true);
            }, 200);
        }, intervalMs);

        return () => window.clearInterval(interval);
    }, [headline, intervalMs]);

    const displayText = headline ?? messages[currentMessageIndex % messages.length];

    return (
        <div
            className={cn(
                'flex items-center gap-2.5 overflow-hidden transition-all duration-300 ease-out',
                visible ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0',
                className
            )}
            aria-hidden={!visible}
        >
            <div className="flex size-7 shrink-0 items-center justify-center overflow-visible rounded-[14px] bg-accent-colored-bg">
                <LoadingAnimation size={20} className="flex-none" />
            </div>
            <span
                className={cn(
                    'text-[13px] font-normal leading-normal text-foreground-muted transition-opacity duration-400 ease-in-out font-instrumentSans',
                    headline || isVisible ? 'opacity-100' : 'opacity-0'
                )}
            >
                {displayText}
            </span>
        </div>
    );
};

export default OnboardingScheduleStatus;
