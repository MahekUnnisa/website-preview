import type { OnboardingRoleId } from '@/types/onboarding';

/** English copy only — website onboarding does not use chrome.i18n. */
export const onboardingV2Msg = (_key: string, fallback: string, _substitutions?: string | string[]) =>
    fallback;

export type OnboardingV2RoleOptionCopy = {
    id: OnboardingRoleId;
    title: string;
    description: string;
    icon: string;
};

export type OnboardingV2PlanStepCopy = {
    lead: string;
    rest: string;
};

export const getOnboardingV2WelcomeCopy = () => ({
    headline: onboardingV2Msg('onboarding_v2_welcome_headline', 'You build, I will run your day.'),
    subtext: onboardingV2Msg(
        'onboarding_v2_welcome_subtext',
        'I find what needs your attention, and make time for it.'
    ),
    hireMe: onboardingV2Msg('onboarding_v2_welcome_hire_me', 'Try me')
});

export const getOnboardingV2PriorityCopy = () => ({
    question: onboardingV2Msg('onboarding_v2_priority_question', 'What should I handle while you build?'),
    roles: [
        {
            id: 'commitments' as const,
            title: onboardingV2Msg('onboarding_v2_role_commitments_title', 'Close the loop'),
            description: onboardingV2Msg(
                'onboarding_v2_role_commitments_desc',
                'Turn Slack promises into calendar time.'
            ),
            icon: 'OnboardingRoleChat' as const
        },
        {
            id: 'meetings' as const,
            title: onboardingV2Msg('onboarding_v2_role_meetings_title', 'Manage meetings'),
            description: onboardingV2Msg(
                'onboarding_v2_role_meetings_desc',
                'Prep context, capture decisions, follow through.'
            ),
            icon: 'OnboardingRoleMeeting' as const
        },
        {
            id: 'focus' as const,
            title: onboardingV2Msg('onboarding_v2_role_focus_title', 'Protect focus time'),
            description: onboardingV2Msg(
                'onboarding_v2_role_focus_desc',
                'Block and defend time for deep work.'
            ),
            icon: 'OnboardingRoleTarget' as const
        }
    ] satisfies OnboardingV2RoleOptionCopy[]
});

export const getOnboardingV2RoleChoiceLabels = (): Record<OnboardingRoleId, string> => ({
    focus: onboardingV2Msg('onboarding_v2_role_choice_focus', 'Protect my focus time'),
    commitments: onboardingV2Msg('onboarding_v2_role_choice_commitments', 'Keep commitments on track'),
    meetings: onboardingV2Msg('onboarding_v2_role_choice_meetings', 'Handle meeting overhead')
});

