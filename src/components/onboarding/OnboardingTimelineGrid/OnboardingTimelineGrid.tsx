import React, { type FC, useEffect, useMemo, useRef } from 'react';
import { format, isAfter, isBefore, isToday, isTomorrow, parseISO, startOfDay, endOfDay, differenceInMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/types/onboarding';

type TimelineGridProps = {
    date: Date;
    events: CalendarEvent[];
    className?: string;
    fillHeight?: boolean;
    scrollToFirstEvent?: boolean;
};

type PositionedEvent = CalendarEvent & {
    startMoment: Date;
    endMoment: Date;
    top: number;
    height: number;
    left: number;
    width: number;
    zIndex: number;
};

const HOUR_HEIGHT_PX = 60;

const formatHourLabel = (hour: number): string => {
    if (hour === 0) {
        return '12 AM';
    }
    if (hour === 12) {
        return '12 PM';
    }
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
};

export const TimelineGrid: FC<TimelineGridProps> = ({
    date,
    events,
    className,
    fillHeight = false,
    scrollToFirstEvent = false,
}) => {
    const startHour = 0;
    const endHour = 23;
    const hours = useMemo(
        () => Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i),
        [startHour, endHour]
    );
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const positionedEvents = useMemo((): PositionedEvent[] => {
        if (!events.length) {
            return [];
        }

        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const sortedEvents = events
            .map((event) => {
                const startRaw = event.start?.dateTime;
                const endRaw = event.end?.dateTime;
                if (!startRaw || !endRaw) {
                    return null;
                }

                const startMoment = parseISO(startRaw);
                const endMoment = parseISO(endRaw);
                const clampedStart = isBefore(startMoment, dayStart) ? dayStart : startMoment;
                const clampedEnd = isAfter(endMoment, dayEnd) ? dayEnd : endMoment;

                if (isAfter(clampedStart, dayEnd) || isBefore(clampedEnd, dayStart)) {
                    return null;
                }

                return { ...event, startMoment: clampedStart, endMoment: clampedEnd };
            })
            .filter((event): event is NonNullable<typeof event> => event !== null)
            .sort((a, b) => a.startMoment.getTime() - b.startMoment.getTime());

        const collisionGroups: (typeof sortedEvents)[] = [];
        const visited = new Set<string>();

        for (const event of sortedEvents) {
            if (visited.has(event.id)) {
                continue;
            }

            const group = [event];
            visited.add(event.id);
            const queue = [event];
            while (queue.length > 0) {
                const current = queue.shift()!;
                for (const other of sortedEvents) {
                    if (visited.has(other.id)) {
                        continue;
                    }
                    if (isAfter(current.endMoment, other.startMoment) && isBefore(current.startMoment, other.endMoment)) {
                        visited.add(other.id);
                        group.push(other);
                        queue.push(other);
                    }
                }
            }
            collisionGroups.push(group);
        }

        const finalLayouts: PositionedEvent[] = [];

        for (const group of collisionGroups) {
            const columns: (typeof group)[] = [];
            group.sort((a, b) => a.startMoment.getTime() - b.startMoment.getTime());

            for (const event of group) {
                let placed = false;
                for (const col of columns) {
                    if (!isAfter(col[col.length - 1].endMoment, event.startMoment)) {
                        col.push(event);
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    columns.push([event]);
                }
            }

            const numColumns = columns.length;
            for (let i = 0; i < columns.length; i += 1) {
                for (const event of columns[i]) {
                    const duration = differenceInMinutes(event.endMoment, event.startMoment);
                    const top =
                        event.startMoment.getHours() * HOUR_HEIGHT_PX +
                        (event.startMoment.getMinutes() / 60) * HOUR_HEIGHT_PX -
                        startHour * HOUR_HEIGHT_PX;
                    const baseHeight = (duration / 60) * HOUR_HEIGHT_PX - 2;

                    finalLayouts.push({
                        ...event,
                        top: Math.max(0, top),
                        height: Math.max(20, baseHeight),
                        left: (i / numColumns) * 100,
                        width: (1 / numColumns) * 100,
                        zIndex: 10,
                    });
                }
            }
        }

        return finalLayouts;
    }, [events, date, startHour]);

    const formattedHeaderDate = useMemo(() => {
        const formatted = format(date, 'd MMMM yyyy');
        if (isToday(date)) {
            return `Today, ${formatted}`;
        }
        if (isTomorrow(date)) {
            return `Tomorrow, ${formatted}`;
        }
        return formatted;
    }, [date]);

    useEffect(() => {
        if (!scrollRef.current) {
            return;
        }

        if (scrollToFirstEvent && positionedEvents.length > 0) {
            const earliest = positionedEvents.reduce((min, event) =>
                event.startMoment.getTime() < min.startMoment.getTime() ? event : min
            );
            const container = scrollRef.current;
            const offset = container.clientHeight / 2;
            const timer = window.setTimeout(() => {
                if (!scrollRef.current) {
                    return;
                }
                scrollRef.current.scrollTo({
                    top: Math.max(earliest.top - offset, 0),
                    behavior: 'smooth',
                });
            }, 100);
            return () => window.clearTimeout(timer);
        }

        if (!isToday(date)) {
            return;
        }

        const container = scrollRef.current;
        const now = new Date();
        const currentTop =
            now.getHours() * HOUR_HEIGHT_PX + (now.getMinutes() / 60) * HOUR_HEIGHT_PX - startHour * HOUR_HEIGHT_PX;
        container.scrollTop = Math.max(currentTop - container.clientHeight / 2, 0);
    }, [date, startHour, scrollToFirstEvent, positionedEvents]);

    const currentTimeTop = useMemo(() => {
        if (!isToday(date)) {
            return null;
        }
        const now = new Date();
        return now.getHours() * HOUR_HEIGHT_PX + (now.getMinutes() / 60) * HOUR_HEIGHT_PX - startHour * HOUR_HEIGHT_PX;
    }, [date, startHour]);

    return (
        <div
            className={cn(
                'w-full max-w-[370px] shrink-0 rounded-lg border border-border-muted bg-border-subtle',
                className
            )}
        >
            <div className="flex h-10 items-center rounded-t-lg border-b border-border px-4">
                <p className="text-xs font-medium text-foreground-primary">{formattedHeaderDate}</p>
            </div>
            <div
                ref={scrollRef}
                className={cn(
                    'scrollbar-theme relative overflow-y-auto border-t border-border-subtle',
                    fillHeight ? 'h-[calc(100%-40px)]' : 'max-h-[460px]'
                )}
            >
                <div className="relative" style={{ height: `${(endHour - startHour + 1) * HOUR_HEIGHT_PX}px` }}>
                    <div
                        className="absolute top-0 bottom-0 left-12 w-px border-l border-dashed border-border-muted"
                        style={{ height: `${(endHour - startHour + 1) * HOUR_HEIGHT_PX}px` }}
                    />
                    {hours.map((hour) => (
                        <div key={hour} className="relative" style={{ height: `${HOUR_HEIGHT_PX}px` }}>
                            <div className="absolute w-12 pr-2 text-right" style={{ top: 0 }}>
                                <span className="block select-none text-[10px] uppercase tracking-wide text-foreground-muted">
                                    {formatHourLabel(hour)}
                                </span>
                            </div>
                            <div className="absolute top-0 left-12 right-0 h-px bg-border-muted" />
                        </div>
                    ))}
                    {currentTimeTop !== null &&
                    currentTimeTop >= 0 &&
                    currentTimeTop <= (endHour - startHour + 1) * HOUR_HEIGHT_PX ? (
                        <div
                            className="absolute left-12 right-0 z-20 h-px bg-semantics-error-100"
                            style={{ top: `${currentTimeTop}px` }}
                        >
                            <div className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full bg-semantics-error-100" />
                        </div>
                    ) : null}
                    <div className="absolute top-0 left-[50px] right-2 h-full">
                        {positionedEvents.map((event) => {
                            const labelText = `${event.summary}, ${format(event.startMoment, 'h:mm a').toLowerCase()}`;
                            const singleLine = event.height <= 28;

                            return (
                                <div
                                    key={event.id}
                                    className="absolute"
                                    style={{
                                        top: `${event.top}px`,
                                        height: `${event.height}px`,
                                        left: `${event.left}%`,
                                        width: `calc(${event.width}% - 4px)`,
                                        zIndex: event.zIndex,
                                        marginLeft: '2px',
                                    }}
                                >
                                    <div
                                        className={cn(
                                            'flex h-full w-full min-w-0 overflow-hidden rounded-md px-3 text-xs font-medium',
                                            singleLine ? 'items-center' : 'items-start py-0.5'
                                        )}
                                        style={{
                                            backgroundColor: event.backgroundColor || 'var(--accent-400)',
                                            color: event.foregroundColor || 'var(--primary-foreground)',
                                        }}
                                        title={labelText}
                                    >
                                        <span className="line-clamp-3">{labelText}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineGrid;
