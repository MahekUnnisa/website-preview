import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TRICKLE_MS = 180; // how often the bar creeps forward while loading
const MIN_VISIBLE_MS = 400; // stops the bar flashing when a chunk is already cached
const FINISH_MS = 240; // 100% → faded out; keep >= the CSS transition duration

/** Ease off as the bar fills, and never reach 100% until the page is actually ready. */
function nextProgress(current) {
  if (current >= 90) return current;
  const step = current < 20 ? 8 : current < 50 ? 4 : current < 80 ? 2 : 0.5;
  return Math.min(90, current + step * Math.random());
}

const RouteLoadContext = createContext({ begin: () => {}, end: () => {} });

function ProgressBar({ phase, progress }) {
  if (phase === 'idle') return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 pointer-events-none"
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div
        className={`h-full overflow-hidden bg-purple-400 shadow-[0_0_10px_rgba(107,76,232,0.7)] transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none ${
          phase === 'finishing' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ width: `${progress}%` }}
      >
        {/* Travelling highlight, so a slow chunk still reads as "working". */}
        <div className="h-full w-16 bg-gradient-to-r from-transparent via-purple-100 to-transparent animate-progress-indeterminate motion-reduce:hidden" />
      </div>
    </div>
  );
}

/**
 * Drives a top-of-viewport loading bar across route changes.
 *
 * Progress is tied to the real Suspense lifecycle rather than a timer: navigation
 * starts the bar, and it only completes once the route's chunk has rendered. Must
 * be mounted inside a Router, and wrap the Suspense boundary it reports on.
 */
export function RouteProgressProvider({ children }) {
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | loading | finishing

  const phaseRef = useRef('idle');
  const startedAt = useRef(0);
  const pending = useRef([]); // fallbacks currently mounted
  const timers = useRef([]);
  const isFirstRoute = useRef(true);

  const enterPhase = useCallback((next) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const start = useCallback(() => {
    clearTimers();
    startedAt.current = Date.now();
    setProgress(8);
    enterPhase('loading');
  }, [clearTimers, enterPhase]);

  const complete = useCallback(() => {
    if (phaseRef.current !== 'loading') return;
    const held = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current));
    timers.current.push(
      setTimeout(() => {
        enterPhase('finishing');
        setProgress(100);
        timers.current.push(
          setTimeout(() => {
            enterPhase('idle');
            setProgress(0);
          }, FINISH_MS)
        );
      }, held)
    );
  }, [enterPhase]);

  const begin = useCallback(() => {
    pending.current.push(1);
  }, []);

  const end = useCallback(() => {
    pending.current.pop();
    if (pending.current.length === 0) complete();
  }, [complete]);

  // Effects run child-first, so any Suspense fallback has already registered by
  // the time this runs. An empty queue therefore means the route rendered without
  // suspending (eager page, or a chunk the browser already had) — finish at once.
  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    start();
    if (pending.current.length === 0) complete();
  }, [pathname, start, complete]);

  useEffect(() => {
    if (phase !== 'loading') return undefined;
    const id = setInterval(() => setProgress(nextProgress), TRICKLE_MS);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => clearTimers, [clearTimers]);

  const signal = useMemo(() => ({ begin, end }), [begin, end]);

  return (
    <RouteLoadContext.Provider value={signal}>
      <ProgressBar phase={phase} progress={progress} />
      {children}
    </RouteLoadContext.Provider>
  );
}

/**
 * Suspense fallback that reports load start/end to the progress bar. Reserves
 * viewport height so the footer does not jump while a chunk is in flight.
 */
export function RouteProgressFallback() {
  const { begin, end } = useContext(RouteLoadContext);

  useEffect(() => {
    begin();
    return end;
  }, [begin, end]);

  return <div className="min-h-[60vh]" aria-busy="true" />;
}

export default RouteProgressProvider;
