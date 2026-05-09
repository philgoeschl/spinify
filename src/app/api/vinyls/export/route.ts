import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import { toDateString } from "@/lib/utils";

export async function GET() {
  try {
    const user = await requireAuth();

    const vinyls = await prisma.vinyl.findMany({
      where: { userId: user.id },
      orderBy: [{ artist: "asc" }, { album: "asc" }],
      include: {
        playLogs: { orderBy: { playedAt: "asc" } },
      },
    });

    const rows = vinyls.map((v) => {
      const playDates = v.playLogs.map((p) => toDateString(new Date(p.playedAt))).join("|");
      return [
        `"${v.artist.replace(/"/g, '""')}"`,
        `"${v.album.replace(/"/g, '""')}"`,
        v.year,
        `"${playDates}"`,
      ].join(",");
    });

    const csv = ["artist,album,year,play_dates", ...rows].join("\n");
    const dateStr = toDateString(new Date());

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="spinify-export-${dateStr}.csv"`,
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
