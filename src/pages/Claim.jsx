import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import PartnerFlowLayout from '../components/PartnerFlowLayout';
import { getApiBase } from '../lib/env';

const apiBase = getApiBase();

const ERROR_COPY = {
  invalid_or_expired:
    'This reward link is no longer valid. It may have expired or been replaced by a newer one. Check your email for the most recent claim link.',
  bootstrap_failed: 'Something went wrong while preparing your sign-in. Please try again in a minute.',
};

const linkClass = 'text-sm font-medium text-purple-200 hover:text-purple-100 underline-offset-4 hover:underline';

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
      if (!apiBase) setStatusError('Site is missing base url.');
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
            err instanceof Error ? `Could not reach the API: ${err.message}` : 'Could not reach the API.',
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
      <PartnerFlowLayout eyebrow="Exclusively for you" title="Invalid link">
        <p className="text-foreground-muted">
          This page needs a claim token from your reward email.
        </p>
        <p>
          <Link to="/" className={linkClass}>
            Back home
          </Link>
        </p>
      </PartnerFlowLayout>
    );
  }

  const invalid = status && status.valid === false;

  return (
    <PartnerFlowLayout eyebrow="Exclusively for you" title="Claim your ZeroAI access!">
      <p className="text-foreground-muted">
        Sign in with the Google account that received this reward to instantly sync your extension.
      </p>
      {statusError && <p className="text-warning text-sm">{statusError}</p>}
      {invalid && (
        <p className="text-warning text-sm">
          {status.expired ? 'This reward link has expired.' : 'This reward link is not valid.'}
        </p>
      )}
      <div className="pt-2">
        <Button onClick={startGoogle} disabled={Boolean(invalid)} className="min-w-[14rem]">
          Continue with Google
        </Button>
      </div>
      {status?.onboarding_status === 'activated' && status?.valid && (
        <p className="text-success text-sm">
          This reward is already active. You can still sign in to manage your account.
        </p>
      )}
      <div className="pt-8 border-t border-border">
        <Link to="/" className={linkClass}>
          Back home
        </Link>
      </div>
    </PartnerFlowLayout>
  );
}
