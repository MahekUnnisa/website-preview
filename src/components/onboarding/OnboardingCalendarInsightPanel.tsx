import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { onboardingBodyFontClass } from '@/lib/onboarding-font';
import { getOnboardingV2InsightCopy } from '@/utils/onboarding-v2-i18n';
import { OnboardingPrimaryButton } from './OnboardingPrimaryButton';
import { OnboardingCalendarDayPreview } from './OnboardingCalendarDayPreview';
import type { CalendarEvent } from '@/types/onboarding';

export interface OnboardingCalendarInsightPanelProps {
    /** Schedule day for TimelineGrid (preferred over dateLabel/dateDetail). */
    date?: Date;
    calendarDateLabel?: string;
    calendarDateDetail?: string;
    events?: CalendarEvent[];
    headline: React.ReactNode;
    wrapUpTime?: string;
    onOpenZero?: () => void;
    /** @deprecated Prefer onOpenZero */
    onLooksGood?: () => void;
    /** @deprecated Prefer onOpenZero */
    onLeaveIt?: () => void;
    /** @deprecated Prefer onOpenZero */
    onSkip?: () => void;
    /** Show analyzing state instead of insight content. */
    loading?: boolean;
    /** Failed analyze — keep loading chrome (no error UI). */
    showSkipOnly?: boolean;
    animateEntrance?: boolean;
    /** When true, render only the right-column body (calendar lives in OnboardingScheduleFlowLayout). */
    embedded?: boolean;
    className?: string;
}

const REVEAL_STAGGER_MS = 400;
const EVENTS_ANIM_MS = 950;

type InsightHeadlinePart = { text: string; bold: boolean };

/** Split `**bold**` / `\n` (real or literal) into lines of plain vs bold runs. */
const parseInsightHeadline = (headline: string): InsightHeadlinePart[][] =>
    headline
        .replace(/\\n/g, '\n')
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) =>
            line
                .split(/(\*\*[^*]+\*\*)/g)
                .filter(Boolean)
                .map((part) => {
                    const match = part.match(/^\*\*(.+)\*\*$/);
                    return match ? { text: match[1], bold: true } : { text: part, bold: false };
                })
        );

const renderInsightHeadlineParts = (parts: InsightHeadlinePart[]) =>
    parts.map((part, index) =>
        part.bold ? (
            <span key={index} className="font-bold">
                {part.text}
            </span>
        ) : (
            part.text
        )
    );

export const OnboardingCalendarInsightPanel: React.FC<OnboardingCalendarInsightPanelProps> = ({
    date,
    calendarDateLabel = 'Tomorrow',
    calendarDateDetail = '2 April 2025',
    events = [],
    headline,
    wrapUpTime = '6:30 PM',
    onOpenZero,
    onLooksGood,
    onLeaveIt,
    onSkip,
    loading = false,
    showSkipOnly = false,
    animateEntrance = true,
    embedded = false,
    className
}) => {
    const copy = getOnboardingV2InsightCopy();
    const [showBody, setShowBody] = useState(!animateEntrance);
    const [showButton, setShowButton] = useState(!animateEntrance);

    const handleOpenZero = onOpenZero ?? onLooksGood ?? onLeaveIt ?? onSkip;

    useEffect(() => {
        if (loading || showSkipOnly || !animateEntrance) {
            setShowBody(true);
            setShowButton(true);
            return undefined;
        }

        setShowBody(false);
        setShowButton(false);
        const eventsDoneMs = EVENTS_ANIM_MS + 300;
        const bodyTimer = window.setTimeout(() => setShowBody(true), eventsDoneMs);
        const buttonTimer = window.setTimeout(() => setShowButton(true), eventsDoneMs + REVEAL_STAGGER_MS);

        return () => {
            window.clearTimeout(bodyTimer);
            window.clearTimeout(buttonTimer);
        };
    }, [animateEntrance, loading, showSkipOnly]);

    const openZeroButton = (
        <OnboardingPrimaryButton
            onClick={handleOpenZero}
            shellClassName="h-10 w-fit shrink-0 self-start"
            className="px-5 py-3 text-sm font-medium leading-[23px]"
        >
            {copy.openZero}
        </OnboardingPrimaryButton>
    );

    const headlineLines = typeof headline === 'string' ? parseInsightHeadline(headline) : null;
    const [firstLine, ...restLines] = headlineLines ?? [];

    const content =
        loading || showSkipOnly ? (
            <div className="onboarding-fade-in flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-xl font-semibold leading-[1.35] text-foreground-secondary font-instrumentSans">
                            {copy.loadingLine1}
                        </p>
                        <p className="text-[15px] leading-[1.45] text-foreground-muted font-instrumentSans">
                            {copy.loadingLine2}
                        </p>
                    </div>
                    <p className="text-[15px] leading-[1.45] text-foreground-muted font-instrumentSans">
                        {copy.wrapUpPrefix}{' '}
                        <span className="font-bold text-foreground-secondary">{wrapUpTime}</span> {copy.wrapUpFor}{' '}
                        <span className="font-bold text-foreground-secondary">{copy.endOfDay}</span>.{' '}
                        {copy.wrapUpSuffix}
                    </p>
                </div>
                {openZeroButton}
            </div>
        ) : (
            <div
                className={cn(
                    'flex flex-col',
                    showBody ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                )}
            >
                <h1 className="text-xl font-normal leading-[1.35] text-foreground-secondary font-instrumentSans">
                    {firstLine ? renderInsightHeadlineParts(firstLine) : headline}
                </h1>

                {restLines.map((line, index) => (
                    <p
                        key={index}
                        className="mt-4 text-[15px] font-normal leading-[1.45] text-foreground-muted font-instrumentSans"
                    >
                        {renderInsightHeadlineParts(line)}
                    </p>
                ))}

                <div
                    className={cn(
                        'mt-6',
                        showButton ? 'onboarding-fade-in' : 'pointer-events-none opacity-0'
                    )}
                >
                    {openZeroButton}
                </div>
            </div>
        );

    if (embedded) {
        return <div className={cn('flex min-h-0 flex-1 flex-col', onboardingBodyFontClass, className)}>{content}</div>;
    }

    return (
        <div className={cn('flex w-full max-w-[684px] items-start gap-5', className)}>
            <OnboardingCalendarDayPreview
                date={date}
                dateLabel={calendarDateLabel}
                dateDetail={calendarDateDetail}
                events={events}
                animateEvents={animateEntrance}
            />

            <div className={cn('flex min-h-[506px] w-full max-w-[288px] flex-col', onboardingBodyFontClass)}>{content}</div>
        </div>
    );
};

export default OnboardingCalendarInsightPanel;

if (import.meta.env?.DEV) {
    const sample = parseInsightHeadline('**Something bold**\\n normal text');
    console.assert(sample.length === 2, 'insight headline should split on literal \\n');
    console.assert(sample[0]?.length === 1 && sample[0][0]?.bold === true && sample[0][0]?.text === 'Something bold', 'first line **bold** should be bold');
    console.assert(sample[1]?.length === 1 && sample[1][0]?.bold === false && sample[1][0]?.text === 'normal text', 'second line should stay normal');
    console.assert(
        parseInsightHeadline('**bold**\nplain')[1]?.[0]?.text === 'plain',
        'insight headline should also split on real newlines'
    );
}