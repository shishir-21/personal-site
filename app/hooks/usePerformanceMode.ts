"use client";

import { useSyncExternalStore } from "react";

interface PerformanceMode {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  shouldReduceAnimations: boolean;
}

let cachedSnapshot: PerformanceMode | null = null;

function getSnapshot(): PerformanceMode {
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (
    cachedSnapshot &&
    cachedSnapshot.isMobile === isMobile &&
    cachedSnapshot.prefersReducedMotion === prefersReducedMotion
  ) {
    return cachedSnapshot;
  }
  cachedSnapshot = { isMobile, prefersReducedMotion, shouldReduceAnimations: isMobile || prefersReducedMotion };
  return cachedSnapshot;
}

// Stable server snapshot — safe default for SSR/hydration
const serverSnapshot: PerformanceMode = {
  isMobile: false,
  prefersReducedMotion: false,
  shouldReduceAnimations: false,
};

function subscribe(callback: () => void): () => void {
  window.addEventListener("resize", callback);

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", callback);
  } else {
    // Fallback for older browsers
    motionQuery.addListener(callback);
  }

  return () => {
    window.removeEventListener("resize", callback);
    if (motionQuery.removeEventListener) {
      motionQuery.removeEventListener("change", callback);
    } else {
      motionQuery.removeListener(callback);
    }
  };
}

/**
 * Hook to detect performance constraints and accessibility preferences.
 * Combines viewport detection (for performance) with prefers-reduced-motion (for accessibility).
 * This is the production-standard hybrid approach used by apps like Stripe and Notion.
 */
export function usePerformanceMode(): PerformanceMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
