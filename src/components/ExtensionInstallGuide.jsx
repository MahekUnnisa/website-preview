import React from 'react';

/**
 * Chrome extension setup — readable surface (no tinted purple panel).
 * Steps: desktop Chrome → install → wait for sync → new tab after success (handled by parent).
 */
export default function ExtensionInstallGuide({ chromeWebStoreUrl }) {
  const steps = [
    {
      title: 'Desktop Only',
      body: 'Open this page in desktop Chrome (extension environments are unsupported on mobile).',
    },
    {
      title: 'Install Extension',
      body: 'Click the button below to add ZeroAI from the Chrome Web Store.',
    },
    {
      title: 'Auto-sync',
      body: 'Keep this tab active. The extension will handshake with this page to sync your reward. (Refresh if stuck >60s).',
    },
    {
      title: 'Initialize',
      body: 'ZeroAI will open a new workspace tab upon successful sync. Pin the extension and close this setup tab.',
    },
  ];

  return (
    <div
      className="border border-border border-l-4 border-l-purple-400 bg-background-secondary py-6 px-5 sm:px-7 space-y-6"
      role="region"
      aria-label="Install the ZeroAI Chrome extension"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground-primary mb-1">Chrome setup steps:</h2>
      </div>

      <ol className="space-y-5 list-none">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-400/25 text-sm font-bold text-purple-100 ring-1 ring-purple-400/40"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="font-medium text-foreground-primary leading-snug">{step.title}</p>
              <p className="mt-1.5 text-sm text-foreground-secondary leading-relaxed">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="pt-2">
        <a
          href={chromeWebStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex btn-primary px-5 py-3 text-sm font-semibold"
        >
          Open Chrome Web Store — ZeroAI
        </a>
      </div>

      <p className="text-sm text-foreground-secondary leading-relaxed border-t border-border pt-5">
        Problems?{' '}
        <button
          type="button"
          className="font-medium text-purple-200 underline underline-offset-4 hover:text-purple-100"
          onClick={() => window.location.reload()}
        >
          Refresh this page
        </button>{' '}
        after installing, or try installing again from the button above.
      </p>
    </div>
  );
}
