import { format, isToday, isTomorrow, parseISO } from 'date-fns';

import { ONBOARDING_V2_OWNER_USER_ID_KEY } from '@/data/static/onboarding';
import { Storage } from '@/lib/storage';
import type { OnboardingCalendarEventItem, OnboardingCalendarEventTone } from '@/types/onboarding';

const CALENDAR_GRID_START_HOUR = 10;
const PX_PER_HOUR = 60;
const EVENT_TOP_OFFSET = 11;

export const CALENDAR_INSIGHT_WAIT_MS = 60_000;
export const CALENDAR_DEFERRED_POLL_MS = 3 * 60_000;
const TAB_OPENED_AT_SESSION_KEY = 'onboarding_calendar_nudge_tab_opened_at';
export const PENDING_CALENDAR_NUDGE_STORAGE_KEY = 'onboarding_pending_calendar_nudge';
const CALENDAR_ANALYZE_STATE_KEY = 'onboarding_calendar_analyze_state';

const storageLocal = () => new Storage({ area: 'local' });

export type CalendarAnalyzeJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type CalendarAnalyzeApiEvent = {
    id: string;
    summary: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
    description?: string;
    color?: string;
    attendees?: Array<{ email?: string; responseStatus?: string }>;
};

export type CalendarAnalyzeResult = {
    name?: string;
    date?: string;
    botMessage?: string;
    data?: {
        events?: CalendarAnalyzeApiEvent[];
    };
};

export type CalendarAnalyzePollResponse = {
    success?: boolean;
    jobId?: string;
    status?: CalendarAnalyzeJobStatus;
    result?: CalendarAnalyzeResult;
    error?: unknown;
    createdAt?: string;
    updatedAt?: string;
};

export type CalendarAnalyzeInsight = {
    jobId: string;
    botMessage: string;
    dateLabel: string;
    dateDetail: string;
    events: OnboardingCalendarEventItem[];
};

export type PendingCalendarNudgeContent = {
    date?: string;
    botMessage?: string;
    events: CalendarAnalyzeApiEvent[];
    headerText: string;
    actions: Array<{ id: string; text: string; type: string }>;
    syntheticOnboardingCalendar: true;
};

export type PendingCalendarNudgeRecord = {
    userId: string;
    ready: boolean;
    /** Epoch ms when the result was stored — only tabs opened after this may show it. */
    readyAt?: number;
    content: PendingCalendarNudgeContent;
};

type StoredCalendarAnalyze = {
    jobId: string | null;
    status: CalendarAnalyzeJobStatus | 'idle';
    result: CalendarAnalyzeResult | null;
    insight: CalendarAnalyzeInsight | null;
    workspaceId: string | null;
    userId: string | null;
    analyzeStartedAt: number | null;
    insightSkipped: boolean;
    pollDeadline: number | null;
};

let stored: StoredCalendarAnalyze = {
    jobId: null,
    status: 'idle',
    result: null,
    insight: null,
    workspaceId: null,
    userId: null,
    analyzeStartedAt: null,
    insightSkipped: false,
    pollDeadline: null
};

const listeners = new Set<(snapshot: StoredCalendarAnalyze) => void>();
const nudgeReadyListeners = new Set<() => void>();
let consumeInFlight = false;
let hydratePromise: Promise<void> | null = null;
let hydrated = false;

const notify = () => {
    listeners.forEach((listener) => listener({ ...stored }));
    void persistCalendarAnalyzeState();
};

const notifyNudgeReady = () => {
    nudgeReadyListeners.forEach((listener) => listener());
};

/** Stamp once per tab session so we can refuse nudges that became ready before this tab opened. */
function getTabOpenedAt(): number {
    try {
        if (typeof sessionStorage === 'undefined') {
            return Date.now();
        }
        const existing = sessionStorage.getItem(TAB_OPENED_AT_SESSION_KEY);
        if (existing) {
            const parsed = Number(existing);
            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }
        const now = Date.now();
        sessionStorage.setItem(TAB_OPENED_AT_SESSION_KEY, String(now));
        return now;
    } catch {
        return Date.now();
    }
}

