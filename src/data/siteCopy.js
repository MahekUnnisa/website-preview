/**
 * Marketing / site chrome copy (English).
 * Edit here, then re-export docs/site-copy.en.json if you need a flat file for translators.
 * Onboarding strings live in src/utils/onboarding-v2-i18n.ts.
 */
export const siteCopy = {
  common: {
    brandAlt: 'ZeroAI',
    getItNow: 'Get it now',
    getStarted: 'Get started',
    installChrome: 'Install Chrome Extension',
    blog: 'Blog',
    product: 'Product',
    security: 'Security',
    docs: 'Docs',
    copyright: (year) => `© 2025–${year} ZeroAI. All rights reserved.`,
    heroProductAlt: 'ZeroAI product preview',
  },

  home: {
    hero: {
      line1: 'For devs who',
      line2Before: 'love to ',
      line2Accent: 'ship',
      sub:
        'Every distraction (Slack messages, emails, and Linear tasks) you don’t want to deal with can be offloaded to your own chief of staff: ZeroAI.',
      trust: ['No upfront cost', 'Works alongside your Calendar and Slack', 'Easy installation'],
    },
    trustBar: {
      lovedBy: 'Loved by 12,000+ devs',
      reviews: '5.0 (100+ reviews)',
    },
    features: {
      eyebrow: 'What all Zero can do',
      title: 'Complete every task that eats your coding time',
      sub: "Zero needs no instructions, comes when you need it, goes away when you don't.",
      protect: {
        title: 'It protects your focus time',
        body: 'Zero reads your week, finds where deep work fits, and schedules it.',
        deepWorkSub: 'Longest open window for deep work',
        endOfDayReview: "Review what got shipped, what didn't",
        protected: 'Protected',
        deepWorkBlock: 'Deep work block',
        endOfDay: 'End of Day',
      },
      commitments: {
        title: 'It helps keep your commitments',
        body: 'Every "I\'ll get to that" in Slack becomes something Zero tracks for you.',
        rows: [
          { text: '"I\'ll review the PR today"', when: '→ Today 2:00, 30 min' },
          { text: '"Spec draft by Friday"', when: '→  Thu 10:00, 90 min' },
          { text: '"Ping testing team about the results" ', when: '→   Tomorrow, 9:15' },
        ],
      },
      meetings: {
        title: 'It absorbs meeting load',
        body: 'Zero joins your meetings, takes notes, does follow-ups.',
        contextLabel: 'Context',
        contextBody: 'what changed since last time',
        meetingLabel: 'Your meeting',
        afterLabel: 'After',
        afterBody: 'decisions captured, follow-ups scheduled, no chasing',
      },
      recap: {
        title: 'It lets you disconnect',
        body: 'Zero tracks your unfinished work, schedules it for next day. And your work day closes.',
      },
    },
    setup: {
      eyebrow: 'QUICK SETUP',
      title: '2 quick steps, then it runs itself.',
      cta: 'Start with step one',
      steps: [
        {
          step: '01.',
          tag: 'CONNECT',
          title: 'Calendar access',
          body: 'Read-only to start. Zero scans the next two weeks and shows you exactly where your focus time went — before it changes anything.',
        },
        {
          step: '02.',
          tag: 'EXTEND',
          title: 'Add Slack',
          body: 'Zero can hear commitments, set your status, decline with context, write meeting notes, and run your end-of-day close-out.',
        },
        {
          step: '03.',
          tag: 'Scan',
          title: 'Your day, mapped',
          body: 'You see the fragmentation as a picture: meeting density, longest uninterrupted stretch, and the two blocks Zero proposes holding.',
        },
      ],
    },
    testimonial: {
      quote:
        '“I stopped negotiating with my own calendar. Zero schedules my tasks, says no for me, and I find out at 6pm that I actually shipped something.”',
      name: 'Anitha R.',
      role: '· Staff Engineer at a frontier lab',
    },
    caseStudy: {
      eyebrow: 'Selected outcome',
      title: 'Nine engineers, one shared afternoon',
      sub: 'What changed when nine engineers stopped making their own calendars',
      body: 'Zero took over focus-block defense and meeting notes across the team. Nobody changed tools, the calendar and Slack they already used simply started behaving differently.',
      meta: [
        ['Scan', '9 engineers, 2 EMs'],
        ['Surfaces used', 'Calendar, Slack, Chrome'],
        ['Before', 'Focus time negotiated in every meeting'],
        ['Rollout', 'Self-serve, no admin setup'],
      ],
      quote:
        '“Focus blocks stopped getting eaten. Meeting notes landed without anyone chasing them. The team just… shipped more.”',
      name: 'Rahul Bansal',
      role: '· AI Head at a startup',
      stats: [
        { value: '3h 12m', label: 'average focus time returned per week' },
        { value: '92%', label: 'of meeting notes shared without an edit' },
        { value: '41%', label: 'Fewer meetings accepted out of politeness' },
      ],
    },
    faq: {
      eyebrow: 'FREQUENTLY ASKED BY DEVS',
      title: 'Questions that matter',
      items: [
        {
          q: 'Is this just a ChatGPT wrapper on my calendar?',
          a: 'No. Zero runs specific jobs: defending focus blocks, capturing commitments, and closing out your day. It is not a chat box sitting on top of your schedule.',
        },
        {
          q: 'What can it actually see?',
          a: 'With calendar connected, Zero can read event titles, times, and attendees to find focus windows. With Slack, it can see commitments you make in channels and DMs you authorize. It does NOT scrape your drive or email unless you connect them.',
        },
        {
          q: 'Will it send things on my behalf without asking?',
          a: 'No. Declines, status changes, and shared notes require your confirmation until you explicitly turn on automation for a specific action.',
        },
        {
          q: 'Does my manager see any of this?',
          a: 'No. Zero is personal by default. Your focus blocks, recaps, and Slack tracking stay on your account unless you choose to share something.',
        },
      ],
    },
    finalCta: {
      title: 'Get back to your original love: Coding',
      sub: 'Connect your calendar and watch Zero find the focus time you already had.',
      freeNote: 'Free for individuals',
    },
  },

  blog: {
    list: {
      eyebrow: 'FROM THE TEAM',
      title: 'For devs who ship',
      sub: 'Practical tips on focus, context switching, and the tools that help you get in flow state.',
      empty: 'No posts yet — check back soon.',
      readPost: 'Read post',
      previous: 'Previous',
      next: 'Next',
      paginationLabel: 'Blog pagination',
    },
    listCta: {
      title: 'Ready to regain your focus?',
    },
    post: {
      toc: 'TABLE OF CONTENTS',
      sidebarCta: 'You build, let Zero handle the rest.',
      startFree: 'Get started',
    },
  },
};

/** Flat key → string map for localization tooling. */
export function flattenSiteCopy(copy = siteCopy, prefix = '') {
  const out = {};
  for (const [key, value] of Object.entries(copy)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'function') {
      out[path] = value(2026);
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'string') out[`${path}.${i}`] = item;
        else if (Array.isArray(item)) out[`${path}.${i}`] = item.join(' | ');
        else if (item && typeof item === 'object') Object.assign(out, flattenSiteCopy(item, `${path}.${i}`));
      });
    } else if (value && typeof value === 'object') {
      Object.assign(out, flattenSiteCopy(value, path));
    } else if (typeof value === 'string') {
      out[path] = value;
    }
  }
  return out;
}
