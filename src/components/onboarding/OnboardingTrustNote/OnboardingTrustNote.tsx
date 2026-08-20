import React from 'react';
import { cn } from '@/lib/utils';
import { Image } from '@/components/onboarding/OnboardingImage';
import { getOnboardingV2RolePlanCopy } from '@/utils/onboarding-v2-i18n';

export interface OnboardingTrustNoteProps {
    children: React.ReactNode;
    className?: string;
}

export const OnboardingTrustNote: React.FC<OnboardingTrustNoteProps> = ({
    children,
    className
}) => (
    <div className={cn('flex items-start gap-2', className)}>
        <Image
            src="OnboardingLockThin"
            alt=""
            type="vector"
            width={16}
            height={16}
            className="mt-0.5 shrink-0"
            style={{ width: 16, height: 16, color: 'var(--foreground-muted)' }}
        />
        <p className="text-xs leading-[1.45] text-foreground-muted font-instrumentSans">
            {children}{' '}
            <span className="font-bold text-accent-200">{getOnboardingV2RolePlanCopy().boldNote}</span>
        </p>
    </div>
);

export default OnboardingTrustNote;
