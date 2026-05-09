import { createHash } from "crypto";

interface VinylHashable {
  id: string;
  artist: string;
  album: string;
  year: number;
  updatedAt: string;
}

export function computeVinylsHash(vinyls: VinylHashable[]): string {
  const sorted = [...vinyls].sort((a, b) => a.id.localeCompare(b.id));
  const canonical = JSON.stringify(
    sorted.map((v) => ({ id: v.id, artist: v.artist, album: v.album, year: v.year, updatedAt: v.updatedAt }))
  );
  return createHash("sha256").update(canonical).digest("hex");
}
