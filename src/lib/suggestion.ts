import type { VinylWithLastPlay } from "@/types";

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function mulberry32(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getDailySuggestions(
  userId: string,
  dateStr: string,
  vinyls: VinylWithLastPlay[],
  count = 5
): VinylWithLastPlay[] {
  if (vinyls.length === 0) return [];

  const seed = djb2(`${userId}:${dateStr}`);
  const rand = mulberry32(seed);

  const today = new Date(dateStr);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const eligible = vinyls.filter(
    (v) => !v.lastPlayedAt || new Date(v.lastPlayedAt) < sevenDaysAgo
  );

  const pool = eligible.length > 0 ? shuffle(eligible, rand) : shuffle(vinyls, rand);
  return pool.slice(0, count);
}
