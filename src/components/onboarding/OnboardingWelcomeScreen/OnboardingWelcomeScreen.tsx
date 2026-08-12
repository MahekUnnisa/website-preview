import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { onboardingBodyFontClass, onboardingDisplayFontClass } from '@/lib/onboarding-font';
import { useOnboardingTyping } from '@/hooks/useOnboardingTyping';
import { IntroCenterIllustration } from '@/components/onboarding/IntroCenterIllustration';
import { getOnboardingV2WelcomeCopy } from '@/utils/onboarding-v2-i18n';
import { OnboardingPrimaryButton } from '../OnboardingPrimaryButton';
import { OnboardingScreenShell } from '../OnboardingScreenShell';

export interface OnboardingWelcomeScreenProps {
    onHireMe?: () => void;
    className?: string;
}

export const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({ onHireMe, className }) => {
    const { headline, subtext, hireMe } = getOnboardingV2WelcomeCopy();
    const [typingDone, setTypingDone] = useState(false);
    const [showSubtext, setShowSubtext] = useState(false);
    const [showHireMe, setShowHireMe] = useState(false);
    const [showIllustration, setShowIllustration] = useState(false);

    const displayedHeadline = useOnboardingTyping(headline, () => setTypingDone(true));

    useEffect(() => {
        if (!typingDone) return undefined;
        const timer = window.setTimeout(() => setShowSubtext(true), 400);
        return () => window.clearTimeout(timer);
    }, [typingDone]);

    useEffect(() => {
        if (!showSubtext) return undefined;
        const timer = window.setTimeout(() => setShowHireMe(true), 400);
        return () => window.clearTimeout(timer);
    }, [showSubtext]);

    useEffect(() => {
        if (!showHireMe) return undefined;
        const timer = window.setTimeout(() => setShowIllustration(true), 400);
        return () => window.clearTimeout(timer);
    }, [showHireMe]);

    return (
        <OnboardingScreenShell
            className={cn('h-dvh max-h-dvh min-h-0 overflow-hidden', className)}
            mainClassName="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-0"
        >
            <div className="flex min-h-0 flex-1 flex-col items-center overflow-hidden pt-10 sm:pt-14">
                <div className="flex w-full shrink-0 flex-col items-center gap-5 text-center">
                    <h1
                        className={cn(
                            onboardingDisplayFontClass,
                            'relative max-w-[605px] text-[clamp(28px,4vw,40px)] font-bold leading-tight'
                        )}
                    >
                        <span className="invisible" aria-hidden>
                            {headline}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-b from-gradient-from from-[22%] to-gradient-to to-[82%] bg-clip-text text-transparent">
                            {displayedHeadline}
                        </span>
                    </h1>
                    <p
                        className={cn(
                            'max-w-[605px] text-xl leading-[1.35] text-foreground-muted',
                            onboardingBodyFontClass,
                            showSubtext ? 'onboarding-fade-in' : 'invisible'
                        )}
                    >
                        {subtext}
                    </p>
                    <OnboardingPrimaryButton
                        onClick={onHireMe}
                        shellClassName={cn(
                            'mt-1 h-12',
                            showHireMe ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                        )}
                        className="px-12 py-3 text-base font-semibold leading-[23px]"
                        tabIndex={showHireMe ? 0 : -1}
                        aria-hidden={!showHireMe}
                    >
                        {hireMe}
                    </OnboardingPrimaryButton>
                </div>

                <div className="relative mt-[60px] flex min-h-0 w-full flex-1 items-start justify-center overflow-hidden sm:mt-[76px]">
                    <div className="w-full max-w-[min(563px,100%)]" style={{ aspectRatio: '563 / 470' }}>
                        {showIllustration ? <IntroCenterIllustration animateEntrance /> : null}
                    </div>
                </div>
            </div>
        </OnboardingScreenShell>
    );
};

export default OnboardingWelcomeScreen;
