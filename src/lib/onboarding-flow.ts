import type { OnboardingV2State } from '@/data/static/onboarding';
import type {
    OnboardingCalendarEventItem,
    OnboardingRoleId,
    OnboardingWorkToolCategory,
} from '@/types/onboarding';
import { publicUrl } from '@/lib/utils';

export type OnboardingFlowStep =
    | 'welcome'
    | 'priority'
    | 'role-plan'
    | 'keys-first'
    | 'keys-second'
    | 'keys-complete'
    | 'work-tools'
    | 'wrap-up-confirm'
    | 'wrap-up-time'
    | 'calendar-insight'
    | 'thank-you';

export type OnboardingWorkspaceProvider = 'slack' | 'msteams';

export type OnboardingKeyAuthProvider = 'google' | OnboardingWorkspaceProvider;

export type OnboardingKeyAuthStatus = 'success' | 'failed';

export type OnboardingFlowData = {
    selectedRole?: OnboardingRoleId;
    workspace?: OnboardingWorkspaceProvider;
    selectedTools?: string[];
    wrapUpTime?: string;
    wrapUpFromTimePicker?: boolean;
    /** Per-key OAuth outcome for Keys screen (persisted on same onboarding state). */
    keyAuth?: Partial<Record<OnboardingKeyAuthProvider, OnboardingKeyAuthStatus>>;
};

export const ONBOARDING_FLOW_STEPS: OnboardingFlowStep[] = [
    'welcome',
    'priority',
    'role-plan',
    'keys-first',
    'keys-second',
    'keys-complete',
    'work-tools',
    'wrap-up-confirm',
    'wrap-up-time',
    'calendar-insight',
    'thank-you'
];

const LEGACY_ONBOARDING_STAGES = new Set(['signup', 'calendar', 'chat', 'loading', 'final']);

export const DEFAULT_WRAP_UP_TIME = '6:30 PM';

/** Default Slack key / picker icon when API omits one. */
export const SLACK_ICON_URL = publicUrl('/assets/onboarding/slack-logo.svg');

/** Keep the old name so stray imports still resolve to the local asset. */
export const SLACK_FAVICON_URL = SLACK_ICON_URL;

export function workspaceKeyIconUrl(icon?: string | null): string {
    const value = typeof icon === 'string' ? icon.trim() : '';
    if (!value || value.includes('slack.com/favicon')) {
        return SLACK_ICON_URL;
    }
    return value;
}

export const mockWorkspaceProviders = [
    {
        id: 'slack' as const,
        label: 'Slack',
        icon: SLACK_ICON_URL
    },
    {
        id: 'msteams' as const,
        label: 'Microsoft Teams',
        icon: 'https://statics.teams.cdn.live.net/evergreen-assets/icons/microsoft_teams_logo_refresh_v2025.ico'
    }
];

const mockWorkToolIcons = {
    linear: 'https://linear.app/favicon.ico',
    jira: 'https://www.atlassian.com/favicon.ico',
    notion: 'https://www.notion.so/images/favicon.ico',
    asana: 'https://asana.com/favicon.ico',
    github: 'https://github.com/favicon.ico',
    bitbucket: 'https://bitbucket.org/favicon.ico',
    sentry: 'https://sentry.io/favicon.ico'
};

export const defaultWorkToolCategories: OnboardingWorkToolCategory[] = [
    {
        label: 'Work tracking',
        icon: 'OnboardingChatsLight',
        tools: [
            {
                id: 'linear',
                label: 'Linear',
                iconKey: 'LinearIcon',
                iconUrl: mockWorkToolIcons.linear,
                badge: 'found in Slack'
            },
            { id: 'jira', label: 'Jira', iconKey: 'JiraIcon', iconUrl: mockWorkToolIcons.jira },
            { id: 'notion', label: 'Notion', iconUrl: mockWorkToolIcons.notion },
            { id: 'asana', label: 'Asana', iconUrl: mockWorkToolIcons.asana }
        ]
    },
    {
        label: 'Code',
        icon: 'OnboardingCodeLight',
        tools: [
            {
                id: 'github',
                label: 'Github',
                iconUrl: mockWorkToolIcons.github,
                badge: 'found in Slack'
            },
            { id: 'bitbucket', label: 'Bitbucket', iconUrl: mockWorkToolIcons.bitbucket },
            { id: 'sentry', label: 'Sentry', iconUrl: mockWorkToolIcons.sentry }
        ]
    }
];

