import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const extensionId = (import.meta.env.VITE_EXTENSION_ID || '').trim();
const DEFAULT_CHROME_WEBSTORE_URL =
  'https://chromewebstore.google.com/detail/zeroai-your-ai-work-assis/hplbpdkajdhlggncdpdmnkjldopmoomg';
const chromeWebStoreUrl =
  (import.meta.env.VITE_CHROME_WEBSTORE_URL || '').trim() || DEFAULT_CHROME_WEBSTORE_URL;

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;
const shellClass = 'max-w-lg mx-auto rounded-[0.625rem] border border-border bg-background-tertiary p-6 shadow-2xl shadow-black/20';
const pageClass = 'relative min-h-[70vh] flex items-center';
const linkClass = 'text-sm text-purple-200 hover:text-purple-100';

function canTalkToExtensions() {
  return typeof chrome !== 'undefined' && Boolean(chrome.runtime?.sendMessage) && Boolean(extensionId);
}

function pingExtension() {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(extensionId, { type: 'PING' }, (resp) => {
        if (chrome.runtime?.lastError) {
          resolve(false);
          return;
        }
        resolve(Boolean(resp?.ok));
      });
    } catch {
      resolve(false);
    }
  });
}

function syncExtension(code) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(extensionId, { type: 'SYNC', code }, (resp) => {
        if (chrome.runtime?.lastError) {
          resolve({ ok: false, error: chrome.runtime.lastError.message || 'no_extension' });
          return;
        }
        resolve(resp || { ok: false, error: 'no_response' });
      });
    } catch (err) {
      resolve({ ok: false, error: err?.message || 'send_failed' });
    }
  });
}

/**
 * Reads JWT #1 + error tag from the URL fragment (#token=...&error=...) which
 * the API now uses instead of the query string. The fragment is never sent to
 * any server (referrer, proxy access logs, server-side rendering, etc.) so it
 * is the safest place to land an OAuth-issued JWT.
 *
 * We also keep a query-string fallback so older bookmarks keep working during
 * the rollout — but as soon as we read the values we scrub them from the
 * address bar via history.replaceState.
 */
