import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/WebAuthProvider';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '@/data/static/analytics-events';
import { useOnboardingFlowState } from '@/hooks/useOnboardingFlowState';
import { useOnboardingCalendarAnalyze } from '@/hooks/useOnboardingCalendarAnalyze';
import { finalizeCalendarAnalyzeAfterOnboarding } from '@/lib/onboarding-calendar-analyze';
import { fetchOnboardingV3, saveOnboardingV3 } from '@/api/onboarding';
import {
    buildDefaultRemoteConfig,
    buildOnboardingV3Payload,
    hasOnboardingV3Payload,
    mapOnboardingV3Response,
    mergeRemoteFlowData,
    resolvePreselectedToolIds,
    selectedToolsMapFromIds,
    type OnboardingRemoteConfig
} from '@/lib/onboarding-api';
import {
    DEFAULT_WRAP_UP_TIME,
    getRoleChoiceLabels,
    normalizeFlowData,
    resolveOnboardingFlowStep,
    SLACK_FAVICON_URL,
    type OnboardingFlowStep,
    type OnboardingFlowData
} from '@/lib/onboarding-flow';
import {
    getOnboardingV2CommitmentsPreviewItems,
    getOnboardingV2FocusPreviewEvents,
    getOnboardingV2KeysCopy,
    getOnboardingV2MeetingsPreviewBlocks,
    getOnboardingV2RolePlanCopy
} from '@/utils/onboarding-v2-i18n';
import { getChromeWebStoreUrl } from '@/lib/env.js';
import { setPendingOnboardingKeyAuth } from '@/lib/onboarding-key-auth';
import {
    getOnboardingDefaultScheduleDate,
    mapAnalyzeEventsToTimelineEvents,
    resolveInsightScheduleDate
} from '@/lib/onboarding-timeline-utils';
import type { OnboardingRoleId } from '../OnboardingRoleSelectScreen';
import { OnboardingWelcomeScreen } from '../OnboardingWelcomeScreen';
import { OnboardingRoleSelectScreen } from '../OnboardingRoleSelectScreen';
import { OnboardingScreenShell } from '../OnboardingScreenShell';
import { OnboardingRolePlanPanel } from '../OnboardingRolePlanPanel';
import { OnboardingPlanStep } from '../OnboardingPlanStep';
import { OnboardingSchedulePreview } from '../OnboardingSchedulePreview';
import { OnboardingThreadsToCalendarPreview } from '../OnboardingThreadsToCalendarPreview';
import { OnboardingMeetingTimelinePreview } from '../OnboardingMeetingTimelinePreview';
import { OnboardingKeysSetupPanel } from '../OnboardingKeysSetupPanel';
import { OnboardingKeysPanel, OnboardingKeysDivider } from '../OnboardingKeysPanel';
import { OnboardingKeyItem } from '../OnboardingKeyItem';
import { OnboardingWorkspacePicker } from '../OnboardingWorkspacePicker';
import { OnboardingFooterActions } from '../OnboardingFooterActions';
import { OnboardingStatusMessage } from '../OnboardingStatusMessage';
import { OnboardingScheduleFlowLayout } from '../OnboardingScheduleFlowLayout';
import { OnboardingCalendarInsightPanel } from '../OnboardingCalendarInsightPanel';

interface OnboardingV2FlowProps {
    setShowOnboardingV2?: (show: boolean) => void;
}

const SECOND_KEY_AUTO_MS = 3000;
/** Web: do not auto-open workspace OAuth — user must click Connect (avoids surprise Slack popup after Google). */
const AUTO_OPEN_WORKSPACE_OAUTH = false;

const PlanStepText = ({ lead, rest }: { lead: string; rest: string }) => (
    <>
        <span className="font-bold">{lead}</span> {rest}
    </>
);

