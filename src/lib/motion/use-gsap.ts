// GSAP loading and motion-preference plumbing.
//
// GSAP and ScrollTrigger are imported dynamically so they stay out of the
// initial bundle: nothing above the fold needs them to render, and a visitor
// who prefers reduced motion never downloads them at all.

"use client";

import { useEffect, useRef, useState } from "react";
import type { gsap as GsapType } from "gsap";

export type Gsap = typeof GsapType;

/** True when the OS asks for reduced motion. Re-evaluates if the user changes it. */
export function usePrefersReducedMotion(): boolean {
  // Assume reduced until proven otherwise, so the very first paint is the
  // static, safe version rather than a flash of animation.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

let gsapPromise: Promise<Gsap> | null = null;

/** Load GSAP + ScrollTrigger once per page, shared across all callers. */
export function loadGsap(): Promise<Gsap> {
  if (!gsapPromise) {
    gsapPromise = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([core, scrollTrigger]) => {
      core.gsap.registerPlugin(scrollTrigger.ScrollTrigger);
      return core.gsap;
    });
  }
  return gsapPromise;
}

/**
 * Run a GSAP setup function against a container element.
 *
 * The callback receives gsap and a context; everything created inside is
 * reverted on unmount via gsap.context, so no tween or ScrollTrigger leaks
 * across a route change. Skipped entirely under reduced motion, which means
 * whatever the markup renders statically is what that visitor sees -- so
 * author the static state as the finished state, never as the "before".
 */
export function useGsapEffect(
  setup: (gsap: Gsap, scope: HTMLElement) => void,
  deps: unknown[] = []
) {
  const scopeRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const scope = scopeRef.current;
    if (!scope) return;

    let context: { revert: () => void } | undefined;
    let cancelled = false;

    loadGsap().then((gsap) => {
      if (cancelled || !scopeRef.current) return;
      context = gsap.context(() => setup(gsap, scope), scope);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return scopeRef;
}