export const workToolsCalendarEvents: OnboardingCalendarEventItem[] = [
    {
        id: 'ux-discussion-1',
        title: 'UX discussion with Rahul',
        timeLabel: '1 pm',
        top: 179,
        height: 66,
        tone: 'purple'
    },
    {
        id: 'lunch',
        title: 'Lunch break',
        timeLabel: '2 pm',
        top: 251,
        height: 62,
        tone: 'gold'
    },
    {
        id: 'ux-discussion-2',
        title: 'UX discussion with Rahul',
        timeLabel: '3:30 pm',
        top: 345,
        height: 66,
        tone: 'purple'
    },
    {
        id: 'eod-review',
        title: 'End of Day review',
        timeLabel: '6 pm',
        top: 489,
        height: 62,
        tone: 'gold'
    }
];

export const calendarInsightEvents: OnboardingCalendarEventItem[] = [
    {
        id: 'deep-work',
        title: 'Deep work block',
        timeLabel: '10 am',
        top: 11,
        height: 105,
        tone: 'brown'
    },
    {
        id: 'comms',
        title: 'Comms window #1',
        timeLabel: '11:30 am',
        top: 122,
        height: 46,
        tone: 'teal'
    },
    {
        id: 'ux-discussion',
        title: 'UX discussion with Rahul',
        timeLabel: '1 pm',
        top: 179,
        height: 66,
        tone: 'purple'
    },
    {
        id: 'lunch',
        title: 'Lunch break',
        timeLabel: '2 pm',
        top: 251,
        height: 62,
        tone: 'gold'
    },
    {
        id: 'ux-discussion-2',
        title: 'UX discussion with Rahul',
        timeLabel: '3:30 pm',
        top: 345,
        height: 66,
        tone: 'purple'
    },
    {
        id: 'eod-review',
        title: 'End of Day review',
        timeLabel: '6 pm',
        top: 489,
        height: 62,
        tone: 'gold'
    }
];

export { getOnboardingV2RoleChoiceLabels as getRoleChoiceLabels } from '@/utils/onboarding-v2-i18n';

export function isOnboardingFlowStep(value: unknown): value is OnboardingFlowStep {
    return typeof value === 'string' && ONBOARDING_FLOW_STEPS.includes(value as OnboardingFlowStep);
}

export function isLegacyOnboardingStage(stage?: string): boolean {
    return Boolean(stage && LEGACY_ONBOARDING_STAGES.has(stage));
}

export function normalizeFlowData(raw: unknown): OnboardingFlowData {
    if (!raw || typeof raw !== 'object') {
        return {};
    }

    const data = raw as OnboardingFlowData;
    const keyAuthRaw = data.keyAuth;
    let keyAuth: OnboardingFlowData['keyAuth'];
    if (keyAuthRaw && typeof keyAuthRaw === 'object') {
        const next: NonNullable<OnboardingFlowData['keyAuth']> = {};
        (['google', 'slack', 'msteams'] as const).forEach((provider) => {
            const status = keyAuthRaw[provider];
            if (status === 'success' || status === 'failed') {
                next[provider] = status;
            }
        });
        if (Object.keys(next).length) {
            keyAuth = next;
        }
    }

    return {
        selectedRole: data.selectedRole,
        workspace:
            data.workspace === 'msteams'
                ? 'msteams'
                : data.workspace === 'slack'
                  ? 'slack'
                  : data.workspace === 'teams'
                    ? 'msteams'
                    : undefined,
        selectedTools: Array.isArray(data.selectedTools) ? data.selectedTools.filter(Boolean) : undefined,
        wrapUpTime: typeof data.wrapUpTime === 'string' ? data.wrapUpTime : undefined,
        wrapUpFromTimePicker: data.wrapUpFromTimePicker === true,
        keyAuth
    };
}

