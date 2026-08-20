import React from 'react';
import LottieImport from 'lottie-react';
import { cn } from '@/lib/utils';
import devbotLoadingAnimation from '@/assets/animations/devbot-loading.json';

/** Native Lottie comp size (matches JSON w/h). Render at native res then scale down to avoid clipping. */
const LOTTIE_NATIVE_SIZE = 40;

type LottieProps = {
    animationData: unknown;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Vite 8 / Storybook can resolve `lottie-react` CJS as a module object
 * (`{ default: Component }`) instead of the component function.
 */
const Lottie = (
    typeof LottieImport === 'function'
        ? LottieImport
        : (LottieImport as unknown as { default: React.ComponentType<LottieProps> }).default
) as React.ComponentType<LottieProps>;

type OnboardingLoadingIconProps = {
    size?: number;
    className?: string;
    animation?: string;
    accent?: string;
    loop?: boolean;
    isPaused?: boolean;
};

/** Devbot Lottie loader (purple theme — matches extension onboarding). */
export const OnboardingLoadingIcon: React.FC<OnboardingLoadingIconProps> = ({
    size = 20,
    className,
    loop = true,
    isPaused = false,
}) => {
    const scale = size / LOTTIE_NATIVE_SIZE;

    return (
        <div
            className={cn('flex shrink-0 items-center justify-center overflow-visible', className)}
            style={{ width: size, height: size }}
            aria-hidden
        >
            <div
                className="overflow-visible"
                style={{
                    width: LOTTIE_NATIVE_SIZE,
                    height: LOTTIE_NATIVE_SIZE,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                }}
            >
                <Lottie
                    animationData={devbotLoadingAnimation}
                    loop={loop}
                    autoplay={!isPaused}
                    className="block overflow-visible"
                    style={{ width: LOTTIE_NATIVE_SIZE, height: LOTTIE_NATIVE_SIZE }}
                />
            </div>
        </div>
    );
};

export const LoadingAnimation = OnboardingLoadingIcon;

export default OnboardingLoadingIcon;
