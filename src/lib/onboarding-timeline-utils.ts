import { addDays, format, parseISO, startOfDay } from 'date-fns';

import type { CalendarAnalyzeApiEvent } from '@/lib/onboarding-calendar-analyze';
import type { CalendarEvent } from '@/types/onboarding';

/** Dark mode event fills — rotate in this order only. */
export const ONBOARDING_EVENT_COLORS_DARK = ['#7B4027', '#1B516C', '#311B67', '#74591E'] as const;

/** Light mode counterparts of the same rotation (same index → same family). */
export const ONBOARDING_EVENT_COLORS_LIGHT = ['#E8C5B4', '#B7D0DC', '#B8A6FF', '#FFE3A7'] as const;

export function getOnboardingEventPaletteColor(index: number, isLight: boolean): {
    backgroundColor: string;
    foregroundColor: string;
} {
    const palette = isLight ? ONBOARDING_EVENT_COLORS_LIGHT : ONBOARDING_EVENT_COLORS_DARK;
    return {
        backgroundColor: palette[index % palette.length],
        foregroundColor: 'var(--foreground-primary)'
    };
}

/** Apply rotating palette to timeline events (theme-aware). */
export function applyOnboardingEventPalette(events: CalendarEvent[], isLight: boolean): CalendarEvent[] {
    return events.map((event, index) => ({
        ...event,
        ...getOnboardingEventPaletteColor(index, isLight)
    }));
}

export function getOnboardingDefaultScheduleDate(): Date {
    return addDays(startOfDay(new Date()), 1);
}

export function mapAnalyzeEventsToTimelineEvents(
    events: CalendarAnalyzeApiEvent[] | undefined
): CalendarEvent[] {
    if (!events?.length) {
        return [];
    }

    return events
        .map((event, index): CalendarEvent | null => {
            const startRaw = event.start?.dateTime ?? event.start?.date;
            const endRaw = event.end?.dateTime ?? event.end?.date;
            if (!startRaw) {
                return null;
            }

            const colors = getOnboardingEventPaletteColor(index, false);

            return {
                id: event.id,
                summary: event.summary,
                ...(event.description ? { description: event.description } : {}),
                start: { dateTime: startRaw },
                end: { dateTime: endRaw ?? startRaw },
                backgroundColor: colors.backgroundColor,
                foregroundColor: colors.foregroundColor
            };
        })
        .filter((event): event is CalendarEvent => event !== null);
}

export function resolveInsightScheduleDate(dateStr?: string): Date {
    if (!dateStr) {
        return getOnboardingDefaultScheduleDate();
    }

    const parsed = parseISO(dateStr);
    return Number.isNaN(parsed.getTime()) ? getOnboardingDefaultScheduleDate() : startOfDay(parsed);
}

export function formatOnboardingScheduleHeader(date: Date): string {
    return format(date, 'd MMMM yyyy');
}
