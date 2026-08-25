import React, { useState } from 'react';
import { Link } from 'react-router';
import { LogoMark, StartCta, LandingFooter, landingAsset as asset } from '../components/landing/LandingShell';

const faqs = [
  {
    q: 'Is this just a ChatGPT wrapper on my calendar?',
    a: 'No. Zero runs specific jobs — defending focus blocks, capturing commitments, and closing out your day — against your calendar and Slack. It is not a chat box sitting on top of your schedule.',
  },
  {
    q: 'What can it actually see?',
    a: 'With calendar connected, Zero can read event titles, times, and attendees to find focus windows. With Slack, it can hear commitments you make in channels and DMs you authorize. It does not scrape your drive or email unless you connect those later.',
  },
  {
    q: 'Will it send things on my behalf without asking?',
    a: 'No. Declines, status changes, and shared notes require your confirmation until you explicitly turn on automation for a specific action.',
  },
  {
    q: 'Does my manager see any of this?',
    a: 'No. Zero is personal by default. Your focus blocks, recaps, and Slack tracking stay on your account unless you choose to share something.',
  },
];

function FeatureProtect() {
  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[20px] bg-[rgba(107,76,232,0.12)] p-8 md:min-h-[324px]">
      <p className="pointer-events-none absolute left-8 top-[-29px] font-azeret text-[84px] font-medium leading-[1.2] tracking-[-0.5px] text-foreground-primary opacity-5">
        01
      </p>
      <div className="relative z-10 max-w-[246px] pt-10">
        <h3 className="mb-[13px] font-instrumentSans text-[28px] font-medium leading-[1.2] text-foreground-primary">
          Protect your time
        </h3>
        <p className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted">
          Zero reads your week, finds where deep work actually fits, and defends it.
        </p>
      </div>
      <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[320px] w-[280px] -translate-y-1/2 overflow-hidden rounded-xl md:block lg:right-4">
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
                <span className="font-instrumentSans text-[10px] font-semibold leading-[14px] text-[#f88460]">Protected</span>
              </span>
            </div>
            <p className="font-instrumentSans text-[10px] font-semibold leading-[1.35] text-foreground-primary">Deep work block</p>
            <p className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">longest uninterrupted stretch of the day</p>
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
            <span className="font-medium leading-[14px]">End of Day</span>
            <span className="leading-[1.35]">5 - 5:15 PM</span>
          </div>
          <p className="mt-1 font-instrumentSans text-[10px] leading-[14px] text-foreground-muted">Review what&apos;s shipped and what&apos;s blocked</p>
        </div>
        <div className="absolute inset-x-0 top-0 h-[76px] bg-linear-to-b from-[#181429] from-[20%] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[95px] bg-linear-to-t from-[#181429] from-[20%] to-transparent" />
      </div>
    </div>
  );
}

