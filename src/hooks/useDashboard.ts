"use client";

import useSWR from "swr";
import type { DashboardData } from "@/types";

async function fetcher(url: string): Promise<DashboardData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>("/api/dashboard", fetcher, {
    revalidateOnFocus: false,
  });

  return {
    lastPlayed: data?.lastPlayed ?? [],
    suggested: data?.suggested ?? [],
    isLoading,
    error,
    mutate,
  };
}
