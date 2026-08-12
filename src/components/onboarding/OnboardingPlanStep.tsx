import React from 'react';
import { cn } from '@/lib/utils';

export interface OnboardingPlanStepProps {
    step: number;
    children: React.ReactNode;
    className?: string;
}

export const OnboardingPlanStep: React.FC<OnboardingPlanStepProps> = ({ step, children, className }) => (
    <div className={cn('flex items-start gap-3', className)}>
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-colored-bg text-sm font-semibold leading-[1.2] text-accent-200 font-instrumentSans">
            {step}
        </div>
        <div className="min-w-0 flex-1 text-sm leading-[1.45] text-foreground-secondary font-instrumentSans">
            {children}
        </div>
    </div>
);

export default OnboardingPlanStep;
