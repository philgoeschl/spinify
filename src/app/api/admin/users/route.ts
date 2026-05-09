import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { vinyls: true, playLogs: true } },
      },
    });

    return NextResponse.json(
      users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        vinylCount: u._count.vinyls,
        playCount: u._count.playLogs,
      }))
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Forbidden" ? 403 : 401 });
  }
}
