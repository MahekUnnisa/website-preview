import React from 'react';
import type { Decorator } from '@storybook/react-vite';
import type { CalendarEvent } from '@/types/onboarding';

/** Dark onboarding shell — matches /onboard full-screen theme. */
export const withOnboardingTheme: Decorator = (Story) => (
    <div className="dark min-h-dvh bg-background text-foreground-primary">
        <Story />
    </div>
);

export const withOnboardingCentered: Decorator = (Story) => (
    <div className="dark flex min-h-dvh items-center justify-center bg-background p-8 text-foreground-primary">
        <Story />
    </div>
);

export const onboardingFullscreen = {
    layout: 'fullscreen' as const,
    backgrounds: { disable: true },
};

export const onboardingViewports = {
    iphoneSE: { name: 'iPhone SE', styles: { width: '375px', height: '667px' }, type: 'mobile' as const },
    iphone12: { name: 'iPhone 12', styles: { width: '390px', height: '844px' }, type: 'mobile' as const },
    tablet768: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' }, type: 'tablet' as const },
};

export const onboardingViewportParameters = {
    ...onboardingFullscreen,
    viewport: { options: onboardingViewports },
};

export const viewportGlobals = (value: keyof typeof onboardingViewports) => ({
    viewport: { value, isRotated: false },
});

export const mockWorkspaceProviders = [
    {
        id: 'slack' as const,
        label: 'Slack',
        icon: '/assets/onboarding/slack-logo.svg',
    },
    {
        id: 'msteams' as const,
        label: 'Microsoft Teams',
        icon: 'https://statics.teams.cdn.live.net/evergreen-assets/icons/microsoft_teams_logo_refresh_v2025.ico',
    },
];

export const mockCalendarEvents: CalendarEvent[] = [
    {
        id: '1',
        summary: 'Focus block',
        start: { dateTime: '2026-04-02T09:00:00' },
        end: { dateTime: '2026-04-02T11:00:00' },
    },
    {
        id: '2',
        summary: 'Team sync',
        start: { dateTime: '2026-04-02T11:30:00' },
        end: { dateTime: '2026-04-02T12:00:00' },
    },
    {
        id: '3',
        summary: 'Lunch',
        start: { dateTime: '2026-04-02T12:30:00' },
        end: { dateTime: '2026-04-02T13:30:00' },
    },
];
