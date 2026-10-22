"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * Browser-only values read without setState-in-effect. The server snapshot is
 * always null, so server HTML and the first client render match, and the real
 * value appears straight after hydration.
 */
export function useBrowserValue<T>(read: () => T): T | null {
  return useSyncExternalStore(noSubscribe, read, () => null);
}

export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}
