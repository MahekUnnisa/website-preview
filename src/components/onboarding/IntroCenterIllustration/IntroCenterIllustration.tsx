import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Image, type AssetName } from '@/components/onboarding/OnboardingImage';
import { LoadingAnimation } from '@/components/onboarding/OnboardingLoadingIcon';

interface IntroCenterIllustrationProps {
    className?: string;
    dateLabel?: string;
    notesTitle?: string;
    notificationCount?: number;
    /** When true, pieces stagger out from bottom-center. Default: show final layout. */
    animateEntrance?: boolean;
    onEntranceComplete?: () => void;
}

// Figma frame 13247:36880 is 563×336 with overflow; content bounds ~563×470.
const ILLUSTRATION_WIDTH = 563;
const ILLUSTRATION_HEIGHT = 470;
const ENTRANCE_DURATION_MS = 1000;
/** Rise distance before pieces settle into design size/position */
const ENTRANCE_RISE_PX = 140;
const ENTRANCE_START_SCALE = 0.72;
const ENTRANCE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

type EntrancePiece = {
    id: string;
    rotateDeg: number;
};

// Rotations from Figma absolute layout (node 13247:36880), build back → front.
const ENTRANCE_PIECES: EntrancePiece[] = [
    { id: 'notes', rotateDeg: 3.33 },
    { id: 'schedule', rotateDeg: -4.61 },
    { id: 'pending', rotateDeg: -1.55 },
    { id: 'success', rotateDeg: 2.89 },
    { id: 'notes-chip', rotateDeg: -3.93 },
    { id: 'calendar-chip', rotateDeg: 3.19 },
    { id: 'devbot', rotateDeg: 0 }
];

const FloatingIconChip: React.FC<{
    icon: AssetName;
    className?: string;
    style?: React.CSSProperties;
    badge?: number;
}> = ({ icon, className, style, badge }) => (
    <div
        className={cn(
            'absolute flex size-[38px] items-center justify-center rounded-[14px] border border-border-subtle bg-onboarding-illust-chip-bg shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)]',
            className
        )}
        style={style}
    >
        <Image
            src={icon}
            alt=""
            type="vector"
            width={20}
            height={20}
            style={{ width: 20, height: 20, color: 'var(--accent-200)' }}
        />
        {badge != null && badge > 0 && (
            <Image
                src="OnboardingNotificationBadge"
                alt=""
                type="vector"
                width={13}
                height={13}
                className="absolute -right-1 -top-1"
                style={{ width: 13, height: 13 }}
            />
        )}
    </div>
);

const StatusPill: React.FC<{
    variant: 'pending' | 'success';
    className?: string;
    style?: React.CSSProperties;
}> = ({ variant, className, style }) => (
    <div
        className={cn(
            'absolute flex h-9 w-[155px] items-center gap-2 rounded-[14px] border border-border-subtle bg-onboarding-illust-chip-bg px-2.5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)]',
            className
        )}
        style={style}
    >
        {variant === 'pending' ? (
            <Image
                src="OnboardingHourglass"
                alt=""
                type="vector"
                width={20}
                height={20}
                style={{ width: 20, height: 20, flexShrink: 0 }}
            />
        ) : (
            <Image
                src="OnboardingTaskAlt"
                alt=""
                type="vector"
                width={20}
                height={20}
                style={{ width: 20, height: 20, flexShrink: 0 }}
            />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="h-[4px] w-full rounded-sm bg-border" />
            <div className="h-[4px] w-[62%] rounded-sm bg-border" />
        </div>
    </div>
);

const ScheduleCard: React.FC<{ dateLabel: string; className?: string; style?: React.CSSProperties }> = ({
    dateLabel,
    className,
    style
}) => {
    return (
        <div
            className={cn(
                'absolute h-[262px] w-[250px] overflow-hidden rounded-2xl border border-border-strong bg-background-secondary shadow-[0px_0px_10px_rgba(0,0,0,0.12)]',
                className
            )}
            style={style}
        >
            <p className="px-4 pt-3 text-sm font-medium text-accent-100">{dateLabel}</p>

            <div className="relative mt-3 px-4 pb-4">
                <div className="absolute bottom-4 left-4 top-0 flex w-3 flex-col justify-between py-1">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="h-[5px] w-full rounded-[11px] bg-border" />
                    ))}
                </div>

                <div className="ml-7 flex flex-col gap-[6px]">
                    <div className="h-[14px] rounded-[7px] bg-onboarding-illust-event-purple" />
                    <div className="h-[8px] rounded-[7px] bg-onboarding-illust-event-cyan" />
                    <div className="h-[58px] rounded-[5px] bg-onboarding-illust-event-purple" />
                    <div className="h-[14px] rounded-[7px] bg-onboarding-illust-event-gold" />
                    <div className="h-[14px] rounded-[7px] bg-onboarding-illust-event-purple" />
                    <div className="h-[8px] rounded-[7px] bg-onboarding-illust-event-cyan" />
                    <div className="h-[58px] rounded-[5px] bg-onboarding-illust-event-purple" />
                </div>
            </div>
        </div>
    );
};

