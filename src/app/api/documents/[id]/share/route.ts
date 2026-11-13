import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { ownerId, targetUserId, permission = "viewer" } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
    }

    if (!["viewer", "editor"].includes(permission)) {
      return NextResponse.json({ error: "Permission must be 'viewer' or 'editor'" }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check ownership
    if (ownerId && doc.ownerId !== ownerId) {
      return NextResponse.json(
        { error: "Forbidden: Only the document owner can share this document" },
        { status: 403 }
      );
    }

    // Cannot share with yourself
    if (doc.ownerId === targetUserId) {
      return NextResponse.json(
        { error: "Owner already has full access to this document" },
        { status: 400 }
      );
    }

    // Upsert share record
    const share = await prisma.share.upsert({
      where: {
        documentId_userId: {
          documentId: id,
          userId: targetUserId,
        },
      },
      update: {
        permission,
      },
      create: {
        documentId: id,
        userId: targetUserId,
        permission,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(share, { status: 200 });
  } catch (error) {
    console.error("Error sharing document:", error);
    return NextResponse.json({ error: "Failed to share document" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");
    const targetUserId = searchParams.get("targetUserId");

    if (!targetUserId) {
      return NextResponse.json({ error: "targetUserId query param is required" }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (ownerId && doc.ownerId !== ownerId) {
      return NextResponse.json(
        { error: "Forbidden: Only the document owner can revoke access" },
        { status: 403 }
      );
    }

    await prisma.share.deleteMany({
      where: {
        documentId: id,
        userId: targetUserId,
      },
    });

    return NextResponse.json({ message: "Share revoked successfully" });
  } catch (error) {
    console.error("Error revoking share:", error);
    return NextResponse.json({ error: "Failed to revoke share" }, { status: 500 });
  }
}