export const getOnboardingV2RolePlanCopy = () => ({
    botMessage: onboardingV2Msg('onboarding_v2_role_plan_bot', "Cool. Here's how I will run it:"),
    trustNote: onboardingV2Msg(
        'onboarding_v2_role_plan_trust',
        "Just Slack and Google Calendar. That's all."
    ),
    goBack: onboardingV2Msg('onboarding_v2_role_plan_go_back', 'Go back'),
    connectTools: onboardingV2Msg('onboarding_v2_role_plan_connect_tools', 'Connect my tools'),
    focusSteps: [
        {
            lead: onboardingV2Msg('onboarding_v2_plan_focus_1_lead', 'Longest open stretch reserved.'),
            rest: onboardingV2Msg(
                'onboarding_v2_plan_focus_1_rest',
                'Reserve your longest open schedule window for deep work.'
            )
        },
        {
            lead: onboardingV2Msg('onboarding_v2_plan_focus_2_lead', 'Chats get batched:'),
            rest: onboardingV2Msg(
                'onboarding_v2_plan_focus_2_rest',
                'Queue Slack notifs and draft replies for batch processing.'
            )
        },
        {
            lead: onboardingV2Msg('onboarding_v2_plan_focus_3_lead', 'Day ends with review:'),
            rest: onboardingV2Msg(
                'onboarding_v2_plan_focus_3_rest',
                'Days ends with a review/hard stop.'
            )
        }
    ] satisfies OnboardingV2PlanStepCopy[],
    commitmentsSteps: [
        {
            lead: onboardingV2Msg('onboarding_v2_plan_commitments_1_lead', 'Workspace scanned.'),
            rest: onboardingV2Msg('onboarding_v2_plan_commitments_1_rest', 'Scan your full workspace')
        },
        {
            lead: onboardingV2Msg('onboarding_v2_plan_commitments_2_lead', 'Triage twice a day.'),
            rest: onboardingV2Msg('onboarding_v2_plan_commitments_2_rest', 'Sort it out twice a day')
        },
        {
            lead: onboardingV2Msg('onboarding_v2_plan_commitments_3_lead', 'Nothing slips.'),
            rest: onboardingV2Msg(
                'onboarding_v2_plan_commitments_3_rest',
                'Assign calendar slots to action items'
            )
        }
    ] satisfies OnboardingV2PlanStepCopy[],
    meetingsSteps: [
        {
            lead: onboardingV2Msg('onboarding_v2_plan_meetings_1_lead', 'Meetings joined, notes taken.'),
            rest: onboardingV2Msg('onboarding_v2_plan_meetings_1_rest', 'Join and take notes')
        },
        {
            lead: onboardingV2Msg('onboarding_v2_plan_meetings_2_lead', 'Prep before, recap after.'),
            rest: onboardingV2Msg(
                'onboarding_v2_plan_meetings_2_rest',
                'Load context, capture action items'
            )
        },
        {
            lead: onboardingV2Msg('onboarding_v2_plan_meetings_3_lead', 'Total recall.'),
            rest: onboardingV2Msg('onboarding_v2_plan_meetings_3_rest', 'Recall all past meetings')
        }
    ] satisfies OnboardingV2PlanStepCopy[]
});

export const getOnboardingV2FocusPreviewEvents = () => [
    {
        id: 'standup',
        title: onboardingV2Msg('onboarding_v2_preview_standup', 'Stand up'),
        timeLabel: '9:30 AM',
        skeleton: true
    },
    {
        id: 'deep-work',
        title: onboardingV2Msg('onboarding_v2_preview_deep_work', 'Deep work block'),
        timeLabel: '10 - 11:30 AM',
        description: onboardingV2Msg(
            'onboarding_v2_preview_deep_work_desc',
            'longest uninterrupted stretch of the day'
        ),
        variant: 'featured' as const,
        badge: {
            icon: 'OnboardingMoonStarsFill' as const,
            label: onboardingV2Msg('onboarding_v2_preview_protected', 'Protected')
        }
    },
    {
        id: 'comms',
        title: onboardingV2Msg('onboarding_v2_preview_comms', 'Comms window #1'),
        timeLabel: '11:30 AM',
        skeleton: true
    },
    {
        id: 'eod',
        title: onboardingV2Msg('onboarding_v2_preview_eod', 'End of Day'),
        timeLabel: '5 - 5:15 PM',
        description: onboardingV2Msg(
            'onboarding_v2_preview_eod_desc',
            "Review what's shipped and what's blocked"
        )
    }
];

export const getOnboardingV2CommitmentsPreviewItems = () => [
    {
        id: 'pr-review',
        message: onboardingV2Msg('onboarding_v2_preview_thread_pr', '"I\'ll review the PR today"'),
        slotLabel: onboardingV2Msg('onboarding_v2_preview_slot_pr', 'Today 2:00, 30 min'),
        tone: 'today' as const,
        skeleton: true
    },
    {
        id: 'spec-draft',
        message: onboardingV2Msg('onboarding_v2_preview_thread_spec', '"Spec draft by Friday"'),
        slotLabel: onboardingV2Msg('onboarding_v2_preview_slot_spec', 'Thu 10:00, 90 min')
    },
    {
        id: 'follow-up',
        message: onboardingV2Msg('onboarding_v2_preview_thread_followup', '"Follow up with design"'),
        slotLabel: onboardingV2Msg('onboarding_v2_preview_slot_followup', 'Tomorrow, 9:15'),
        skeleton: true
    }
];

