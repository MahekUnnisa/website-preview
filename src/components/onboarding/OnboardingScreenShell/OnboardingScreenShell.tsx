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
    /** Wider main column for calendar + insight / welcome hero. */
    size?: 'default' | 'wide';
    /** Vertically center main content (large screens); scrolls from top when content overflows. */
    center?: boolean;
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
    size = 'default',
    center = false,
}) => (
    <div
        className={cn(
            'relative flex min-h-dvh w-full flex-col overflow-x-hidden overflow-y-auto bg-background pb-[env(safe-area-inset-bottom)]',
            onboardingBodyFontClass,
            className
        )}
        style={dottedGridStyle}
    >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[182px] bg-[radial-gradient(ellipse_at_top,var(--accent-400-15),transparent_70%)]" />

        <header className="relative z-10 flex h-14 shrink-0 items-center justify-between px-5 pt-3 sm:h-16 sm:px-6 sm:pt-[17px] lg:px-10 xl:px-12">
            <div className="flex items-center gap-[7px]">
                <Image src="Logo" alt="ZeroAI" width={53} height={16} style={{ width: 53, height: 16 }} />
                <span
                    className="size-[6px] rounded-full bg-online-indicator shadow-[0_0_8px_2px_rgba(44,194,100,0.7)]"
                    aria-hidden
                />
            </div>
            {headerTrailing}
        </header>

        <main
            className={cn(
                'relative z-10 mx-auto flex w-full flex-1 flex-col px-5 pb-5 sm:px-8 sm:pb-12 lg:px-10',
                size === 'wide'
                    ? 'max-w-[960px] xl:max-w-[1120px] 2xl:max-w-[1240px]'
                    : 'max-w-[720px] xl:max-w-[840px] 2xl:max-w-[920px]',
                mainClassName
            )}
        >
            {center ? <div className="my-auto w-full py-6 sm:py-10">{children}</div> : children}
        </main>

        {footer}
    </div>
);

export default OnboardingScreenShell;
