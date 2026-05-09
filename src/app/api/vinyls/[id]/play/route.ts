import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const vinyl = await prisma.vinyl.findFirst({ where: { id, userId: user.id } });
    if (!vinyl) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const log = await prisma.playLog.create({
      data: { vinylId: id, userId: user.id, playedAt: today },
    });

    return NextResponse.json({
      ...log,
      playedAt: log.playedAt.toISOString(),
      createdAt: log.createdAt.toISOString(),
    }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
