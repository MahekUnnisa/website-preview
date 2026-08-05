import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NAV_OFFSET = 64; // fixed navbar height (h-16), so anchors don't land underneath it
const MAX_FRAMES = 60; // ~1s of retries, enough for a lazy route chunk to mount

/**
 * Owns scroll position across navigation.
 *
 * - No hash: jump to the top of the new page.
 * - `#anchor`: scroll to that element, offset for the fixed navbar. The target may
 *   live in a route that is still being fetched, so it retries until it appears.
 *
 * Keyed on `key` as well as the path so repeat clicks on the same link re-scroll.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    const target = hash.slice(1);

    // Ignore non-anchor fragments — /partner/success carries its OAuth payload here.
    if (!target || /[^\w-]/.test(target)) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    let frame;
    let attempts = 0;

    const scrollToAnchor = () => {
      const el = document.getElementById(target);
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, behavior });
        return;
      }
      if (attempts++ < MAX_FRAMES) frame = requestAnimationFrame(scrollToAnchor);
    };

    frame = requestAnimationFrame(scrollToAnchor);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
}

export default ScrollManager;
