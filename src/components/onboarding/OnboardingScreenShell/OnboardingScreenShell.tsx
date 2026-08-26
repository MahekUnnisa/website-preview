import React from 'react';
import { Link } from 'react-router';
import { cn, publicUrl } from '@/lib/utils';
import { onboardingBodyFontClass } from '@/lib/onboarding-font';
import { Image } from '@/components/onboarding/OnboardingImage';

export type OnboardingShellVariant = 'default' | 'landing';

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
    /** Kept for callers; both values use the marketing landing background. */
    variant?: OnboardingShellVariant;
}

const landingAsset = (name: string) => publicUrl(`/assets/landing/${name}`);

function LandingBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute left-0 top-0 h-[400.5px] w-[479px]">
                <div className="absolute inset-[0_0_-0.25%_-0.21%]">
                    <img alt="" src={landingAsset('grid-corner.svg')} className="block size-full max-w-none" />
                </div>
            </div>
            <div className="absolute bottom-0 right-0 hidden h-[400.5px] w-[479px] md:block">
                <div className="-scale-y-100">
                    <div className="relative h-[400.5px] w-[479px]">
                        <div className="absolute inset-[0_0_-0.25%_-0.21%]">
                            <img alt="" src={landingAsset('grid-corner-2.svg')} className="block size-full max-w-none" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-[-91px] h-[182px] w-[788px] -translate-x-1/2">
                <img
                    alt=""
                    src={landingAsset('glow-ellipse.svg')}
                    className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
                    width={1188}
                    height={582}
                />
            </div>
            <img
                alt=""
                src={landingAsset('hero-noise.svg')}
                width={1400}
                height={810}
                className="absolute inset-0 size-full object-cover"
            />
        </div>
    );
}

export const OnboardingScreenShell: React.FC<OnboardingScreenShellProps> = ({
    children,
    headerTrailing,
    footer,
    mainClassName,
    className,
    size = 'default',
    center = false,
    variant: _variant = 'default',
}) => (
    <div
        className={cn(
            'relative flex min-h-dvh w-full flex-col overflow-x-hidden overflow-y-auto bg-background pb-[env(safe-area-inset-bottom)]',
            onboardingBodyFontClass,
            className
        )}
    >
        <LandingBackground />

        <header className="relative z-10 flex h-14 shrink-0 items-center justify-between px-5 pt-3 sm:h-16 sm:px-6 sm:pt-[17px] lg:px-10 xl:px-12">
            <Link to="/" className="flex items-center gap-[7px]">
                <Image src="Logo" alt="ZeroAI" width={53} height={16} style={{ width: 53, height: 16 }} />
                <span
                    className="size-[6px] rounded-full bg-online-indicator shadow-[0_0_8px_2px_rgba(44,194,100,0.7)]"
                    aria-hidden
                />
            </Link>
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
