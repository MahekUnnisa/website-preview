import React from 'react';
import { cn } from '@/lib/utils';
import { Image, type AssetName } from '@/components/onboarding/OnboardingImage';
import { useRolePlanEntrance } from '../RolePlanEntranceContext';

export type OnboardingScheduleEventVariant = 'default' | 'featured';

export interface OnboardingScheduleEvent {
    id: string;
    title: string;
    timeLabel: string;
    description?: string;
    variant?: OnboardingScheduleEventVariant;
    /** When true, render title as skeleton lines (Figma placeholder chrome). */
    skeleton?: boolean;
    badge?: {
        icon?: AssetName;
        label: string;
    };
}

export interface OnboardingSchedulePreviewProps {
    events: OnboardingScheduleEvent[];
    className?: string;
}

/** Figma node 13247:37132 — absolute event tops within the 320px preview */
const SCHEDULE_EVENT_TOP: Record<string, number> = {
    standup: 44,
    'deep-work': 76,
    comms: 166,
    eod: 225
};

const SkeletonBars: React.FC = () => (
    <div className="flex gap-1.5">
        <span className="h-1 w-[51px] rounded-sm bg-white/30" />
        <span className="h-1 w-[19px] rounded-sm bg-white/30" />
    </div>
);

const ScheduleEventRow: React.FC<{
    event: OnboardingScheduleEvent;
    entranceClassName?: string;
    style?: React.CSSProperties;
}> = ({ event, entranceClassName, style }) => {
    const isFeatured = event.variant === 'featured';

    return (
        <div
            className={cn(
                'absolute left-[69px] w-[199px] rounded-lg border border-dashed px-3',
                isFeatured
                    ? 'border-onboarding-featured-border bg-gradient-to-b from-onboarding-featured-from to-onboarding-featured-to py-2.5 shadow-[0_0_8px_var(--accent-400-30)]'
                    : 'border-border bg-foreground-subtle py-1.5',
                entranceClassName
            )}
            style={style}
        >
            {isFeatured ? (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] leading-[1.35] text-onboarding-featured-muted font-instrumentSans">
                            {event.timeLabel}
                        </span>
                        {event.badge ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold leading-[14px] text-onboarding-badge-accent font-instrumentSans">
                                {event.badge.icon ? (
                                    <Image
                                        src={event.badge.icon}
                                        alt=""
                                        type="vector"
                                        width={14}
                                        height={14}
                                        className="text-onboarding-badge-accent"
                                        style={{ width: 14, height: 14, color: 'var(--onboarding-badge-accent)' }}
                                    />
                                ) : null}
                                {event.badge.label}
                            </span>
                        ) : null}
                    </div>
                    <p className="text-[10px] font-semibold leading-[1.35] text-onboarding-featured-fg font-instrumentSans">
                        {event.title}
                    </p>
                    {event.description ? (
                        <p className="text-[10px] leading-[1.35] text-onboarding-featured-muted font-instrumentSans">
                            {event.description}
                        </p>
                    ) : null}
                </div>
            ) : (
                <div className={cn('flex gap-3', event.description ? 'flex-col gap-1' : 'items-center')}>
                    {event.skeleton ? (
                        <div className="flex w-full items-center justify-between gap-3">
                            <SkeletonBars />
                            <p className="shrink-0 text-[10px] leading-[14px] text-foreground-muted font-instrumentSans">
                                {event.timeLabel}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[10px] font-medium leading-[14px] text-foreground-primary font-instrumentSans">
                                    {event.title}
                                </p>
                                <p className="shrink-0 text-[10px] leading-[14px] text-foreground-muted font-instrumentSans">
                                    {event.timeLabel}
                                </p>
                            </div>
                            {event.description ? (
                                <p className="text-[10px] leading-[14px] text-foreground-muted font-instrumentSans">
                                    {event.description}
                                </p>
                            ) : null}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export const OnboardingSchedulePreview: React.FC<OnboardingSchedulePreviewProps> = ({ events, className }) => {
    const { showPreviewBg, showRegularItems, showAccentItem } = useRolePlanEntrance();

    return (
        <div
            className={cn(
                'relative mx-auto h-[320px] w-full max-w-[280px] shrink-0 overflow-hidden rounded-xl bg-background-secondary lg:mx-0',
                showPreviewBg ? 'onboarding-fade-in' : 'pointer-events-none opacity-0',
                className
            )}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[76px] bg-gradient-to-b from-background-secondary from-[19.728%] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[95px] bg-gradient-to-t from-background-secondary from-[19.728%] to-transparent" />

            <div
                className={cn(
                    'absolute left-3 top-1/2 flex w-[254px] -translate-y-1/2 gap-2.5',
                    showPreviewBg ? 'opacity-100' : 'opacity-0'
                )}
            >
                <div className="flex flex-1 flex-col">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="flex h-[60px] items-center gap-2">
                            <span className="h-1.5 w-5 shrink-0 rounded-[5px] bg-white/20" />
                            <span className="h-px flex-1 bg-border" />
                        </div>
                    ))}
                </div>
                <span className="absolute left-12 top-0 h-[calc(100%+38px)] w-px bg-border" />
            </div>

            <div className="absolute inset-0 z-20">
                {events.map((event) => {
                    const isAccent = event.variant === 'featured';
                    const top = SCHEDULE_EVENT_TOP[event.id];

                    return (
                        <ScheduleEventRow
                            key={event.id}
                            event={event}
                            style={top != null ? { top } : undefined}
                            entranceClassName={
                                isAccent
                                    ? showAccentItem
                                        ? 'onboarding-slide-from-right'
                                        : 'pointer-events-none opacity-0 translate-x-[56px]'
                                    : showRegularItems
                                      ? 'onboarding-fade-in'
                                      : 'pointer-events-none opacity-0'
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default OnboardingSchedulePreview;
