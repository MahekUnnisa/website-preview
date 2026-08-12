import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { onboardingBodyFontClass } from '@/lib/onboarding-font';
import { OnboardingUserBubble } from './OnboardingUserBubble';
import { OnboardingStatusMessage } from './OnboardingStatusMessage';
import { OnboardingPlanPreviewCard } from './OnboardingPlanPreviewCard';
import { OnboardingFooterActions, type OnboardingFooterAction } from './OnboardingFooterActions';
import { OnboardingTrustNote } from './OnboardingTrustNote';
import { RolePlanEntranceProvider } from './RolePlanEntranceContext';

export interface OnboardingRolePlanPanelProps {
    userChoice: string;
    botMessage: string;
    preview: React.ReactNode;
    steps: React.ReactNode;
    actions: OnboardingFooterAction[];
    trustNote?: React.ReactNode;
    className?: string;
}

const STEP_INTERVAL_MS = 600;
const STEP_ANIMATION_MS = 950;

const flattenStepChildren = (steps: React.ReactNode): React.ReactNode[] =>
    React.Children.toArray(steps).flatMap((child) => {
        if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
            return React.Children.toArray(child.props.children);
        }
        return [child];
    });

export const OnboardingRolePlanPanel: React.FC<OnboardingRolePlanPanelProps> = ({
    userChoice,
    botMessage,
    preview,
    steps,
    actions,
    trustNote,
    className
}) => {
    const [showBubble, setShowBubble] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [showPreviewBg, setShowPreviewBg] = useState(false);
    const [showRegularItems, setShowRegularItems] = useState(false);
    const [showAccentItem, setShowAccentItem] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState(-1);
    const [showFooter, setShowFooter] = useState(false);

    const stepChildren = useMemo(() => flattenStepChildren(steps), [steps]);
    const stepCount = stepChildren.length;

    useEffect(() => {
        const timers: number[] = [];
        const schedule = (fn: () => void, ms: number) => {
            timers.push(window.setTimeout(fn, ms));
        };

        schedule(() => setShowBubble(true), 0);
        schedule(() => setShowStatus(true), 450);
        schedule(() => setShowCard(true), 950);
        schedule(() => setShowPreviewBg(true), 1400);
        schedule(() => setShowRegularItems(true), 1850);
        schedule(() => setShowAccentItem(true), 2350);

        const stepsStart = 2350 + 750;
        for (let i = 0; i < stepCount; i += 1) {
            schedule(() => setActiveStepIndex(i), stepsStart + i * STEP_INTERVAL_MS);
        }

        schedule(
            () => setShowFooter(true),
            stepsStart + stepCount * STEP_INTERVAL_MS + STEP_ANIMATION_MS + 200
        );

        return () => timers.forEach((id) => window.clearTimeout(id));
    }, [stepCount]);

    const entranceState = useMemo(
        () => ({
            showPreviewBg,
            showRegularItems,
            showAccentItem
        }),
        [showPreviewBg, showRegularItems, showAccentItem]
    );

    return (
        <div className={cn('flex w-full max-w-[608px] flex-col gap-6', onboardingBodyFontClass, className)}>
            <OnboardingUserBubble
                className={cn(
                    showBubble ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                )}
            >
                {userChoice}
            </OnboardingUserBubble>

            <OnboardingStatusMessage
                message={botMessage}
                variant="prominent"
                className={cn(showStatus ? 'onboarding-fade-in' : 'pointer-events-none opacity-0')}
            />

            <RolePlanEntranceProvider value={entranceState}>
                <OnboardingPlanPreviewCard
                    className={cn(
                        showCard ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                    )}
                    preview={preview}
                    steps={stepChildren.map((child, index) => {
                        const isShown = index <= activeStepIndex;
                        const isEntering = index === activeStepIndex;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    isEntering && 'onboarding-slide-down',
                                    isShown && !isEntering && 'onboarding-step-visible',
                                    !isShown && 'pointer-events-none opacity-0'
                                )}
                            >
                                {child}
                            </div>
                        );
                    })}
                />
            </RolePlanEntranceProvider>

            <div
                className={cn(
                    'flex flex-col gap-3',
                    showFooter ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                )}
            >
                <OnboardingFooterActions actions={actions} />
                {trustNote ? <OnboardingTrustNote>{trustNote}</OnboardingTrustNote> : null}
            </div>
        </div>
    );
};

export default OnboardingRolePlanPanel;
