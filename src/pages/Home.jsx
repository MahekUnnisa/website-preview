import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { LogoMark, StartCta, LandingFooter, landingAsset as asset } from '../components/landing/LandingShell';
import { siteCopy } from '../data/siteCopy';
import { ANALYTICS_EVENTS } from '../data/static/analytics-events';
import { trackEvent, trackEventOnce } from '../lib/analytics';
import { getChromeWebStoreUrl } from '../lib/env';

const copy = siteCopy.home;
const { common } = siteCopy;

function FeatureProtect() {
  const f = copy.features.protect;
  return (
    <div className="relative h-[450px] overflow-hidden rounded-[20px] bg-[rgba(107,76,232,0.12)] md:h-auto md:min-h-[324px] md:p-8">
      <p className="pointer-events-none absolute left-6 top-[-29px] font-azeret text-[84px] font-medium leading-[1.2] tracking-[-0.5px] text-foreground-primary opacity-5 md:left-8">
        01
      </p>
      <div className="absolute left-6 top-[84px] z-10 w-[min(302px,calc(100%-3rem))] md:relative md:left-auto md:top-auto md:max-w-[246px] md:pt-10">
        <h3 className="mb-[13px] font-instrumentSans text-[28px] font-medium leading-[1.2] text-foreground-primary">
          {f.title}
        </h3>
        <p className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted">{f.body}</p>
      </div>
      {/* mobile: bottom-centered mock; md+: side panel */}
      <div className="pointer-events-none absolute bottom-[-73px] left-1/2 h-[320px] w-[280px] -translate-x-1/2 overflow-hidden rounded-xl md:bottom-auto md:left-auto md:right-0 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 lg:right-4">
        <div className="absolute left-3 top-[calc(50%-141px)] flex w-[254px] gap-2.5">
          <div className="flex flex-1 flex-col">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex h-[60px] items-start gap-2">
                <span className="mt-0 h-1.5 w-5 rounded-[5px] bg-white/20" />
                <span className="mt-[2px] h-px flex-1 bg-white/10" />
              </div>
            ))}
          </div>
          <div className="absolute left-12 top-px h-[419px] w-px bg-white/10" />
        </div>
        <div className="absolute left-[69px] top-[44px] w-[199px] rounded-lg border border-dashed border-border bg-white/6 px-3 py-1.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              <span className="h-1 w-[51px] rounded-sm bg-white/30" />
              <span className="h-1 w-[19px] rounded-sm bg-white/30" />
            </div>
            <span className="font-instrumentSans text-[10px] leading-[14px] text-foreground-muted">9:30 AM</span>
          </div>
        </div>
        <div className="absolute left-[69px] top-[76px] w-[199px] rounded-lg border border-dashed border-purple-500 bg-linear-to-b from-purple-500 to-purple-600 py-2.5 shadow-[0_0_8px_rgba(146,119,255,0.3)]">
          <div className="px-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">10 - 11:30 AM</span>
              <span className="flex items-center gap-1">
                <img alt="" src={asset('moon-stars.svg')} className="size-3.5" />
                <span className="font-instrumentSans text-[10px] font-semibold leading-[14px] text-[#f88460]">{f.protected}</span>
              </span>
            </div>
            <p className="font-instrumentSans text-[10px] font-semibold leading-[1.35] text-foreground-primary">{f.deepWorkBlock}</p>
            <p className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">{f.deepWorkSub}</p>
          </div>
        </div>
        <div className="absolute left-[69px] top-[166px] w-[199px] rounded-lg border border-dashed border-border bg-white/6 px-3 py-1.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              <span className="h-1 w-[51px] rounded-sm bg-white/30" />
              <span className="h-1 w-[19px] rounded-sm bg-white/30" />
            </div>
            <span className="font-instrumentSans text-[10px] leading-[14px] text-foreground-muted">11:30 AM</span>
          </div>
        </div>
        <div className="absolute left-[69px] top-[225px] w-[199px] rounded-lg border border-dashed border-border bg-white/6 px-3 py-2.5">
          <div className="flex justify-between gap-4 font-instrumentSans text-[10px] text-foreground-muted">
            <span className="font-medium leading-[14px]">{f.endOfDay}</span>
            <span className="leading-[1.35]">5 - 5:15 PM</span>
          </div>
          <p className="mt-1 font-instrumentSans text-[10px] leading-[14px] text-foreground-muted">{f.endOfDayReview}</p>
        </div>
        <div className="absolute inset-x-0 top-0 h-[76px] bg-linear-to-b from-[#181429] from-[20%] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[95px] bg-linear-to-t from-[#181429] from-[20%] to-transparent" />
      </div>
    </div>
  );
}

