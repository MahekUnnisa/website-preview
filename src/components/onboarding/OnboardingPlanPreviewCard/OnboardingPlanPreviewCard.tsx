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
            'flex w-full flex-col gap-5 rounded-xl border border-border-muted bg-background-secondary p-4 lg:flex-row lg:items-stretch',
            className
        )}
    >
        <div className="flex w-full min-w-0 flex-1 flex-col justify-center rounded-xl bg-background-tertiary px-4 py-9 lg:w-[268px] lg:shrink-0">
            <OnboardingPlanSteps className="w-full gap-5">{steps}</OnboardingPlanSteps>
        </div>
        {preview}
    </div>
);

export default OnboardingPlanPreviewCard;
