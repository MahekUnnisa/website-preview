import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { onboardingBodyFontClass } from '@/lib/onboarding-font';
import { getOnboardingV2AllSetCopy } from '@/utils/onboarding-v2-i18n';
import { fetchOnboardingV3 } from '@/api/onboarding';
import { ANALYTICS_EVENTS } from '@/data/static/analytics-events';
import { trackEventOnce } from '@/lib/analytics';
import { markOnboardInstall, openWorkspaceHandoff, slackHandoffFromOnboardingPayload, tryOpenWorkspaceApp, workspaceAppUrl, workspaceWebUrl } from '@/lib/slack-handoff';
import type { OnboardingWorkspaceProvider } from '@/lib/onboarding-flow';
import { Image } from '../OnboardingImage';
import { OnboardingFooterActions } from '../OnboardingFooterActions';
import { OnboardingScreenShell, type OnboardingShellVariant } from '../OnboardingScreenShell';
import { OnboardingStatusMessage } from '../OnboardingStatusMessage';

const AUTO_OPEN_APP_MS = 3000;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function trackSlackOpen(entryRoute: 'get-started' | 'onboard', workspace: OnboardingWorkspaceProvider): void {
    trackEventOnce(`slack_open_clicked_${entryRoute}`, ANALYTICS_EVENTS.ONBOARDING.SLACK_OPEN_CLICKED, {
        entry_route: entryRoute,
        workspace,
        provider: workspace,
    });
}

export interface OnboardingAllSetScreenProps {
    entryRoute?: 'get-started' | 'onboard';
    workspace?: OnboardingWorkspaceProvider;
    workspaceLabel?: string;
    teamId?: string | null;
    botUserId?: string | null;
    channelId?: string | null;
    /** Auto-try Slack after 3s. Stories pass false. */
    autoOpen?: boolean;
    onHandoffDone?: () => void;
    className?: string;
    shellVariant?: OnboardingShellVariant;
}

export const OnboardingAllSetScreen: React.FC<OnboardingAllSetScreenProps> = ({
    entryRoute = 'onboard',
    workspace = 'slack',
    workspaceLabel,
    teamId = null,
    botUserId = null,
    channelId = null,
    autoOpen = true,
    onHandoffDone,
    className,
    shellVariant = 'default',
}) => {
    const label = workspaceLabel ?? (workspace === 'msteams' ? 'Teams' : 'Slack');
    const copy = getOnboardingV2AllSetCopy(label);
    const onDoneRef = useRef(onHandoffDone);
    onDoneRef.current = onHandoffDone;
    const urlsRef = useRef({
        app: workspaceAppUrl(workspace, teamId, botUserId, channelId),
        web: workspaceWebUrl(workspace, teamId, botUserId, channelId)
    });
    const [showPrompt, setShowPrompt] = useState(!autoOpen);

    useEffect(() => {
        trackEventOnce(`all_set_viewed_${entryRoute}`, ANALYTICS_EVENTS.ONBOARDING.ALL_SET_VIEWED, {
            entry_route: entryRoute,
            workspace,
        });
    }, [entryRoute, workspace]);

    const openSlackAndInstall = useCallback(() => {
        const { app, web } = urlsRef.current;
        trackSlackOpen(entryRoute, workspace);
        markOnboardInstall();
        openWorkspaceHandoff(app, web);
        onDoneRef.current?.();
    }, [entryRoute, workspace]);

    useEffect(() => {
        if (!autoOpen) {
            return undefined;
        }

        let cancelled = false;
        const startedAt = Date.now();

        void (async () => {
            let nextTeamId = teamId;
            let nextBotUserId = botUserId;
            let nextChannelId = channelId;
            if (workspace === 'slack' && !nextChannelId && !nextBotUserId) {
                const response = await fetchOnboardingV3();
                const handoff = slackHandoffFromOnboardingPayload(response.data);
                nextTeamId = handoff.teamId ?? nextTeamId;
                nextBotUserId = handoff.botUserId ?? nextBotUserId;
                nextChannelId = handoff.channelId ?? nextChannelId;
            }
            if (cancelled) {
                return;
            }
            urlsRef.current = {
                app: workspaceAppUrl(workspace, nextTeamId, nextBotUserId, nextChannelId),
                web: workspaceWebUrl(workspace, nextTeamId, nextBotUserId, nextChannelId)
            };

            const remaining = Math.max(0, AUTO_OPEN_APP_MS - (Date.now() - startedAt));
            if (remaining > 0) {
                await sleep(remaining);
            }
            if (cancelled) {
                return;
            }

            trackSlackOpen(entryRoute, workspace);
            tryOpenWorkspaceApp(urlsRef.current.app);
            markOnboardInstall();
            onDoneRef.current?.();
            setShowPrompt(true);
        })();

        return () => {
            cancelled = true;
        };
    }, [autoOpen, botUserId, channelId, entryRoute, teamId, workspace]);

    return (
        <OnboardingScreenShell
            className={className}
            variant={shellVariant}
            mainClassName="flex min-h-0 flex-1 flex-col px-5 pb-5 sm:px-8 sm:pb-12 lg:px-10"
        >
            <div
                className={cn(
                    'mx-auto grid min-h-0 w-full flex-1 grid-cols-1 grid-rows-[auto_auto_minmax(0,1fr)] gap-6 pt-8',
                    'lg:my-auto lg:max-w-[720px] lg:flex-none lg:grid-cols-[auto_1fr] lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-8 lg:gap-y-6 lg:py-10',
                    'xl:max-w-[840px] xl:gap-x-10 2xl:max-w-[900px]',
                    onboardingBodyFontClass
                )}
            >
                <div className="flex flex-col gap-3 lg:col-start-2 lg:row-start-1">
                    <h1 className="text-[24px] font-semibold leading-[1.35] text-foreground-secondary lg:text-[clamp(24px,2.6vw,36px)]">
                        {copy.title}
                    </h1>
                    <p className="text-sm leading-[1.45] text-foreground-muted">
                        {copy.bodyLead}{' '}
                        <span className="font-medium text-foreground-primary">{copy.bodyEmphasis}</span>
                    </p>
                </div>

                <div className="flex justify-center lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:justify-start">
                    <div
                        className="relative w-full overflow-hidden rounded-xl border border-border bg-foreground-subtle lg:w-[302px] xl:w-[340px]"
                        style={{ aspectRatio: '302 / 251' }}
                    >
                        <Image
                            src="OnboardingAllSetSlack"
                            alt=""
                            type="raster"
                            width={604}
                            height={502}
                            className="size-full object-cover"
                        />
                    </div>
                </div>

                <div className="mt-auto flex w-full min-w-0 flex-col items-start gap-3 lg:col-start-2 lg:row-start-2 lg:mt-0">
                    {showPrompt ? (
                        <>
                            <p className="text-sm leading-[1.45] text-foreground-muted">{copy.ifNotOpen}</p>
                            <OnboardingFooterActions
                                actions={[
                                    {
                                        label: copy.openApp,
                                        onClick: openSlackAndInstall
                                    },
                                    {
                                        label: copy.openWeb,
                                        variant: 'ghost',
                                        onClick: openSlackAndInstall
                                    }
                                ]}
                            />
                        </>
                    ) : (
                        <OnboardingStatusMessage
                            message={copy.takingYou}
                            loadingIcon
                            className="[&_p]:text-foreground-muted"
                        />
                    )}
                </div>
            </div>
        </OnboardingScreenShell>
    );
};

export default OnboardingAllSetScreen;
