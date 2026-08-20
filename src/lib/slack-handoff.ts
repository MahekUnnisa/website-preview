/** Slack / Teams handoff URLs after onboarding. Prefer the bot IM (D…) when /auth/apps has it. */

export type SlackHandoff = {
    connected: boolean;
    teamId: string | null;
    botUserId: string | null;
    channelId: string | null;
};

export function slackWebUrl(
    teamId?: string | null,
    botUserId?: string | null,
    channelId?: string | null
): string {
    const team = typeof teamId === 'string' ? teamId.trim() : '';
    const channel = typeof channelId === 'string' ? channelId.trim() : '';
    const bot = typeof botUserId === 'string' ? botUserId.trim() : '';
    if (team && channel) {
        return `https://app.slack.com/client/${encodeURIComponent(team)}/${encodeURIComponent(channel)}`;
    }
    if (team && bot) {
        return `https://slack.com/app_redirect?channel=${encodeURIComponent(bot)}&team=${encodeURIComponent(team)}`;
    }
    return team ? `https://app.slack.com/client/${encodeURIComponent(team)}` : 'https://app.slack.com';
}

export function slackAppUrl(
    teamId?: string | null,
    botUserId?: string | null,
    channelId?: string | null
): string {
    const team = typeof teamId === 'string' ? teamId.trim() : '';
    const channel = typeof channelId === 'string' ? channelId.trim() : '';
    const bot = typeof botUserId === 'string' ? botUserId.trim() : '';
    if (team && channel) {
        return `slack://channel?team=${encodeURIComponent(team)}&id=${encodeURIComponent(channel)}`;
    }
    if (team && bot) {
        return `slack://user?team=${encodeURIComponent(team)}&id=${encodeURIComponent(bot)}`;
    }
    return team ? `slack://open?team=${encodeURIComponent(team)}` : 'slack://open';
}

export function teamsWebUrl(): string {
    return 'https://teams.microsoft.com';
}

export function teamsAppUrl(): string {
    return 'msteams:';
}

export function workspaceAppUrl(
    provider: 'slack' | 'msteams',
    teamId?: string | null,
    botUserId?: string | null,
    channelId?: string | null
): string {
    return provider === 'msteams' ? teamsAppUrl() : slackAppUrl(teamId, botUserId, channelId);
}

export function workspaceWebUrl(
    provider: 'slack' | 'msteams',
    teamId?: string | null,
    botUserId?: string | null,
    channelId?: string | null
): string {
    return provider === 'msteams' ? teamsWebUrl() : slackWebUrl(teamId, botUserId, channelId);
}

function connectedAppsFromPayload(payload: unknown): Array<Record<string, unknown>> {
    if (!payload || typeof payload !== 'object') {
        return [];
    }
    const root = payload as Record<string, unknown>;
    const nested = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : null;
    const appsRaw = Array.isArray(nested?.connectedApps)
        ? nested.connectedApps
        : Array.isArray(root.connectedApps)
          ? root.connectedApps
          : [];
    return appsRaw.filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object');
}

export function slackHandoffFromAppsPayload(payload: unknown): SlackHandoff {
    let connected = false;
    let teamId: string | null = null;
    let botUserId: string | null = null;
    let channelId: string | null = null;

    for (const app of connectedAppsFromPayload(payload)) {
        if (app.provider !== 'slack') {
            continue;
        }
        connected = true;
        if (!teamId && typeof app.teamId === 'string' && app.teamId.trim()) {
            teamId = app.teamId.trim();
        }
        const bot =
            (typeof app.slackBotUserId === 'string' && app.slackBotUserId.trim()) ||
            (typeof app.botUserId === 'string' && app.botUserId.trim()) ||
            '';
        if (!botUserId && bot) {
            botUserId = bot;
        }
        const dm =
            (typeof app.slackDmChannelId === 'string' && app.slackDmChannelId.trim()) ||
            (typeof app.channelId === 'string' && app.channelId.trim()) ||
            '';
        if (!channelId && dm) {
            channelId = dm;
        }
    }

    return { connected, teamId, botUserId, channelId };
}

export function connectionsFromConnectedAppsPayload(
    payload: unknown
): Record<string, { connected: boolean }> {
    const connections: Record<string, { connected: boolean }> = {};
    for (const app of connectedAppsFromPayload(payload)) {
        const provider = typeof app.provider === 'string' ? app.provider.toLowerCase().trim() : '';
        if (provider === 'slack') {
            connections.slack = { connected: true };
        }
        if (provider === 'msteams' || provider === 'microsoft') {
            connections.msteams = { connected: true };
        }
    }
    return connections;
}