function FeatureCommitments() {
  const f = copy.features.commitments;
  const whenClasses = ['text-[#ffd270]', 'text-purple-200', 'text-purple-200'];
  const rotates = ['rotate-2', '-rotate-2', 'rotate-2'];
  return (
    <div className="relative h-[450px] overflow-hidden rounded-[20px] bg-background-secondary md:h-auto md:min-h-[324px] md:p-8">
      <div className="pointer-events-none absolute left-1/2 top-[-15px] flex h-[465px] w-[696px] -translate-x-1/2 items-center justify-center md:left-0 md:h-[355px] md:w-[532px] md:translate-x-0">
        <div className="h-full w-full -scale-y-100 rotate-180">
          <img
            alt=""
            src={asset('feature-commitments-bg.webp')}
            loading="lazy"
            decoding="async"
            className="size-full max-w-none object-cover opacity-10"
          />
        </div>
      </div>
      <p className="pointer-events-none absolute left-6 top-[-29px] font-azeret text-[84px] font-medium leading-[1.2] tracking-[-0.5px] text-foreground-primary opacity-5 md:left-8">
        02
      </p>
      <div className="absolute left-6 top-[82px] z-10 w-[min(302px,calc(100%-3rem))] md:relative md:left-auto md:top-auto md:max-w-[246px] md:pt-10">
        <h3 className="mb-[13px] font-instrumentSans text-[28px] font-medium leading-[1.2] text-foreground-primary">
          {f.title}
        </h3>
        <p className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted">{f.body}</p>
      </div>
      <div className="pointer-events-none absolute bottom-[-28px] left-1/2 h-[243px] w-[256px] -translate-x-1/2 rounded-lg border border-border md:bottom-auto md:left-auto md:right-4 md:top-10 md:translate-x-0">
        {f.rows.map((row, i) => (
          <div key={row.text} className="absolute left-8" style={{ top: 12 + i * 77 }}>
            <div className={`${rotates[i]} flex h-9 w-[190px] items-center gap-2 rounded-md bg-white/10 px-2.5`}>
              <img alt="" src={asset('chat-circle.svg')} className="size-4 shrink-0" />
              <span className="truncate font-instrumentSans text-xs font-medium leading-[1.45] text-foreground-muted">{row.text}</span>
            </div>
            <div className="mt-1 ml-16 inline-flex rounded-md border border-border-muted bg-background-secondary px-2.5 py-1.5">
              <span className={`font-instrumentSans text-[10px] font-medium leading-[1.45] whitespace-pre ${whenClasses[i]}`}>{row.when}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureMeetings() {
  const f = copy.features.meetings;
  return (
    <div className="relative h-[450px] overflow-clip rounded-[20px] bg-background-secondary md:h-[324px]">
      {/* ponytail: Figma layers are wider than the card; overflow-clip makes the right-edge steps */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[1090px] rounded-bl-xl bg-[#473786] shadow-[inset_-60px_4px_80px_0_rgba(255,255,255,0.12)]" />
      <div className="pointer-events-none absolute right-[88px] top-0 h-full w-[979px] rounded-bl-xl bg-[#473786] shadow-[inset_-60px_4px_80px_0_rgba(255,255,255,0.12)]" />
      <div className="pointer-events-none absolute right-[189px] top-0 h-full w-[811px] rounded-bl-xl bg-[#473786] shadow-[inset_-60px_4px_80px_0_rgba(255,255,255,0.12)]" />
      <p className="pointer-events-none absolute left-6 top-[-29px] z-10 font-azeret text-[84px] font-medium leading-[1.2] tracking-[-0.5px] text-foreground-primary opacity-5 md:left-8">
        03
      </p>
      <div className="absolute left-6 top-[84px] z-10 w-[calc(100%-48px)] max-w-[302px] md:left-8 md:w-[246px]">
        <h3 className="mb-[13px] font-instrumentSans text-[28px] font-medium leading-[1.2] text-foreground-primary">
          {f.title}
        </h3>
        <p className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted">{f.body}</p>
      </div>
      <div className="pointer-events-none absolute bottom-[-30px] left-1/2 z-10 h-[243px] w-[256px] -translate-x-1/2 rounded-lg bg-[#1f1733] md:bottom-auto md:left-auto md:right-[-28px] md:top-[40px] md:translate-x-0">
        <div className="absolute left-4 top-[35px] w-[226px] rounded-lg border border-dashed border-border-strong bg-[rgba(107,76,232,0.12)] py-2.5 shadow-[0_0_16px_rgba(146,119,255,0.15)]">
          <div className="px-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <img alt="" src={asset('sparkles.svg')} className="size-3" />
                <span className="font-hauora text-[10px] font-semibold leading-[1.35] text-purple-200">{f.contextLabel}</span>
              </span>
              <span className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">10:40 AM</span>
            </div>
            <p className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">{f.contextBody}</p>
          </div>
        </div>
        <div className="absolute left-4 top-[99px] w-[226px] rounded-lg border border-border-muted bg-white/6 py-2.5 backdrop-blur-[2px]">
          <div className="flex items-center justify-between px-3">
            <span className="font-hauora text-xs font-semibold leading-[17px] text-foreground-primary">{f.meetingLabel}</span>
            <span className="font-hauora text-[10px] font-medium leading-[14px] text-foreground-muted">11 - 11:30 AM</span>
          </div>
        </div>
        <div className="absolute left-4 top-[146px] w-[226px] rounded-lg border border-dashed border-border-strong bg-[rgba(107,76,232,0.12)] py-2.5 shadow-[0_0_16px_rgba(146,119,255,0.15)]">
          <div className="px-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <img alt="" src={asset('sparkles-gold.svg')} className="size-3" />
                <span className="font-hauora text-[10px] font-semibold leading-[1.35] text-[#ffd270]">{f.afterLabel}</span>
              </span>
              <span className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">11:35 AM</span>
            </div>
            <p className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">{f.afterBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRecap() {
  const f = copy.features.recap;
  return (
    <div className="relative h-[450px] overflow-clip rounded-[20px] bg-[rgba(107,76,232,0.12)] md:flex md:h-[324px]">
      <p className="pointer-events-none absolute left-6 top-[-29px] font-azeret text-[84px] font-medium leading-[1.2] tracking-[-0.5px] text-foreground-primary opacity-5 md:left-8">
        04
      </p>
      <div className="relative z-10 max-w-[302px] px-6 pt-[84px] md:flex md:w-[246px] md:shrink-0 md:flex-col md:justify-center md:p-8 md:pt-8">
        <h3 className="mb-[13px] font-instrumentSans text-[28px] font-medium leading-[1.2] text-foreground-primary">
          {f.title}
        </h3>
        <p className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted">{f.body}</p>
      </div>
      {/* mobile: bottom preview; md+: side preview */}
      <div className="pointer-events-none absolute bottom-[-40px] left-1/2 h-[253px] w-[280px] -translate-x-1/2 overflow-hidden rounded-[10px] border border-border shadow-[0_0_24px_rgba(136,85,255,0.14)] md:relative md:bottom-auto md:left-auto md:h-auto md:min-w-0 md:w-auto md:flex-1 md:translate-x-0 md:overflow-visible md:border-0 md:shadow-none">
        <div className="absolute inset-0 overflow-hidden rounded-[10px] md:right-[-72px] md:top-8 md:h-[338px] md:w-[381px] md:border md:border-border md:shadow-[0_0_24px_rgba(136,85,255,0.14)]">
          <img alt="" src={asset('daily-recap.webp')} loading="lazy" decoding="async" className="absolute left-[-4.21%] top-0 h-[103.98%] w-[117.08%] max-w-none object-cover" />
        </div>
      </div>
    </div>
  );
}

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    trackEventOnce('home_viewed', ANALYTICS_EVENTS.PAGE.HOME_VIEWED);
  }, []);

  return (
    <div className="dark min-h-screen bg-background font-instrumentSans text-foreground-primary antialiased">
      {/* Hero — Figma 1400×1128 frame */}
      <section className="relative mx-auto w-full px-5 pt-5">
        <div className="relative overflow-hidden rounded-[20px] border border-border bg-background">
          {/* bg grid — Vector 124 / 125 */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-0 top-0 h-[400.5px] w-[479px]">
              <div className="absolute inset-[0_0_-0.25%_-0.21%]">
                <img alt="" src={asset('grid-corner.svg')} className="block size-full max-w-none" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 hidden h-[400.5px] w-[479px] md:block">
              <div className="-scale-y-100">
                <div className="relative h-[400.5px] w-[479px]">
                  <div className="absolute inset-[0_0_-0.25%_-0.21%]">
                    <img alt="" src={asset('grid-corner-2.svg')} className="block size-full max-w-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Ellipse 98 — Figma frame 788×182; asset overflows to 1188×582 */}
          <div className="pointer-events-none absolute left-1/2 top-[-91px] h-[182px] w-[788px] -translate-x-1/2" aria-hidden>
            <img
              alt=""
              src={asset('glow-ellipse.svg')}
              className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
              width={1188}
              height={582}
            />
          </div>
          {/* Rectangle 4972 — noise overlay; fill full hero card */}
          <img
            alt=""
            src={asset('hero-noise-mobile.svg')}
            width={362}
            height={810}
            className="pointer-events-none absolute inset-0 size-full object-cover md:hidden"
            aria-hidden
          />
          <img
            alt=""
            src={asset('hero-noise.svg')}
            width={1400}
            height={810}
            className="pointer-events-none absolute inset-0 hidden size-full object-cover md:block"
            aria-hidden
          />

          <header className="relative z-20 flex h-16 items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-[7px]">
              <LogoMark className="h-4 w-[53px]" />
              <img alt="" src={asset('beta-dot.svg')} className="size-2" />
            </Link>
            <Link
              to="/get-started"
              className="inline-flex h-10 shrink-0 items-center rounded-[20px] border border-foreground-primary px-3 font-instrumentSans text-xs font-medium leading-[1.2] tracking-[0.4px] text-foreground-primary transition-colors hover:bg-white/5 sm:px-5 sm:text-sm"
              onClick={() => {
                trackEvent(ANALYTICS_EVENTS.CTA.GET_STARTED_CLICK, {
                  source: 'home_header_cta',
                  destination: '/get-started',
                });
              }}
            >
              {common.getItNow}
            </Link>
          </header>

          <div className="relative z-10 mx-auto flex w-full flex-col items-center gap-11 px-4 pb-[170px] lg:pb-[340px] pt-[69px] text-center md:pb-[340px] md:pt-[69px]">
            <div className="flex w-full max-w-[702px] flex-col items-center gap-8 animate-landing-fade-up">
              <h1 className="font-azeret text-[32px] font-normal leading-[1.2] tracking-[-0.5px] text-foreground-primary sm:text-4xl md:text-[48px]">
                {copy.hero.line1}
                <br />
                {copy.hero.line2Before}
                <span className="bg-linear-to-r from-purple-200 via-[#a790ff] to-[#9ec8ff] bg-clip-text text-transparent">
                  {copy.hero.line2Accent}
                </span>
              </h1>
              <p className="max-w-[604px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-secondary">
                {copy.hero.sub}
              </p>
            </div>

            <div className="flex w-full max-w-[720px] flex-col items-center gap-8 animate-landing-fade-up" style={{ animationDelay: '120ms' }}>
              <div className="flex w-full flex-col items-center gap-5 md:flex-row md:flex-wrap md:justify-center">
                <StartCta
                  to="/get-started"
                  source="home_hero_primary_cta"
                  className="w-full max-w-[314px] md:w-auto md:max-w-none"
                >
                  {common.getStarted}
                </StartCta>
                <a
                  href={getChromeWebStoreUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-full max-w-[314px] items-center justify-center gap-2 rounded-xl border border-purple-75 px-[30px] font-instrumentSans text-base font-semibold text-purple-50 transition-opacity hover:opacity-90 md:w-auto md:max-w-none"
                  onClick={() => {
                    trackEvent(ANALYTICS_EVENTS.ONBOARDING.EXTENSION_INSTALL_CLICKED, {
                      source: 'home_hero_install_cta',
                    });
                  }}
                >
                  <img alt="" src={asset('chrome-logo.webp')} width={18} height={18} className="size-[18px] shrink-0 object-cover" />
                  {common.installChrome}
                </a>
              </div>
              <div className="flex w-full flex-col items-stretch gap-4 px-1 md:max-w-none md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-6 md:px-0">
                {copy.hero.trust.map((label, i) => (
                  <React.Fragment key={label}>
                    {i > 0 && <span className="hidden h-[19px] w-px shrink-0 bg-border md:block" aria-hidden />}
                    <span className="flex min-w-0 items-center gap-2 text-left">
                      <img alt="" src={asset('check-circle.svg')} className="size-5 shrink-0" />
                      <span className="min-w-0 font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-foreground-muted md:whitespace-nowrap">
                        {label}
                      </span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mx-auto -mt-[120px] w-[min(313px,calc(100%-2rem))] overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_120px_rgba(146,119,255,0.04)] animate-landing-fade-in md:-mt-[300px] md:w-full md:max-w-[856px] md:rounded-[20px] md:border-[5px] md:border-[rgba(146,119,255,0.08)] md:shadow-[0_60px_150px_rgba(146,119,255,0.04)]">
          {/* ponytail: mobile + desktop mp4 loops; posters for first paint */}
          <video
            className="aspect-[313/470] w-full object-cover md:hidden"
            width={313}
            height={470}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={asset('hero-product-mobile-poster.webp')}
            aria-label={common.heroProductAlt}
          >
            <source src={asset('hero-product-mobile.mp4')} type="video/mp4" />
          </video>
          <video
            className="hidden aspect-[856/578] w-full object-cover md:block"
            width={856}
            height={578}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={asset('hero-product-poster.webp')}
            aria-label={common.heroProductAlt}
          >
            <source src={asset('hero-product.mp4')} type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Trust bar — Figma 14802:276 */}
      <section className="mt-[60px] bg-white/[0.03] py-5">
        <div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-8 px-4">
          <p className="shrink-0 whitespace-nowrap font-instrumentSans text-sm font-normal leading-normal text-foreground-muted">
            {copy.trustBar.lovedBy}
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <div className="relative shrink-0" style={{ width: 96, height: 36 }}>
              {['avatar-1.webp', 'avatar-2.webp', 'avatar-3.webp', 'avatar-4.webp'].map((src, i) => (
                <div
                  key={src}
                  className="absolute top-0 overflow-hidden rounded-[20px] bg-white shadow-[-4px_4px_16px_rgba(0,0,0,0.25)]"
                  style={{ left: i * 20, width: 36, height: 36 }}
                >
                  <img
                    alt=""
                    src={asset(src)}
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full max-w-none object-cover"
                    style={{ width: 36, height: 36 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2" style={{ width: 92 }}>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <img key={i} alt="" src={asset('star-fill.svg')} width={14} height={14} className="block shrink-0" style={{ width: 14, height: 14 }} />
                ))}
              </div>
              <p className="whitespace-nowrap text-right font-instrumentSans text-xs font-normal leading-[1.35] text-foreground-muted">
                {copy.trustBar.reviews}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-[60px] md:px-6">
        <div className="mx-auto max-w-[1256px]">
          <div className="mb-10 flex flex-col gap-5">
            <p className="font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-purple-200">
              {copy.features.eyebrow}
            </p>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-[484px] font-azeret text-[28px] font-normal leading-[1.35] tracking-[-0.5px] text-foreground-primary md:text-[36px]">
                {copy.features.title}
              </h2>
              <p className="max-w-[401px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-muted">
                {copy.features.sub}
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FeatureProtect />
            <FeatureCommitments />
            <FeatureMeetings />
            <FeatureRecap />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-[60px] md:px-6">
        <div className="mx-auto flex max-w-[916px] flex-col items-center gap-10">
          <div className="flex w-full flex-col items-center gap-5 text-center">
            <p className="font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-purple-200">{copy.setup.eyebrow}</p>
            <h2 className="font-azeret text-[28px] font-normal leading-[1.2] tracking-[-0.5px] text-foreground-primary md:text-[36px]">
              {copy.setup.title}
            </h2>
          </div>

          <div className="flex w-full flex-col gap-2">
            {copy.setup.steps.map((step, i) => {
              const icons = [
                <img key="cal" alt="" src={asset('google-cal.webp')} loading="lazy" decoding="async" className="size-7 object-cover" />,
                <img key="slack" alt="" src={asset('slack-logo.svg')} className="size-7" />,
                <img key="check" alt="" src={asset('calendar-check.svg')} className="size-8" />,
              ];
              return (
                <React.Fragment key={step.title}>
                  <div className="flex flex-col gap-4 py-5 md:flex-row md:items-end md:gap-6">
                    <div className="flex items-end gap-5">
                      <div className="flex size-16 shrink-0 items-center justify-center rounded-[32px] bg-white/6 p-4">
                        {icons[i]}
                      </div>
                      <div className="w-[200px] sm:w-[300px]">
                        <div className="mb-3 flex items-center text-xs leading-[1.45] whitespace-nowrap">
                          <span className="font-azeret font-normal tracking-[-0.5px] text-purple-200">{step.step}</span>
                          <span className="font-azeret font-extralight uppercase text-foreground-muted">{step.tag}</span>
                        </div>
                        <p className="font-instrumentSans text-2xl font-medium leading-[1.2] text-foreground-primary">{step.title}</p>
                      </div>
                    </div>
                    <p className="flex-1 font-instrumentSans text-base font-normal leading-[1.45] text-foreground-muted md:max-w-[508px]">
                      {step.body}
                    </p>
                  </div>
                  {i < 2 && (
                    <div className="flex items-center gap-5">
                      <div className="flex h-9 w-16 items-center justify-center">
                        <img alt="" src={asset('down-double.svg')} className="size-6" />
                      </div>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <StartCta
            to="/get-started"
            source="home_setup_cta"
            className="w-full max-w-[314px] md:w-auto md:max-w-none"
          >
            {copy.setup.cta}
            <img alt="" src={asset('arrow-right.svg')} className="size-5" />
          </StartCta>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-4 py-[60px] md:px-6">
        <div className="relative mx-auto max-w-[1256px] overflow-hidden rounded-xl bg-background-secondary px-6 py-[60px] md:px-16">
          <div className="absolute left-0 top-0 size-[46px] bg-background" />
          <div className="absolute left-[46px] top-[46px] size-[30px] bg-background" />
          <div className="absolute bottom-0 right-0 size-[46px] bg-background" />
          <div className="absolute bottom-[46px] right-[46px] size-[30px] bg-background" />
          <blockquote className="relative mx-auto flex max-w-[1006px] flex-col items-center gap-8 text-center">
            <p className="font-instrumentSans text-2xl italic font-normal leading-[1.35] tracking-[-0.5px] text-foreground-secondary md:text-[32px]">
              {copy.testimonial.quote}
            </p>
            <footer className="flex flex-wrap items-center justify-center gap-2 font-instrumentSans text-base">
              <span className="text-foreground-primary">{copy.testimonial.name}</span>
              <span className="text-foreground-muted">{copy.testimonial.role}</span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Case study */}
      <section
        className="px-4 py-[60px] md:px-6"
        style={{ backgroundImage: 'linear-gradient(-90deg, rgba(17,13,31,0) 0%, rgb(17,13,31) 50%, rgba(17,13,31,0) 100%)' }}
      >
        <div className="mx-auto max-w-[1256px]">
          <div className="mb-10 flex flex-col gap-5">
            <p className="font-azeret text-xs font-normal uppercase leading-[1.45] tracking-[-0.5px] text-purple-200">
              {copy.caseStudy.eyebrow}
            </p>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-[484px] font-azeret text-[28px] font-normal leading-[1.35] tracking-[-0.5px] md:text-[36px]">
                {copy.caseStudy.title}
              </h2>
              <p className="max-w-[442px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-muted">
                {copy.caseStudy.sub}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-border">
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-1 flex-col lg:max-w-[702px]">
                <p className="border-b border-border p-8 font-instrumentSans text-base font-normal leading-[1.45] text-foreground-primary">
                  {copy.caseStudy.body}
                </p>
                <div className="grid gap-x-10 gap-y-[46px] px-8 py-5 sm:grid-cols-2">
                  {copy.caseStudy.meta.map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-3">
                      <p className="font-azeret text-xs font-extralight uppercase leading-[1.45] text-foreground-muted">{label}</p>
                      <p className="font-instrumentSans text-base font-normal leading-[1.45] text-foreground-primary">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[340px] flex-1 overflow-hidden border-t border-border lg:min-h-0 lg:border-t-0 lg:border-l lg:rounded-tr-[20px]">
                <img alt="" src={asset('case-photo.webp')} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                <div className="relative z-10 flex h-full min-h-[340px] flex-col justify-end gap-[19px] p-8 lg:absolute lg:inset-0">
                  <p className="font-instrumentSans text-xl italic font-normal leading-[1.45] text-foreground-secondary">
                    {copy.caseStudy.quote}
                  </p>
                  <div className="flex gap-2 font-instrumentSans text-sm">
                    <span className="text-foreground-primary">{copy.caseStudy.name}</span>
                    <span className="text-foreground-muted">{copy.caseStudy.role}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-8 border-t border-border bg-white/[0.03] px-8 py-[27px] sm:grid-cols-3">
              {copy.caseStudy.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-4 text-center">
                  <p className="font-azeret text-[28px] font-normal leading-[1.2] tracking-[-0.5px] text-foreground-primary md:text-[36px]">
                    {stat.value}
                  </p>
                  <p className="font-instrumentSans text-sm font-normal text-foreground-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-[60px] md:px-6">
        <div className="mx-auto max-w-[1256px]">
          <div className="mb-10 flex flex-col gap-5">
            <p className="font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-purple-200">
              {copy.faq.eyebrow}
            </p>
            <h2 className="font-azeret text-[28px] font-normal leading-[1.2] tracking-[-0.5px] md:text-[36px]">
              {copy.faq.title}
            </h2>
          </div>
          <div className="flex flex-col">
            {copy.faq.items.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className={i > 0 ? 'border-t border-border' : ''}>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-4 py-6 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span className="flex min-w-0 items-center gap-5">
                      <span className="shrink-0 font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-purple-200 transition-colors group-hover:text-purple-100">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span className="font-instrumentSans text-lg font-medium leading-[1.2] transition-colors group-hover:text-purple-100 md:text-xl">
                        {faq.q}
                      </span>
                    </span>
                    <img
                      alt=""
                      src={asset('plus.svg')}
                      className={`size-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'rotate-45' : ''}`}
                    />
                  </button>
                  <div className="faq-answer" data-open={open} aria-hidden={!open}>
                    <div>
                      <p className="max-w-3xl pb-6 pl-[52px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-muted">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative min-h-[486px] overflow-hidden border-t border-border">
        {/* Ellipse 216 — Figma frame 948×107; asset overflows to 1348×507 */}
        <div className="pointer-events-none absolute left-1/2 top-[-54px] h-[107px] w-[948px] max-w-none -translate-x-1/2" aria-hidden>
          <img
            alt=""
            src={asset('cta-glow.svg')}
            className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
            width={1348}
            height={507}
          />
        </div>
        {/* bg grid — Vector 124 / 125 */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-5 top-0 h-[400.5px] w-[479px]">
            <div className="absolute inset-[0_0_-0.25%_-0.21%]">
              <img alt="" src={asset('grid-corner.svg')} className="block size-full max-w-none" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 hidden h-[400.5px] w-[479px] md:block">
            <div className="-scale-y-100">
              <div className="relative h-[400.5px] w-[479px]">
                <div className="absolute inset-[0_0_-0.25%_-0.21%]">
                  <img alt="" src={asset('grid-corner-3.svg')} className="block size-full max-w-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto flex max-w-[781px] flex-col items-center gap-11 px-4 py-[120px] text-center">
          <div className="flex w-full flex-col items-center gap-8">
            <h2 className="font-azeret text-[32px] font-normal leading-[1.2] tracking-[-0.5px] md:text-[48px]">
              {copy.finalCta.title}
            </h2>
            <p className="max-w-[604px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-secondary">
              {copy.finalCta.sub}
            </p>
          </div>
          <div className="flex w-full max-w-[314px] flex-col items-center gap-4">
            <StartCta to="/get-started" source="home_bottom_cta" className="w-full">
              {common.getStarted}
            </StartCta>
            <p className="w-full text-center font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-foreground-muted">
              {copy.finalCta.freeNote}
            </p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Home;
