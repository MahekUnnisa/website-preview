import React from 'react';
import { cn } from '@/lib/utils';

export interface OnboardingPrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** 0–1 fill for left-to-right progress overlay. */
    progress?: number;
    /** Outer shell class (size, margin). */
    shellClassName?: string;
}

/**
 * Primary onboarding CTA: border-widget shell + borderless gradient fill
 * (Hire me / Connect my tools rim treatment).
 */
export const OnboardingPrimaryButton: React.FC<OnboardingPrimaryButtonProps> = ({
    children,
    className,
    shellClassName,
    progress,
    type = 'button',
    ...props
}) => {
    const fill = progress != null ? Math.min(1, Math.max(0, progress)) : undefined;

    return (
        <button
            type={type}
            className={cn(
                'inline-flex min-h-12 cursor-pointer rounded-lg bg-border-widget p-[3px] transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50',
                shellClassName
            )}
            {...props}
        >
            <span
                className={cn(
                    'relative flex h-full w-full items-center justify-center overflow-hidden rounded-[5px] bg-gradient-to-b from-accent-200 to-accent-500 text-white',
                    className
                )}
            >
                {fill != null ? (
                    <span
                        className="pointer-events-none absolute inset-y-0 left-0 bg-white/15"
                        style={{ width: `${fill * 100}%` }}
                        aria-hidden
                    />
                ) : null}
                <span className="relative z-[1] flex items-center gap-2">{children}</span>
            </span>
        </button>
    );
};

export default OnboardingPrimaryButton;
