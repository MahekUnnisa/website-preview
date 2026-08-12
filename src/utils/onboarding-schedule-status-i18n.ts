const SCHEDULE_STATUS_MESSAGES = [
    'Checking your schedule...',
    'Compiling your schedule..',
    "Looking at tomorrow's blocks...",
    'Learning your wrap-up pattern...',
    'Scanning connected tools...',
] as const;

export const ONBOARDING_SCHEDULE_STATUS_COUNT = SCHEDULE_STATUS_MESSAGES.length;

export const getOnboardingScheduleStatusMessages = () => [...SCHEDULE_STATUS_MESSAGES];
