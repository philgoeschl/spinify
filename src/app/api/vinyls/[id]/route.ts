import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const vinyl = await prisma.vinyl.findFirst({
      where: { id, userId: user.id },
      include: {
        playLogs: { orderBy: { playedAt: "desc" } },
        _count: { select: { playLogs: true } },
      },
    });

    if (!vinyl) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...vinyl,
      createdAt: vinyl.createdAt.toISOString(),
      updatedAt: vinyl.updatedAt.toISOString(),
      lastPlayedAt: vinyl.playLogs[0]?.playedAt?.toISOString() ?? null,
      playCount: vinyl._count.playLogs,
      playLogs: vinyl.playLogs.map((p) => ({
        ...p,
        playedAt: p.playedAt.toISOString(),
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const vinyl = await prisma.vinyl.findFirst({ where: { id, userId: user.id } });
    if (!vinyl) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.vinyl.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
