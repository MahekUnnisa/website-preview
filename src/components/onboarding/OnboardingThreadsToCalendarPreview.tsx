import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Image } from '@/components/onboarding/OnboardingImage';
import { getOnboardingV2InsightCopy } from '@/utils/onboarding-v2-i18n';
import { OnboardingPreviewFrame } from './OnboardingPreviewFrame';
import { useRolePlanEntrance } from './RolePlanEntranceContext';

export type OnboardingThreadSlotTone = 'today' | 'scheduled';

export interface OnboardingThreadToCalendarItem {
    id: string;
    message: string;
    slotLabel: string;
    tone?: OnboardingThreadSlotTone;
    /** When true, render message as skeleton lines. */
    skeleton?: boolean;
}

export interface OnboardingThreadsToCalendarPreviewProps {
    items: OnboardingThreadToCalendarItem[];
    title?: string;
    className?: string;
}

const THREAD_INTERVAL_MS = 450;

const slotToneClass: Record<OnboardingThreadSlotTone, string> = {
    today: 'text-semantics-warning-100',
    scheduled: 'text-accent-200'
};

const slotOffsetClass: Record<number, string> = {
    0: 'left-[61px]',
    1: 'left-[63px]',
    2: 'left-[75px]'
};

const ThreadRow: React.FC<{
    item: OnboardingThreadToCalendarItem;
    index: number;
    taskClassName?: string;
    slotClassName?: string;
}> = ({ item, index, taskClassName, slotClassName }) => (
    <div className="relative h-[66px] w-[190px]">
        <div
            className={cn(
                'flex h-9 items-center rounded-md bg-foreground-subtle px-2.5 py-1.5',
                index % 2 === 0 ? 'rotate-2' : '-rotate-2',
                taskClassName
            )}
        >
            <div className="flex min-w-0 items-center gap-2">
                <Image
                    src="OnboardingRoleChat"
                    alt=""
                    type="vector"
                    width={16}
                    height={16}
                    className="shrink-0 text-foreground-secondary"
                    style={{ width: 16, height: 16 }}
                />
                {item.skeleton ? (
                    <div className="flex gap-1.5">
                        <span className="h-1 w-[79px] rounded-sm bg-white/30" />
                        <span className="h-1 w-8 rounded-sm bg-white/30" />
                    </div>
                ) : (
                    <p className="min-w-0 text-xs font-medium leading-[1.45] text-foreground-muted font-instrumentSans">
                        {item.message}
                    </p>
                )}
            </div>
        </div>
        <div
            className={cn(
                'absolute top-[30px] rounded-md border border-border-muted bg-background-secondary px-2.5 py-1.5',
                slotOffsetClass[index] ?? 'left-[61px]',
                slotClassName
            )}
        >
            <p
                className={cn(
                    'whitespace-nowrap text-[10px] font-medium leading-[1.45] font-instrumentSans',
                    slotToneClass[item.tone ?? 'scheduled']
                )}
            >
                → {item.slotLabel}
            </p>
        </div>
    </div>
);

export const OnboardingThreadsToCalendarPreview: React.FC<OnboardingThreadsToCalendarPreviewProps> = ({
    items,
    title = getOnboardingV2InsightCopy().threadsPreviewTitle,
    className
}) => {
    const { showRegularItems } = useRolePlanEntrance();
    const [activeThreadIndex, setActiveThreadIndex] = useState(-1);
    const [showSlots, setShowSlots] = useState(false);

    useEffect(() => {
        if (!showRegularItems) return undefined;

        const timers: number[] = [];
        items.forEach((_, index) => {
            timers.push(window.setTimeout(() => setActiveThreadIndex(index), index * THREAD_INTERVAL_MS));
        });
        timers.push(window.setTimeout(() => setShowSlots(true), items.length * THREAD_INTERVAL_MS + 200));

        return () => timers.forEach((id) => window.clearTimeout(id));
    }, [showRegularItems, items]);

    return (
        <OnboardingPreviewFrame
            title={title}
            className={className}
            contentClassName="flex flex-col items-center gap-5 px-3.5 py-4"
        >
            {items.map((item, index) => {
                const taskShown = index <= activeThreadIndex;
                const taskEntering = index === activeThreadIndex;

                return (
                    <ThreadRow
                        key={item.id}
                        item={item}
                        index={index}
                        taskClassName={cn(
                            taskEntering && 'onboarding-slide-from-left',
                            taskShown && !taskEntering && 'onboarding-step-visible',
                            !taskShown && 'pointer-events-none opacity-0 -translate-x-[56px]'
                        )}
                        slotClassName={cn(showSlots ? 'onboarding-fade-in' : 'pointer-events-none opacity-0')}
                    />
                );
            })}
        </OnboardingPreviewFrame>
    );
};

export default OnboardingThreadsToCalendarPreview;