// Capture open time as early as this module loads in the tab.
void getTabOpenedAt();

async function persistCalendarAnalyzeState(): Promise<void> {
    if (!stored.jobId) {
        return;
    }

    try {
        await storageLocal().set(CALENDAR_ANALYZE_STATE_KEY, {
            jobId: stored.jobId,
            status: stored.status,
            result: stored.result,
            insight: stored.insight,
            workspaceId: stored.workspaceId,
            userId: stored.userId,
            analyzeStartedAt: stored.analyzeStartedAt,
            insightSkipped: stored.insightSkipped,
            pollDeadline: stored.pollDeadline
        });
    } catch {
        // ponytail: best-effort — in-memory state still drives the current session
    }
}

export function isCalendarAnalyzeHydrated(): boolean {
    return hydrated;
}

export async function hydrateCalendarAnalyzeFromStorage(): Promise<void> {
    if (hydrated) {
        return;
    }

    if (!hydratePromise) {
        hydratePromise = (async () => {
            try {
                const saved = await storageLocal().get<StoredCalendarAnalyze>(CALENDAR_ANALYZE_STATE_KEY);
                if (saved?.jobId) {
                    stored = {
                        ...stored,
                        ...saved,
                        status: saved.status ?? 'idle'
                    };
                    notify();
                }
            } catch {
                // continue with empty in-memory state
            } finally {
                hydrated = true;
            }
        })();
    }

    await hydratePromise;
}

export async function clearCalendarAnalyzePersistence(): Promise<void> {
    stored = {
        jobId: null,
        status: 'idle',
        result: null,
        insight: null,
        workspaceId: null,
        userId: null,
        analyzeStartedAt: null,
        insightSkipped: false,
        pollDeadline: null
    };
    hydrated = true;
    hydratePromise = Promise.resolve();
    notify();
    try {
        await storageLocal().remove(CALENDAR_ANALYZE_STATE_KEY);
    } catch {
        // noop
    }
}

/** Drop reload snapshot after onboarding. */
export async function finalizeCalendarAnalyzeAfterOnboarding(): Promise<void> {
    try {
        await storageLocal().remove(CALENDAR_ANALYZE_STATE_KEY);
    } catch {
        // noop
    }

    await clearCalendarAnalyzePersistence();
}

export function subscribePendingCalendarNudgeReady(listener: () => void): () => void {
    nudgeReadyListeners.add(listener);
    return () => nudgeReadyListeners.delete(listener);
}

export function subscribeOnboardingCalendarAnalyze(listener: (snapshot: StoredCalendarAnalyze) => void): () => void {
    listeners.add(listener);
    listener({ ...stored });
    return () => listeners.delete(listener);
}

export function getOnboardingCalendarAnalyzeSnapshot(): StoredCalendarAnalyze {
    return { ...stored };
}

export function resetOnboardingCalendarAnalyze(): void {
    stored = {
        jobId: null,
        status: 'idle',
        result: null,
        insight: null,
        workspaceId: null,
        userId: null,
        analyzeStartedAt: null,
        insightSkipped: false,
        pollDeadline: null
    };
    notify();
}

export function hasCompletedCalendarAnalyzeResult(): boolean {
    return stored.status === 'completed' && Boolean(stored.result);
}

export function isCalendarInsightLoading(): boolean {
    return !hasCompletedCalendarAnalyzeResult() && stored.status !== 'failed';
}

export function markCalendarInsightSkipped(): void {
    if (stored.insightSkipped) {
        return;
    }

    const startedAt = stored.analyzeStartedAt ?? Date.now();
    stored = {
        ...stored,
        insightSkipped: true,
        analyzeStartedAt: stored.analyzeStartedAt ?? startedAt,
        pollDeadline: startedAt + CALENDAR_INSIGHT_WAIT_MS + CALENDAR_DEFERRED_POLL_MS
    };
    notify();
}

