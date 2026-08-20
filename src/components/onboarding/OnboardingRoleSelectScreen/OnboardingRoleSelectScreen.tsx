import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { AssetName } from '@/components/onboarding/OnboardingImage';
import type { OnboardingRoleId } from '@/types/onboarding';
import { useOnboardingTyping } from '@/hooks/useOnboardingTyping';
import { getOnboardingV2PriorityCopy } from '@/utils/onboarding-v2-i18n';
import { OnboardingScreenShell } from '../OnboardingScreenShell';
import { OnboardingActionCard } from '../OnboardingActionCard';

export type { OnboardingRoleId };

export interface OnboardingRoleOption {
    id: OnboardingRoleId;
    title: string;
    description: string;
    icon: AssetName;
}

export const getDefaultOnboardingRoles = (): OnboardingRoleOption[] => getOnboardingV2PriorityCopy().roles;

/** @deprecated Prefer getDefaultOnboardingRoles() so copy resolves at call time. */
export const defaultOnboardingRoles: OnboardingRoleOption[] = getDefaultOnboardingRoles();

export interface OnboardingRoleSelectScreenProps {
    roles?: OnboardingRoleOption[];
    onSelect?: (roleId: OnboardingRoleId) => void;
    className?: string;
}

export const OnboardingRoleSelectScreen: React.FC<OnboardingRoleSelectScreenProps> = ({
    roles,
    onSelect,
    className
}) => {
    const { question, roles: defaultRoles } = getOnboardingV2PriorityCopy();
    const roleOptions = roles ?? defaultRoles;
    const [typingDone, setTypingDone] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const displayedQuestion = useOnboardingTyping(question, () => setTypingDone(true));

    useEffect(() => {
        if (!typingDone) return undefined;
        const timer = window.setTimeout(() => setShowOptions(true), 400);
        return () => window.clearTimeout(timer);
    }, [typingDone]);

    return (
        <OnboardingScreenShell className={className}>
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 pt-8 lg:my-auto lg:py-10 xl:max-w-[840px] 2xl:max-w-[900px]">
                <h1 className="relative text-[24px] font-semibold leading-[1.35] text-foreground-secondary font-instrumentSans lg:text-[clamp(24px,2.6vw,36px)]">
                    <span className="invisible" aria-hidden>
                        {question}
                    </span>
                    <span className="absolute inset-0" aria-live="polite">
                        {displayedQuestion}
                    </span>
                </h1>

                <div
                    className={cn(
                        'flex flex-col gap-3',
                        showOptions ? 'onboarding-slide-down' : 'pointer-events-none opacity-0'
                    )}
                >
                    {roleOptions.map((role) => (
                        <OnboardingActionCard
                            key={role.id}
                            title={role.title}
                            description={role.description}
                            icon={role.icon}
                            onClick={() => onSelect?.(role.id)}
                        />
                    ))}
                </div>
            </div>
        </OnboardingScreenShell>
    );
};

export default OnboardingRoleSelectScreen;
