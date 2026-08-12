import { useCallback, useEffect, useRef, useState } from 'react';

import { requestCalendarAnalyze, requestExecuteFirstOnboardingJob } from '@/api/onboarding';
import {
    beginCalendarAnalyzePolling,
    ensureCalendarAnalyzePolling,
    getOnboardingCalendarAnalyzeSnapshot,
    hasCompletedCalendarAnalyzeResult,
    hydrateCalendarAnalyzeFromStorage,
    isCalendarAnalyzeHydrated,
    isCalendarInsightLoading,
    markCalendarInsightSkipped,
    setCalendarAnalyzeJob,
    subscribeOnboardingCalendarAnalyze,
    type CalendarAnalyzeJobStatus
} from '@/lib/onboarding-calendar-analyze';
import type { OnboardingWorkspaceProvider } from '@/lib/onboarding-flow';

const TERMINAL: CalendarAnalyzeJobStatus[] = ['completed', 'failed'];

type UseOnboardingCalendarAnalyzeOptions = {
    workspace: OnboardingWorkspaceProvider;
    workspaceConnected: boolean;
    userId?: string | null;
    /** Keys screen: start analyze once when the selected workspace connects. */
    canStart: boolean;
};

export function useOnboardingCalendarAnalyze({
    workspace,
    workspaceConnected,
    userId,
    canStart
}: UseOnboardingCalendarAnalyzeOptions) {
    const [snapshot, setSnapshot] = useState(getOnboardingCalendarAnalyzeSnapshot);
    const [hydrated, setHydrated] = useState(isCalendarAnalyzeHydrated());
    const startedForWorkspaceRef = useRef<string | null>(null);

    useEffect(() => subscribeOnboardingCalendarAnalyze(setSnapshot), []);

    useEffect(() => {
        if (hydrated) {
            return;
        }

        void hydrateCalendarAnalyzeFromStorage().then(() => {
            const { jobId, workspaceId } = getOnboardingCalendarAnalyzeSnapshot();
            if (jobId && workspaceId) {
                startedForWorkspaceRef.current = workspaceId;
            }
            setSnapshot(getOnboardingCalendarAnalyzeSnapshot());
            setHydrated(true);
        });
    }, [hydrated]);

    const startAnalyze = useCallback(async () => {
        const response = await requestCalendarAnalyze();
        const jobId = (response.data as { jobId?: string } | undefined)?.jobId;
        if (!jobId) {
            return;
        }

        setCalendarAnalyzeJob(jobId, workspace, userId);
        startedForWorkspaceRef.current = workspace;
        beginCalendarAnalyzePolling(jobId);
    }, [userId, workspace]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }

        const { jobId, status, workspaceId } = getOnboardingCalendarAnalyzeSnapshot();
        if (
            jobId &&
            workspaceId === workspace &&
            !TERMINAL.includes(status as CalendarAnalyzeJobStatus)
        ) {
            startedForWorkspaceRef.current = workspace;
            ensureCalendarAnalyzePolling();
        }
    }, [hydrated, workspace]);

    useEffect(() => {
        if (!hydrated || !canStart || !workspaceConnected) {
            return;
        }

        const { jobId, workspaceId } = getOnboardingCalendarAnalyzeSnapshot();
        if (jobId && workspaceId === workspace) {
            startedForWorkspaceRef.current = workspace;
            ensureCalendarAnalyzePolling();
            return;
        }

        if (startedForWorkspaceRef.current === workspace) {
            return;
        }

        void startAnalyze();
    }, [canStart, hydrated, startAnalyze, workspace, workspaceConnected]);

    const fireExecuteFirstJob = useCallback(() => {
        const { status, result } = getOnboardingCalendarAnalyzeSnapshot();
        if (status !== 'completed' || !result) {
            return;
        }
        void requestExecuteFirstOnboardingJob();
    }, []);

    const skipCalendarInsight = useCallback(() => {
        markCalendarInsightSkipped();
    }, []);

    return {
        insight: snapshot.insight,
        analyzeResult: snapshot.result,
        status: snapshot.status,
        hasCompletedResult: hasCompletedCalendarAnalyzeResult(),
        isInsightLoading: isCalendarInsightLoading(),
        insightSkipped: snapshot.insightSkipped,
        fireExecuteFirstJob,
        skipCalendarInsight
    };
}
