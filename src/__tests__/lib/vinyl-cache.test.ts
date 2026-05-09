import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCachedVinyls, setCachedVinyls, clearVinylCache } from "@/lib/vinyl-cache";
import type { VinylWithLastPlay } from "@/types";

const mockVinyl: VinylWithLastPlay = {
  id: "1",
  artist: "Test",
  album: "Album",
  year: 2000,
  userId: "u1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastPlayedAt: null,
  playCount: 0,
};

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = val; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

beforeEach(() => {
  mockStorage.clear();
  vi.stubGlobal("localStorage", mockStorage);
});

describe("vinyl-cache", () => {
  it("returns null when nothing cached", () => {
    expect(getCachedVinyls()).toBeNull();
  });

  it("stores and retrieves vinyls", () => {
    setCachedVinyls([mockVinyl], "abc123");
    const cached = getCachedVinyls();
    expect(cached).not.toBeNull();
    expect(cached!.data).toHaveLength(1);
    expect(cached!.hash).toBe("abc123");
  });

  it("clears cache", () => {
    setCachedVinyls([mockVinyl], "abc123");
    clearVinylCache();
    expect(getCachedVinyls()).toBeNull();
  });

  it("handles corrupt cache gracefully", () => {
    mockStorage.setItem("spinify_vinyls", "{invalid json}");
    expect(getCachedVinyls()).toBeNull();
  });
});
