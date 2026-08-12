import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const VECTOR_PATHS: Record<string, string> = {
    ArrowLeftIcon: '/assets/onboarding/arrow-left.svg',
    CrossIcon: '/assets/onboarding/cross.svg',
    DevbotIcon: '/assets/onboarding/devbot.svg',
    NotesThickIcon: '/assets/onboarding/notes-thick.svg',
    OnboardingArrowClockwiseLight: '/assets/onboarding/arrow-clockwise-light.svg',
    OnboardingCalendarBookmark: '/assets/onboarding/calendar-bookmark.svg',
    OnboardingChatsLight: '/assets/onboarding/chats-light.svg',
    OnboardingCheckCircleLight: '/assets/onboarding/check-circle-light.svg',
    OnboardingCodeLight: '/assets/onboarding/code-light.svg',
    OnboardingHourglass: '/assets/onboarding/hourglass.svg',
    OnboardingKeyLight: '/assets/onboarding/key-light.svg',
    OnboardingLockThin: '/assets/onboarding/lock-thin.svg',
    OnboardingMoonStarsFill: '/assets/onboarding/moon-stars-fill.svg',
    OnboardingNotificationBadge: '/assets/onboarding/notification-badge.svg',
    OnboardingRoleArrowUpRight: '/assets/onboarding/role-arrow-up-right.svg',
    OnboardingRoleChat: '/assets/onboarding/role-chat.svg',
    OnboardingRoleMeeting: '/assets/onboarding/role-meeting.svg',
    OnboardingRoleTarget: '/assets/onboarding/role-target.svg',
    OnboardingTaskAlt: '/assets/onboarding/task-alt.svg',
    OnboardingXCircleLight: '/assets/onboarding/x-circle-light.svg',
    SparklesIcon: '/assets/onboarding/sparkles.svg',
};

const RASTER_PATHS: Record<string, string> = {
    GoogleCalendarIcon: '/assets/icons/google-calendar-icon.png',
    Logo: '/assets/icons/logo.png',
};

export type AssetName = string;

type OnboardingImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
    src: AssetName;
    alt: string;
    type?: 'vector' | 'raster';
};

const svgCache = new Map<string, string>();
const svgInflight = new Map<string, Promise<string>>();

const normalizeSvg = (svg: string): string => {
    const match = svg.match(/<svg[^>]*>/i);
    if (!match) {
        return svg;
    }
    let openTag = match[0];
    openTag = openTag.replace(/\s(width|height)=("[^"]*"|'[^']*')/gi, '');
    if (!/preserveAspectRatio=/i.test(openTag)) {
        openTag = openTag.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
    }
    if (/style=/i.test(openTag)) {
        openTag = openTag.replace(/style=("[^"]*"|'[^']*')/i, (attr) => {
            const quote = attr.includes('"') ? '"' : "'";
            const content = attr.slice(7, -1);
            return `style=${quote}${content};width:100%;height:100%;display:block;${quote}`;
        });
    } else {
        openTag = openTag.replace('<svg', '<svg style="width:100%;height:100%;display:block;"');
    }
    return svg.replace(match[0], openTag);
};

const loadSvg = async (path: string): Promise<string> => {
    const cached = svgCache.get(path);
    if (cached) {
        return cached;
    }

    const inflight = svgInflight.get(path);
    if (inflight) {
        return inflight;
    }

    const promise = fetch(path)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${path}`);
            }
            return response.text();
        })
        .then((svg) => {
            const normalized = normalizeSvg(svg);
            svgCache.set(path, normalized);
            svgInflight.delete(path);
            return normalized;
        })
        .catch((error) => {
            svgInflight.delete(path);
            throw error;
        });

    svgInflight.set(path, promise);
    return promise;
};

const InlineVector: React.FC<{
    path: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
}> = ({ path, alt, className, style, ...rest }) => {
    const [svg, setSvg] = useState(() => svgCache.get(path));

    useEffect(() => {
        if (svgCache.has(path)) {
            setSvg(svgCache.get(path));
            return undefined;
        }

        let cancelled = false;
        void loadSvg(path).then((loaded) => {
            if (!cancelled) {
                setSvg(loaded);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [path]);

    if (!svg) {
        return (
            <span
                className={cn('inline-block', className)}
                style={style}
                role="img"
                aria-label={alt || undefined}
                aria-hidden={alt ? undefined : true}
                {...rest}
            />
        );
    }

    return (
        <div
            className={cn('inline-flex items-center justify-center', className)}
            style={style}
            role="img"
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true}
            {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        >
            <div
                className="flex h-full w-full items-center justify-center overflow-visible"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
};

export const Image: React.FC<OnboardingImageProps> = ({ src, alt, type = 'raster', className, style, ...rest }) => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
        return <img src={src} alt={alt} className={className} style={style} {...rest} />;
    }

    const rasterPath = RASTER_PATHS[src];
    if (type === 'raster' || rasterPath) {
        if (!rasterPath) {
            return null;
        }
        return <img src={rasterPath} alt={alt} className={className} style={style} {...rest} />;
    }

    const vectorPath = VECTOR_PATHS[src];
    if (!vectorPath) {
        return null;
    }

    return <InlineVector path={vectorPath} alt={alt} className={className} style={style} {...rest} />;
};

export default Image;

/** Warm the SVG cache for onboarding screens (optional). */
export function preloadOnboardingIcons(keys: AssetName[] = Object.keys(VECTOR_PATHS)): void {
    keys.forEach((key) => {
        const path = VECTOR_PATHS[key];
        if (path) {
            void loadSvg(path);
        }
    });
}
