import type { OnboardingKeyAuthProvider } from '@/lib/onboarding-key-auth';

export const ONBOARD_OAUTH_MESSAGE_TYPE = 'ZERO_ONBOARD_OAUTH';
const ONBOARD_OAUTH_CHANNEL = 'zero-onboard-oauth';
export const ONBOARD_RETURN_PATH = `${import.meta.env.BASE_URL}onboard`.replace(/\/{2,}/g, '/');
export const GET_STARTED_RETURN_PATH = `${import.meta.env.BASE_URL}get-started`.replace(/\/{2,}/g, '/');
const SAME_TAB_OAUTH_KEY = 'zero_onboard_oauth_same_tab';
const POPUP_FLAG_KEY = 'zero_onboard_oauth_popup';
const RETURN_PATH_KEY = 'zero_onboard_oauth_return';
const POPUP_NAME = 'zero-onboard-oauth';
const POPUP_FEATURES = 'width=500,height=600,scrollbars=yes,resizable=yes';

/** Opener's Window handle. Parent and popup are separate heaps — only the opener can close via this. */
let activeOAuthPopup: Window | null = null;

export type OnboardOAuthMessage = {
    type: typeof ONBOARD_OAUTH_MESSAGE_TYPE;
    status: 'success' | 'failed';
    provider: OnboardingKeyAuthProvider | null;
};

export function createOnboardOAuthState(): string {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    return `onboard_${id}`;
}

export function preferSameTabOAuthFrom(opts: { coarsePointer: boolean; innerWidth: number }): boolean {
    void opts;
    return true;
}

export function preferSameTabOAuth(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return preferSameTabOAuthFrom({
        coarsePointer: window.matchMedia('(pointer: coarse)').matches,
        innerWidth: window.innerWidth,
    });
}

export function isOAuthPopupFrom(opts: { openerAlive: boolean; name: string; popupFlag: boolean }): boolean {
    return opts.openerAlive || opts.name === POPUP_NAME || opts.popupFlag;
}

function readPopupFlag(): boolean {
    try {
        return sessionStorage.getItem(POPUP_FLAG_KEY) === '1';
    } catch {
        return false;
    }
}

function openerIsAlive(): boolean {
    try {
        return Boolean(window.opener && !window.opener.closed);
    } catch {
        return true;
    }
}

/** True when this window is the desktop OAuth popup. Slack/Google often null opener and rewrite name; sessionStorage survives. */
export function isOAuthPopupWindow(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return isOAuthPopupFrom({
        openerAlive: openerIsAlive(),
        name: window.name,
        popupFlag: readPopupFlag(),
    });
}

export function canCloseOAuthWindow(): boolean {
    return isOAuthPopupWindow();
}

function rememberOAuthPopup(popup: Window | null): void {
    activeOAuthPopup = popup && !popup.closed ? popup : null;
}

export function closeActiveOAuthPopup(): void {
    try {
        activeOAuthPopup?.close();
    } catch {
        /* COOP can detach the WindowProxy */
    }
    activeOAuthPopup = null;
}

function markOAuthPopup(win: Window): void {
    try {
        win.name = POPUP_NAME;
    } catch {
        /* ignore */
    }
    try {
        win.sessionStorage.setItem(POPUP_FLAG_KEY, '1');
    } catch {
        /* about:blank / COOP */
    }
}

function markSameTabOAuth(): void {
    try {
        sessionStorage.setItem(SAME_TAB_OAUTH_KEY, '1');
    } catch {
        /* ignore */
    }
}

function clearSameTabOAuth(): void {
    try {
        sessionStorage.removeItem(SAME_TAB_OAUTH_KEY);
    } catch {
        /* ignore */
    }
}

export function oauthCallbackActionLabel(canClose: boolean): string {
    return canClose ? 'Close Window' : 'Continue';
}

export function oauthCallbackCountdownLabel(canClose: boolean, seconds: number): string {
    return canClose ? `Closing in ${seconds}…` : `Returning in ${seconds}…`;
}

function isSameTabOAuth(): boolean {
    try {
        return sessionStorage.getItem(SAME_TAB_OAUTH_KEY) === '1';
    } catch {
        return false;
    }
}

/** Same-tab OAuth returns to /onboard or /get-started. Popup must never load those. */
export function shouldReturnToOnboard(): boolean {
    return isSameTabOAuth() && !isOAuthPopupWindow();
}

/** Remember which marketing entry started OAuth so same-tab return lands correctly. */
export function markOnboardReturnPath(entry: 'onboard' | 'get-started'): void {
    try {
        sessionStorage.setItem(RETURN_PATH_KEY, entry);
    } catch {
        /* sessionStorage unavailable */
    }
}

export function resolveOnboardReturnPath(): string {
    try {
        if (sessionStorage.getItem(RETURN_PATH_KEY) === 'get-started') {
            return GET_STARTED_RETURN_PATH;
        }
    } catch {
        /* sessionStorage unavailable */
    }
    return ONBOARD_RETURN_PATH;
}

