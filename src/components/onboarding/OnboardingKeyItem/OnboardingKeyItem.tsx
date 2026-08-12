import React from 'react';
import { cn } from '@/lib/utils';
import { Image, type AssetName } from '@/components/onboarding/OnboardingImage';

export type OnboardingKeyIconVariant = 'accent' | 'success' | 'brand';

export interface OnboardingKeyItemProps {
    keyLabel: string;
    title: string;
    description: string;
    /** Theme asset when not using iconUrl. */
    icon?: AssetName;
    /** External favicon / brand URL (e.g. Slack). Preferred over icon when set. */
    iconUrl?: string;
    iconType?: 'vector' | 'raster';
    iconVariant?: OnboardingKeyIconVariant;
    connected?: boolean;
    /** OAuth failed — show error X instead of brand icon (until connected). */
    failed?: boolean;
    /** Always-visible trailing hint on the KEY label row (e.g. Google required). */
    requiredHint?: string;
    /** Shown instead of requiredHint when connected (Figma: green “Connected”). */
    connectedLabel?: string;
    footer?: React.ReactNode;
    className?: string;
}

const iconShellClass: Record<OnboardingKeyIconVariant, string> = {
    accent: 'bg-accent-colored-bg-blur',
    success: 'bg-[rgba(13,167,103,0.15)]',
    brand: 'bg-accent-colored-bg-blur'
};

export const OnboardingKeyItem: React.FC<OnboardingKeyItemProps> = ({
    keyLabel,
    title,
    description,
    icon,
    iconUrl,
    iconType = 'vector',
    iconVariant = 'accent',
    connected = false,
    failed = false,
    requiredHint,
    connectedLabel = 'Connected',
    footer,
    className
}) => {
    const showFailed = failed && !connected;

    return (
        <div className={cn('flex w-full items-start gap-3.5', className)}>
            <div
                className={cn(
                    'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] p-2 transition-colors duration-500 ease-out',
                    connected
                        ? iconShellClass.success
                        : showFailed
                          ? 'bg-[rgba(208,69,84,0.15)]'
                          : iconShellClass[iconVariant]
                )}
            >
                <div
                    className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out',
                        connected || showFailed ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
                    )}
                    aria-hidden={connected || showFailed}
                >
                    {iconUrl ? (
                        <img src={iconUrl} alt="" className="size-5 object-contain" />
                    ) : icon && iconType === 'raster' ? (
                        <Image src={icon} alt="" width={20} height={20} className="size-5 object-contain" />
                    ) : icon ? (
                        <Image
                            src={icon}
                            alt=""
                            type="vector"
                            width={24}
                            height={24}
                            style={{
                                width: 24,
                                height: 24,
                                color: 'var(--accent-200)'
                            }}
                        />
                    ) : null}
                </div>
                <div
                    className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out',
                        showFailed ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                    )}
                    aria-hidden={!showFailed}
                >
                    <Image
                        src="OnboardingXCircleLight"
                        alt=""
                        type="vector"
                        width={24}
                        height={24}
                        style={{
                            width: 24,
                            height: 24,
                            color: 'var(--semantics-error-100)'
                        }}
                    />
                </div>
                <div
                    className={cn(
                        'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out',
                        connected ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                    )}
                    aria-hidden={!connected}
                >
                    <Image
                        src="OnboardingCheckCircleLight"
                        alt=""
                        type="vector"
                        width={24}
                        height={24}
                        style={{
                            width: 24,
                            height: 24,
                            color: 'var(--semantics-success-100)'
                        }}
                    />
                </div>
            </div>
            <div className={cn('flex min-w-0 flex-1 flex-col', footer ? 'gap-4' : 'gap-2')}>
                <div className="flex flex-col gap-2">
                    <div className="flex w-full items-start justify-between gap-3">
                        <p className="text-xs leading-[1.45] text-accent-200 font-instrumentSans">{keyLabel}</p>
                        {connected ? (
                            <p className="shrink-0 text-xs leading-[1.45] text-semantics-success-100 font-instrumentSans">
                                {connectedLabel}
                            </p>
                        ) : requiredHint ? (
                            <p className="shrink-0 text-xs leading-[1.45] text-semantics-error-100 font-instrumentSans">
                                {requiredHint}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-base font-bold leading-[1.45] text-foreground-primary font-aeonik">
                            {title}
                        </p>
                        <p className="text-sm leading-[1.45] text-foreground-muted font-instrumentSans">
                            {description}
                        </p>
                    </div>
                </div>
                {footer}
            </div>
        </div>
    );
};

export default OnboardingKeyItem;
