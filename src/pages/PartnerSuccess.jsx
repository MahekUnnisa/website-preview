import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import PartnerFlowLayout from '../components/PartnerFlowLayout';
import ExtensionInstallGuide from '../components/ExtensionInstallGuide';
import { getApiBase, getChromeWebStoreUrl, getExtensionId } from '../lib/env';

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

const linkClass = 'text-sm font-medium text-purple-200 hover:text-purple-100 underline-offset-4 hover:underline';

function canTalkToExtensions() {
  return typeof chrome !== 'undefined' && Boolean(chrome.runtime?.sendMessage) && Boolean(getExtensionId());
}

function pingExtension() {
  const extensionId = getExtensionId();
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
  const extensionId = getExtensionId();
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

  const canMint = useMemo(() => Boolean(jwt && getApiBase() && !oauthError), [jwt, oauthError]);

  const mintCode = useCallback(async () => {
    const apiBase = getApiBase();
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
        setMessage(
          'ZeroAI is signed in and synced. We’re opening a new tab where you can pin the extension and get started.',
        );
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
          'Your ZeroAI account is active in this browser session. Install the Chrome extension below to sync it automatically.',
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

  useEffect(() => {
    if (phase !== 'done_synced') return;
    try {
      const key = 'zeroai_partner_post_sync_tab';
      if (typeof sessionStorage !== 'undefined') {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
      }
      window.open(`${window.location.origin}/`, '_blank', 'noopener,noreferrer');
    } catch {
      /* popup blocked — user can use manual link below */
    }
  }, [phase]);

  if (oauthError === 'email_mismatch') {
    return (
      <PartnerFlowLayout eyebrow="Exclusively for you" title="Google account does not match.">
        <p className="text-foreground-muted">
          Please sign in with the same Google email that received the reward.
        </p>
        <p>
          <Link to="/claim" className={linkClass}>
            Back to claim
          </Link>
        </p>
      </PartnerFlowLayout>
    );
  }

  if (oauthError === 'claim_expired') {
    return (
      <PartnerFlowLayout eyebrow="Exclusively for you" title="Claim link expired">
        <p className="text-foreground-muted">
          Your sign-in took too long, or this link was already used. Open the original reward email again and start
          over.
        </p>
        <p>
          <Link to="/" className={linkClass}>
            Back home
          </Link>
        </p>
      </PartnerFlowLayout>
    );
  }

  if (!jwt) {
    return (
      <PartnerFlowLayout eyebrow="Exclusively for you" title="Missing session">
        <p className="text-foreground-muted">Open this page from the link you land on after Google sign-in.</p>
        <p>
          <Link to="/" className={linkClass}>
            Back home
          </Link>
        </p>
      </PartnerFlowLayout>
    );
  }

  const showExtensionInstallHelp = phase === 'done_web_only';

  const statusLine =
    phase === 'minting'
      ? 'Finishing sign-in and preparing extension sync...'
      : phase === 'idle'
        ? 'Preparing...'
        : phase === 'error'
          ? message || 'Something went wrong.'
          : phase === 'done_synced'
            ? message || 'All set.'
            : phase === 'done_web_only'
              ? message || ''
              : '';

  const statusMuted = phase === 'minting' || phase === 'idle';

  return (
    <PartnerFlowLayout eyebrow="ZeroAI access" title="You’re signed in.">
      <p className={statusMuted ? 'text-foreground-muted animate-pulse' : 'text-foreground-muted'}>{statusLine}</p>

      {phase === 'done_synced' && (
        <p className="text-sm text-foreground-secondary">
         Open a new tab and start using ZeroAI.
        </p>
      )}

      {showExtensionInstallHelp && (
        <>
          <p className="text-foreground-secondary text-sm leading-relaxed">
            You’re signed in on the web.
          </p>
          <ExtensionInstallGuide chromeWebStoreUrl={getChromeWebStoreUrl()} />
        </>
      )}

      <div className="pt-8 border-t border-border">
        <Link to="/" className={linkClass}>
          Back home
        </Link>
      </div>
    </PartnerFlowLayout>
  );
}
