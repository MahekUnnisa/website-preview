import React from 'react';
import { cn } from '@/lib/utils';
import { useRolePlanEntrance } from '../RolePlanEntranceContext';

export interface OnboardingPreviewFrameProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export const OnboardingPreviewFrame: React.FC<OnboardingPreviewFrameProps> = ({
    title,
    children,
    className,
    contentClassName
}) => {
    const { showPreviewBg } = useRolePlanEntrance();

    return (
        <div
            className={cn(
                'relative mx-auto h-[303px] w-full max-w-[280px] shrink-0 overflow-hidden rounded-xl bg-background-secondary lg:mx-0',
                showPreviewBg ? 'onboarding-fade-in' : 'pointer-events-none opacity-0',
                className
            )}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[58px] bg-gradient-to-b from-background-secondary from-[19.728%] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[58px] bg-gradient-to-t from-background-secondary from-[19.728%] to-transparent" />
            <div className="absolute left-3 top-1/2 z-20 flex w-[256px] -translate-y-1/2 flex-col items-center gap-2.5">
                <p className="w-full text-center text-[10px] uppercase leading-[1.45] text-foreground-muted font-instrumentSans">
                    {title}
                </p>
                <div
                    className={cn(
                        'w-full rounded-lg bg-border-subtle px-3.5 py-4',
                        showPreviewBg ? 'onboarding-fade-in' : 'opacity-0',
                        contentClassName
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPreviewFrame;