export function slackTeamIdFromAppsPayload(payload: unknown): string | null {
    return slackHandoffFromAppsPayload(payload).teamId;
}

function trimId(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

/** Slack handoff ids from GET /v2/onboarding?version=v3 `workspace`. */
export function slackHandoffFromOnboardingPayload(payload: unknown): SlackHandoff {
    const root = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
    const nested = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : null;
    const workspaceRaw = nested?.workspace ?? root.workspace;
    const workspace = workspaceRaw && typeof workspaceRaw === 'object' ? (workspaceRaw as Record<string, unknown>) : {};
    return {
        connected: workspace.connected === true,
        teamId: trimId(workspace.teamId),
        botUserId: trimId(workspace.botUserId) ?? trimId(workspace.slackBotUserId),
        channelId: trimId(workspace.channelId) ?? trimId(workspace.slackDmChannelId),
    };
}

/**
 * Open Slack in this tab. Prefer the web client URL (works on iOS + Android).
 * slack:// does not unload the page if the app is missing; https does navigate away.
 */
export function openWorkspaceHandoff(appUrl: string, webUrl?: string | null): void {
    if (typeof window === 'undefined') {
        return;
    }
    const url = typeof webUrl === 'string' && webUrl.trim() ? webUrl.trim() : appUrl;
    if (url) {
        window.location.assign(url);
    }
}

/** Timer try: slack:// in this tab so /onboard is not replaced if the scheme is ignored. */
export function tryOpenWorkspaceApp(appUrl: string): void {
    if (typeof window === 'undefined' || !appUrl) {
        return;
    }
    window.location.href = appUrl;
}

const SHOW_INSTALL_KEY = 'zero_onboard_show_install';

export function markOnboardInstall(): void {
    try {
        localStorage.setItem(SHOW_INSTALL_KEY, '1');
    } catch {
        try {
            sessionStorage.setItem(SHOW_INSTALL_KEY, '1');
        } catch {
            /* ignore */
        }
    }
}

function readInstallMark(): boolean {
    try {
        if (localStorage.getItem(SHOW_INSTALL_KEY) === '1') {
            return true;
        }
    } catch {
        /* ignore */
    }
    try {
        return sessionStorage.getItem(SHOW_INSTALL_KEY) === '1';
    } catch {
        return false;
    }
}

export function onboardInstallMarked(): boolean {
    return readInstallMark();
}

if (import.meta.env.DEV) {
    console.assert(
        slackAppUrl('T123', 'U456', 'D789') === 'slack://channel?team=T123&id=D789',
        'Slack app URL should open the bot IM when channel id is present'
    );
    console.assert(
        slackWebUrl('T123', 'U456', 'D789') === 'https://app.slack.com/client/T123/D789',
        'Slack web URL should be client/team/channel when channel id is present'
    );
    console.assert(
        slackAppUrl('T123', 'U456') === 'slack://user?team=T123&id=U456',
        'Slack app URL should open Zero DM when bot id is present'
    );
    console.assert(
        slackWebUrl('T123', 'U456') === 'https://slack.com/app_redirect?channel=U456&team=T123',
        'Slack web URL should app-redirect to Zero DM when bot id is present'
    );
    console.assert(slackAppUrl('T123') === 'slack://open?team=T123', 'Slack app URL should fall back to workspace');
    console.assert(
        slackHandoffFromAppsPayload({
            data: {
                connectedApps: [{ provider: 'slack', teamId: 'T1', slackBotUserId: 'U9', slackDmChannelId: 'D2' }],
            },
        }).channelId === 'D2',
        'handoff should read slackDmChannelId from /auth/apps'
    );
    console.assert(
        slackHandoffFromOnboardingPayload({
            workspace: { connected: true, teamId: 'T1', channelId: 'D2', botUserId: 'U9' },
        }).channelId === 'D2',
        'handoff should read channelId from onboarding workspace'
    );
    console.assert(
        connectionsFromConnectedAppsPayload({
            data: { connectedApps: [{ provider: 'slack', teamId: 'T1' }] },
        }).slack?.connected === true,
        'existing Slack auth should count as connected'
    );
}
