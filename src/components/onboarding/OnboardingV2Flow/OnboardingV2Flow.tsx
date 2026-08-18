import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/WebAuthProvider';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '@/data/static/analytics-events';
import { useOnboardingFlowState } from '@/hooks/useOnboardingFlowState';
import { fetchOnboardingV3, fireExecuteFirstOnboardingJob } from '@/api/onboarding';
import {
    buildDefaultRemoteConfig,
    resolvePreselectedToolIds,
    selectedToolsMapFromIds
} from '@/lib/onboarding-api';
import {
    getRoleChoiceLabels,
    normalizeFlowData,
    resolveOnboardingFlowStep,
    shouldFireExecuteFirstOnboardingJob,
    workspaceKeyIconUrl,
    type OnboardingFlowStep
} from '@/lib/onboarding-flow';
import {
    getOnboardingV2CommitmentsPreviewItems,
    getOnboardingV2FocusPreviewEvents,
    getOnboardingV2KeysCopy,
    getOnboardingV2MeetingsPreviewBlocks,
    getOnboardingV2RolePlanCopy
} from '@/utils/onboarding-v2-i18n';
import { preferSameTabOAuth, subscribeOnboardOAuthResult } from '@/lib/onboard-oauth';
import { onboardInstallMarked, slackHandoffFromOnboardingPayload, type SlackHandoff } from '@/lib/slack-handoff';
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
import { OnboardingAllSetScreen } from '../OnboardingAllSetScreen';
import { OnboardingInstallScreen } from '../OnboardingInstallScreen';
import { OnboardingStatusMessage } from '../OnboardingStatusMessage';

interface OnboardingV2FlowProps {
    setShowOnboardingV2?: (show: boolean) => void;
}

const SECOND_KEY_AUTO_MS = 3000;
const isKeysStep = (step: OnboardingFlowStep): boolean => step === 'keys-first' || step === 'keys-second';

function onboardingWorkspaceConnectedFromRecord(record: unknown, workspace: 'slack' | 'msteams'): boolean {
    const root = record && typeof record === 'object' ? (record as Record<string, unknown>) : {};
    const nested = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : null;
    const workspaceRaw = (nested?.workspace ?? root.workspace) as unknown;
    if (!workspaceRaw || typeof workspaceRaw !== 'object') {
        return false;
    }

    const workspaceRecord = workspaceRaw as Record<string, unknown>;
    if (workspaceRecord.connected === true) {
        return true;
    }

    const options = Array.isArray(workspaceRecord.options) ? workspaceRecord.options : [];
    return options.some((entry) => {
        if (!entry || typeof entry !== 'object') {
            return false;
        }
        const option = entry as Record<string, unknown>;
        const id = typeof option.id === 'string' ? option.id : '';
        const normalized = id === 'teams' ? 'msteams' : id;
        return normalized === workspace && option.connected === true;
    });
}

const PlanStepText = ({ lead, rest }: { lead: string; rest: string }) => (
    <>
        <span className="font-bold">{lead}</span> {rest}
    </>
);

