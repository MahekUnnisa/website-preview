import React, { useEffect, useMemo, useState } from 'react';
import { format, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { TimelineGrid } from '@/components/onboarding/OnboardingTimelineGrid';
import { LoadingAnimation } from '@/components/onboarding/OnboardingLoadingIcon';
import {
    applyOnboardingEventPalette,
    getOnboardingDefaultScheduleDate
} from '@/lib/onboarding-timeline-utils';
import type { CalendarEvent } from '@/types/onboarding';
import { getOnboardingV2InsightCopy } from '@/utils/onboarding-v2-i18n';

/** @deprecated TimelineGrid uses CalendarEvent directly — kept for legacy imports. */
export type OnboardingCalendarEventTone = 'purple' | 'teal' | 'gold' | 'brown';

/** @deprecated TimelineGrid uses CalendarEvent directly — kept for legacy imports. */
export interface OnboardingCalendarEventItem {
    id: string;
    title: string;
    timeLabel: string;
    top: number;
    height: number;
    tone: OnboardingCalendarEventTone;
}

export interface OnboardingCalendarDayPreviewProps {
    date?: Date;
    events?: CalendarEvent[];
    className?: string;
    /** Loading / work-tools / wrap-up: Figma blurred empty day, not scrollable. */
    overlay?: boolean;
    /** Fade events in when insight becomes ready. */
    animateEvents?: boolean;
    /** @deprecated Use `date` */
    dateLabel?: string;
    /** @deprecated Use `date` */
    dateDetail?: string;
}

const HOUR_ROW_HEIGHT = 60;
/** Full day labels for Figma loading chrome (5 AM–9 PM). */
const OVERLAY_HOURS = [
    '5 AM',
    '6 AM',
    '7 AM',
    '8 AM',
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
    '9 PM'
] as const;
/** Figma scrolls the day so ~10 AM sits near the top of the 462px viewport. */
const OVERLAY_SCROLL_OFFSET = -291;

/** Figma node 14084:51121 — purple / gold blocks under the blur (theme tokens). */
const OVERLAY_PLACEHOLDER_EVENTS = [
    {
        id: 'ux-1',
        title: 'UX discussion with Rahul',
        timeLabel: '1 pm',
        top: 179,
        height: 66,
        backgroundColor: 'var(--onboarding-event-purple)'
    },
    {
        id: 'lunch',
        title: 'Lunch break',
        timeLabel: '2 pm',
        top: 251,
        height: 62,
        backgroundColor: 'var(--onboarding-event-gold)'
    },
    {
        id: 'ux-2',
        title: 'UX discussion with Rahul',
        timeLabel: '3:30 pm',
        top: 345,
        height: 66,
        backgroundColor: 'var(--onboarding-event-purple)'
    },
    {
        id: 'eod',
        title: 'End of Day review',
        timeLabel: '6 pm',
        top: 489,
        height: 62,
        backgroundColor: 'var(--onboarding-event-gold)'
    }
] as const;

/** Website onboarding is dark-only. */
function useIsLightTheme(): boolean {
    return false;
}

function formatHeader(date: Date): { label: string; detail: string } {
    const detail = format(date, 'd MMMM yyyy');
    if (isTomorrow(date)) {
        return { label: 'Tomorrow', detail };
    }
    if (isToday(date)) {
        return { label: 'Today', detail };
    }
    return { label: format(date, 'EEEE'), detail };
}

const OverlayDayChrome: React.FC<{ date: Date }> = ({ date }) => {
    const { label, detail } = formatHeader(date);

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-muted bg-background-tertiary">
            <div className="relative z-[2] h-11 shrink-0 border-b border-border px-4 py-2.5">
                <p className="text-base font-semibold leading-6 text-foreground-primary font-hauora">
                    {label}
                    <span className="text-foreground-muted">, {detail}</span>
                </p>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
                {/* Scrolled day track — events sit in viewport coords like Figma */}
                <div
                    className="absolute left-4 flex w-[303px] gap-2.5"
                    style={{ top: OVERLAY_SCROLL_OFFSET, height: OVERLAY_HOURS.length * HOUR_ROW_HEIGHT }}
                    aria-hidden
                >
                    <div className="flex flex-1 flex-col">
                        {OVERLAY_HOURS.map((hour) => (
                            <div key={hour} className="flex h-[60px] items-start gap-2">
                                <span className="w-[33px] shrink-0 text-xs leading-[17px] text-foreground-muted font-hauora">
                                    {hour}
                                </span>
                                <span className="mt-2 h-px flex-1 bg-white/10" />
                            </div>
                        ))}
                    </div>
                    <span className="absolute left-12 top-px h-[1019px] w-px bg-border" />
                </div>

                {OVERLAY_PLACEHOLDER_EVENTS.map((event) => (
                    <div
                        key={event.id}
                        className="absolute left-[75px] flex w-[236px] items-start rounded-lg border border-border px-2.5 pb-10 pt-3"
                        style={{
                            top: event.top,
                            height: event.height,
                            backgroundColor: event.backgroundColor
                        }}
                        aria-hidden
                    >
                        <div className="flex items-center gap-3 text-xs leading-[17px] font-hauora">
                            <span className="text-foreground-primary">{event.title}</span>
                            <span className="text-foreground-muted">{event.timeLabel}</span>
                        </div>
                    </div>
                ))}

                <div className="pointer-events-none absolute inset-0 z-[1] bg-background-tertiary/60 backdrop-blur-[3px]" />
            </div>

            {/* Figma: centered on the full 506px card, slightly above geometric center */}
            <div className="absolute left-1/2 top-[calc(50%-30px)] z-[2] flex w-[162px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
                <div className="flex size-16 items-center justify-center overflow-hidden rounded-[32px] bg-foreground-subtle">
                    <LoadingAnimation size={36} className="flex-none" />
                </div>
                <p className="text-center text-xs font-medium leading-[17px] text-foreground-muted font-instrumentSans">
                    {getOnboardingV2InsightCopy().checkingSchedule}
                </p>
            </div>
        </div>
    );
};