function readClaimResultFromUrl() {
  if (typeof window === 'undefined') return { jwt: '', error: '' };

  const fragment = (window.location.hash || '').replace(/^#/, '');
  const fragmentParams = fragment ? new URLSearchParams(fragment) : null;
  const search = new URLSearchParams(window.location.search || '');

  const jwt = (fragmentParams?.get('token') || search.get('token') || '').trim();
  const error = (fragmentParams?.get('error') || search.get('error') || '').trim();

  const hadSensitive =
    Boolean(fragmentParams?.get('token')) ||
    Boolean(fragmentParams?.get('error')) ||
    Boolean(search.get('token'));

  if (hadSensitive) {
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch {
      /* ignore — best-effort scrub */
    }
  }

  return { jwt, error };
}

export default function PartnerSuccess() {
  const [{ jwt, oauthError }] = useState(() => {
    const result = readClaimResultFromUrl();
    return { jwt: result.jwt, oauthError: result.error };
  });

  const [phase, setPhase] = useState('idle');
  const [message, setMessage] = useState(null);
  const pollStartedAtRef = useRef(0);
  const pollTimerRef = useRef(null);
  const syncedRef = useRef(false);

  const canMint = useMemo(() => Boolean(jwt && apiBase && !oauthError), [jwt, oauthError]);

  const mintCode = useCallback(async () => {
    const res = await fetch(`${apiBase}/partner-access/exchange-code`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const json = await res.json().catch(() => null);
    if (res.status === 429) {
      const retryAfter = Number(json?.retryAfter || res.headers.get('Retry-After') || 60);
      const err = new Error(
        `Too many sync attempts. Please wait ${Math.max(1, Math.ceil(retryAfter / 60))} minute(s) and try again.`,
      );
      err.code = 'rate_limited';
      throw err;
    }
    if (!res.ok || !json?.success || !json.data?.code) {
      throw new Error(json?.message || `mint_failed_${res.status}`);
    }
    return json.data.code;
  }, [jwt]);

  const trySync = useCallback(async () => {
    if (syncedRef.current) return true;
    try {
      const code = await mintCode();
      const resp = await syncExtension(code);
      if (resp?.ok) {
        syncedRef.current = true;
        setPhase('done_synced');
        setMessage('ZeroAI extension is signed in. You can close this tab.');
        return true;
      }
      setPhase('done_web_only');
      setMessage(
        resp?.error && resp.error !== 'no_extension'
          ? `Extension did not confirm sync (${resp.error}). Install or open the extension below.`
          : 'Your ZeroAI account is ready in the browser. Install the extension below to sync it automatically.',
      );
      return false;
    } catch (err) {
      const rateLimited = err && err.code === 'rate_limited';
      if (rateLimited) {
        syncedRef.current = true;
      }
      setPhase(rateLimited ? 'done_web_only' : 'error');
      setMessage(err instanceof Error ? err.message : 'Could not prepare extension sync.');
      return false;
    }
  }, [mintCode]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollTimerRef.current || syncedRef.current) return;
    pollStartedAtRef.current = Date.now();
    pollTimerRef.current = window.setInterval(async () => {
      if (syncedRef.current) {
        stopPolling();
        return;
      }
      if (Date.now() - pollStartedAtRef.current > POLL_TIMEOUT_MS) {
        stopPolling();
        return;
      }
      if (!canTalkToExtensions()) {
        stopPolling();
        return;
      }
      const installed = await pingExtension();
      if (installed) {
        stopPolling();
        await trySync();
      }
    }, POLL_INTERVAL_MS);
  }, [stopPolling, trySync]);

  useEffect(() => {
    if (!canMint) return undefined;
    let cancelled = false;

    (async () => {
      setPhase('minting');
      if (!canTalkToExtensions()) {
        setPhase('done_web_only');
        setMessage(
          extensionId
            ? 'Your ZeroAI account is active in this browser session. Install the Chrome extension below to sync it automatically.'
            : 'Your ZeroAI account is active in this browser session. Install the Chrome extension below — one-click sync requires VITE_EXTENSION_ID in the site build.',
        );
        return;
      }

      const installed = await pingExtension();
      if (cancelled) return;
      if (installed) {
        await trySync();
        return;
      }

      setPhase('done_web_only');
      setMessage(
        'Your ZeroAI account is active in this browser session. Install the Chrome extension below — we will sync it the moment it is available.',
      );
      startPolling();
    })();

    return () => {
      cancelled = true;
    };
  }, [canMint, trySync, startPolling]);

  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== 'visible' || syncedRef.current) return;
      if (!canMint || !canTalkToExtensions()) return;
      const installed = await pingExtension();
      if (installed) {
        stopPolling();
        await trySync();
      } else {
        startPolling();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [canMint, trySync, startPolling, stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  if (oauthError === 'email_mismatch') {
    return (
      <div className="relative">
        <div className="fixed inset-0 grid-overlay pointer-events-none" />
        <section className={pageClass}>
          <div className="container-custom w-full">
            <div className={shellClass}>
              <h1 className="text-2xl font-semibold text-foreground-primary mb-3">Google account does not match</h1>
              <p className="text-sm text-foreground-muted mb-6 leading-relaxed">
                Sign in with the same Google email that received the partner reward, then open the claim link again.
              </p>
              <Link to="/claim" className={linkClass}>
                Back to claim
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (oauthError === 'claim_expired') {
    return (
      <div className="relative">
        <div className="fixed inset-0 grid-overlay pointer-events-none" />
        <section className={pageClass}>
          <div className="container-custom w-full">
            <div className={shellClass}>
              <h1 className="text-2xl font-semibold text-foreground-primary mb-3">Claim link expired</h1>
              <p className="text-sm text-foreground-muted mb-6 leading-relaxed">
                Your sign-in took too long, or this link was already used. Open the original reward email again and start over.
              </p>
              <Link to="/" className={linkClass}>
                Back home
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!jwt) {
    return (
      <div className="relative">
        <div className="fixed inset-0 grid-overlay pointer-events-none" />
        <section className={pageClass}>
          <div className="container-custom w-full">
            <div className={shellClass}>
              <h1 className="text-2xl font-semibold text-foreground-primary mb-3">Missing session</h1>
              <p className="text-sm text-foreground-muted mb-6 leading-relaxed">Open this page from the link you land on after Google sign-in.</p>
              <Link to="/" className={linkClass}>
                Back home
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const showExtensionInstallHelp = phase === 'done_web_only';

  return (
    <div className="relative">
      <div className="fixed inset-0 grid-overlay pointer-events-none" />
      <section className={pageClass}>
        <div className="container-custom w-full">
          <div className={shellClass}>
            <div className="mb-5 inline-flex items-center space-x-2 rounded-full border border-border-colored bg-purple-15 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span>
              <span className="text-xs font-medium text-purple-200">ZeroAI access</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground-primary mb-3">You are in</h1>
            <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
              {phase === 'minting' && 'Finishing sign-in and preparing extension sync...'}
              {phase === 'idle' && 'Preparing...'}
              {phase === 'error' && (message || 'Something went wrong.')}
              {phase === 'done_synced' && (message || 'All set.')}
              {phase === 'done_web_only' && (message || '')}
            </p>

            {showExtensionInstallHelp && (
              <div
                className="mb-8 rounded-[0.625rem] border border-border-colored bg-purple-15 p-5 text-left"
                role="region"
                aria-label="Install the ZeroAI extension"
              >
                <h2 className="text-lg font-semibold text-foreground-primary mb-2">Next: install the ZeroAI Chrome extension</h2>
                <p className="text-foreground-muted text-sm mb-4 leading-relaxed">
                  Your partner reward is applied to this Google login. Install the extension to use ZeroAI in Chrome with the sidebar, quick actions, meeting features, and notes.
                </p>
                <a
                  href={chromeWebStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-[0.625rem] bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-400/15 transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-background"
                >
                  Install ZeroAI from Chrome Web Store
                </a>
                <p className="mt-4 text-foreground-muted text-sm leading-relaxed">
                  Keep this tab open. We'll auto-sync the moment the extension is installed. You can also{' '}
                  <button
                    type="button"
                    className="text-purple-200 underline hover:text-purple-100"
                    onClick={() => window.location.reload()}
                  >
                    refresh this page
                  </button>
                  .
                </p>
              </div>
            )}

            <Link to="/" className={linkClass}>
              Back home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
