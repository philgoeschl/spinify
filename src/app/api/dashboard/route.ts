import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import { getDailySuggestions } from "@/lib/suggestion";
import { toDateString } from "@/lib/utils";

export async function GET() {
  try {
    const user = await requireAuth();

    const vinyls = await prisma.vinyl.findMany({
      where: { userId: user.id },
      include: {
        playLogs: {
          orderBy: { playedAt: "desc" },
          take: 1,
        },
        _count: { select: { playLogs: true } },
      },
    });

    const mapped = vinyls.map((v) => ({
      id: v.id,
      artist: v.artist,
      album: v.album,
      year: v.year,
      userId: v.userId,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
      lastPlayedAt: v.playLogs[0]?.playedAt?.toISOString() ?? null,
      playCount: v._count.playLogs,
    }));

    const lastPlayed = [...mapped]
      .filter((v) => v.lastPlayedAt !== null)
      .sort((a, b) => new Date(b.lastPlayedAt!).getTime() - new Date(a.lastPlayedAt!).getTime())
      .slice(0, 10);

    const today = toDateString(new Date());
    const suggested = getDailySuggestions(user.id, today, mapped, 5);

    return NextResponse.json({ lastPlayed, suggested });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
