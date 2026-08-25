/** Static blog data — swap for API later. */
export const BLOG_PAGE_SIZE = 2;

export const blogs = [
  {
    slug: 'for-devs-whose-only-love-is-coding',
    title: 'For devs whose only love is coding:',
    excerpt:
      'You are doing what you love to do: code and ship. Suddenly, a message drops. Slack threads multiply. Notes scatter across tabs — and the day turns into something you dread.',
    publishedAt: '2026-08-20',
    author: 'ZeroAI Team',
    authorRole: 'Built for developer chaos',
    readTime: '4 min read',
    featureImage: 'case-photo.webp',
    body: [
      {
        type: 'p',
        text: 'You are doing what you love to do: code and ship. Suddenly, a message drops: “Can you review the auth PR before Friday?” Then, you check Slack, and you find another thread has three action items from standup. Your notes are scattered across tabs.',
      },
      {
        type: 'p',
        text: 'It quickly becomes a day you dread.',
      },
      {
        type: 'p',
        text: 'That’s exactly why ZeroAI exists. An AI assistant built for developer chaos.',
      },
      { type: 'h2', text: 'What it actually does for developers:' },
      {
        type: 'ul',
        items: [
          'Turns Slack messages, emails, notes & meeting action items into real calendar blocks',
          'Lets you type a task in plain English → estimates duration and finds focus-friendly slots',
          'Transcribes standups/meetings and extracts owners + deadlines automatically',
          'Pulls context from your open tabs, bookmarks, and connected tools so you can jump straight back in',
          'Protects deep work with on-demand Pomodoro/Focus Mode',
        ],
      },
      { type: 'h2', text: 'Pick whichever interface fits your flow:' },
      {
        type: 'links',
        items: [
          { label: 'Slack integration', url: 'https://zeroai.co.in/onboard' },
          {
            label: 'Chrome Extension',
            url: 'https://chromewebstore.google.com/detail/zeroai-ai-assistant-that/hplbpdkajdhlggncdpdmnkjldopmoomg',
          },
        ],
      },
    ],
  },
  {
    slug: 'the-hidden-cost-of-context-switching',
    title: 'The hidden cost of context switching',
    excerpt:
      'Every ping costs more than the interruption itself. Here is what fragmented days actually do to deep work — and how developers get it back.',
    publishedAt: '2026-08-12',
    author: 'ZeroAI Team',
    authorRole: 'Built for developer chaos',
    readTime: '3 min read',
    featureImage: null,
    body: [
      {
        type: 'p',
        text: 'Developers do not lose hours to meetings alone. They lose them to the recovery time between meetings — the Slack reply that pulls you out of flow, the PR review that lands mid-debug, the standup action item nobody wrote down.',
      },
      {
        type: 'p',
        text: 'ZeroAI treats those fragments as first-class work: capture them, schedule them, and defend the blocks where real coding happens.',
      },
      { type: 'h2', text: 'What changes when chaos becomes calendar:' },
      {
        type: 'ul',
        items: [
          'Commitments from Slack stop living only in threads',
          'Focus blocks get defended before someone books over them',
          'End-of-day close-out files unfinished work into tomorrow',
        ],
      },
    ],
  },
  {
    slug: 'how-zero-defends-focus-blocks',
    title: 'How Zero defends focus blocks',
    excerpt:
      'Most calendars treat focus time as a suggestion. Zero treats it as infrastructure — scanning your week, finding the longest stretch, and holding the line.',
    publishedAt: '2026-08-05',
    author: 'ZeroAI Team',
    authorRole: 'Built for developer chaos',
    readTime: '5 min read',
    featureImage: 'daily-recap.webp',
    body: [
      {
        type: 'p',
        text: 'Deep work does not fail because developers lack discipline. It fails because the calendar never stops accepting invitations.',
      },
      {
        type: 'p',
        text: 'Zero reads your week, finds where uninterrupted time actually fits, and defends those blocks — declining with context when you have told it to, surfacing conflicts before they land.',
      },
      { type: 'h2', text: 'Three jobs, not another inbox:' },
      {
        type: 'ul',
        items: [
          'Protect focus blocks before they disappear',
          'Track commitments pulled from Slack and meetings',
          'Close the day with a recap that sets up tomorrow',
        ],
      },
      { type: 'h2', text: 'Get started:' },
      {
        type: 'links',
        items: [{ label: 'Connect calendar & Slack', url: '/onboard' }],
      },
    ],
  },
];

export function getBlogBySlug(slug) {
  return blogs.find((b) => b.slug === slug) ?? null;
}

export function getBlogPage(page = 1) {
  const total = blogs.length;
  const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * BLOG_PAGE_SIZE;
  return {
    posts: blogs.slice(start, start + BLOG_PAGE_SIZE),
    page: safePage,
    totalPages,
    total,
  };
}

export function formatBlogDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getBlogToc(post) {
  return (post?.body ?? [])
    .filter((b) => b.type === 'h2')
    .map((b) => ({ id: slugifyHeading(b.text), text: b.text }));
}
