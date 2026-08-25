import React from 'react';
import { Link } from 'react-router';
import { landingAsset } from '../landing/LandingShell';
import { slugifyHeading } from '../../data/blogs';

export default function BlogBody({ blocks }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        if (block.type === 'p') {
          return (
            <p key={i} className="font-instrumentSans text-base font-normal leading-[1.65] text-foreground-secondary">
              {block.text}
            </p>
          );
        }
        if (block.type === 'h2') {
          const id = slugifyHeading(block.text);
          return (
            <h2
              key={i}
              id={id}
              className="scroll-mt-28 mt-2 font-azeret text-xl font-normal leading-[1.35] tracking-[-0.5px] text-foreground-primary md:text-2xl"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="flex flex-col gap-3 pl-1">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3 font-instrumentSans text-base leading-[1.65] text-foreground-secondary">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-purple-200" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'links') {
          return (
            <ul key={i} className="flex flex-col gap-3">
              {block.items.map((item) => {
                const external = item.url.startsWith('http');
                const className =
                  'group inline-flex items-center gap-2 font-instrumentSans text-base font-medium text-purple-200 transition-colors hover:text-purple-100';
                const content = (
                  <>
                    <img alt="" src={landingAsset('arrow-right.svg')} className="size-4 -rotate-90 opacity-70 group-hover:opacity-100" />
                    {item.label}
                  </>
                );
                return (
                  <li key={item.url}>
                    {external ? (
                      <a href={item.url} className={className} target="_blank" rel="noreferrer">
                        {content}
                      </a>
                    ) : (
                      <Link to={item.url} className={className}>
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}