const OnboardingV2Flow: React.FC<OnboardingV2FlowProps> = () => {
    const { trackEvent } = useAnalytics();
    const { authenticated, login, connectIntegration, userId } = useAuth();
    const [flowState, setFlowState, isHydrated, syncAfterLogin] = useOnboardingFlowState(userId ?? null);
    const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>(() =>
        selectedToolsMapFromIds(resolvePreselectedToolIds())
    );
    const remoteConfig = useMemo(() => buildDefaultRemoteConfig(), []);
    const [keysEntranceComplete, setKeysEntranceComplete] = useState(false);
    const [secondKeyProgress, setSecondKeyProgress] = useState(0);
    const syncedAuthRef = useRef<string | null>(null);
    const completedAllSetRef = useRef(false);
    const secondKeyRafRef = useRef<number | null>(null);
    const workspaceOAuthStartedRef = useRef(false);
    const slackAlreadyConnectedRef = useRef(false);
    const capturedSlackHydrateRef = useRef(false);
    const [workspaceConnectedFromApi, setWorkspaceConnectedFromApi] = useState(false);
    const [slackHandoff, setSlackHandoff] = useState<SlackHandoff>({
        connected: false,
        teamId: null,
        botUserId: null,
        channelId: null
    });
    const [showInstall, setShowInstall] = useState(() => onboardInstallMarked());

    const flowData = useMemo(() => normalizeFlowData(flowState?.flowData), [flowState?.flowData]);
    const workspace = flowData.workspace ?? 'slack';

    const step = resolveOnboardingFlowStep(flowState, { authenticated });
    const workspaceConnected = workspaceConnectedFromApi;
    const googleFailed = flowData.keyAuth?.google === 'failed';
    const workspaceFailed = flowData.keyAuth?.[workspace] === 'failed';
    const keysErrored = googleFailed || workspaceFailed;

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

    useEffect(() => {
        if (!authenticated || !(isKeysStep(step) || step === 'thank-you')) {
            return;
        }
        let cancelled = false;
        void fetchOnboardingV3().then((response) => {
            if (cancelled) {
                return;
            }
            const connected = onboardingWorkspaceConnectedFromRecord(response.data, workspace);
            setWorkspaceConnectedFromApi(connected);
            setSlackHandoff(slackHandoffFromOnboardingPayload(response.data));
            if (!capturedSlackHydrateRef.current) {
                capturedSlackHydrateRef.current = true;
                slackAlreadyConnectedRef.current = connected;
            }
        });
        return () => {
            cancelled = true;
        };
    }, [authenticated, step, workspace]);

    // Persist Google keyAuth once this session has a JWT (OAuth callback stored the token).
    useEffect(() => {
        if (!authenticated || googleFailed || flowData.keyAuth?.google === 'success') {
            return;
        }
        void setFlowState((previous) => {
            const prevData = normalizeFlowData(previous?.flowData);
            if (prevData.keyAuth?.google === 'failed' || prevData.keyAuth?.google === 'success') {
                return {};
            }
            return {
                flowData: {
                    ...prevData,
                    keyAuth: { ...prevData.keyAuth, google: 'success' }
                }
            };
        });
    }, [authenticated, flowData.keyAuth?.google, googleFailed, setFlowState]);

    useEffect(() => {
        const unsubscribe = subscribeOnboardOAuthResult((message) => {
            if (message.status === 'failed') {
                if (message.provider) {
                    void setFlowState((previous) => {
                        const prevData = normalizeFlowData(previous?.flowData);
                        return {
                            flowData: {
                                ...prevData,
                                keyAuth: { ...prevData.keyAuth, [message.provider]: 'failed' }
                            }
                        };
                    });
                }
                return;
            }
            if (message.status !== 'success' || !authenticated || !isKeysStep(step)) {
                return;
            }
            if (message.provider) {
                void setFlowState((previous) => {
                    const prevData = normalizeFlowData(previous?.flowData);
                    return {
                        flowData: {
                            ...prevData,
                            keyAuth: { ...prevData.keyAuth, [message.provider]: 'success' }
                        }
                    };
                });
            }
            void fetchOnboardingV3().then((response) => {
                const connected = onboardingWorkspaceConnectedFromRecord(response.data, workspace);
                setWorkspaceConnectedFromApi(connected);
                setSlackHandoff(slackHandoffFromOnboardingPayload(response.data));
                if (
                    shouldFireExecuteFirstOnboardingJob({
                        slackAlreadyConnected: slackAlreadyConnectedRef.current,
                        slackConnectedNow: connected,
                        oauthProvider: message.provider
                    })
                ) {
                    fireExecuteFirstOnboardingJob();
                }
            });
        });
        return unsubscribe;
    }, [authenticated, setFlowState, step, workspace]);

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
        if (!authenticated || googleFailed) {
            return;
        }
        if (flowState?.stage === 'keys-first') {
            void persistStep('keys-second');
            return;
        }
        if (flowState?.stage === 'role-plan' && flowData.keyAuth?.google === 'success') {
            void persistStep('keys-second');
        }
    }, [authenticated, flowData.keyAuth?.google, flowState?.stage, googleFailed, persistStep]);

    useEffect(() => {
        if (keysErrored) {
            return undefined;
        }
        if (step === 'keys-second' && workspaceConnected) {
            const timer = window.setTimeout(() => {
                void persistStep('thank-you', {}, 'completed');
            }, 2000);
            return () => window.clearTimeout(timer);
        }
        return undefined;
    }, [keysErrored, persistStep, step, workspaceConnected]);

    // Skip leftover keys-complete / calendar insight / wrap-up if a stored stage still points at them.
    useEffect(() => {
        if (
            step === 'keys-complete' ||
            step === 'work-tools' ||
            step === 'wrap-up-confirm' ||
            step === 'wrap-up-time' ||
            step === 'calendar-insight'
        ) {
            void persistStep('thank-you', {}, 'completed');
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

        await setFlowState({
            status: 'completed',
            stage: 'thank-you',
            completed: true,
            flowData: mergedFlowData,
            onboardingStartTime: flowState?.onboardingStartTime ?? new Date().toISOString()
        });
    }, [
        flowData,
        flowState?.onboardingStartTime,
        selectedTools,
        setFlowState,
        trackEvent
    ]);

    useEffect(() => {
        if (step !== 'thank-you' || completedAllSetRef.current) {
            return;
        }
        completedAllSetRef.current = true;
        void handleComplete();
    }, [handleComplete, step]);

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
                // Persist first so same-tab Google return lands on keys, not role-plan.
                void persistStep('keys-first', { selectedRole: role }).then(() => login());
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

    useEffect(() => {
        const isKeysStep = step === 'keys-first' || step === 'keys-second' || step === 'keys-complete';
        if (!isKeysStep || keysEntranceComplete) {
            return undefined;
        }

        const timer = window.setTimeout(() => setKeysEntranceComplete(true), 2200);
        return () => window.clearTimeout(timer);
    }, [keysEntranceComplete, step]);

    const startSecondKeyAuth = useCallback(() => {
        workspaceOAuthStartedRef.current = true;
        connectIntegration(workspace);
    }, [connectIntegration, workspace]);

    // Slack path: 3s progress then auto-start Slack OAuth.
    useEffect(() => {
        const shouldFill =
            step === 'keys-second' &&
            authenticated &&
            !workspaceConnected &&
            !keysErrored &&
            workspace === 'slack' &&
            keysEntranceComplete;

        if (!shouldFill) {
            if (secondKeyRafRef.current != null) {
                cancelAnimationFrame(secondKeyRafRef.current);
                secondKeyRafRef.current = null;
            }
            if (step !== 'keys-second' || workspaceConnected || keysErrored) {
                setSecondKeyProgress(0);
            }
            return undefined;
        }

        const startedAt = performance.now();

        const tick = (now: number) => {
            const progress = Math.min(1, (now - startedAt) / SECOND_KEY_AUTO_MS);
            setSecondKeyProgress(progress);
            if (progress >= 1) {
                if (!workspaceOAuthStartedRef.current) {
                    startSecondKeyAuth();
                }
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
        keysEntranceComplete,
        keysErrored,
        startSecondKeyAuth,
        step,
        workspace,
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
            <OnboardingScreenShell
                className="max-lg:h-dvh max-lg:max-h-dvh max-lg:overflow-hidden"
                mainClassName="max-lg:min-h-0 max-lg:overflow-hidden max-lg:pb-0"
            >
                {renderRolePlan(role)}
            </OnboardingScreenShell>
        );
    }

    if (step === 'keys-first' && !authenticated && !googleFailed && preferSameTabOAuth()) {
        return <div className="min-h-screen bg-background" />;
    }

    if (step === 'keys-first' || step === 'keys-second') {
        const calendarConnected = authenticated && !googleFailed;
        const keysCopy = getOnboardingV2KeysCopy();
        const showRetryCta = keysErrored;
        const slackShownConnected = workspaceConnected && !workspaceFailed;
        const ctaLabel = googleFailed
            ? keysCopy.retryNamed('Google')
            : workspaceFailed
              ? keysCopy.retryNamed(workspaceLabel)
              : calendarConnected
                ? keysCopy.turnNamed(workspaceLabel)
                : keysCopy.turnFirst;

        const bothConnected = calendarConnected && slackShownConnected && !keysErrored;

        return (
            <OnboardingScreenShell>
                <OnboardingKeysSetupPanel
                    title={keysCopy.title}
                    className="gap-6"
                    contentClassName="gap-6"
                    entranceComplete={keysEntranceComplete}
                    footer={
                        bothConnected ? (
                            <OnboardingStatusMessage
                                message="Both keys connected"
                                loadingIcon
                                className="[&_p]:text-foreground-muted"
                            />
                        ) : (
                        <OnboardingFooterActions
                            actions={[
                                {
                                    label: ctaLabel,
                                    icon: showRetryCta ? 'OnboardingArrowClockwiseLight' : 'OnboardingKeyLight',
                                    progress:
                                        !showRetryCta &&
                                        calendarConnected &&
                                        workspace === 'slack'
                                            ? secondKeyProgress
                                            : undefined,
                                    onClick: () => {
                                        if (googleFailed || !calendarConnected) {
                                            login();
                                            return;
                                        }
                                        if (secondKeyRafRef.current != null) {
                                            cancelAnimationFrame(secondKeyRafRef.current);
                                            secondKeyRafRef.current = null;
                                        }
                                        if (!workspaceFailed) {
                                            setSecondKeyProgress(1);
                                        }
                                        startSecondKeyAuth();
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
                            iconUrl={workspaceKeyIconUrl(selectedWorkspaceProvider?.icon)}
                            iconVariant="brand"
                            connected={slackShownConnected}
                            failed={workspaceFailed}
                            connectedLabel={keysCopy.connected}
                            footer={
                                slackShownConnected || !calendarConnected || !hasMultipleWorkspaceProviders
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

    if (
        step === 'thank-you' ||
        step === 'keys-complete' ||
        step === 'calendar-insight'
    ) {
        if (showInstall) {
            return <OnboardingInstallScreen />;
        }
        return (
            <OnboardingAllSetScreen
                workspace={workspace}
                workspaceLabel={workspaceLabel}
                teamId={slackHandoff.teamId}
                botUserId={slackHandoff.botUserId}
                channelId={slackHandoff.channelId}
                onHandoffDone={() => setShowInstall(true)}
            />
        );
    }

    return null;
};

export default OnboardingV2Flow;