export function leaveOAuthCallback(): void {
    if (typeof window === 'undefined') {
        return;
    }
    closeActiveOAuthPopup();
    if (isOAuthPopupWindow() || !isSameTabOAuth()) {
        window.close();
        return;
    }
    clearSameTabOAuth();
    window.location.assign(resolveOnboardReturnPath());
}

export function openOAuthPopup(url: string): Window | null {
    if (typeof window === 'undefined') {
        return null;
    }
    const popup = window.open(url, POPUP_NAME, POPUP_FEATURES);
    if (popup) {
        markOAuthPopup(popup);
        rememberOAuthPopup(popup);
    }
    return popup;
}

/** Desktop: blank popup on the click. Mobile: skip (same-tab). */
export function openOAuthPopupBlank(): Window | null {
    if (typeof window === 'undefined' || preferSameTabOAuth()) {
        return null;
    }
    return openOAuthPopup('');
}

/** Desktop: navigate the click-opened popup. Mobile / blocked: this tab. */
export function startOnboardOAuth(url: string, popup?: Window | null): void {
    if (typeof window === 'undefined') {
        return;
    }
    if (preferSameTabOAuth() || !popup || popup.closed) {
        markSameTabOAuth();
        popup?.close();
        rememberOAuthPopup(null);
        window.location.assign(url);
        return;
    }
    markOAuthPopup(popup);
    rememberOAuthPopup(popup);
    try {
        popup.location.replace(url);
    } catch {
        markSameTabOAuth();
        popup.close();
        rememberOAuthPopup(null);
        window.location.assign(url);
    }
}

export function postOnboardOAuthResult(message: Omit<OnboardOAuthMessage, 'type'>): void {
    if (typeof window === 'undefined') {
        return;
    }
    const payload: OnboardOAuthMessage = { type: ONBOARD_OAUTH_MESSAGE_TYPE, ...message };
    // Slack/Teams hops through a third-party origin and often nulls window.opener (COOP).
    window.opener?.postMessage(payload, window.location.origin);
    try {
        const channel = new BroadcastChannel(ONBOARD_OAUTH_CHANNEL);
        channel.postMessage(payload);
        channel.close();
    } catch {
        /* BroadcastChannel unavailable */
    }
}

export function isOnboardOAuthMessage(data: unknown): data is OnboardOAuthMessage {
    if (!data || typeof data !== 'object') {
        return false;
    }
    const message = data as OnboardOAuthMessage;
    return (
        message.type === ONBOARD_OAUTH_MESSAGE_TYPE &&
        (message.status === 'success' || message.status === 'failed')
    );
}

/** Parent window: postMessage (if opener survived) + BroadcastChannel (same-origin, no opener needed). */
export function subscribeOnboardOAuthResult(onResult: (message: OnboardOAuthMessage) => void): () => void {
    if (typeof window === 'undefined') {
        return () => undefined;
    }

    const handle = (message: OnboardOAuthMessage) => {
        closeActiveOAuthPopup();
        onResult(message);
    };

    const onWindowMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
            return;
        }
        if (isOnboardOAuthMessage(event.data)) {
            handle(event.data);
        }
    };
    window.addEventListener('message', onWindowMessage);

    let channel: BroadcastChannel | null = null;
    try {
        channel = new BroadcastChannel(ONBOARD_OAUTH_CHANNEL);
        channel.onmessage = (event: MessageEvent) => {
            if (isOnboardOAuthMessage(event.data)) {
                handle(event.data);
            }
        };
    } catch {
        channel = null;
    }

    return () => {
        window.removeEventListener('message', onWindowMessage);
        channel?.close();
    };
}

if (import.meta.env.DEV) {
    console.assert(preferSameTabOAuthFrom({ coarsePointer: true, innerWidth: 1280 }) === true, 'coarse pointer should same-tab');
    console.assert(preferSameTabOAuthFrom({ coarsePointer: false, innerWidth: 390 }) === true, 'narrow viewport should same-tab');
    console.assert(preferSameTabOAuthFrom({ coarsePointer: false, innerWidth: 1280 }) === true, 'desktop should same-tab');
    console.assert(oauthCallbackActionLabel(true) === 'Close Window', 'popup callback should close');
    console.assert(oauthCallbackActionLabel(false) === 'Continue', 'same-tab callback should continue');
    console.assert(oauthCallbackCountdownLabel(true, 3) === 'Closing in 3…', 'popup countdown copy');
    console.assert(oauthCallbackCountdownLabel(false, 3) === 'Returning in 3…', 'same-tab countdown copy');
    console.assert(isOAuthPopupFrom({ openerAlive: false, name: '', popupFlag: true }) === true, 'sessionStorage flag is a popup');
    console.assert(isOAuthPopupFrom({ openerAlive: false, name: POPUP_NAME, popupFlag: false }) === true, 'window.name is a popup');
    console.assert(isOAuthPopupFrom({ openerAlive: false, name: '', popupFlag: false }) === false, 'bare window is not a popup');
}
