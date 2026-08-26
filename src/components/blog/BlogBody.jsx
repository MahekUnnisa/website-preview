import React from 'react';

/** Renders markdown HTML produced by `src/data/blogs.js`. Styles live in `src/styles/blog.css`. */
export default function BlogBody({ html }) {
  return <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
