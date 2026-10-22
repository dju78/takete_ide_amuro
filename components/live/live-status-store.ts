"use client";

import { useSyncExternalStore } from "react";
import type { PublicBroadcast } from "@/lib/live/broadcast";

/**
 * One shared poller of /api/live/status for every component on the page (the
 * player hub and the replay list), so status changes and newly published
 * replays reach viewers who already have /live open, with a single request
 * per minute rather than one per component.
 */

const POLL_MS = 60_000;

let latest: PublicBroadcast | null = null;
const listeners = new Set<() => void>();
let timer: number | undefined;

async function poll() {
  if (document.visibilityState !== "visible") return;
  try {
    const res = await fetch("/api/live/status", { cache: "no-store" });
    if (!res.ok) return;
    const next = (await res.json()) as PublicBroadcast;
    if (!next || typeof next.status !== "string" || !Array.isArray(next.replays)) return;
    latest = next;
    listeners.forEach((l) => l());
  } catch {
    // Network blips are expected on event day; keep showing the last known state.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    timer = window.setInterval(poll, POLL_MS);
    document.addEventListener("visibilitychange", poll);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", poll);
    }
  };
}

/** Latest public broadcast state; `initial` (server-rendered) until a poll returns. */
export function useLiveStatus(initial: PublicBroadcast): PublicBroadcast {
  return useSyncExternalStore(
    subscribe,
    () => latest ?? initial,
    () => initial,
  );
}
