import React from 'react';
import { Link, Navigate, useParams } from 'react-router';
import BlogBody from '../components/blog/BlogBody';
import LandingShell, { landingAsset, StartCta } from '../components/landing/LandingShell';
import { formatBlogDate, getBlogBySlug, getBlogToc } from '../data/blogs';
import { siteCopy } from '../data/siteCopy';

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const toc = getBlogToc(post);

  return (
    <LandingShell>
      <div key={slug} className="border-b border-border px-4 pb-16 pt-10 md:px-6 md:pb-24 md:pt-14">
        <div className="mx-auto max-w-[1100px]">
          <nav
            className="mb-8 flex flex-wrap items-center gap-2 font-instrumentSans text-sm text-foreground-muted animate-landing-fade-in"
          >
            <Link to="/blog" className="transition-colors duration-200 hover:text-purple-200">
              Blog
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate text-foreground-secondary">{post.title}</span>
          </nav>

          <header className="mb-10 max-w-[720px] md:mb-14 animate-landing-fade-up" style={{ animationDelay: '60ms' }}>
            <h1 className="mb-6 font-azeret text-[32px] font-normal leading-[1.2] tracking-[-0.5px] text-foreground-primary md:text-[44px]">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <img
                alt=""
                src={landingAsset(post.authorAvatar || 'devbot.webp')}
                className="size-9 shrink-0 rounded-full object-cover"
              />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-instrumentSans text-sm text-foreground-muted">
                <span className="font-medium text-foreground-primary">{post.author}</span>
                {post.authorRole && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{post.authorRole}</span>
                  </>
                )}
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                <span aria-hidden>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            <main
              className="min-w-0 flex-1 lg:max-w-[720px] animate-landing-fade-up"
              style={{ animationDelay: '140ms' }}
            >
              {post.featureImage && (
                <img
                  alt=""
                  src={landingAsset(post.featureImage)}
                  loading="lazy"
                  decoding="async"
                  className="mb-10 aspect-[2/1] w-full object-cover animate-landing-fade-in"
                  style={{ animationDelay: '180ms' }}
                />
              )}
              <BlogBody html={post.html} />
            </main>

            <aside
              className="w-full shrink-0 lg:w-[260px] animate-landing-fade-up"
              style={{ animationDelay: '220ms' }}
            >
              <div className="space-y-10 lg:sticky lg:top-24">
                {toc.length > 0 && (
                  <div>
                    <p className="mb-4 font-azeret text-xs tracking-[-0.5px] text-foreground-muted">
                      {siteCopy.blog.post.toc}
                    </p>
                    <ol className="flex flex-col gap-2 border-l border-border pl-4">
                      {toc.map((item, i) => (
                        <li
                          key={item.id}
                          className="animate-landing-fade-up"
                          style={{ animationDelay: `${260 + i * 50}ms` }}
                        >
                          <a
                            href={`#${item.id}`}
                            className="font-instrumentSans text-sm leading-[1.45] text-foreground-muted transition-colors duration-200 hover:text-purple-200"
                          >
                            <span className="mr-2 text-foreground-subtle">{String(i + 1).padStart(2, '0')}</span>
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="border-t border-border pt-8">
                  <p className="mb-4 font-instrumentSans text-sm leading-[1.45] text-foreground-muted">
                    {siteCopy.blog.post.sidebarCta}
                  </p>
                  <StartCta to="/get-started" className="w-full">
                    {siteCopy.blog.post.startFree}
                  </StartCta>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
