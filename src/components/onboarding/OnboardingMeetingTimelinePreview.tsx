import React from 'react';
import { cn } from '@/lib/utils';
import { Image } from '@/components/onboarding/OnboardingImage';
import { OnboardingPreviewFrame } from './OnboardingPreviewFrame';
import { useRolePlanEntrance } from './RolePlanEntranceContext';

export type OnboardingMeetingTimelineBlockVariant = 'context' | 'meeting' | 'after';

export interface OnboardingMeetingTimelineBlock {
    id: string;
    label: string;
    timeLabel: string;
    description?: string;
    variant: OnboardingMeetingTimelineBlockVariant;
}

export interface OnboardingMeetingTimelinePreviewProps {
    blocks: OnboardingMeetingTimelineBlock[];
    title?: string;
    className?: string;
}

const blockVariantClass: Record<OnboardingMeetingTimelineBlockVariant, string> = {
    context: 'border-border bg-accent-colored-bg-blur shadow-[0_0_16px_var(--accent-400-15)]',
    meeting: 'border-border-strong bg-foreground-subtle backdrop-blur-[2px]',
    after: 'border-border bg-accent-colored-bg-blur shadow-[0_0_16px_var(--accent-400-15)]'
};

const labelVariantClass: Record<OnboardingMeetingTimelineBlockVariant, string> = {
    context: 'text-accent-200',
    meeting: 'text-xs font-semibold leading-[17px] text-foreground-secondary',
    after: 'text-onboarding-after-accent'
};

const iconColorClass: Partial<Record<OnboardingMeetingTimelineBlockVariant, string>> = {
    context: 'text-accent-200',
    after: 'text-onboarding-after-accent'
};

const TimelineBlock: React.FC<{
    block: OnboardingMeetingTimelineBlock;
    entranceClassName?: string;
}> = ({ block, entranceClassName }) => {
    const iconColor = iconColorClass[block.variant];
    const isMeeting = block.variant === 'meeting';

    return (
        <div
            className={cn(
                'w-[226px] rounded-lg border border-dashed px-3 py-2.5',
                blockVariantClass[block.variant],
                entranceClassName
            )}
        >
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                        {iconColor ? (
                            <Image
                                src="SparklesIcon"
                                alt=""
                                type="vector"
                                width={12}
                                height={12}
                                className={iconColor}
                                style={{
                                    width: 12,
                                    height: 12,
                                    color:
                                        block.variant === 'after'
                                            ? 'var(--onboarding-after-accent)'
                                            : 'var(--accent-200)'
                                }}
                            />
                        ) : null}
                        <p
                            className={cn(
                                'text-[10px] font-semibold leading-[1.35] font-instrumentSans',
                                labelVariantClass[block.variant]
                            )}
                        >
                            {block.label}
                        </p>
                    </div>
                    <p className="text-[10px] leading-[1.35] text-foreground-muted font-instrumentSans">
                        {block.timeLabel}
                    </p>
                </div>
                {block.description && !isMeeting ? (
                    <p className="text-[10px] leading-[1.35] text-foreground-muted font-instrumentSans">
                        {block.description}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export const OnboardingMeetingTimelinePreview: React.FC<OnboardingMeetingTimelinePreviewProps> = ({
    blocks,
    title = 'Your 11:00 Meeting · brief ready by 10:40',
    className
}) => {
    const { showRegularItems, showAccentItem } = useRolePlanEntrance();

    return (
        <OnboardingPreviewFrame
            title={title}
            className={className}
            contentClassName="flex min-h-[243px] flex-col items-center gap-3 px-4 py-[30px]"
        >
            {blocks.map((block) => {
                const isAccent = block.variant === 'meeting';

                return (
                    <TimelineBlock
                        key={block.id}
                        block={block}
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
        </OnboardingPreviewFrame>
    );
};

export default OnboardingMeetingTimelinePreview;
