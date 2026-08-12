export type OnboardingRoleId = 'focus' | 'commitments' | 'meetings';

export type OnboardingCalendarEventTone = 'purple' | 'teal' | 'gold' | 'brown';

export interface OnboardingCalendarEventItem {
    id: string;
    title: string;
    timeLabel: string;
    top: number;
    height: number;
    tone: OnboardingCalendarEventTone;
}

export type WorkspaceProvider = 'slack' | 'msteams';

export type WorkspaceProviderOption = {
    id: WorkspaceProvider;
    label: string;
    icon: string;
};

/** Types-only (work-tools UI is not ported). Used by v3 API mapping. */
export type OnboardingWorkToolItem = {
    id: string;
    label: string;
    iconKey?: string;
    iconUrl?: string;
    badge?: string;
    selected?: boolean;
};

export type OnboardingWorkToolCategory = {
    label: string;
    icon: string;
    tools: OnboardingWorkToolItem[];
};

export type CalendarEvent = {
    id: string;
    summary: string;
    description?: string;
    start: {
        dateTime: string;
        date?: string;
        timeZone?: string;
    };
    end: {
        dateTime: string;
        date?: string;
        timeZone?: string;
    };
    backgroundColor?: string;
    foregroundColor?: string;
};
