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
            className={cn('h-dvh max-h-dvh min-h-0 overflow-y-auto', className)}
            mainClassName="flex min-h-0 flex-1 flex-col px-5 pb-0 sm:px-8"
        >
            <div className="flex min-h-0 flex-1 flex-col items-center">
                <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center py-4">
                    <div className="flex w-full max-w-[605px] flex-col items-center gap-[30px] text-center lg:max-w-[720px]">
                        <div className="flex w-full flex-col items-center gap-5">
                            <h1
                                className={cn(
                                    onboardingDisplayFontClass,
                                    'relative w-full text-[32px] font-bold leading-normal sm:text-[clamp(32px,4vw,48px)] sm:leading-tight'
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
                                    'w-full text-base leading-[1.35] text-foreground-muted sm:text-lg lg:text-xl',
                                    onboardingBodyFontClass,
                                    showSubtext ? 'onboarding-fade-in' : 'invisible'
                                )}
                            >
                                {subtext}
                            </p>
                        </div>
                        <OnboardingPrimaryButton
                            onClick={onHireMe}
                            shellClassName={cn(
                                'relative z-10 h-12',
                                showHireMe ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                            )}
                            className="px-12 py-3 text-base font-semibold leading-[23px]"
                            tabIndex={showHireMe ? 0 : -1}
                            aria-hidden={!showHireMe}
                        >
                            {hireMe}
                        </OnboardingPrimaryButton>
                    </div>
                </div>

                <div className="pointer-events-none relative z-0 mt-auto flex w-full shrink-0 items-end justify-center overflow-hidden lg:max-w-[min(960px,calc(50dvh*563/470))]">
                    <div
                        className="w-full max-w-[min(563px,100%)] max-h-[min(42dvh,470px)] lg:max-h-none lg:max-w-none"
                        style={{ aspectRatio: '563 / 470' }}
                    >
                        {showIllustration ? <IntroCenterIllustration animateEntrance /> : null}
                    </div>
                </div>
            </div>
        </OnboardingScreenShell>
    );
};

export default OnboardingWelcomeScreen;
