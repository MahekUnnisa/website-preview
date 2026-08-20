import { Storage } from '@/lib/storage';

const TOKEN_KEY = 'zero_web_auth_token';
const USER_ID_KEY = 'zero_web_auth_user_id';

const authStorage = new Storage({ area: 'local' });

export async function getAuthToken(): Promise<string | null> {
    const token = await authStorage.get<string>(TOKEN_KEY);
    if (typeof token === 'string' && token.trim().length > 0) {
        return token;
    }
    return null;
}

export async function getAuthUserId(): Promise<string | null> {
    const userId = await authStorage.get<string>(USER_ID_KEY);
    if (typeof userId === 'string' && userId.trim().length > 0) {
        return userId;
    }
    return null;
}

export async function setAuthSession(session: { token: string; userId?: string | null }): Promise<void> {
    await authStorage.set(TOKEN_KEY, session.token);
    if (session.userId) {
        await authStorage.set(USER_ID_KEY, session.userId);
    }
}

export async function clearAuthSession(): Promise<void> {
    await authStorage.remove(TOKEN_KEY);
    await authStorage.remove(USER_ID_KEY);
}
