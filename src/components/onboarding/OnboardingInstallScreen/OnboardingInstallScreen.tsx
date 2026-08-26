import React from 'react';
import { cn } from '@/lib/utils';
import { onboardingBodyFontClass } from '@/lib/onboarding-font';
import { getChromeWebStoreUrl } from '@/lib/env.js';
import { getOnboardingV2InstallCopy } from '@/utils/onboarding-v2-i18n';
import { OnboardingFooterActions } from '../OnboardingFooterActions';
import { OnboardingScreenShell, type OnboardingShellVariant } from '../OnboardingScreenShell';

export interface OnboardingInstallScreenProps {
    className?: string;
    shellVariant?: OnboardingShellVariant;
}

export const OnboardingInstallScreen: React.FC<OnboardingInstallScreenProps> = ({
    className,
    shellVariant = 'default',
}) => {
    const copy = getOnboardingV2InstallCopy();

    return (
        <OnboardingScreenShell
            className={className}
            variant={shellVariant}
            mainClassName="flex min-h-0 flex-1 flex-col px-5 pb-5 sm:px-8 sm:pb-12 lg:px-10"
        >
            <div
                className={cn(
                    'mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col justify-center gap-3 pt-8 lg:py-10',
                    onboardingBodyFontClass
                )}
            >
                <div className="flex flex-col gap-3">
                    <h1 className="text-[24px] font-semibold leading-[1.35] text-foreground-secondary lg:text-[clamp(24px,2.6vw,36px)]">
                        {copy.title}
                    </h1>
                    <p className="text-[15px] leading-[1.45] text-foreground-muted">{copy.body}</p>
                </div>
                <OnboardingFooterActions
                    actions={[
                        {
                            label: copy.cta,
                            onClick: () => {
                                window.open(getChromeWebStoreUrl(), '_blank', 'noopener,noreferrer');
                            }
                        }
                    ]}
                />
                <p className="text-xs leading-[1.45] text-foreground-muted">{copy.desktopNote}</p>
            </div>
        </OnboardingScreenShell>
    );
};

export default OnboardingInstallScreen;
