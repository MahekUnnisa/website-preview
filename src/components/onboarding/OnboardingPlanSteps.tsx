import React from 'react';
import { cn } from '@/lib/utils';

export interface OnboardingPlanStepsProps {
    children: React.ReactNode;
    className?: string;
}

export const OnboardingPlanSteps: React.FC<OnboardingPlanStepsProps> = ({ children, className }) => (
    <div className={cn('flex flex-col gap-[12px]', className)}>{children}</div>
);

export default OnboardingPlanSteps;
