import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useOnboardingTyping } from '@/hooks/useOnboardingTyping';

export interface OnboardingKeysSetupPanelProps {
    title: string;
    description?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    /** When true, keep content/footer visible — avoids re-fading on in-step connection updates. */
    entranceComplete?: boolean;
    className?: string;
    contentClassName?: string;
}

export const OnboardingKeysSetupPanel: React.FC<OnboardingKeysSetupPanelProps> = ({
    title,
    description,
    children,
    footer,
    entranceComplete = false,
    className,
    contentClassName
}) => {
    const [typingDone, setTypingDone] = useState(entranceComplete);
    const [showDescription, setShowDescription] = useState(entranceComplete);
    const [showContent, setShowContent] = useState(entranceComplete);
    const [showFooter, setShowFooter] = useState(entranceComplete);

    const displayedTitle = useOnboardingTyping(title, () => setTypingDone(true), entranceComplete);

    useEffect(() => {
        if (!typingDone) return undefined;
        if (!description) {
            setShowDescription(true);
            return undefined;
        }
        const timer = window.setTimeout(() => setShowDescription(true), 300);
        return () => window.clearTimeout(timer);
    }, [description, typingDone]);

    useEffect(() => {
        if (!showDescription) return undefined;
        const timer = window.setTimeout(() => setShowContent(true), 400);
        return () => window.clearTimeout(timer);
    }, [showDescription]);

    useEffect(() => {
        if (!showContent) return undefined;
        const timer = window.setTimeout(() => setShowFooter(true), 400);
        return () => window.clearTimeout(timer);
    }, [showContent]);

    return (
        <div className={cn('flex w-full max-w-[608px] flex-col gap-[30px]', className)}>
            <div className="flex flex-col gap-3">
                <h1 className="relative text-[28px] font-bold leading-[1.35] text-foreground-secondary font-aeonik">
                    <span className="invisible" aria-hidden>
                        {title}
                    </span>
                    <span className="absolute inset-0" aria-live="polite">
                        {displayedTitle}
                    </span>
                </h1>
                {description ? (
                    <div
                        className={cn(
                            'text-sm leading-[1.45] text-foreground-muted font-instrumentSans',
                            showDescription ? 'onboarding-fade-in' : 'invisible'
                        )}
                    >
                        {description}
                    </div>
                ) : null}
            </div>

            {children ? (
                <div
                    className={cn(
                        'flex w-full flex-col gap-8',
                        contentClassName,
                        showContent ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                    )}
                >
                    {children}
                </div>
            ) : null}

            {footer ? (
                <div
                    className={cn(
                        showFooter ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                    )}
                >
                    {footer}
                </div>
            ) : null}
        </div>
    );
};

export default OnboardingKeysSetupPanel;
