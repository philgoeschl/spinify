import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

function parseCSV(text: string): Array<Record<string, string>> {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing: handles quoted fields with commas
    const values: string[] = [];
    let inQuote = false;
    let current = "";
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"' && !inQuote) { inQuote = true; continue; }
      if (ch === '"' && inQuote) {
        if (line[j + 1] === '"') { current += '"'; j++; continue; }
        inQuote = false; continue;
      }
      if (ch === "," && !inQuote) { values.push(current); current = ""; continue; }
      current += ch;
    }
    values.push(current);

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ""; });
    rows.push(row);
  }

  return rows;
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    let added = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const artist = row.artist?.trim();
      const album = row.album?.trim();
      const yearRaw = row.year?.trim();
      const playDatesRaw = row.play_dates?.trim() ?? "";

      if (!artist || !album || !yearRaw) {
        errors.push(`Skipped row: missing required fields (artist="${artist}", album="${album}", year="${yearRaw}")`);
        skipped++;
        continue;
      }

      const year = parseInt(yearRaw, 10);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        errors.push(`Skipped "${artist} - ${album}": invalid year "${yearRaw}"`);
        skipped++;
        continue;
      }

      // Match by artist + album + year (case-insensitive)
      const existing = await prisma.vinyl.findFirst({
        where: {
          userId: user.id,
          artist: { equals: artist, mode: "insensitive" },
          album: { equals: album, mode: "insensitive" },
          year,
        },
        include: { playLogs: { select: { playedAt: true } } },
      });

      const playDates = playDatesRaw
        ? playDatesRaw.split("|").map((d) => d.trim()).filter(Boolean)
        : [];

      if (!existing) {
        const vinyl = await prisma.vinyl.create({
          data: { artist, album, year, userId: user.id },
        });

        for (const dateStr of playDates) {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            date.setUTCHours(0, 0, 0, 0);
            await prisma.playLog.create({
              data: { vinylId: vinyl.id, userId: user.id, playedAt: date },
            });
          }
        }

        added++;
      } else {
        // Vinyl exists — merge play dates only
        const existingDates = new Set(
          existing.playLogs.map((p) => new Date(p.playedAt).toISOString().split("T")[0])
        );

        let newDates = 0;
        for (const dateStr of playDates) {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) continue;
          date.setUTCHours(0, 0, 0, 0);
          const key = date.toISOString().split("T")[0];
          if (!existingDates.has(key)) {
            await prisma.playLog.create({
              data: { vinylId: existing.id, userId: user.id, playedAt: date },
            });
            newDates++;
          }
        }

        if (newDates > 0) updated++;
        else skipped++;
      }
    }

    return NextResponse.json({ added, updated, skipped, errors });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
