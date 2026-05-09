import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const user = await requireAuth();

    const logs = await prisma.playLog.findMany({
      where: { userId: user.id },
      orderBy: { playedAt: "desc" },
      include: { vinyl: true },
    });

    return NextResponse.json(
      logs.map((l) => ({
        ...l,
        playedAt: l.playedAt.toISOString(),
        createdAt: l.createdAt.toISOString(),
      }))
    );
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
