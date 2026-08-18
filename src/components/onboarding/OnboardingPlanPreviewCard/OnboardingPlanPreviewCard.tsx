import React from 'react';
import { cn } from '@/lib/utils';
import { OnboardingPlanSteps } from '../OnboardingPlanSteps';

export interface OnboardingPlanPreviewCardProps {
    preview: React.ReactNode;
    steps: React.ReactNode;
    className?: string;
}

export const OnboardingPlanPreviewCard: React.FC<OnboardingPlanPreviewCardProps> = ({
    preview,
    steps,
    className
}) => (
    <div
        className={cn(
            'flex w-full flex-col gap-4 rounded-xl border border-border-muted bg-background-secondary p-4 sm:p-5 lg:w-[608px] lg:flex-row lg:items-stretch lg:gap-5 xl:p-6',
            className
        )}
    >
        <div className="order-2 flex w-full min-w-0 flex-col justify-center rounded-xl bg-background-tertiary px-3.5 py-5 sm:px-4 sm:py-6 lg:order-1 lg:w-[268px] lg:shrink-0 lg:py-9 xl:w-[268px] xl:px-4">
            <OnboardingPlanSteps className="w-full gap-6">{steps}</OnboardingPlanSteps>
        </div>
        <div className="order-1 flex w-full justify-center lg:order-2 lg:w-[280px] lg:shrink-0">{preview}</div>
    </div>
);

export default OnboardingPlanPreviewCard;
