import React from 'react';
import { Link } from 'react-router';
import { publicUrl } from '../../lib/utils';
import { siteCopy } from '../../data/siteCopy';
import { ANALYTICS_EVENTS } from '../../data/static/analytics-events';
import { trackEvent } from '../../lib/analytics';

export const landingAsset = (name) => publicUrl(`/assets/landing/${name}`);

export function LogoMark({ className = 'h-4 w-auto' }) {
  return <img alt={siteCopy.common.brandAlt} src={landingAsset('logo-wordmark.svg')} className={className} />;
}

export function StartCta({ children, className = '', to = '/get-started' }) {
  return (
    <Link
      to={to}
      className={`relative inline-flex h-14 items-stretch rounded-xl bg-white/10 p-[3px] font-instrumentSans text-base font-semibold text-purple-800 transition-opacity hover:opacity-90 ${className}`}
      onClick={() => {
        trackEvent(ANALYTICS_EVENTS.CTA.GET_STARTED_CLICK, { entry: 'cta', to });
      }}
      onMouseEnter={() => {
        // ponytail: warm the target route on intent; ceiling = one prefetch per href
        if (document.querySelector(`link[data-prefetch-cta="${to}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = publicUrl(to);
        link.dataset.prefetchCta = to;
        document.head.appendChild(link);
      }}
    >
      {/* purple fill on white/10 plate — plate is the ring, not a CSS border */}
      <span className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[9px] bg-purple-75 px-[27px]">
        {/* Ellipse 212 — 208×32 frame; blur overflows to 308×132 */}
        <span className="pointer-events-none absolute left-1/2 top-[40px] h-8 w-[208px] -translate-x-1/2" aria-hidden>
          <span className="absolute inset-[-156.25%_-24.04%]">
            <img alt="" src={landingAsset('btn-glow.svg')} className="block size-full max-w-none" width={308} height={132} />
          </span>
        </span>
        <span className="relative flex items-center gap-1.5 whitespace-nowrap">{children}</span>
      </span>
    </Link>
  );
}

export function LandingHeader() {
  return (
    <header className="relative z-20 mx-auto flex h-16 max-w-[1256px] items-center justify-between px-5 md:px-6">
      <Link to="/" className="flex items-center gap-[7px]">
        <LogoMark className="h-4 w-[53px]" />
        <img alt="" src={landingAsset('beta-dot.svg')} className="size-2" />
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          to="/get-started"
          className="inline-flex h-10 shrink-0 items-center rounded-[20px] border border-foreground-primary px-3 font-instrumentSans text-xs font-medium leading-[1.2] tracking-[0.4px] text-foreground-primary transition-colors hover:bg-white/5 sm:px-5 sm:text-sm"
          onClick={() => {
            trackEvent(ANALYTICS_EVENTS.CTA.GET_STARTED_CLICK, { entry: 'nav', to: '/get-started' });
          }}
        >
          {siteCopy.common.getItNow}
        </Link>
      </nav>
    </header>
  );
}

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 py-5 md:px-[92px]">
      <div className="mx-auto flex max-w-[1256px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-[250px] flex-col gap-3">
          <div className="flex items-center gap-[7px]">
            <img alt="" src={landingAsset('devbot.webp')} className="size-6 object-cover" />
            <img alt={siteCopy.common.brandAlt} src={landingAsset('logo-wordmark-lg.svg')} className="h-5 w-[67px]" />
            <img alt="" src={landingAsset('beta-dot.svg')} className="size-2" />
          </div>
          <p className="font-instrumentSans text-xs font-normal leading-[1.45] text-foreground-muted">
            {siteCopy.common.copyright(year)}
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 font-instrumentSans text-sm font-normal leading-[1.2] text-foreground-primary">
          <Link to="/#features" className="hover:text-purple-200">{siteCopy.common.product}</Link>
          <Link to="/blog" className="hover:text-purple-200">{siteCopy.common.blog}</Link>
          <Link to="/about" className="hover:text-purple-200">{siteCopy.common.about}</Link>
          <Link to="/slack" className="hover:text-purple-200">{siteCopy.common.slack}</Link>
          <Link to="/support" className="hover:text-purple-200">{siteCopy.common.support}</Link>
          <Link to="/privacy" className="hover:text-purple-200">{siteCopy.common.privacy}</Link>
          <Link to="/terms" className="hover:text-purple-200">{siteCopy.common.terms}</Link>
        </nav>
      </div>
    </footer>
  );
}

export default function LandingShell({ children }) {
  return (
    <div className="dark min-h-screen bg-background font-instrumentSans text-foreground-primary antialiased">
      <LandingHeader />
      {children}
      <LandingFooter />
    </div>
  );
}
