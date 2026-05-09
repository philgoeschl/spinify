// @vitest-environment node
import { describe, it, expect } from "vitest";
import { computeVinylsHash } from "@/lib/hash";
import type { Vinyl } from "@/types";

const makeVinyl = (id: string): Vinyl => ({
  id,
  artist: "Test Artist",
  album: "Test Album",
  year: 2000,
  userId: "user1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe("computeVinylsHash", () => {
  it("returns same hash for same input", () => {
    const vinyls = [makeVinyl("a"), makeVinyl("b")];
    expect(computeVinylsHash(vinyls)).toBe(computeVinylsHash(vinyls));
  });

  it("returns same hash regardless of input order", () => {
    const a = makeVinyl("a");
    const b = makeVinyl("b");
    expect(computeVinylsHash([a, b])).toBe(computeVinylsHash([b, a]));
  });

  it("returns different hash when vinyl is added", () => {
    const vinyls = [makeVinyl("a")];
    const withExtra = [makeVinyl("a"), makeVinyl("b")];
    expect(computeVinylsHash(vinyls)).not.toBe(computeVinylsHash(withExtra));
  });

  it("returns empty-string hash for empty array consistently", () => {
    expect(computeVinylsHash([])).toBe(computeVinylsHash([]));
  });
});