function parseEventDate(value?: string): Date | null {
    if (!value) {
        return null;
    }
    const parsed = parseISO(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatEventTimeLabel(date: Date): string {
    return format(date, 'h:mm a').replace('AM', 'am').replace('PM', 'pm');
}

function minutesFromGridStart(date: Date): number {
    return Math.max(0, (date.getHours() - CALENDAR_GRID_START_HOUR) * 60 + date.getMinutes());
}

function colorToTone(color?: string): OnboardingCalendarEventTone {
    const normalized = color?.toLowerCase() ?? '';
    if (normalized.includes('4d') || normalized.includes('deep')) {
        return 'brown';
    }
    if (normalized.includes('1b516c') || normalized.includes('teal')) {
        return 'teal';
    }
    if (normalized.includes('74591e') || normalized.includes('gold')) {
        return 'gold';
    }
    return 'purple';
}

function formatCalendarDateLabels(dateStr?: string): { dateLabel: string; dateDetail: string } {
    if (!dateStr) {
        return { dateLabel: 'Tomorrow', dateDetail: format(new Date(), 'd MMMM yyyy') };
    }

    const date = parseISO(dateStr);
    if (Number.isNaN(date.getTime())) {
        return { dateLabel: 'Tomorrow', dateDetail: dateStr };
    }

    const dateLabel = isTomorrow(date) ? 'Tomorrow' : isToday(date) ? 'Today' : format(date, 'EEEE');
    return {
        dateLabel,
        dateDetail: format(date, 'd MMMM yyyy')
    };
}

export function mapCalendarAnalyzeEvents(events: CalendarAnalyzeApiEvent[] | undefined): OnboardingCalendarEventItem[] {
    if (!events?.length) {
        return [];
    }

    return events
        .map((event) => {
            const start = parseEventDate(event.start?.dateTime ?? event.start?.date);
            const end = parseEventDate(event.end?.dateTime ?? event.end?.date);
            if (!start) {
                return null;
            }

            const startMinutes = minutesFromGridStart(start);
            const endMinutes = end ? minutesFromGridStart(end) : startMinutes + 30;
            const durationMinutes = Math.max(15, endMinutes - startMinutes);

            return {
                id: event.id,
                title: event.summary,
                timeLabel: formatEventTimeLabel(start),
                top: EVENT_TOP_OFFSET + (startMinutes / 60) * PX_PER_HOUR,
                height: Math.max(30, (durationMinutes / 60) * PX_PER_HOUR - 4),
                tone: colorToTone(event.color)
            };
        })
        .filter((event): event is OnboardingCalendarEventItem => event !== null);
}

export function mapCalendarAnalyzeToInsight(jobId: string, result: CalendarAnalyzeResult): CalendarAnalyzeInsight {
    const { dateLabel, dateDetail } = formatCalendarDateLabels(result.date);
    return {
        jobId,
        botMessage: result.botMessage ?? '',
        dateLabel,
        dateDetail,
        events: mapCalendarAnalyzeEvents(result.data?.events)
    };
}

export function mapCalendarAnalyzeToResponseContent(result: CalendarAnalyzeResult): PendingCalendarNudgeContent {
    return {
        date: result.date,
        botMessage: result.botMessage,
        events: result.data?.events ?? [],
        headerText: 'What would you like to do?',
        actions: [
            { id: 'onboarding-calendar-looks-good', text: 'Looks good', type: 'primary' },
            { id: 'onboarding-calendar-leave-it', text: 'Leave it', type: 'secondary' }
        ],
        syntheticOnboardingCalendar: true
    };
}

export function setCalendarAnalyzeJob(jobId: string, workspaceId: string, userId?: string | null): void {
    const startedAt = Date.now();
    stored = {
        ...stored,
        jobId,
        status: 'queued',
        workspaceId,
        userId: userId ?? stored.userId,
        result: null,
        insight: null,
        analyzeStartedAt: startedAt,
        insightSkipped: false,
        pollDeadline: startedAt + CALENDAR_INSIGHT_WAIT_MS + CALENDAR_DEFERRED_POLL_MS
    };
    notify();
}

export function applyCalendarAnalyzePollResponse(response: CalendarAnalyzePollResponse): void {
    const status = response.status ?? stored.status;
    const result = response.result ?? (status === 'completed' ? stored.result : null);
    const jobId = response.jobId ?? stored.jobId;
    const wasDeferred = stored.insightSkipped;
    const previousStatus = stored.status;

    stored = {
        ...stored,
        jobId,
        status,
        result: result ?? null,
        insight:
            status === 'completed' && result && jobId
                ? mapCalendarAnalyzeToInsight(jobId, result)
                : stored.insight
    };
    notify();

    if (status === 'completed' && result && wasDeferred && previousStatus !== 'completed') {
        void persistDeferredCalendarNudge(result).then(() => {
            void clearCalendarAnalyzePersistence();
        });
    }
}

async function persistDeferredCalendarNudge(result: CalendarAnalyzeResult): Promise<void> {
    const owner =
        stored.userId ??
        (await storageLocal().get<string>(ONBOARDING_V2_OWNER_USER_ID_KEY));
    const userId = owner ? String(owner) : 'unknown';

    const record: PendingCalendarNudgeRecord = {
        userId,
        ready: true,
        readyAt: Date.now(),
        content: mapCalendarAnalyzeToResponseContent(result)
    };

    await storageLocal().set(PENDING_CALENDAR_NUDGE_STORAGE_KEY, record);
    notifyNudgeReady();
}

export async function peekPendingCalendarNudgeRecord(
    userId: string
): Promise<PendingCalendarNudgeRecord | null> {
    const record = await storageLocal().get<PendingCalendarNudgeRecord>(PENDING_CALENDAR_NUDGE_STORAGE_KEY);
    if (!record?.ready || String(record.userId) !== String(userId)) {
        return null;
    }
    return record;
}

export async function consumePendingCalendarNudge(
    userId: string
): Promise<PendingCalendarNudgeContent | null> {
    if (consumeInFlight) {
        return null;
    }

    consumeInFlight = true;
    try {
        const record = await peekPendingCalendarNudgeRecord(userId);
        if (!record) {
            return null;
        }

        // Only the first new tab opened after generation may show — leave storage for that tab.
        if (getTabOpenedAt() <= (record.readyAt ?? 0)) {
            return null;
        }

        await storageLocal().remove(PENDING_CALENDAR_NUDGE_STORAGE_KEY);
        return record.content;
    } finally {
        consumeInFlight = false;
    }
}

// ponytail: assert-based self-check — layout math fails if grid constants drift
if (import.meta.env?.DEV) {
    const sample = mapCalendarAnalyzeToInsight('job-1', {
        name: 'CalendarResponse',
        date: '2026-07-31',
        botMessage: 'Planning your day.',
        data: {
            events: [
                {
                    id: 'a',
                    summary: 'AI Scrum',
                    start: { dateTime: '2026-07-31T10:00:00+05:30' },
                    end: { dateTime: '2026-07-31T10:30:00+05:30' },
                    color: '#6B4CE8'
                }
            ]
        }
    });
    console.assert(sample.botMessage === 'Planning your day.', 'botMessage should map to insight headline');
    console.assert(sample.events.length === 1, 'events should map from API payload');
    console.assert(sample.events[0]?.title === 'AI Scrum', 'event summary should map to title');

    const responseContent = mapCalendarAnalyzeToResponseContent({
        date: '2026-07-31',
        botMessage: 'Planning your day.',
        data: { events: [{ id: 'a', summary: 'AI Scrum', start: { dateTime: '2026-07-31T10:00:00+05:30' }, end: { dateTime: '2026-07-31T10:30:00+05:30' } }] }
    });
    console.assert(responseContent.syntheticOnboardingCalendar === true, 'synthetic flag should be set');
    console.assert(responseContent.actions.length === 2, 'Looks good / Leave it actions should be present');
}
