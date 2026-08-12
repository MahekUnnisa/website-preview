import { apiClient } from '@/lib/api/client';
import { routes } from '@/lib/api';

export type AuthMeUser = {
    id: string;
    name?: string;
    email?: string;
    picture?: string;
    provider?: string;
};

export async function fetchAuthMe(): Promise<AuthMeUser | null> {
    const response = await apiClient.get<unknown>(routes.auth.me);
    const body = response.data;
    if (!body || typeof body !== 'object') {
        return null;
    }
    const record = body as Record<string, unknown>;
    if (typeof record.id === 'string') {
        return record as AuthMeUser;
    }
    const nested = record.data;
    if (nested && typeof nested === 'object' && typeof (nested as AuthMeUser).id === 'string') {
        return nested as AuthMeUser;
    }
    return null;
}

export function connectionsFromIntegrationsPayload(
    payload: unknown
): Record<string, { connected: boolean }> {
    const root = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
    const nested = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : null;
    const appsRaw = Array.isArray(nested?.apps) ? nested.apps : Array.isArray(root.apps) ? root.apps : [];

    const connections: Record<string, { connected: boolean }> = {};
    for (const entry of appsRaw) {
        if (!entry || typeof entry !== 'object') {
            continue;
        }
        const app = entry as { id?: string; connected?: boolean };
        const id = typeof app.id === 'string' ? app.id.toLowerCase().trim() : '';
        if (!id) {
            continue;
        }
        connections[id] = { connected: app.connected === true };
    }
    return connections;
}

export async function fetchIntegrationConnections(): Promise<Record<string, { connected: boolean }>> {
    const response = await apiClient.get(routes.integrations.list);
    return connectionsFromIntegrationsPayload(response.data);
}
