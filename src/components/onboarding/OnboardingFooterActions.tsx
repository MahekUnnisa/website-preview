import React from 'react';
import { cn } from '@/lib/utils';
import { Image, type AssetName } from '@/components/onboarding/OnboardingImage';
import { OnboardingPrimaryButton } from './OnboardingPrimaryButton';

export interface OnboardingFooterAction {
    label: string;
    onClick?: () => void;
    icon?: AssetName;
    iconType?: 'vector' | 'raster';
    variant?: 'primary' | 'ghost' | 'back';
    /** 0–1 fill for left-to-right progress on primary buttons. */
    progress?: number;
}

export interface OnboardingFooterActionsProps {
    actions: OnboardingFooterAction[];
    className?: string;
}

export const OnboardingFooterActions: React.FC<OnboardingFooterActionsProps> = ({ actions, className }) => (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
        {actions.map((action) => {
            if (action.variant === 'back') {
                return (
                    <button
                        key={action.label}
                        type="button"
                        onClick={action.onClick}
                        aria-label={action.label}
                        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-foreground-subtle transition-opacity hover:opacity-80"
                    >
                        <Image
                            src="ArrowLeftIcon"
                            alt=""
                            type="vector"
                            width={20}
                            height={20}
                            style={{ width: 20, height: 20, color: 'var(--icon-primary)' }}
                        />
                    </button>
                );
            }

            if (action.variant === 'ghost') {
                return (
                    <button
                        key={action.label}
                        type="button"
                        onClick={action.onClick}
                        className="flex h-12 items-center px-6 text-[15px] font-medium leading-[23px] text-accent-200 transition-opacity hover:opacity-80"
                    >
                        {action.label}
                    </button>
                );
            }

            return (
                <OnboardingPrimaryButton
                    key={action.label}
                    onClick={action.onClick}
                    progress={action.progress}
                    shellClassName="h-12"
                    className="pl-5 pr-6 text-[15px] font-medium leading-[23px]"
                >
                    {action.icon ? (
                        action.iconType === 'raster' ? (
                            <Image src={action.icon} alt="" width={20} height={20} className="size-5" />
                        ) : (
                            <Image
                                src={action.icon}
                                alt=""
                                type="vector"
                                width={20}
                                height={20}
                                style={{ width: 20, height: 20, color: 'white' }}
                            />
                        )
                    ) : null}
                    {action.label}
                </OnboardingPrimaryButton>
            );
        })}
    </div>
);

export default OnboardingFooterActions;