function FeatureCommitments() {
  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[20px] bg-background-secondary p-8 md:min-h-[324px]">
      <div className="pointer-events-none absolute left-0 top-[-15px] flex h-[355px] w-[532px] items-center justify-center">
        <div className="h-[355px] w-[532px] -scale-y-100 rotate-180">
          <img
            alt=""
            src={asset('feature-commitments-bg.webp')}
            className="size-full max-w-none object-cover opacity-10"
          />
        </div>
      </div>
      <p className="pointer-events-none absolute left-8 top-[-29px] font-azeret text-[84px] font-medium leading-[1.2] tracking-[-0.5px] text-foreground-primary opacity-5">
        02
      </p>
      <div className="relative z-10 max-w-[246px] pt-10">
        <h3 className="mb-[13px] font-instrumentSans text-[28px] font-medium leading-[1.2] text-foreground-primary">
          Keep your commitments
        </h3>
        <p className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted">
          Every &quot;I&apos;ll get to that&quot; in Slack becomes something Zero tracks for you.
        </p>
      </div>
      <div className="pointer-events-none absolute right-4 top-10 hidden h-[243px] w-[256px] rounded-lg border border-border md:block">
        {[
          { text: '"I\'ll review the PR today"', when: '→ Today 2:00, 30 min', whenClass: 'text-[#ffd270]', rotate: 'rotate-2' },
          { text: '"Spec draft by Friday"', when: '→  Thu 10:00, 90 min', whenClass: 'text-purple-200', rotate: '-rotate-2' },
          { text: '"Ping legal about the DPA" ', when: '→   Tomorrow, 9:15', whenClass: 'text-purple-200', rotate: 'rotate-2' },
        ].map((row, i) => (
          <div key={row.text} className="absolute left-8" style={{ top: 12 + i * 77 }}>
            <div className={`${row.rotate} flex h-9 w-[190px] items-center gap-2 rounded-md bg-white/10 px-2.5`}>
              <img alt="" src={asset('chat-circle.svg')} className="size-4 shrink-0" />
              <span className="truncate font-instrumentSans text-xs font-medium leading-[1.45] text-foreground-muted">{row.text}</span>
            </div>
            <div className="mt-1 ml-16 inline-flex rounded-md border border-border-muted bg-background-secondary px-2.5 py-1.5">
              <span className={`font-instrumentSans text-[10px] font-medium leading-[1.45] whitespace-pre ${row.whenClass}`}>{row.when}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureMeetings() {
  return (
    <div className="relative h-[280px] overflow-clip rounded-[20px] bg-background-secondary md:h-[324px]">
      {/* ponytail: Figma layers are wider than the card; overflow-clip makes the right-edge steps */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[1090px] rounded-bl-xl bg-[#473786] shadow-[inset_-60px_4px_80px_0_rgba(255,255,255,0.12)]" />
      <div className="pointer-events-none absolute right-[88px] top-0 h-full w-[979px] rounded-bl-xl bg-[#473786] shadow-[inset_-60px_4px_80px_0_rgba(255,255,255,0.12)]" />
      <div className="pointer-events-none absolute right-[189px] top-0 h-full w-[811px] rounded-bl-xl bg-[#473786] shadow-[inset_-60px_4px_80px_0_rgba(255,255,255,0.12)]" />
      <p className="pointer-events-none absolute left-8 top-[-29px] z-10 font-azeret text-[84px] font-medium leading-[1.2] tracking-[-0.5px] text-foreground-primary opacity-5">
        03
      </p>
      <div className="absolute left-8 top-[84px] z-10 w-[246px]">
        <h3 className="mb-[13px] font-instrumentSans text-[28px] font-medium leading-[1.2] text-foreground-primary">
          Absorb meeting overhead
        </h3>
        <p className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted">
          Joining, note-taking, follow-ups — the work around the work.
        </p>
      </div>
      <div className="pointer-events-none absolute right-[-28px] top-[40px] z-10 hidden h-[243px] w-[256px] rounded-lg bg-[#1f1733] md:block">
        <div className="absolute left-4 top-[35px] w-[226px] rounded-lg border border-dashed border-border-strong bg-[rgba(107,76,232,0.12)] py-2.5 shadow-[0_0_16px_rgba(146,119,255,0.15)]">
          <div className="px-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <img alt="" src={asset('sparkles.svg')} className="size-3" />
                <span className="font-hauora text-[10px] font-semibold leading-[1.35] text-purple-200">Context</span>
              </span>
              <span className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">10:40 AM</span>
            </div>
            <p className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">what changed since last time, in three lines</p>
          </div>
        </div>
        <div className="absolute left-4 top-[99px] w-[226px] rounded-lg border border-border-muted bg-white/6 py-2.5 backdrop-blur-[2px]">
          <div className="flex items-center justify-between px-3">
            <span className="font-hauora text-xs font-semibold leading-[17px] text-foreground-primary">Your meeting</span>
            <span className="font-hauora text-[10px] font-medium leading-[14px] text-foreground-muted">11 - 11:30 AM</span>
          </div>
        </div>
        <div className="absolute left-4 top-[146px] w-[226px] rounded-lg border border-dashed border-border-strong bg-[rgba(107,76,232,0.12)] py-2.5 shadow-[0_0_16px_rgba(146,119,255,0.15)]">
          <div className="px-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <img alt="" src={asset('sparkles-gold.svg')} className="size-3" />
                <span className="font-hauora text-[10px] font-semibold leading-[1.35] text-[#ffd270]">After</span>
              </span>
              <span className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">11:35 AM</span>
            </div>
            <p className="font-instrumentSans text-[10px] leading-[1.35] text-foreground-muted">decisions captured, follow-ups scheduled, no chasing</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRecap() {
  return (
    <div className="relative flex h-[280px] overflow-clip rounded-[20px] bg-[rgba(107,76,232,0.12)] md:h-[324px]">
      <p className="pointer-events-none absolute left-8 top-[-29px] font-azeret text-[84px] font-medium leading-[1.2] tracking-[-0.5px] text-foreground-primary opacity-5">
        04
      </p>
      <div className="relative z-10 flex w-[246px] shrink-0 flex-col justify-center p-8">
        <h3 className="mb-[13px] font-instrumentSans text-[28px] font-medium leading-[1.2] text-foreground-primary">
          End the day on purpose
        </h3>
        <p className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted">
          Two taps, no typing. Unfinished work files itself into tomorrow and the day closes.
        </p>
      </div>
      <div className="pointer-events-none relative hidden min-w-0 flex-1 xl:block">
        <div className="absolute right-[-72px] top-8 h-[338px] w-[381px] overflow-hidden rounded-[10px] border border-border shadow-[0_0_24px_rgba(136,85,255,0.14)]">
          <img alt="" src={asset('daily-recap.webp')} className="absolute left-[-4.21%] top-0 h-[103.98%] w-[117.08%] max-w-none object-cover" />
        </div>
      </div>
    </div>
  );
}

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="dark min-h-screen bg-background font-instrumentSans text-foreground-primary antialiased">
      {/* Hero — Figma 1400×1128 frame */}
      <section className="relative mx-auto w-full max-w-[1440px] px-5 pt-0">
        <div className="relative overflow-hidden rounded-[20px] border border-border bg-background">
          <img alt="" src={asset('grid-corner.svg')} className="pointer-events-none absolute left-0 top-0 h-[400.5px] w-[479px] max-w-none" />
          <img alt="" src={asset('grid-corner-2.svg')} className="pointer-events-none absolute bottom-0 right-0 hidden h-[400.5px] w-[479px] max-w-none -scale-y-100 md:block" />
          <img alt="" src={asset('glow-ellipse.svg')} className="pointer-events-none absolute left-1/2 top-[-91px] h-[182px] w-[788px] max-w-none -translate-x-1/2" />
          <div className="pointer-events-none absolute inset-0 bg-black/8" />

          <header className="relative z-20 flex h-16 items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-[7px]">
              <LogoMark className="h-4 w-[53px]" />
              <img alt="" src={asset('beta-dot.svg')} className="size-2" />
            </Link>
            <Link
              to="/onboard"
              className="inline-flex h-10 items-center rounded-[20px] border border-foreground-primary px-5 font-instrumentSans text-sm font-medium leading-[1.2] tracking-[0.4px] text-foreground-primary transition-colors hover:bg-white/5"
            >
              Start ZeroAI
            </Link>
          </header>

          <div className="relative z-10 mx-auto flex w-full flex-col items-center gap-11 px-4 pb-[300px] pt-[69px] text-center md:pb-[340px] md:pt-[69px]">
            <div className="flex w-full max-w-[702px] flex-col items-center gap-8 animate-landing-fade-up">
              <h1 className="font-azeret text-[32px] font-normal leading-[1.2] tracking-[-0.5px] text-foreground-primary sm:text-4xl md:text-[48px]">
                Turn workday chaos
                <br />
                into focused{' '}
                <span className="bg-linear-to-r from-purple-200 via-[#a790ff] to-[#9ec8ff] bg-clip-text text-transparent">
                  momentum
                </span>
              </h1>
              <p className="max-w-[604px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-secondary">
                An AI assistant for developers who lose hours to context switching. It guards your focus blocks, writes your meeting notes, and closes out your day — before you ask.
              </p>
            </div>

            <div className="flex w-full max-w-[720px] flex-col items-center gap-8 animate-landing-fade-up" style={{ animationDelay: '120ms' }}>
              <StartCta>Start free- Connect in 90 secs</StartCta>
              <div className="flex w-full flex-nowrap items-center justify-center gap-6">
                {[
                  'No upfront cost',
                  'Works alongside your calendar and Slack',
                  'Easy installation',
                ].map((label, i) => (
                  <React.Fragment key={label}>
                    {i > 0 && <span className="h-[19px] w-px shrink-0 bg-border" aria-hidden />}
                    <span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                      <img alt="" src={asset('check-circle.svg')} className="size-5 shrink-0" />
                      <span className="font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-foreground-muted">
                        {label}
                      </span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mx-auto -mt-[260px] max-w-[856px] overflow-hidden rounded-[20px] border-[5px] border-[rgba(146,119,255,0.08)] bg-background shadow-[0_60px_150px_rgba(146,119,255,0.04)] animate-landing-fade-in md:-mt-[300px]">
          <img
            src={asset('hero-product.gif')}
            alt="ZeroAI product preview"
            className="aspect-[856/578] w-full object-cover"
          />
        </div>
      </section>

      {/* Trust bar */}
      <section className="mt-[60px] bg-white/[0.03] py-5">
        <div className="mx-auto flex max-w-[1256px] flex-wrap items-center justify-center gap-8 px-4">
          <p className="font-instrumentSans text-sm font-normal text-foreground-muted">Loved by 12.000+ developers</p>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[
                { src: 'avatar-1.webp', className: 'absolute h-[117%] w-[175%] max-w-none -left-[38%] -top-[17%]' },
                { src: 'avatar-2.webp', className: 'absolute h-[114%] w-[171%] max-w-none -left-[34%] -top-[14%]' },
                { src: 'avatar-3.webp', className: 'size-full object-cover' },
                { src: 'avatar-4.webp', className: 'size-full object-cover' },
              ].map((avatar, i) => (
                <div
                  key={avatar.src}
                  className="relative size-9 overflow-hidden rounded-[20px] border border-border bg-white shadow-[-4px_4px_16px_rgba(0,0,0,0.25)]"
                  style={{ marginLeft: i === 0 ? 0 : -16 }}
                >
                  <img alt="" src={asset(avatar.src)} className={avatar.className} />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <img key={i} alt="" src={asset('star-fill.svg')} className="size-3.5" />
                ))}
                <img alt="" src={asset('star-half.svg')} className="size-3.5" />
              </div>
              <p className="font-instrumentSans text-xs font-normal leading-[1.35] text-foreground-muted">4.7 (2.7k reviews)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-[60px] md:px-6">
        <div className="mx-auto max-w-[1256px]">
          <div className="mb-10 flex flex-col gap-5">
            <p className="font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-purple-200">
              WHAT ZERO IS RESPONSIBLE FOR
            </p>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-[484px] font-azeret text-[28px] font-normal leading-[1.35] tracking-[-0.5px] text-foreground-primary md:text-[36px]">
                Everything you need to own your workday
              </h2>
              <p className="max-w-[401px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-muted">
                Most assistants give you another inbox to manage. Zero takes three specific jobs off your plate and reports back when they&apos;re done.
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
            <p className="font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-purple-200">QUICK SETUP</p>
            <h2 className="font-azeret text-[28px] font-normal leading-[1.2] tracking-[-0.5px] text-foreground-primary md:text-[36px]">
              2 quick steps, then it runs itself.
            </h2>
          </div>

          <div className="flex w-full flex-col gap-2">
            {[
              {
                icon: <img alt="" src={asset('google-cal.webp')} className="size-7 object-cover" />,
                step: '01.',
                tag: 'CONNECT',
                title: 'Calendar access',
                body: 'Read-only to start. Zero scans the next two weeks and shows you exactly where your focus time went — before it changes anything.',
              },
              {
                icon: <img alt="" src={asset('slack-logo.svg')} className="size-7" />,
                step: '02.',
                tag: 'EXTEND',
                title: 'Add Slack',
                body: 'Zero can hear commitments, set your status, decline with context, write meeting notes, and run your end-of-day close-out.',
              },
              {
                icon: <img alt="" src={asset('calendar-check.svg')} className="size-8" />,
                step: '03.',
                tag: 'Scan',
                title: 'Your day, mapped',
                body: 'You see the fragmentation as a picture: meeting density, longest uninterrupted stretch, and the two blocks Zero proposes holding.',
              },
            ].map((step, i) => (
              <React.Fragment key={step.title}>
                <div className="flex flex-col gap-4 py-5 md:flex-row md:items-end md:gap-6">
                  <div className="flex items-end gap-5">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-[32px] bg-white/6 p-4">
                      {step.icon}
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
            ))}
          </div>

          <StartCta>
            Start with step one
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
              “I stopped negotiating with my own calendar. Zero holds the block, says no for me, and I find out at 6pm that I actually shipped something.”
            </p>
            <footer className="flex flex-wrap items-center justify-center gap-2 font-instrumentSans text-base">
              <span className="text-foreground-primary">Anitha R.</span>
              <span className="text-foreground-muted">· Staff Engineer, XYZ</span>
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
              Selected outcome
            </p>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-[484px] font-azeret text-[28px] font-normal leading-[1.35] tracking-[-0.5px] md:text-[36px]">
                Nine engineers, one shared afternoon
              </h2>
              <p className="max-w-[442px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-muted">
                What changed when nine engineers stopped defending their own calendars by hand.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-border">
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-1 flex-col lg:max-w-[702px]">
                <p className="border-b border-border p-8 font-instrumentSans text-base font-normal leading-[1.45] text-foreground-primary">
                  Zero took over focus-block defence and meeting notes across the team. Nobody changed tools — the calendar and Slack they already used simply started behaving differently.
                </p>
                <div className="grid gap-x-10 gap-y-[46px] px-8 py-5 sm:grid-cols-2">
                  {[
                    ['Scan', '9 engineers, 2 EMs'],
                    ['Surfaces used', 'Calendar, Slack, Chrome'],
                    ['Before', 'Focus time negotiated meeting by meeting'],
                    ['Rollout', 'Self-serve, no admin setup'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-3">
                      <p className="font-azeret text-xs font-extralight uppercase leading-[1.45] text-foreground-muted">{label}</p>
                      <p className="font-instrumentSans text-base font-normal leading-[1.45] text-foreground-primary">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[340px] flex-1 overflow-hidden border-t border-border lg:min-h-0 lg:border-t-0 lg:border-l lg:rounded-tr-[20px]">
                <img alt="" src={asset('case-photo.webp')} className="absolute inset-0 size-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                <div className="relative z-10 flex h-full min-h-[340px] flex-col justify-end gap-[19px] p-8 lg:absolute lg:inset-0">
                  <p className="font-instrumentSans text-xl italic font-normal leading-[1.45] text-foreground-secondary">
                    “I stopped negotiating with my own calendar. Zero holds the block, says no for me, and I find out at 6pm that I actually shipped something.”
                  </p>
                  <div className="flex gap-2 font-instrumentSans text-sm">
                    <span className="text-foreground-primary">Anitha R.</span>
                    <span className="text-foreground-muted">· Staff Engineer</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-8 border-t border-border bg-white/[0.03] px-8 py-[27px] sm:grid-cols-3">
              {[
                { value: '3h 12m', label: 'average focus time returned per week' },
                { value: <>92<span className="text-purple-200">%</span></>, label: 'of meeting notes shared without an edit' },
                { value: <>41<span className="text-purple-200">%</span></>, label: 'Fewer meetings accepted out of politeness' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-4 text-center">
                  <p className="font-azeret text-[28px] font-normal leading-[1.2] tracking-[-0.5px] md:text-[36px]">{stat.value}</p>
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
              FREQUENTLY ASKED BY ENGINEERS
            </p>
            <h2 className="font-azeret text-[28px] font-normal leading-[1.2] tracking-[-0.5px] md:text-[36px]">
              Questions that matter
            </h2>
          </div>
          <div className="flex flex-col">
            {faqs.map((faq, i) => {
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
      <section className="relative overflow-hidden border-t border-border">
        <img alt="" src={asset('grid-corner.svg')} className="pointer-events-none absolute left-5 top-0 h-[400.5px] w-[479px] max-w-none" />
        <img alt="" src={asset('grid-corner-3.svg')} className="pointer-events-none absolute bottom-0 right-0 hidden h-[400.5px] w-[479px] max-w-none -scale-y-100 md:block" />
        <img alt="" src={asset('cta-glow.svg')} className="pointer-events-none absolute left-1/2 top-[-54px] h-[107px] w-[948px] max-w-none -translate-x-1/2" />
        <div className="relative mx-auto flex max-w-[781px] flex-col items-center gap-11 px-4 py-[120px] text-center">
          <div className="flex w-full flex-col items-center gap-8">
            <h2 className="font-azeret text-[32px] font-normal leading-[1.2] tracking-[-0.5px] md:text-[48px]">
              Get your afternoon back.
            </h2>
            <p className="max-w-[604px] font-instrumentSans text-base font-normal leading-[1.45] text-foreground-secondary">
              Connect your calendar and watch Zero find the focus time you already had.
            </p>
          </div>
          <div className="flex w-[284px] flex-col items-center gap-4">
            <StartCta className="w-full">Start free- Connect in 90 secs</StartCta>
            <p className="w-full text-center font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-foreground-muted">
              Free for individuals
            </p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Home;
