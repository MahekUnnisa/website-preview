import React from 'react';
import { Link, useSearchParams } from 'react-router';
import LandingShell, { landingAsset, StartCta } from '../components/landing/LandingShell';
import { formatBlogDate, getBlogPage } from '../data/blogs';

function BlogCard({ post, index = 0 }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="blog-card group flex flex-col overflow-hidden border border-border transition-[border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] animate-landing-fade-up hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
      style={{ animationDelay: `${120 + index * 80}ms` }}
    >
      {post.featureImage ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
          <img
            alt=""
            src={landingAsset(post.featureImage)}
            className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border bg-[rgba(107,76,232,0.12)]">
          <span className="font-azeret text-5xl font-medium tracking-[-0.5px] text-foreground-primary opacity-10 transition-opacity duration-300 group-hover:opacity-20">
            {post.title.slice(0, 1)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 font-azeret text-xs tracking-[-0.5px] text-foreground-muted">
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{post.readTime}</span>
        </div>
        <h2 className="font-azeret text-xl font-normal leading-[1.35] tracking-[-0.5px] text-foreground-primary transition-colors duration-300 group-hover:text-purple-200 md:text-2xl">
          {post.title}
        </h2>
        <p className="line-clamp-3 flex-1 font-instrumentSans text-sm leading-[1.55] text-foreground-muted">
          {post.excerpt}
        </p>
        <span className="inline-flex items-center gap-1.5 font-instrumentSans text-sm font-medium text-purple-200">
          Read post
          <img alt="" src={landingAsset('arrow-right.svg')} className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
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
      aria-label="Blog pagination"
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
        Previous
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
        Next
      </Link>
    </nav>
  );
}

export default function BlogList() {
  const [params] = useSearchParams();
  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1);
  const { posts, page: safePage, totalPages } = getBlogPage(page);

  return (
    <LandingShell active="blog">
      <section className="relative overflow-hidden border-b border-border px-4 pb-[60px] pt-10 md:px-6 md:pt-[60px]">
        <img alt="" src={landingAsset('grid-corner.svg')} className="pointer-events-none absolute left-0 top-0 h-[400px] w-[479px] max-w-none opacity-60" />
        <img alt="" src={landingAsset('glow-ellipse.svg')} className="pointer-events-none absolute left-1/2 top-[-60px] h-[182px] w-[788px] max-w-none -translate-x-1/2 opacity-80" />

        <div className="relative mx-auto max-w-[1256px]">
          <div className="mb-10 flex flex-col gap-5 md:mb-14 animate-landing-fade-up">
            <p className="font-azeret text-xs font-normal leading-[1.45] tracking-[-0.5px] text-purple-200">
              FROM THE TEAM
            </p>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h1 className="max-w-[560px] font-azeret text-[32px] font-normal leading-[1.2] tracking-[-0.5px] text-foreground-primary md:text-[48px]">
                Notes for developers who ship
              </h1>
              <p className="max-w-[401px] font-instrumentSans text-base leading-[1.45] text-foreground-muted">
                Practical writing on focus, context switching, and the tools that help you get your afternoon back.
              </p>
            </div>
          </div>

          <div key={safePage} className="grid gap-5 md:grid-cols-2">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>

          <div className="mt-10">
            <Pagination page={safePage} totalPages={totalPages} />
          </div>
        </div>
      </section>

      <section className="px-4 py-[80px] md:px-6">
        <div
          className="mx-auto flex max-w-[781px] flex-col items-center gap-8 text-center animate-landing-fade-up"
          style={{ animationDelay: '320ms' }}
        >
          <h2 className="font-azeret text-[28px] font-normal leading-[1.2] tracking-[-0.5px] md:text-[36px]">
            Ready to stop dreading your calendar?
          </h2>
          <StartCta>Start free- Connect in 90 secs</StartCta>
        </div>
      </section>
    </LandingShell>
  );
}
