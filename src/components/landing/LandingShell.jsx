import React from 'react';
import { Link } from 'react-router';
import { publicUrl } from '../../lib/utils';

export const landingAsset = (name) => publicUrl(`/assets/landing/${name}`);

export function LogoMark({ className = 'h-4 w-auto' }) {
  return <img alt="ZeroAI" src={landingAsset('logo-wordmark.svg')} className={className} />;
}

export function StartCta({ children, className = '', to = '/onboard' }) {
  return (
    <Link
      to={to}
      className={`relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl border-[3px] border-white/10 bg-purple-75 px-[30px] font-instrumentSans text-base font-semibold text-purple-800 transition-opacity hover:opacity-90 ${className}`}
    >
      <span className="pointer-events-none absolute left-1/2 top-[43px] h-8 w-[208px] -translate-x-1/2">
        <img alt="" src={landingAsset('btn-glow.svg')} className="size-full max-w-none" />
      </span>
      <span className="relative flex items-center gap-1.5 whitespace-nowrap">{children}</span>
    </Link>
  );
}

export function LandingHeader({ active }) {
  return (
    <header className="relative z-20 mx-auto flex h-16 max-w-[1256px] items-center justify-between px-5 md:px-6">
      <Link to="/" className="flex items-center gap-[7px]">
        <LogoMark className="h-4 w-[53px]" />
        <img alt="" src={landingAsset('beta-dot.svg')} className="size-2" />
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          to="/blog"
          className={`font-instrumentSans text-sm font-medium leading-[1.2] transition-colors hover:text-purple-200 ${
            active === 'blog' ? 'text-purple-200' : 'text-foreground-muted'
          }`}
        >
          Blog
        </Link>
        <Link
          to="/onboard"
          className="inline-flex h-10 items-center rounded-[20px] border border-foreground-primary px-5 font-instrumentSans text-sm font-medium leading-[1.2] tracking-[0.4px] text-foreground-primary transition-colors hover:bg-white/5"
        >
          Start ZeroAI
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
            <img alt="ZeroAI" src={landingAsset('logo-wordmark-lg.svg')} className="h-5 w-[67px]" />
            <img alt="" src={landingAsset('beta-dot.svg')} className="size-2" />
          </div>
          <p className="font-instrumentSans text-xs font-normal leading-[1.45] text-foreground-muted">
            © 2025–{year} ZeroAI. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-8 font-instrumentSans text-sm font-normal leading-[1.2] text-foreground-primary">
          <Link to="/#features" className="hover:text-purple-200">Product</Link>
          <Link to="/blog" className="hover:text-purple-200">Blog</Link>
          <Link to="/privacy" className="hover:text-purple-200">Security</Link>
          <Link to="/support" className="hover:text-purple-200">Docs</Link>
        </nav>
      </div>
    </footer>
  );
}

export default function LandingShell({ active, children }) {
  return (
    <div className="dark min-h-screen bg-background font-instrumentSans text-foreground-primary antialiased">
      <LandingHeader active={active} />
      {children}
      <LandingFooter />
    </div>
  );
}
