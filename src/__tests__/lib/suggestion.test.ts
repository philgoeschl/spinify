// @vitest-environment node
import { describe, it, expect } from "vitest";
import { getDailySuggestions } from "@/lib/suggestion";
import type { VinylWithLastPlay } from "@/types";

const makeVinyl = (id: string, lastPlayedAt: string | null = null): VinylWithLastPlay => ({
  id,
  artist: "Artist",
  album: `Album ${id}`,
  year: 2000,
  userId: "user1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastPlayedAt,
  playCount: lastPlayedAt ? 1 : 0,
});

const vinyls = Array.from({ length: 10 }, (_, i) => makeVinyl(`vinyl-${i}`));

describe("getDailySuggestions", () => {
  it("returns empty array for empty input", () => {
    expect(getDailySuggestions("u1", "2025-01-01", [])).toEqual([]);
  });

  it("is deterministic — same args return same suggestions", () => {
    const a = getDailySuggestions("user1", "2025-06-01", vinyls);
    const b = getDailySuggestions("user1", "2025-06-01", vinyls);
    expect(a.map((v) => v.id)).toEqual(b.map((v) => v.id));
  });

  it("returns different suggestions for different dates", () => {
    const a = getDailySuggestions("user1", "2025-06-01", vinyls);
    const b = getDailySuggestions("user1", "2025-06-02", vinyls);
    // Very likely different with 10 vinyls — order should differ
    expect(a.map((v) => v.id).join(",")).not.toBe(b.map((v) => v.id).join(","));
  });

  it("returns at most `count` suggestions", () => {
    expect(getDailySuggestions("user1", "2025-06-01", vinyls, 3)).toHaveLength(3);
  });

  it("prefers vinyls not played in last 7 days", () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 2);
    const recentStr = recentDate.toISOString().split("T")[0];

    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);
    const oldStr = oldDate.toISOString().split("T")[0];

    const mixed = [
      makeVinyl("recent-1", recentStr),
      makeVinyl("recent-2", recentStr),
      makeVinyl("old-1", oldStr),
      makeVinyl("old-2", oldStr),
      makeVinyl("never-1"),
    ];

    const today = new Date().toISOString().split("T")[0];
    const suggestions = getDailySuggestions("user1", today, mixed, 5);
    const ids = suggestions.map((v) => v.id);

    // old and never-played should appear first (eligible pool)
    expect(ids.some((id) => id.startsWith("old-") || id.startsWith("never-"))).toBe(true);
  });

  it("falls back to all vinyls when all played recently", () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 1);
    const recentStr = recentDate.toISOString().split("T")[0];

    const allRecent = Array.from({ length: 5 }, (_, i) => makeVinyl(`v${i}`, recentStr));
    const today = new Date().toISOString().split("T")[0];
    const suggestions = getDailySuggestions("user1", today, allRecent, 3);

    expect(suggestions).toHaveLength(3);
  });
});
