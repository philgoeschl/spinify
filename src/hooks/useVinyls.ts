"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { getCachedVinyls, setCachedVinyls } from "@/lib/vinyl-cache";
import type { VinylWithLastPlay, VinylsResponse } from "@/types";

const KEY = "/api/vinyls";

async function fetchVinyls(): Promise<VinylWithLastPlay[]> {
  const cached = getCachedVinyls();
  const url = cached ? `${KEY}?hash=${cached.hash}` : KEY;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch vinyls");

  const data = await res.json();

  if (data.unchanged) {
    return cached!.data;
  }

  const { vinyls, hash } = data as VinylsResponse;
  setCachedVinyls(vinyls, hash);
  return vinyls;
}

export function useVinyls() {
  const cached = getCachedVinyls();
  const { data, error, isLoading, mutate } = useSWR<VinylWithLastPlay[]>(KEY, fetchVinyls, {
    revalidateOnFocus: false,
    fallbackData: cached?.data as VinylWithLastPlay[] | undefined,
  });

  async function invalidate() {
    await mutate();
    await globalMutate("/api/dashboard");
  }

  return {
    vinyls: data ?? [],
    isLoading,
    error,
    mutate: invalidate,
  };
}
