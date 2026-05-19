import React from 'react';

/**
 * Reward / partner flows: full-width narrative layout under the global Navbar.
 * No floating rounded card — content sits on the page with a light top divider only.
 */
export default function PartnerFlowLayout({ eyebrow, title, children, prepend }) {
  return (
    <div className="relative">
      <div className="fixed inset-0 grid-overlay pointer-events-none -z-10" aria-hidden />
      <section className="border-t border-border">
        <div className="container-custom py-10 sm:py-12 lg:py-16">
          {prepend}
          <header className="max-w-2xl mb-5 sm:mb-5">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-purple-200 mb-3">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground-primary tracking-tight">
              {title}
            </h1>
          </header>
          <div className="max-w-2xl space-y-6 text-base leading-relaxed">{children}</div>
        </div>
      </section>
    </div>
  );
}
