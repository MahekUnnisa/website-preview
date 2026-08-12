import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { fetchAuthMe, fetchIntegrationConnections } from '@/api/auth';
import { apiClient } from '@/lib/api/client';
import { routes } from '@/lib/api';
import { getApiBase } from '@/lib/env.js';
import { clearAuthSession, getAuthToken, setAuthSession } from '@/lib/auth-session';
import { setPendingOnboardingKeyAuth, type OnboardingKeyAuthProvider } from '@/lib/onboarding-key-auth';
import {
    createOnboardOAuthState,
    isOnboardOAuthMessage,
    openOAuthPopup,
} from '@/lib/onboard-oauth';

type AuthUser = {
    email: string | null;
    userId: string | null;
    name: string | null;
    picture: string | null;
    token?: string | null;
};

type AuthState = {
    status: 'idle' | 'loading' | 'authenticating' | 'success' | 'error';
    authenticated: boolean;
    user: AuthUser;
    error: string | null;
    connections: Record<string, { connected: boolean; token?: string }>;
};

export type AuthContextType = Omit<AuthState, 'user'> &
    AuthUser & {
        login: () => void;
        connectIntegration: (type: string) => void;
        disconnectIntegration: (type: string) => void;
        logout: () => void;
        isLoading: boolean;
    };

const emptyUser: AuthUser = {
    email: null,
    userId: null,
    name: null,
    picture: null,
    token: null,
};

const initialState: AuthState = {
    status: 'loading',
    authenticated: false,
    user: emptyUser,
    error: null,
    connections: {},
};

type AuthAction =
    | { type: 'AUTHENTICATING' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: AuthUser } }
    | { type: 'LOGOUT_SUCCESS' }
    | { type: 'AUTH_ERROR'; payload: { error: string } }
    | { type: 'SET_INTEGRATIONS'; payload: { connections: AuthState['connections'] } }
    | { type: 'READY_UNAUTHENTICATED' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTHENTICATING':
            return { ...state, status: 'authenticating', error: null };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                status: 'success',
                authenticated: true,
                user: action.payload.user,
                error: null,
            };
        case 'LOGOUT_SUCCESS':
        case 'READY_UNAUTHENTICATED':
            return { ...initialState, status: 'success', authenticated: false };
        case 'AUTH_ERROR':
            return { ...state, status: 'error', error: action.payload.error };
        case 'SET_INTEGRATIONS':
            return { ...state, connections: action.payload.connections };
        default:
            return state;
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function googleLoginUrl(): string {
    const base = getApiBase();
    const state = createOnboardOAuthState();
    return `${base}${routes.auth.google}?state=${encodeURIComponent(state)}`;
}

export const WebAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const hydrateFromToken = useCallback(async () => {
        const token = await getAuthToken();
        if (!token) {
            dispatch({ type: 'READY_UNAUTHENTICATED' });
            return;
        }

        try {
            const me = await fetchAuthMe();
            if (!me?.id) {
                await clearAuthSession();
                dispatch({ type: 'READY_UNAUTHENTICATED' });
                return;
            }

            await setAuthSession({ token, userId: me.id });
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: {
                        email: me.email ?? null,
                        userId: me.id,
                        name: me.name ?? null,
                        picture: me.picture ?? null,
                        token,
                    },
                },
            });

            try {
                const connections = await fetchIntegrationConnections();
                dispatch({ type: 'SET_INTEGRATIONS', payload: { connections } });
            } catch {
                dispatch({ type: 'SET_INTEGRATIONS', payload: { connections: {} } });
            }
        } catch {
            await clearAuthSession();
            dispatch({ type: 'READY_UNAUTHENTICATED' });
        }
    }, []);

    useEffect(() => {
        void hydrateFromToken();
    }, [hydrateFromToken]);

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (!isOnboardOAuthMessage(event.data)) {
                return;
            }
            void hydrateFromToken();
        };

        const onFocus = () => {
            if (state.status === 'authenticating') {
                void hydrateFromToken();
            }
        };

        window.addEventListener('message', onMessage);
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onFocus);
        return () => {
            window.removeEventListener('message', onMessage);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onFocus);
        };
    }, [hydrateFromToken, state.status]);

    const login = useCallback(() => {
        dispatch({ type: 'AUTHENTICATING' });
        void setPendingOnboardingKeyAuth('google').then(() => {
            openOAuthPopup(googleLoginUrl());
        });
    }, []);

    const connectIntegration = useCallback((type: string) => {
        const provider = type.toLowerCase() as OnboardingKeyAuthProvider;
        if (provider !== 'slack' && provider !== 'msteams') {
            return;
        }

        dispatch({ type: 'AUTHENTICATING' });
        void (async () => {
            await setPendingOnboardingKeyAuth(provider);
            try {
                const response = await apiClient.get<{ data?: { url?: string } }>(
                    routes.auth.oauthV2Start(provider),
                    {
                        params: { state: createOnboardOAuthState() },
                    }
                );
                const url = response.data?.data?.url;
                if (typeof url === 'string' && url.trim()) {
                    openOAuthPopup(url);
                    return;
                }
                dispatch({ type: 'AUTH_ERROR', payload: { error: 'Could not start workspace sign-in.' } });
            } catch {
                dispatch({ type: 'AUTH_ERROR', payload: { error: 'Could not start workspace sign-in.' } });
            }
        })();
    }, []);

    const disconnectIntegration = useCallback((_type: string) => {
        /* Onboarding does not disconnect integrations. */
    }, []);

    const logout = useCallback(() => {
        void clearAuthSession().then(() => {
            dispatch({ type: 'LOGOUT_SUCCESS' });
        });
    }, []);

    const value: AuthContextType = {
        status: state.status,
        authenticated: state.authenticated,
        error: state.error,
        connections: state.connections,
        ...state.user,
        login,
        connectIntegration,
        disconnectIntegration,
        logout,
        isLoading: state.status === 'loading' || state.status === 'authenticating',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within WebAuthProvider');
    }
    return ctx;
};
