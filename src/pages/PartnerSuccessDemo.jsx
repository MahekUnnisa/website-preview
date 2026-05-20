import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PartnerFlowLayout from '../components/PartnerFlowLayout';
import ExtensionInstallGuide from '../components/ExtensionInstallGuide';
import { getChromeWebStoreUrl } from '../lib/env';

const chromeWebStoreUrl = getChromeWebStoreUrl();

const linkClass = 'text-sm font-medium text-purple-200 hover:text-purple-100 underline-offset-4 hover:underline';

/** Preview-only scenes — match PartnerSuccess layouts without OAuth / extension APIs. */
const SCENES = [
  { id: 'install', label: 'Install CTA' },
  { id: 'synced', label: 'Synced' },
  { id: 'minting', label: 'Minting' },
  { id: 'error', label: 'Error' },
  { id: 'email_mismatch', label: 'Email mismatch' },
  { id: 'claim_expired', label: 'Expired' },
  { id: 'missing_session', label: 'Missing session' },
];

function SceneSwitcher({ active }) {
  return (
    <div className="max-w-2xl mb-8 pb-6 border-b border-border">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-warning mb-3">Demo preview</p>
      <p className="text-sm text-foreground-muted mb-4">
        Static copy of partner success screens for UI testing. Not connected to OAuth or the extension.
      </p>
      <div className="flex flex-wrap gap-2">
        {SCENES.map(({ id, label }) => (
          <Link
            key={id}
            to={`/partner/success/demo${id === 'install' ? '' : `?scene=${encodeURIComponent(id)}`}`}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors border ${
              active === id
                ? 'border-purple-400 bg-purple-15 text-purple-100'
                : 'border-border text-foreground-muted hover:border-border-strong hover:text-foreground-primary'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function DemoFooter() {
  return (
    <div className="pt-8 border-t border-border space-y-4">
      <Link to="/" className={linkClass}>
        Back home
      </Link>
      <p className="text-xs text-foreground-muted">
        Production flow:{' '}
        <Link to="/partner/success" className={`${linkClass} text-xs`}>
          /partner/success
        </Link>
      </p>
    </div>
  );
}

export default function PartnerSuccessDemo() {
  const [params] = useSearchParams();
  const raw = (params.get('scene') || 'install').trim();
  const scene = SCENES.some((s) => s.id === raw) ? raw : 'install';

  const prepend = <SceneSwitcher active={scene} />;

  switch (scene) {
    case 'synced':
      return (
        <PartnerFlowLayout prepend={prepend} eyebrow="ZeroAI access" title="You’re signed in.">
          <p className="text-foreground-secondary">
            ZeroAI is signed in and synced. In production we open your site in a new tab here — pin ZeroAI from Chrome’s
            toolbar (puzzle icon), then close this tab when you’re ready.
          </p>
          <DemoFooter />
        </PartnerFlowLayout>
      );
    case 'minting':
      return (
        <PartnerFlowLayout prepend={prepend} eyebrow="ZeroAI access" title="You’re signed in.">
          <p className="text-foreground-muted animate-pulse">
            Finishing sign-in and preparing extension sync...
          </p>
          <DemoFooter />
        </PartnerFlowLayout>
      );
    case 'error':
      return (
        <PartnerFlowLayout prepend={prepend} eyebrow="ZeroAI access" title="You’re signed in.">
          <p className="text-foreground-muted">
            mint_failed_503 — Something went wrong reaching the sync service (demo message).
          </p>
          <DemoFooter />
        </PartnerFlowLayout>
      );
    case 'email_mismatch':
      return (
        <PartnerFlowLayout prepend={prepend} eyebrow="Exclusively for you" title="Google account does not match.">
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
    case 'claim_expired':
      return (
        <PartnerFlowLayout prepend={prepend} eyebrow="Exclusively for you" title="Claim link expired">
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
    case 'missing_session':
      return (
        <PartnerFlowLayout prepend={prepend} eyebrow="Exclusively for you" title="Missing session">
          <p className="text-foreground-muted">Open this page from the link you land on after Google sign-in.</p>
          <p>
            <Link to="/" className={linkClass}>
              Back home
            </Link>
          </p>
        </PartnerFlowLayout>
      );
    case 'install':
    default:
      return (
        <PartnerFlowLayout prepend={prepend} eyebrow="ZeroAI access" title="You’re signed in.">
          <p className="text-foreground-secondary text-sm leading-relaxed">
            You’re signed in on the web.
          </p>
          <ExtensionInstallGuide chromeWebStoreUrl={chromeWebStoreUrl} />
          <DemoFooter />
        </PartnerFlowLayout>
      );
  }
}
