import { useEffect, useRef, useState } from "react";

/**
 * Whether an element has been seen (to play its entrance once) and whether it
 * is on screen now (to pause its animations when it is not). Without
 * IntersectionObserver everything counts as seen.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [state, setState] = useState(() => ({ seen: false, live: false }));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setState({ seen: true, live: true });
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setState((s) => ({ seen: s.seen || entry.isIntersecting, live: entry.isIntersecting })),
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, state] as const;
}