type ResolveFlowStepOptions = {
    authenticated: boolean;
};

export function resolveOnboardingFlowStep(
    state: OnboardingV2State | undefined,
    { authenticated }: ResolveFlowStepOptions
): OnboardingFlowStep {
    if (!state || state.status === 'not_started') {
        return 'welcome';
    }

    if (state.status === 'skipped') {
        return 'welcome';
    }

    if (state.status === 'completed') {
        return state.stage === 'thank-you' ? 'thank-you' : 'welcome';
    }

    let step: OnboardingFlowStep = isOnboardingFlowStep(state.stage)
        ? state.stage
        : isLegacyOnboardingStage(state.stage)
          ? 'welcome'
          : 'welcome';

    const keyAuth = normalizeFlowData(state.flowData).keyAuth;
    if (authenticated && step === 'keys-first' && keyAuth?.google !== 'failed') {
        step = 'keys-second';
    }
    if (authenticated && step === 'role-plan' && keyAuth?.google === 'success') {
        step = 'keys-second';
    }

    return step;
}

export function getPreviousFlowStep(step: OnboardingFlowStep): OnboardingFlowStep | null {
    switch (step) {
        case 'priority':
            return 'welcome';
        case 'role-plan':
            return 'priority';
        case 'keys-first':
            return 'role-plan';
        case 'keys-second':
            return 'keys-first';
        case 'work-tools':
            return 'keys-complete';
        case 'wrap-up-confirm':
            return 'work-tools';
        case 'wrap-up-time':
            return 'wrap-up-confirm';
        case 'calendar-insight':
            return 'keys-complete';
        case 'thank-you':
            return 'keys-second';
        default:
            return null;
    }
}

export function getNextFlowStep(step: OnboardingFlowStep): OnboardingFlowStep | null {
    const index = ONBOARDING_FLOW_STEPS.indexOf(step);
    if (index < 0 || index >= ONBOARDING_FLOW_STEPS.length - 1) {
        return null;
    }
    return ONBOARDING_FLOW_STEPS[index + 1];
}

/** First job is only for a new Slack connect this session — not Google, not already-connected Slack. */
export function shouldFireExecuteFirstOnboardingJob(opts: {
    slackAlreadyConnected: boolean;
    slackConnectedNow: boolean;
    oauthProvider: OnboardingKeyAuthProvider | null;
}): boolean {
    if (opts.slackAlreadyConnected || !opts.slackConnectedNow) {
        return false;
    }
    return opts.oauthProvider !== 'google';
}

if (import.meta.env.DEV) {
    console.assert(
        shouldFireExecuteFirstOnboardingJob({
            slackAlreadyConnected: true,
            slackConnectedNow: true,
            oauthProvider: 'slack'
        }) === false,
        'already-connected Slack should not execute first job'
    );
    console.assert(
        shouldFireExecuteFirstOnboardingJob({
            slackAlreadyConnected: false,
            slackConnectedNow: true,
            oauthProvider: 'google'
        }) === false,
        'Google OAuth should not execute first job'
    );
    console.assert(
        shouldFireExecuteFirstOnboardingJob({
            slackAlreadyConnected: false,
            slackConnectedNow: true,
            oauthProvider: 'slack'
        }) === true,
        'new Slack connect should execute first job'
    );
    console.assert(
        resolveOnboardingFlowStep(
            { status: 'in_progress', stage: 'keys-first', flowData: { keyAuth: { google: 'failed' } } },
            { authenticated: true }
        ) === 'keys-first',
        'failed Google should not auto-advance off keys-first'
    );
}
