import React from 'react';
import LottieImport from 'lottie-react';
import { cn } from '@/lib/utils';
import { Image } from '@/components/onboarding/OnboardingImage';
import successCheckAnimation from '@/assets/animations/success-check.json';
import type { AuthErrorTone } from '@/lib/auth-error-codes';
import {
    canCloseOAuthWindow,
    leaveOAuthCallback,
    oauthCallbackActionLabel,
    oauthCallbackCountdownLabel
} from '@/lib/onboard-oauth';

type LottieProps = {
    animationData: unknown;
    loop?: boolean;
    autoplay?: boolean;
    style?: React.CSSProperties;
};

const Lottie = (
    typeof LottieImport === 'function'
        ? LottieImport
        : (LottieImport as unknown as { default: React.ComponentType<LottieProps> }).default
) as React.ComponentType<LottieProps>;

export type OnboardOAuthTabStatus = 'loading' | 'success' | 'error';

export interface OnboardOAuthTabProps {
    status: OnboardOAuthTabStatus;
    countdown?: number;
    canClose?: boolean;
    actionLabel?: string;
    errorTitle?: string;
    errorDescription?: string;
    errorTone?: AuthErrorTone;
    onClose?: () => void;
}

const COPY = {
    loadingTitle: 'Logging you in...',
    loadingDesc: 'Please wait while we complete the authentication process.',
    successTitle: 'Authentication successful.',
    successDesc: 'You have successfully logged in.',
    errorTitle: 'Authentication Failed',
    errorDesc: "We couldn't complete the login process. Please try again.",
};

const CheckAnimation = () => (
    <Lottie
        animationData={successCheckAnimation}
        loop
        autoplay
        style={{ width: 150, height: 150 }}
    />
);

export const OnboardOAuthTab: React.FC<OnboardOAuthTabProps> = ({
    status,
    countdown,
    canClose = canCloseOAuthWindow(),
    actionLabel,
    errorTitle = COPY.errorTitle,
    errorDescription = COPY.errorDesc,
    errorTone = 'error',
    onClose
}) => {
    const close = onClose ?? leaveOAuthCallback;
    const buttonLabel = actionLabel ?? oauthCallbackActionLabel(canClose);
    const countdownText =
        countdown != null && countdown > 0 ? oauthCallbackCountdownLabel(canClose, countdown) : null;
    const isWarning = errorTone === 'warning';

    return (
        <div className="flex min-h-dvh items-center justify-center bg-background p-4">
            <div className="h-[366px] w-[380px] rounded-lg border border-border bg-background-secondary p-5 shadow-lg">
                {status === 'error' ? (
                    <div className="text-center">
                        <div className="flex h-[150px] items-center justify-center">
                            <Image
                                src={isWarning ? 'OnboardingWarningCircleLight' : 'OnboardingXCircleLight'}
                                alt=""
                                type="vector"
                                className={cn('size-20', isWarning ? 'text-warning' : 'text-error')}
                                style={{ width: 80, height: 80 }}
                            />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-foreground-primary">{errorTitle}</h2>
                        <p className="mt-2 text-sm text-foreground-primary">{errorDescription}</p>
                        {countdownText ? (
                            <p className="mt-2 text-xs text-foreground-muted">{countdownText}</p>
                        ) : null}
                        <button
                            type="button"
                            onClick={close}
                            className="mt-6 rounded-md bg-accent-400 px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
                        >
                            {buttonLabel}
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center">
                            <CheckAnimation />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-foreground-primary">
                            {status === 'loading' ? COPY.loadingTitle : COPY.successTitle}
                        </h2>
                        <p
                            className={cn(
                                'mt-2 text-sm',
                                status === 'success' ? 'text-foreground-muted' : 'text-foreground-primary'
                            )}
                        >
                            {status === 'loading' ? COPY.loadingDesc : COPY.successDesc}
                        </p>
                        {status === 'success' ? (
                            <>
                                {countdownText ? (
                                    <p className="mt-2 text-xs text-foreground-muted">{countdownText}</p>
                                ) : null}
                                {canClose ? (
                                    <button
                                        type="button"
                                        onClick={close}
                                        className="mt-6 rounded-md bg-accent-400 px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
                                    >
                                        {buttonLabel}
                                    </button>
                                ) : null}
                            </>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardOAuthTab;
