import React from 'react';
import { cn } from '@/lib/utils';
import { onboardingBodyFontClass } from '@/lib/onboarding-font';
import { Image } from '@/components/onboarding/OnboardingImage';

export interface OnboardingScreenShellProps {
    children: React.ReactNode;
    headerTrailing?: React.ReactNode;
    footer?: React.ReactNode;
    mainClassName?: string;
    className?: string;
}

const dottedGridStyle: React.CSSProperties = {
    backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
    backgroundSize: '16px 16px',
    backgroundPosition: 'center',
};

export const OnboardingScreenShell: React.FC<OnboardingScreenShellProps> = ({
    children,
    headerTrailing,
    footer,
    mainClassName,
    className,
}) => (
    <div
        className={cn(
            'relative flex min-h-screen w-full flex-col overflow-hidden bg-background',
            onboardingBodyFontClass,
            className
        )}
        style={dottedGridStyle}
    >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[182px] bg-[radial-gradient(ellipse_at_top,var(--accent-400-15),transparent_70%)]" />

        <header className="relative z-10 flex h-16 shrink-0 items-center justify-between px-8 pt-[17px]">
            <div className="flex items-center gap-[7px]">
                <Image src="Logo" alt="ZeroAI" width={53} height={16} style={{ width: 53, height: 16 }} />
                <span
                    className="size-[6px] rounded-full bg-online-indicator shadow-[0_0_8px_2px_rgba(44,194,100,0.7)]"
                    aria-hidden
                />
            </div>
            {headerTrailing}
        </header>

        <main className={cn('relative z-10 mx-auto flex w-full max-w-[640px] flex-1 flex-col px-4', mainClassName)}>
            {children}
        </main>

        {footer}
    </div>
);

export default OnboardingScreenShell;