const MeetingNotesCard: React.FC<{ title: string; className?: string; style?: React.CSSProperties }> = ({
    title,
    className,
    style
}) => (
    <div
        className={cn(
            'absolute h-[285px] w-[248px] overflow-hidden rounded-2xl border border-border-strong bg-background-secondary shadow-[0px_0px_10px_rgba(0,0,0,0.25)]',
            className
        )}
        style={style}
    >
        <div className="flex items-center justify-between px-4 pt-3">
            <div className="flex items-center gap-2">
                <Image
                    src="NotesThickIcon"
                    alt=""
                    type="vector"
                    width={16}
                    height={16}
                    style={{ width: 16, height: 16, color: 'var(--accent-200)' }}
                />
                <p className="text-sm font-medium text-foreground-primary">{title}</p>
            </div>
            <Image
                src="CrossIcon"
                alt=""
                type="vector"
                width={12}
                height={12}
                style={{ width: 12, height: 12, color: 'var(--foreground-muted)' }}
            />
        </div>

        <div className="mt-4 flex flex-col gap-3 px-4">
            {[100, 78, 92, 64, 88, 98, 56, 88, 42, 94, 28].map((width, index) => (
                <div key={index} className="h-[6px] rounded-sm bg-border-muted" style={{ width: `${width}%` }} />
            ))}
        </div>
    </div>
);

const DevbotGlowBox: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
    <div className={cn('absolute z-30', className)} style={style}>
        <div
            className="relative flex size-[72px] items-center justify-center overflow-visible rounded-2xl border-[2px] border-border bg-background-secondary p-[16px]"
            style={{
                boxShadow: '0px 12px 24px 0px rgba(107, 76, 232, 0.2), 0 0 120px 24px var(--accent-colored-bg)',
            }}
        >
            <LoadingAnimation size={38} className="flex-none" />
        </div>
    </div>
);

const pieceStyle = (
    piece: EntrancePiece,
    layout: React.CSSProperties,
    visible: boolean,
    animateEntrance: boolean
): React.CSSProperties => {
    // Rise from below + grow into final design size/rotation
    const settled = `translateY(0) scale(1) rotate(${piece.rotateDeg}deg)`;
    const emerging = `translateY(${ENTRANCE_RISE_PX}px) scale(${ENTRANCE_START_SCALE}) rotate(${piece.rotateDeg}deg)`;

    return {
        ...layout,
        opacity: visible ? 1 : 0,
        transform: visible ? settled : emerging,
        transformOrigin: 'center bottom',
        transition: animateEntrance
            ? `opacity ${ENTRANCE_DURATION_MS}ms ${ENTRANCE_EASE}, transform ${ENTRANCE_DURATION_MS}ms ${ENTRANCE_EASE}`
            : undefined,
        pointerEvents: visible ? undefined : 'none',
        willChange: animateEntrance ? 'transform, opacity' : undefined
    };
};