export const OnboardingCalendarDayPreview: React.FC<OnboardingCalendarDayPreviewProps> = ({
    date,
    events = [],
    className,
    overlay = false,
    animateEvents = false
}) => {
    const isLight = useIsLightTheme();
    const [showEvents, setShowEvents] = useState(!animateEvents);
    const scheduleDate = date ?? getOnboardingDefaultScheduleDate();

    const eventKey = useMemo(() => events.map((event) => event.id).join(','), [events]);

    const displayEvents = useMemo(() => {
        if (!events.length) {
            return events;
        }
        return applyOnboardingEventPalette(events, isLight);
    }, [events, isLight]);

    useEffect(() => {
        if (overlay || !animateEvents) {
            setShowEvents(true);
            return undefined;
        }

        setShowEvents(false);
        const timer = window.setTimeout(() => setShowEvents(true), 0);
        return () => window.clearTimeout(timer);
    }, [animateEvents, eventKey, overlay]);

    if (overlay) {
        return (
            <div
                className={cn(
                    'relative mx-auto h-[min(506px,68dvh)] w-full max-w-[320px] shrink-0 sm:h-[506px]',
                    className
                )}
            >
                <OverlayDayChrome date={scheduleDate} />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative mx-auto h-[min(506px,68dvh)] w-full max-w-[320px] shrink-0 overflow-hidden rounded-lg sm:h-[506px]',
                className
            )}
        >
            <div
                className={cn(
                    'h-full transition-opacity duration-500 ease-out',
                    showEvents ? 'opacity-100' : 'opacity-0'
                )}
            >
                <TimelineGrid
                    date={scheduleDate}
                    events={displayEvents}
                    fillHeight
                    scrollToFirstEvent={displayEvents.length > 0}
                    className="flex h-full w-full max-w-none flex-col rounded-lg border-border bg-background-tertiary"
                />
            </div>
        </div>
    );
};

export default OnboardingCalendarDayPreview;
