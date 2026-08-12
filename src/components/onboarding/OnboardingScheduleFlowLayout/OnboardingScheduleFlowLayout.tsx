import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { OnboardingScheduleStatus } from '../OnboardingScheduleStatus';
import { OnboardingCalendarDayPreview } from '../OnboardingCalendarDayPreview';
import type { CalendarEvent } from '@/types/onboarding';

export interface OnboardingScheduleFlowLayoutProps {
    scheduleDate?: Date;
    calendarEvents?: CalendarEvent[];
    animateCalendar?: boolean;
    overlay?: boolean;
    animateEvents?: boolean;
    showStatus?: boolean;
    scheduleStatusHeadline?: string;
    children: React.ReactNode;
    className?: string;
    /** @deprecated Use scheduleDate */
    calendarDateLabel?: string;
    /** @deprecated Use scheduleDate */
    calendarDateDetail?: string;
}

/** Shared calendar + persistent schedule status for work-tools → wrap-up → insight flow */
export const OnboardingScheduleFlowLayout: React.FC<OnboardingScheduleFlowLayoutProps> = ({
    scheduleDate,
    calendarEvents = [],
    animateCalendar = false,
    overlay = true,
    animateEvents = false,
    showStatus = true,
    scheduleStatusHeadline,
    children,
    className
}) => {
    const animateOnMount = useRef(animateCalendar);
    const shouldAnimateCalendar = animateOnMount.current;

    return (
        <div className={cn('flex w-full max-w-[684px] items-start gap-5', className)}>
            <OnboardingCalendarDayPreview
                date={scheduleDate}
                events={calendarEvents}
                overlay={overlay}
                animateEvents={animateEvents}
                className={shouldAnimateCalendar ? 'onboarding-slide-from-bottom' : undefined}
            />

            <div className="flex min-h-[506px] w-full max-w-[288px] flex-col">
                <OnboardingScheduleStatus visible={showStatus} headline={scheduleStatusHeadline} />
                {children}
            </div>
        </div>
    );
};

export default OnboardingScheduleFlowLayout;
