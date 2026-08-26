import React from 'react';
import { Link, useSearchParams } from 'react-router';
import LandingShell, { landingAsset, StartCta } from '../components/landing/LandingShell';
import { formatBlogDate, getBlogPage } from '../data/blogs';
import { siteCopy } from '../data/siteCopy';

const copy = siteCopy.blog;

function BlogCard({ post, index = 0 }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="blog-card animate-landing-fade-up"
      style={{ animationDelay: `${120 + index * 80}ms` }}
    >
      {post.featureImage ? (
        <div className="blog-card__media">
          <img alt="" src={landingAsset(post.featureImage)} loading="lazy" decoding="async" />
        </div>
      ) : (
        <div className="blog-card__media blog-card__placeholder">
          <span className="blog-card__placeholder-letter">{post.title.slice(0, 1)}</span>
        </div>
      )}
      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{post.readTime}</span>
        </div>
        <h2 className="blog-card__title">{post.title}</h2>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <span className="blog-card__cta">
          {copy.list.readPost}
          <img alt="" src={landingAsset('arrow-right.svg')} />
        </span>
      </div>
    </Link>
  );
}

function Pagination({ page, totalPages }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label={copy.list.paginationLabel}
      className="flex flex-wrap items-center justify-center gap-2 border-t border-border pt-10 animate-landing-fade-in"
      style={{ animationDelay: '280ms' }}
    >
      <Link
        to={page > 1 ? `/blog?page=${page - 1}` : '#'}
        aria-disabled={page <= 1}
        className={`inline-flex h-10 items-center border border-border px-4 font-instrumentSans text-sm transition-colors duration-200 ${
          page <= 1 ? 'pointer-events-none opacity-40' : 'hover:border-border-strong hover:bg-white/5'
        }`}
      >
        {copy.list.previous}
      </Link>
      {pages.map((n) => (
        <Link
          key={n}
          to={`/blog?page=${n}`}
          aria-current={n === page ? 'page' : undefined}
          className={`inline-flex size-10 items-center justify-center border font-azeret text-xs tracking-[-0.5px] transition-colors duration-200 ${
            n === page
              ? 'border-purple-200 bg-[rgba(107,76,232,0.12)] text-purple-200'
              : 'border-border text-foreground-muted hover:border-border-strong hover:bg-white/5'
          }`}
        >
          {n}
        </Link>
      ))}
      <Link
        to={page < totalPages ? `/blog?page=${page + 1}` : '#'}
        aria-disabled={page >= totalPages}
        className={`inline-flex h-10 items-center border border-border px-4 font-instrumentSans text-sm transition-colors duration-200 ${
          page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:border-border-strong hover:bg-white/5'
        }`}
      >
        {copy.list.next}
      </Link>
    </nav>
  );
}

export default function BlogList() {
  const [params] = useSearchParams();
  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1);
  const { posts, page: safePage, totalPages } = getBlogPage(page);

  return (
    <LandingShell>
      <section className="relative overflow-hidden border-b border-border px-4 pb-[60px] pt-10 md:px-6 md:pt-[60px]">
        <img alt="" src={landingAsset('grid-corner.svg')} className="pointer-events-none absolute left-0 top-0 h-[400px] w-[479px] max-w-none opacity-60" />
        <img alt="" src={landingAsset('glow-ellipse.svg')} className="pointer-events-none absolute left-1/2 top-[-60px] h-[182px] w-[788px] max-w-none -translate-x-1/2 opacity-80" />

        <div className="relative mx-auto max-w-[1256px]">
          <div className="mb-10 flex flex-col gap-5 md:mb-14 animate-landing-fade-up">
            <p className="font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-purple-200">
              {copy.list.eyebrow}
            </p>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h1 className="max-w-[560px] font-azeret text-[32px] font-normal leading-[1.2] tracking-[-0.5px] text-foreground-primary md:text-[48px]">
                {copy.list.title}
              </h1>
              <p className="max-w-[401px] font-instrumentSans text-base leading-[1.45] text-foreground-muted">
                {copy.list.sub}
              </p>
            </div>
          </div>

          {posts.length > 0 ? (
            <>
              <div key={safePage} className="grid gap-5 md:grid-cols-2">
                {posts.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination page={safePage} totalPages={totalPages} />
              </div>
            </>
          ) : (
            <p className="font-instrumentSans text-base leading-[1.45] text-foreground-muted animate-landing-fade-up">
              {copy.list.empty}
            </p>
          )}
        </div>
      </section>

      <section className="px-4 py-[80px] md:px-6">
        <div
          className="mx-auto flex max-w-[781px] flex-col items-center gap-8 text-center animate-landing-fade-up"
          style={{ animationDelay: '320ms' }}
        >
          <h2 className="font-azeret text-[28px] font-normal leading-[1.2] tracking-[-0.5px] md:text-[36px]">
            {copy.listCta.title}
          </h2>
          <StartCta>{siteCopy.common.getStarted}</StartCta>
        </div>
      </section>
    </LandingShell>
  );
}
