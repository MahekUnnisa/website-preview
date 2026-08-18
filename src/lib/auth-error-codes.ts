/**
 * Server redirect contract for onboard OAuth error page:
 *   /onboard/oauth/error?code=<ErrorCode>
 * Optional plain-text overrides: ?title=...&message=...
 * Keep in sync with the extension AUTH_ERROR_CODES (+ email_mismatch from the API).
 */
export const AUTH_ERROR_CODES = [
    'auth_failed',
    'oauth_denied',
    'integration_failed',
    'email_mismatch',
    'generic'
] as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number];

export type AuthErrorTone = 'error' | 'warning';

type AuthErrorCopy = {
    title: string;
    description: string;
    tone: AuthErrorTone;
};

const AUTH_ERROR_COPY: Record<AuthErrorCode, AuthErrorCopy> = {
    auth_failed: {
        title: 'Authentication Failed',
        description: "We couldn't complete the login process. Please try again.",
        tone: 'error'
    },
    oauth_denied: {
        title: 'Access denied',
        description: 'Permission was not granted. You can close this window and try again.',
        tone: 'error'
    },
    integration_failed: {
        title: 'Connection failed',
        description: "We couldn't connect this integration. Please try again.",
        tone: 'error'
    },
    email_mismatch: {
        title: 'Email mismatch',
        description: 'Please use the same email as your Google account.',
        tone: 'warning'
    },
    generic: {
        title: 'Something went wrong',
        description: 'Please close this window and try again.',
        tone: 'error'
    }
};

export function isAuthErrorCode(value: string | null | undefined): value is AuthErrorCode {
    return Boolean(value && (AUTH_ERROR_CODES as readonly string[]).includes(value));
}

export function resolveAuthErrorCopy(code: string | null | undefined): AuthErrorCopy {
    const resolved: AuthErrorCode = isAuthErrorCode(code) ? code : 'generic';
    return AUTH_ERROR_COPY[resolved];
}

if (import.meta.env.DEV) {
    console.assert(isAuthErrorCode('oauth_denied') === true, 'oauth_denied is a known auth error code');
    console.assert(resolveAuthErrorCopy('auth_failed').title === 'Authentication Failed', 'auth_failed copy');
    console.assert(resolveAuthErrorCopy('not-a-code').title === 'Something went wrong', 'unknown code is generic');
    console.assert(resolveAuthErrorCopy('email_mismatch').tone === 'warning', 'email mismatch is a warning');
    console.assert(resolveAuthErrorCopy('auth_failed').tone === 'error', 'auth_failed stays error');
}
