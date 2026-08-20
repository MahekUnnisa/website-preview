import React from 'react';
import { cn } from '@/lib/utils';
import { Image, type AssetName } from '@/components/onboarding/OnboardingImage';

export interface OnboardingActionCardProps {
    title: string;
    description: string;
    icon: AssetName;
    className?: string;
    onClick?: () => void;
}

export const OnboardingActionCard: React.FC<OnboardingActionCardProps> = ({
    title,
    description,
    icon,
    className,
    onClick
}) => {
    const Comp = onClick ? 'button' : 'div';

    return (
        <Comp
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={cn(
                'group flex w-full flex-col rounded-xl border border-border bg-background-secondary px-4 py-5 text-left',
                onClick &&
                    'cursor-pointer transition-all duration-200 ease-smooth hover:border-border-strong hover:bg-background-tertiary hover:shadow-1 active:scale-[0.99]',
                className
            )}
        >
            <div className="flex w-full items-start gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3.5">
                    <div
                        className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-colored-bg-blur p-2',
                            onClick && 'transition-colors duration-200 group-hover:bg-accent-colored-bg'
                        )}
                    >
                        <Image
                            src={icon}
                            alt=""
                            type="vector"
                            width={24}
                            height={24}
                            className="text-accent-200"
                            style={{ width: 24, height: 24 }}
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="text-base font-semibold leading-[1.45] text-foreground-primary font-instrumentSans">
                            {title}
                        </p>
                        <p className="text-sm leading-[1.45] text-foreground-muted font-instrumentSans">{description}</p>
                    </div>
                </div>
                <Image
                    src="OnboardingRoleArrowUpRight"
                    alt=""
                    type="vector"
                    width={16}
                    height={16}
                    className={cn(
                        'shrink-0 text-icon-secondary',
                        onClick && 'transition-colors duration-200 group-hover:text-accent-200'
                    )}
                    style={{ width: 16, height: 16 }}
                />
            </div>
        </Comp>
    );
};

export default OnboardingActionCard;
