import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSeeded } from "@/lib/seedHelper";

export async function GET(request: NextRequest) {
  try {
    await ensureSeeded(prisma);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId parameter is required" }, { status: 400 });
    }

    // Documents owned by user
    const ownedDocs = await prisma.document.findMany({
      where: { ownerId: userId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Documents shared with user
    const sharedShares = await prisma.share.findMany({
      where: { userId },
      include: {
        document: {
          include: {
            owner: { select: { id: true, name: true, email: true } },
            shares: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedOwned = ownedDocs.map((doc) => ({
      ...doc,
      isOwner: true,
      permission: "owner" as const,
    }));

    const formattedShared = sharedShares.map((share) => ({
      ...share.document,
      isOwner: false,
      permission: share.permission as "viewer" | "editor",
    }));

    return NextResponse.json({
      owned: formattedOwned,
      shared: formattedShared,
      all: [...formattedOwned, ...formattedShared],
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, ownerId } = body;

    if (!ownerId) {
      return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
    }

    // Default empty Tiptap document content
    const initialContent =
      content ||
      JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [],
          },
        ],
      });

    const doc = await prisma.document.create({
      data: {
        title: title?.trim() || "Untitled Document",
        content: typeof initialContent === "string" ? initialContent : JSON.stringify(initialContent),
        ownerId,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: true,
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
