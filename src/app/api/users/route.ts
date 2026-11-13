import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeeded } from "@/lib/seedHelper";

export async function GET() {
  try {
    await ensureSeeded(prisma);

    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            ownedDocuments: true,
            shares: true,
          },
        },
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
