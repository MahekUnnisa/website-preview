import React from 'react';
import { cn } from '@/lib/utils';

export interface OnboardingKeysPanelProps {
    children: React.ReactNode;
    className?: string;
}

export const OnboardingKeysPanel: React.FC<OnboardingKeysPanelProps> = ({ children, className }) => (
    <div
        className={cn(
            'w-full rounded-xl bg-gradient-to-b from-background-tertiary to-background-secondary px-4 py-5',
            className
        )}
    >
        <div className="flex flex-col gap-5">{children}</div>
    </div>
);

export const OnboardingKeysDivider: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('h-px w-full border-t border-dashed border-border', className)} />
);

export default OnboardingKeysPanel;
