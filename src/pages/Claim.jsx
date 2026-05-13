import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '../components/Button';

const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const ERROR_COPY = {
  invalid_or_expired: 'This reward link is no longer valid. It may have expired or been replaced by a newer one. Check your email for the most recent claim link.',
  bootstrap_failed: 'Something went wrong while preparing your sign-in. Please try again in a minute.',
};

export default function Claim() {
  const [params] = useSearchParams();
  const token = (params.get('token') || '').trim();
  const errorCode = (params.get('error') || '').trim();
  const [status, setStatus] = useState(null);
  const [statusError, setStatusError] = useState(
    errorCode ? ERROR_COPY[errorCode] || 'We could not start the sign-in flow for this link.' : null,
  );

  useEffect(() => {
    if (!token || !apiBase) {
      if (!apiBase) setStatusError('Site is missing VITE_API_BASE_URL. Configure the website env and rebuild.');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/partner-access/claim/status?token=${encodeURIComponent(token)}`);
        const json = await res.json().catch(() => null);
        if (cancelled) return;
        if (json?.success && json.data) {
          setStatus(json.data);
          return;
        }
        const reason =
          (json && (json.message || json.error)) ||
          (res.status === 401
            ? 'API rejected the request as unauthenticated. /v2/partner-access/claim/status must be public.'
            : `Could not verify this link (HTTP ${res.status}).`);
        setStatusError(reason);
      } catch (err) {
        if (!cancelled) {
          setStatusError(
            err instanceof Error
              ? `Could not reach the API: ${err.message}`
              : 'Could not reach the API.',
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const startGoogle = () => {
    if (!token || !apiBase) return;
    const state = `claim_${token}`;
    window.location.href = `${apiBase}/partner-access/login/google?state=${encodeURIComponent(state)}`;
  };

  if (!token) {
    return (
      <div className="relative">
        <div className="fixed inset-0 grid-overlay pointer-events-none" />
        <section className="relative min-h-[70vh] flex items-center">
          <div className="container-custom w-full">
            <div className="max-w-lg mx-auto rounded-[0.625rem] border border-border bg-background-tertiary p-6">
              <h1 className="text-2xl font-semibold text-foreground-primary mb-3">Invalid link</h1>
              <p className="text-sm text-foreground-muted mb-6">This page needs a claim token from your reward email.</p>
              <Link to="/" className="text-sm text-purple-200 hover:text-purple-100">
                Back home
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const invalid = status && status.valid === false;

  return (
    <div className="relative">
      <div className="fixed inset-0 grid-overlay pointer-events-none" />
      <section className="relative min-h-[70vh] flex items-center">
        <div className="container-custom w-full">
          <div className="max-w-lg mx-auto rounded-[0.625rem] border border-border bg-background-tertiary p-6 shadow-2xl shadow-black/20">
            <div className="mb-5 inline-flex items-center space-x-2 rounded-full border border-border-colored bg-purple-15 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span>
              <span className="text-xs font-medium text-purple-200">Partner access</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground-primary mb-3">Claim your ZeroAI access</h1>
            <p className="text-sm text-foreground-muted mb-6 leading-relaxed">
              Sign in with the Google account that received this reward. After login, you can sync the extension in one step.
            </p>
            {statusError && <p className="text-warning text-sm mb-4">{statusError}</p>}
            {invalid && (
              <p className="text-warning text-sm mb-4">
                {status.expired ? 'This reward link has expired.' : 'This reward link is not valid.'}
              </p>
            )}
            <Button
              onClick={startGoogle}
              disabled={Boolean(invalid)}
              className="mb-4"
            >
              Continue with Google
            </Button>
            {status?.onboarding_status === 'activated' && status?.valid && (
              <p className="text-success text-sm mb-4">
                This reward is already active. You can still sign in to manage your account.
              </p>
            )}
            <p className="text-sm">
              <Link to="/" className="text-purple-200 hover:text-purple-100">
                Back home
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
