import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingAnimation } from '@/components/onboarding/OnboardingLoadingIcon';
import { Image } from '@/components/onboarding/OnboardingImage';

export interface OnboardingStatusMessageProps {
    message: string;
    variant?: 'default' | 'prominent';
    loadingIcon?: boolean;
    className?: string;
}

export const OnboardingStatusMessage: React.FC<OnboardingStatusMessageProps> = ({
    message,
    variant = 'default',
    loadingIcon = false,
    className
}) => {
    return (
        <div className={cn('flex items-center gap-2.5', loadingIcon && 'onboarding-fade-in', className)}>
            <div
                className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-[14px] bg-accent-colored-bg',
                    loadingIcon ? 'overflow-visible' : 'overflow-hidden'
                )}
            >
                {loadingIcon ? (
                    <LoadingAnimation size={20} className="flex-none" />
                ) : (
                    <Image
                        src="DevbotIcon"
                        alt=""
                        type="vector"
                        width={16}
                        height={16}
                        className="text-accent-200"
                        style={{ width: 16, height: 16 }}
                    />
                )}
            </div>
            <p
                className={cn(
                    'leading-[1.45] font-instrumentSans',
                    variant === 'prominent'
                        ? 'text-[15px] font-semibold text-foreground-secondary'
                        : 'text-xs text-foreground-primary'
                )}
            >
                {message}
            </p>
        </div>
    );
};

export default OnboardingStatusMessage;
