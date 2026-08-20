import React from 'react';
import { cn } from '@/lib/utils';

export interface OnboardingUserBubbleProps {
    children: React.ReactNode;
    className?: string;
}

export const OnboardingUserBubble: React.FC<OnboardingUserBubbleProps> = ({ children, className }) => (
    <div className={cn('flex justify-end', className)}>
        <div className="rounded-lg rounded-tr-none bg-border-muted px-4 py-2 text-[15px] leading-[1.45] text-foreground-secondary font-instrumentSans">
            {children}
        </div>
    </div>
);

export default OnboardingUserBubble;