export const getOnboardingV2MeetingsPreviewBlocks = () => [
    {
        id: 'context',
        label: onboardingV2Msg('onboarding_v2_preview_meeting_context', 'Context'),
        timeLabel: '10:40 AM',
        description: onboardingV2Msg(
            'onboarding_v2_preview_meeting_context_desc',
            'what changed since last time, in three lines'
        ),
        variant: 'context' as const
    },
    {
        id: 'meeting',
        label: onboardingV2Msg('onboarding_v2_preview_meeting_yours', 'Your meeting'),
        timeLabel: '11 - 11:30 AM',
        variant: 'meeting' as const
    },
    {
        id: 'after',
        label: onboardingV2Msg('onboarding_v2_preview_meeting_after', 'After'),
        timeLabel: '11:35 AM',
        description: onboardingV2Msg(
            'onboarding_v2_preview_meeting_after_desc',
            'decisions captured, follow-ups scheduled, no chasing'
        ),
        variant: 'after' as const
    }
];

export const getOnboardingV2KeysCopy = () => ({
    title: onboardingV2Msg('onboarding_v2_keys_title', 'Auth once, I will handle the rest'),
    bothTurned: onboardingV2Msg('onboarding_v2_keys_both_turned', 'Both keys are turned. Starting now...'),
    turnFirst: onboardingV2Msg('onboarding_v2_keys_turn_first', 'Turn the first key'),
    turnNamed: (label: string) =>
        onboardingV2Msg('onboarding_v2_keys_turn_named', `Turn the ${label} key`, label),
    key01: onboardingV2Msg('onboarding_v2_keys_key_01', 'KEY 01'),
    key02: onboardingV2Msg('onboarding_v2_keys_key_02', 'KEY 02'),
    calendarTitle: onboardingV2Msg('onboarding_v2_keys_calendar_title', 'Google Calendar'),
    calendarDesc: onboardingV2Msg('onboarding_v2_keys_calendar_desc', 'To understand your day'),
    workspaceDesc: onboardingV2Msg(
        'onboarding_v2_keys_workspace_desc',
        'Where the real commitments, decisions, and blockers live'
    ),
    requiredHint: onboardingV2Msg(
        'onboarding_v2_keys_required_hint',
        '*Required for optimized results'
    ),
    connected: onboardingV2Msg('onboarding_v2_keys_connected', 'Connected'),
    retryNamed: (label: string) =>
        onboardingV2Msg('onboarding_v2_keys_retry_named', `Retry ${label} key`, label)
});

export const getOnboardingV2InsightCopy = () => ({
    openZero: onboardingV2Msg('onboarding_v2_insight_open_zero', 'Open Zero'),
    loadingLine1: onboardingV2Msg(
        'onboarding_v2_insight_loading_line1',
        "Thanks, I'm off to work now."
    ),
    loadingLine2: onboardingV2Msg(
        'onboarding_v2_insight_loading_line2',
        "I'm scanning your threads for commitments and context. I will notify you when I'm ready."
    ),
    endOfDay: onboardingV2Msg('onboarding_v2_insight_end_of_day', 'End of Day'),
    /** Full wrap-up sentence; $1 = time, $2 = End of Day label */
    wrapUpSeeYou: (time: string, endOfDayLabel: string) =>
        onboardingV2Msg(
            'onboarding_v2_insight_wrap_up_see_you',
            `See you at ${time} for ${endOfDayLabel}.`,
            [time, endOfDayLabel]
        ),
    /** Parts for bolding time + End of Day in the UI */
    wrapUpPrefix: onboardingV2Msg('onboarding_v2_insight_wrap_up_prefix', 'See you at'),
    wrapUpFor: onboardingV2Msg('onboarding_v2_insight_wrap_up_for', 'for'),
    wrapUpSuffix: onboardingV2Msg(
        'onboarding_v2_insight_wrap_up_suffix',
        'You can summon me here or in Slack anytime.'
    ),
    checkingSchedule: onboardingV2Msg('onboarding_v2_schedule_checking', 'Checking your schedule...'),
    threadsPreviewTitle: onboardingV2Msg(
        'onboarding_v2_preview_threads_title',
        'From threads → onto your calendar'
    )
});
