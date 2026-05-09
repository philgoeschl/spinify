import type { VinylWithLastPlay } from "@/types";

const CACHE_KEY = "spinify_vinyls";

interface VinylCache {
  data: VinylWithLastPlay[];
  hash: string;
  cachedAt: number;
}

export function getCachedVinyls(): VinylCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VinylCache;
  } catch {
    return null;
  }
}

export function setCachedVinyls(data: VinylWithLastPlay[], hash: string): void {
  if (typeof window === "undefined") return;
  try {
    const cache: VinylCache = { data, hash, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage unavailable (private mode, quota exceeded, etc.)
  }
}

export function clearVinylCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}
