import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import { computeVinylsHash } from "@/lib/hash";
import { VinylSchema } from "@/schemas/vinyl";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const clientHash = req.nextUrl.searchParams.get("hash");

    const vinyls = await prisma.vinyl.findMany({
      where: { userId: user.id },
      orderBy: { id: "asc" },
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

    const hash = computeVinylsHash(mapped);

    if (clientHash && clientHash === hash) {
      return NextResponse.json({ unchanged: true, hash });
    }

    return NextResponse.json({ vinyls: mapped, hash });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const parsed = VinylSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const vinyl = await prisma.vinyl.create({
      data: { ...parsed.data, userId: user.id },
    });

    return NextResponse.json(vinyl, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