const OnboardingV2Flow: React.FC<OnboardingV2FlowProps> = ({ setShowOnboardingV2 }) => {
    const { trackEvent } = useAnalytics();
    const { authenticated, login, connectIntegration, connections, userId } = useAuth();
    const [flowState, setFlowState, isHydrated, syncAfterLogin] = useOnboardingFlowState(userId ?? null);
    const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>(() =>
        selectedToolsMapFromIds(resolvePreselectedToolIds())
    );
    const [remoteConfig, setRemoteConfig] = useState<OnboardingRemoteConfig>(() => buildDefaultRemoteConfig());
    const [keysEntranceComplete, setKeysEntranceComplete] = useState(false);
    const [secondKeyProgress, setSecondKeyProgress] = useState(0);
    const [remoteConfigLoaded, setRemoteConfigLoaded] = useState(false);
    const syncedAuthRef = useRef<string | null>(null);
    const configSyncedForUserRef = useRef<string | null>(null);
    const remoteConfigInFlightRef = useRef(false);
    const remoteConfigLoadGenRef = useRef(0);
    const scheduleFlowEnteredRef = useRef(false);
    const keysCompleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const secondKeyRafRef = useRef<number | null>(null);
    const secondKeyAutoFiredRef = useRef(false);

    const flowData = useMemo(() => normalizeFlowData(flowState?.flowData), [flowState?.flowData]);
    const workspace = flowData.workspace ?? 'slack';
    const wrapUpTime = flowData.wrapUpTime ?? DEFAULT_WRAP_UP_TIME;

    const step = resolveOnboardingFlowStep(flowState, { authenticated, connections });
    const workspaceConnected = Boolean(connections[workspace]?.connected);
    const isWorkspaceKeysStep = step === 'keys-second' || step === 'keys-complete';

    const {
        insight: calendarInsight,
        analyzeResult: calendarAnalyzeResult,
        fireExecuteFirstJob,
        isInsightLoading,
        hasCompletedResult,
        status: calendarAnalyzeStatus
    } = useOnboardingCalendarAnalyze({
        workspace,
        workspaceConnected,
        userId,
        canStart: isWorkspaceKeysStep
    });

    const syncToApi = useCallback(
        async (data: OnboardingFlowData, tools: Record<string, boolean> = selectedTools) => {
            if (!authenticated) {
                return;
            }

            const payload = buildOnboardingV3Payload(data, tools, remoteConfig.toolCategories);
            if (!hasOnboardingV3Payload(payload)) {
                return;
            }

            await saveOnboardingV3(payload);
        },
        [authenticated, remoteConfig.toolCategories, selectedTools]
    );

    useEffect(() => {
        if (!authenticated || !userId || syncedAuthRef.current === userId) {
            return;
        }
        syncedAuthRef.current = userId;
        void syncAfterLogin(userId);
    }, [authenticated, syncAfterLogin, userId]);

    useEffect(() => {
        setSelectedTools(selectedToolsMapFromIds(resolvePreselectedToolIds(flowData.selectedTools)));
    }, [flowData.selectedTools]);

    const loadRemoteConfig = useCallback(async () => {
        if (remoteConfigInFlightRef.current) {
            return;
        }

        const loadGen = remoteConfigLoadGenRef.current;
        remoteConfigInFlightRef.current = true;
        try {
            const response = await fetchOnboardingV3();
            if (loadGen !== remoteConfigLoadGenRef.current) {
                return;
            }
            const { flowData: remotePatch, config } = mapOnboardingV3Response(response.data);

            setRemoteConfig(config);

            await setFlowState((previous) => ({
                flowData: mergeRemoteFlowData(normalizeFlowData(previous?.flowData), remotePatch)
            }));
        } catch {
            // ponytail: keep Slack default from buildDefaultRemoteConfig
        } finally {
            remoteConfigInFlightRef.current = false;
            if (loadGen === remoteConfigLoadGenRef.current) {
                setRemoteConfigLoaded(true);
            }
        }
    }, [setFlowState]);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        const isKeysStep = step === 'keys-first' || step === 'keys-second' || step === 'keys-complete';
        if (!isKeysStep || remoteConfigLoaded) {
            return;
        }

        void loadRemoteConfig();
    }, [isHydrated, loadRemoteConfig, remoteConfigLoaded, step]);

    // Persist keyAuth success when connections land (covers auth-success race / missed write).
    useEffect(() => {
        if (!authenticated || flowData.keyAuth?.google === 'success') {
            return;
        }
        void setFlowState((previous) => {
            const prevData = normalizeFlowData(previous?.flowData);
            if (prevData.keyAuth?.google === 'success') {
                return {};
            }
            return {
                flowData: {
                    ...prevData,
                    keyAuth: { ...prevData.keyAuth, google: 'success' }
                }
            };
        });
    }, [authenticated, flowData.keyAuth?.google, setFlowState]);

    useEffect(() => {
        if (!workspaceConnected || flowData.keyAuth?.[workspace] === 'success') {
            return;
        }
        void setFlowState((previous) => {
            const prevData = normalizeFlowData(previous?.flowData);
            if (prevData.keyAuth?.[workspace] === 'success') {
                return {};
            }
            return {
                flowData: {
                    ...prevData,
                    keyAuth: { ...prevData.keyAuth, [workspace]: 'success' }
                }
            };
        });
    }, [flowData.keyAuth, setFlowState, workspace, workspaceConnected]);

    useEffect(() => {
        if (!authenticated || !userId || configSyncedForUserRef.current === userId) {
            return;
        }
        configSyncedForUserRef.current = userId;
        remoteConfigLoadGenRef.current += 1;
        remoteConfigInFlightRef.current = false;
        setRemoteConfigLoaded(false);
    }, [authenticated, userId]);

    const persistStep = useCallback(
        async (
            nextStep: OnboardingFlowStep,
            patch: Partial<typeof flowData> = {},
            status: 'in_progress' | 'completed' = 'in_progress'
        ) => {
            const selectedToolIds = Object.entries(selectedTools)
                .filter(([, selected]) => selected)
                .map(([id]) => id);

            const mergedFlowData = {
                ...flowData,
                ...patch,
                selectedTools: patch.selectedTools ?? selectedToolIds
            };

            await setFlowState({
                status,
                stage: nextStep,
                completed: status === 'completed',
                flowData: mergedFlowData,
                onboardingStartTime: flowState?.onboardingStartTime ?? new Date().toISOString()
            });
        },
        [flowData, flowState?.onboardingStartTime, selectedTools, setFlowState]
    );

    const updateWorkspace = useCallback(
        (nextWorkspace: 'slack' | 'msteams') => {
            void setFlowState({ flowData: { ...flowData, workspace: nextWorkspace } });
        },
        [flowData, setFlowState]
    );

    useEffect(() => {
        if (step !== 'keys-complete') {
            if (keysCompleteTimerRef.current) {
                clearTimeout(keysCompleteTimerRef.current);
                keysCompleteTimerRef.current = null;
            }
            return;
        }

        keysCompleteTimerRef.current = setTimeout(() => {
            void persistStep('calendar-insight');
        }, 5000);

        return () => {
            if (keysCompleteTimerRef.current) {
                clearTimeout(keysCompleteTimerRef.current);
                keysCompleteTimerRef.current = null;
            }
        };
    }, [persistStep, step]);

    useEffect(() => {
        if (step === 'keys-first' && authenticated && flowState?.stage === 'keys-first') {
            void persistStep('keys-second');
        }
    }, [authenticated, flowState?.stage, persistStep, step]);

    useEffect(() => {
        if (step === 'keys-second' && connections[workspace]?.connected && flowState?.stage === 'keys-second') {
            void persistStep('keys-complete');
        }
    }, [connections, flowState?.stage, persistStep, step, workspace]);

    // Skip legacy mid-flow screens if a stored stage still points at them.
    useEffect(() => {
        if (step === 'work-tools' || step === 'wrap-up-confirm' || step === 'wrap-up-time' || step === 'thank-you') {
            void persistStep('calendar-insight');
        }
    }, [persistStep, step]);

    const handleComplete = useCallback(async () => {
        trackEvent(ANALYTICS_EVENTS.ONBOARDING.COMPLETED);
        const mergedFlowData = {
            ...flowData,
            selectedTools: Object.entries(selectedTools)
                .filter(([, selected]) => selected)
                .map(([id]) => id)
        };

        await syncToApi(mergedFlowData, selectedTools);

        await setFlowState({
            status: 'completed',
            stage: 'calendar-insight',
            completed: true,
            flowData: mergedFlowData,
            onboardingStartTime: flowState?.onboardingStartTime ?? new Date().toISOString()
        });
        void finalizeCalendarAnalyzeAfterOnboarding();
        setShowOnboardingV2?.(false);
    }, [
        flowData,
        flowState?.onboardingStartTime,
        selectedTools,
        setFlowState,
        setShowOnboardingV2,
        syncToApi,
        trackEvent
    ]);

    const handleOpenZero = useCallback(() => {
        if (hasCompletedResult) {
            fireExecuteFirstJob();
        }
        void handleComplete();
        window.open(getChromeWebStoreUrl(), '_blank', 'noopener,noreferrer');
    }, [fireExecuteFirstJob, handleComplete, hasCompletedResult]);

    const rolePlanCopy = getOnboardingV2RolePlanCopy();

    const rolePlanActions = (role: OnboardingRoleId) => [
        {
            label: rolePlanCopy.goBack,
            variant: 'back' as const,
            onClick: () => {
                void persistStep('priority');
            }
        },
        {
            label: rolePlanCopy.connectTools,
            icon: 'OnboardingKeyLight' as const,
            onClick: () => {
                void persistStep('keys-first', { selectedRole: role });
            }
        }
    ];

    const renderRolePlan = (role: OnboardingRoleId) => {
        const userChoice = getRoleChoiceLabels()[role];

        if (role === 'focus') {
            return (
                <OnboardingRolePlanPanel
                    userChoice={userChoice}
                    botMessage={rolePlanCopy.botMessage}
                    preview={<OnboardingSchedulePreview events={getOnboardingV2FocusPreviewEvents()} />}
                    steps={
                        <>
                            {rolePlanCopy.focusSteps.map((stepCopy, index) => (
                                <OnboardingPlanStep key={stepCopy.lead} step={index + 1}>
                                    {/*<PlanStepText lead={stepCopy.lead} rest={stepCopy.rest} />*/}
                                    <PlanStepText lead='' rest={stepCopy.rest} />
                                </OnboardingPlanStep>
                            ))}
                        </>
                    }
                    actions={rolePlanActions(role)}
                    trustNote={rolePlanCopy.trustNote}
                />
            );
        }

        if (role === 'commitments') {
            return (
                <OnboardingRolePlanPanel
                    userChoice={userChoice}
                    botMessage={rolePlanCopy.botMessage}
                    preview={<OnboardingThreadsToCalendarPreview items={getOnboardingV2CommitmentsPreviewItems()} />}
                    steps={
                        <>
                            {rolePlanCopy.commitmentsSteps.map((stepCopy, index) => (
                                <OnboardingPlanStep key={stepCopy.lead} step={index + 1}>
                                    <PlanStepText lead="" rest={stepCopy.rest} />
                                </OnboardingPlanStep>
                            ))}
                        </>
                    }
                    actions={rolePlanActions(role)}
                    trustNote={rolePlanCopy.trustNote}
                />
            );
        }

        return (
            <OnboardingRolePlanPanel
                userChoice={userChoice}
                botMessage={rolePlanCopy.botMessage}
                preview={<OnboardingMeetingTimelinePreview blocks={getOnboardingV2MeetingsPreviewBlocks()} />}
                steps={
                    <>
                        {rolePlanCopy.meetingsSteps.map((stepCopy, index) => (
                            <OnboardingPlanStep key={stepCopy.lead} step={index + 1}>
                                <PlanStepText lead="" rest={stepCopy.rest} />
                            </OnboardingPlanStep>
                        ))}
                    </>
                }
                actions={rolePlanActions(role)}
                trustNote={rolePlanCopy.trustNote}
            />
        );
    };

    const workspaceProviders = remoteConfig.workspaceProviders;
    const selectedWorkspaceProvider =
        workspaceProviders.find((provider) => provider.id === workspace) ?? workspaceProviders[0];
    const workspaceLabel = selectedWorkspaceProvider?.label ?? 'Slack';
    const hasMultipleWorkspaceProviders = workspaceProviders.length > 1;

    const scheduleDate = useMemo(() => {
        if (calendarAnalyzeResult?.date) {
            return resolveInsightScheduleDate(calendarAnalyzeResult.date);
        }
        return getOnboardingDefaultScheduleDate();
    }, [calendarAnalyzeResult?.date]);

    const insightTimelineEvents = useMemo(
        () => mapAnalyzeEventsToTimelineEvents(calendarAnalyzeResult?.data?.events),
        [calendarAnalyzeResult?.data?.events]
    );

    useEffect(() => {
        const isKeysStep = step === 'keys-first' || step === 'keys-second' || step === 'keys-complete';
        if (!isKeysStep || keysEntranceComplete) {
            return undefined;
        }

        const timer = window.setTimeout(() => setKeysEntranceComplete(true), 2200);
        return () => window.clearTimeout(timer);
    }, [keysEntranceComplete, step]);

    const startSecondKeyAuth = useCallback(
        (fromAuto = false) => {
            if (fromAuto) {
                if (secondKeyAutoFiredRef.current) {
                    return;
                }
                secondKeyAutoFiredRef.current = true;
                setSecondKeyProgress(1);
            }
            void setPendingOnboardingKeyAuth(workspace).then(() => {
                connectIntegration(workspace);
            });
        },
        [connectIntegration, workspace]
    );

    // Extension auto-opens workspace OAuth after 3s; disabled on web (explicit click only).
    useEffect(() => {
        if (!AUTO_OPEN_WORKSPACE_OAUTH) {
            if (secondKeyRafRef.current != null) {
                cancelAnimationFrame(secondKeyRafRef.current);
                secondKeyRafRef.current = null;
            }
            if (step !== 'keys-second' || workspaceConnected) {
                setSecondKeyProgress(0);
                secondKeyAutoFiredRef.current = false;
            }
            return undefined;
        }

        const shouldAuto =
            step === 'keys-second' &&
            authenticated &&
            !workspaceConnected &&
            remoteConfigLoaded &&
            !hasMultipleWorkspaceProviders &&
            keysEntranceComplete;

        if (!shouldAuto) {
            if (secondKeyRafRef.current != null) {
                cancelAnimationFrame(secondKeyRafRef.current);
                secondKeyRafRef.current = null;
            }
            if (step !== 'keys-second' || workspaceConnected) {
                setSecondKeyProgress(0);
                secondKeyAutoFiredRef.current = false;
            }
            return undefined;
        }

        secondKeyAutoFiredRef.current = false;
        const startedAt = performance.now();

        const tick = (now: number) => {
            const progress = Math.min(1, (now - startedAt) / SECOND_KEY_AUTO_MS);
            setSecondKeyProgress(progress);
            if (progress >= 1) {
                startSecondKeyAuth(true);
                return;
            }
            secondKeyRafRef.current = requestAnimationFrame(tick);
        };

        secondKeyRafRef.current = requestAnimationFrame(tick);

        return () => {
            if (secondKeyRafRef.current != null) {
                cancelAnimationFrame(secondKeyRafRef.current);
                secondKeyRafRef.current = null;
            }
        };
    }, [
        authenticated,
        hasMultipleWorkspaceProviders,
        keysEntranceComplete,
        remoteConfigLoaded,
        startSecondKeyAuth,
        step,
        workspaceConnected
    ]);

    if (!isHydrated) {
        return <div className="min-h-screen bg-background" />;
    }

    if (step === 'welcome') {
        return (
            <OnboardingWelcomeScreen
                onHireMe={() => {
                    void persistStep('priority');
                }}
            />
        );
    }

    if (step === 'priority') {
        return (
            <OnboardingRoleSelectScreen
                onSelect={(roleId) => {
                    void persistStep('role-plan', { selectedRole: roleId });
                }}
            />
        );
    }

    if (step === 'role-plan') {
        const role = flowData.selectedRole ?? 'focus';
        return (
            <OnboardingScreenShell mainClassName="items-start justify-center pt-[13px]">
                {renderRolePlan(role)}
            </OnboardingScreenShell>
        );
    }

    if (step === 'keys-first' || step === 'keys-second' || step === 'keys-complete') {
        const calendarConnected = authenticated;
        const bothKeysConnected = calendarConnected && workspaceConnected;
        const keysCopy = getOnboardingV2KeysCopy();
        const googleFailed = flowData.keyAuth?.google === 'failed' && !calendarConnected;
        const workspaceFailed = flowData.keyAuth?.[workspace] === 'failed' && !workspaceConnected;
        const showRetryCta = googleFailed || workspaceFailed;
        const ctaLabel = googleFailed
            ? keysCopy.retryNamed('Google')
            : workspaceFailed
              ? keysCopy.retryNamed(workspaceLabel)
              : calendarConnected
                ? keysCopy.turnNamed(workspaceLabel)
                : keysCopy.turnFirst;

        return (
            <OnboardingScreenShell mainClassName="items-start justify-center pt-[13px]">
                <OnboardingKeysSetupPanel
                    title={keysCopy.title}
                    className="gap-6"
                    contentClassName="gap-6"
                    entranceComplete={keysEntranceComplete || bothKeysConnected}
                    footer={
                        bothKeysConnected ? (
                            <OnboardingStatusMessage message={keysCopy.bothTurned} loadingIcon />
                        ) : (
                            <OnboardingFooterActions
                                actions={[
                                    {
                                        label: ctaLabel,
                                        icon: showRetryCta ? 'OnboardingArrowClockwiseLight' : 'OnboardingKeyLight',
                                        progress:
                                            AUTO_OPEN_WORKSPACE_OAUTH &&
                                            !showRetryCta &&
                                            calendarConnected &&
                                            !hasMultipleWorkspaceProviders
                                                ? secondKeyProgress
                                                : undefined,
                                        onClick: () => {
                                            if (!calendarConnected) {
                                                void setPendingOnboardingKeyAuth('google').then(() => {
                                                    login();
                                                });
                                                return;
                                            }
                                            if (secondKeyRafRef.current != null) {
                                                cancelAnimationFrame(secondKeyRafRef.current);
                                                secondKeyRafRef.current = null;
                                            }
                                            setSecondKeyProgress(1);
                                            startSecondKeyAuth(false);
                                        }
                                    }
                                ]}
                            />
                        )
                    }
                >
                    <OnboardingKeysPanel>
                        <OnboardingKeyItem
                            keyLabel={keysCopy.key01}
                            title={keysCopy.calendarTitle}
                            description={keysCopy.calendarDesc}
                            icon="GoogleCalendarIcon"
                            iconType="raster"
                            iconVariant="brand"
                            connected={calendarConnected}
                            failed={googleFailed}
                            requiredHint={keysCopy.requiredHint}
                            connectedLabel={keysCopy.connected}
                        />
                        <OnboardingKeysDivider />
                        <OnboardingKeyItem
                            keyLabel={keysCopy.key02}
                            title={workspaceLabel}
                            description={keysCopy.workspaceDesc}
                            iconUrl={selectedWorkspaceProvider?.icon || SLACK_FAVICON_URL}
                            iconVariant="brand"
                            connected={workspaceConnected}
                            failed={workspaceFailed}
                            connectedLabel={keysCopy.connected}
                            footer={
                                workspaceConnected || !calendarConnected || !hasMultipleWorkspaceProviders
                                    ? undefined
                                    : (
                                        <OnboardingWorkspacePicker
                                            value={workspace}
                                            onChange={updateWorkspace}
                                            providers={workspaceProviders}
                                        />
                                    )
                            }
                        />
                    </OnboardingKeysPanel>
                </OnboardingKeysSetupPanel>
            </OnboardingScreenShell>
        );
    }

    if (step === 'calendar-insight') {
        const insightReady = calendarInsight != null && !isInsightLoading && calendarAnalyzeStatus === 'completed';
        const insightLoading = !insightReady;
        const insightHeadline =
            insightReady && calendarInsight.botMessage
                ? calendarInsight.botMessage
                : '';
        const leftTimelineEvents = insightReady ? insightTimelineEvents : [];
        const animateCalendarEntry = !scheduleFlowEnteredRef.current;
        scheduleFlowEnteredRef.current = true;

        return (
            <OnboardingScreenShell mainClassName="items-start justify-center pt-[13px]">
                <OnboardingScheduleFlowLayout
                    scheduleDate={scheduleDate}
                    calendarEvents={leftTimelineEvents}
                    animateCalendar={animateCalendarEntry}
                    overlay={insightLoading}
                    animateEvents={insightReady}
                    showStatus={false}
                >
                    <OnboardingCalendarInsightPanel
                        embedded
                        loading={insightLoading}
                        events={[]}
                        headline={insightHeadline}
                        wrapUpTime={wrapUpTime}
                        onOpenZero={handleOpenZero}
                    />
                </OnboardingScheduleFlowLayout>
            </OnboardingScreenShell>
        );
    }

    return null;
};

export default OnboardingV2Flow;
