import { useEffect, type RefObject } from "react";

/**
 * Writes the scroll progress of an element through the viewport into its CSS
 * variables: --p is 0 as its top enters from below, 0.5 when it is centred and
 * 1 as its bottom leaves above; --peak is 1 when it is centred, 0 at the ends.
 * Only while `live`, once per frame, and never with "reduce motion": the 3D
 * objects read them to move as the page scrolls.
 */
export function useScrollProgress(ref: RefObject<HTMLElement>, live: boolean) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !live) return;
    const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (motion?.matches) {
      element.style.setProperty("--p", "0.5");
      element.style.setProperty("--peak", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = (viewport - rect.top) / (viewport + rect.height);
      const p = Math.min(1, Math.max(0, progress));
      element.style.setProperty("--p", p.toFixed(4));
      // 1 when the element is centred, 0 at either end: how open the objects are.
      element.style.setProperty("--peak", (1 - Math.abs(p - 0.5) * 2).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref, live]);
}