export const IntroCenterIllustration: React.FC<IntroCenterIllustrationProps> = ({
    className,
    dateLabel = 'Tomorrow',
    notesTitle = 'Meeting notes',
    notificationCount = 2,
    animateEntrance = false,
    onEntranceComplete
}) => {
    const shellRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [visible, setVisible] = useState(!animateEntrance);
    const completedRef = useRef(false);
    const onCompleteRef = useRef(onEntranceComplete);
    onCompleteRef.current = onEntranceComplete;

    useEffect(() => {
        const shell = shellRef.current;
        if (!shell) return undefined;

        const updateScale = () => {
            setScale(shell.clientWidth / ILLUSTRATION_WIDTH);
        };
        updateScale();

        const observer = new ResizeObserver(updateScale);
        observer.observe(shell);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!animateEntrance) {
            setVisible(true);
            return undefined;
        }

        completedRef.current = false;
        setVisible(false);

        // ponytail: paint emerging state first so the rise transition runs
        let startId = 0;
        const prepId = window.requestAnimationFrame(() => {
            startId = window.requestAnimationFrame(() => {
                setVisible(true);
            });
        });
        const doneId = window.setTimeout(() => {
            if (!completedRef.current) {
                completedRef.current = true;
                onCompleteRef.current?.();
            }
        }, ENTRANCE_DURATION_MS + 50);

        return () => {
            window.cancelAnimationFrame(prepId);
            window.cancelAnimationFrame(startId);
            window.clearTimeout(doneId);
        };
    }, [animateEntrance]);

    return (
        <div
            ref={shellRef}
            className={cn('pointer-events-none relative mx-auto h-full w-full max-w-none', className)}
            style={{ aspectRatio: `${ILLUSTRATION_WIDTH} / ${ILLUSTRATION_HEIGHT}` }}
            role="img"
            aria-label="Onboarding intro illustration"
        >
            <div
                className="absolute left-0 top-0 origin-top-left"
                style={{
                    width: ILLUSTRATION_WIDTH,
                    height: ILLUSTRATION_HEIGHT,
                    transform: `scale(${scale})`
                }}
            >
                <MeetingNotesCard
                    title={notesTitle}
                    className="z-[1] origin-center"
                    style={pieceStyle(ENTRANCE_PIECES[0], { left: 299, top: 171 }, visible, animateEntrance)}
                />

                <ScheduleCard
                    dateLabel={dateLabel}
                    className="z-[2] origin-center"
                    style={pieceStyle(ENTRANCE_PIECES[1], { right: 292.73, top: 131 }, visible, animateEntrance)}
                />

                <StatusPill
                    variant="pending"
                    className="z-10"
                    style={pieceStyle(ENTRANCE_PIECES[2], { right: 372.58, top: 72.14 }, visible, animateEntrance)}
                />

                <StatusPill
                    variant="success"
                    className="z-10"
                    style={pieceStyle(ENTRANCE_PIECES[3], { right: 42.7, top: 96.74 }, visible, animateEntrance)}
                />

                <FloatingIconChip
                    icon="NotesThickIcon"
                    className="z-20"
                    style={pieceStyle(ENTRANCE_PIECES[4], { right: 386.74, top: 0.01 }, visible, animateEntrance)}
                />

                <FloatingIconChip
                    icon="OnboardingCalendarBookmark"
                    badge={notificationCount}
                    className="z-20"
                    style={pieceStyle(ENTRANCE_PIECES[5], { right: 165.62, top: 29.91 }, visible, animateEntrance)}
                />

                <DevbotGlowBox
                    style={pieceStyle(ENTRANCE_PIECES[6], { left: 242, top: 11 }, visible, animateEntrance)}
                />
            </div>
        </div>
    );
};

export default IntroCenterIllustration;
