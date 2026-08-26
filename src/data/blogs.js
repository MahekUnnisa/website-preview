import { marked } from 'marked';

/** Drop a `.md` file in `content/blog/` — filename becomes the slug. */
export const BLOG_PAGE_SIZE = 2;

const rawPosts = import.meta.glob('../../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseFrontmatter(raw) {
  const match = String(raw).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, markdown: String(raw).trim() };

  const data = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value === 'null' || value === '') value = null;
    data[key] = value;
  }

  return { data, markdown: match[2].trim() };
}

function stripInlineMarkdown(text) {
  return String(text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim();
}

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plain = stripInlineMarkdown(tokens.map((t) => t.raw ?? t.text ?? '').join(''));
      if (depth === 2) {
        return `<h2 id="${slugifyHeading(plain)}">${text}</h2>\n`;
      }
      return `<h${depth}>${text}</h${depth}>\n`;
    },
  },
});

function loadBlogs() {
  const posts = Object.entries(rawPosts).map(([path, raw]) => {
    const fileSlug = path.split('/').pop().replace(/\.md$/, '');
    const { data, markdown } = parseFrontmatter(raw);
    const html = marked.parse(markdown);

    return {
      slug: data.slug || fileSlug,
      title: data.title || fileSlug,
      excerpt: data.excerpt || '',
      publishedAt: data.publishedAt || '1970-01-01',
      author: data.author || 'ZeroAI Team',
      authorRole: data.authorRole || null,
      authorAvatar: data.authorAvatar || null,
      readTime: data.readTime || null,
      featureImage: data.featureImage || null,
      // ponytail: per-post hide — set `hidden: true` in frontmatter to unpublish one post
      hidden: data.hidden === true,
      markdown,
      html,
    };
  });

  return posts
    .filter((p) => !p.hidden)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export const blogs = loadBlogs();

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

export function getBlogToc(post) {
  const matches = [...String(post?.markdown ?? '').matchAll(/^##\s+(.+)$/gm)];
  return matches.map((m) => {
    const text = stripInlineMarkdown(m[1]);
    return { id: slugifyHeading(text), text };
  });
}
