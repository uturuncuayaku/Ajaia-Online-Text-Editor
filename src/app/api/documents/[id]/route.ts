import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const doc = await prisma.document.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (userId) {
      const isOwner = doc.ownerId === userId;
      const share = doc.shares.find((s) => s.userId === userId);

      if (!isOwner && !share) {
        return NextResponse.json(
          { error: "Access denied. You do not have permission to view this document." },
          { status: 403 }
        );
      }

      const permission = isOwner ? "owner" : share?.permission || "viewer";

      return NextResponse.json({
        ...doc,
        isOwner,
        permission,
      });
    }

    return NextResponse.json(doc);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, content, userId } = body;

    const doc = await prisma.document.findUnique({
      where: { id },
      include: { shares: true },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (userId) {
      const isOwner = doc.ownerId === userId;
      const share = doc.shares.find((s) => s.userId === userId);
      const canEdit = isOwner || share?.permission === "editor";

      if (!canEdit) {
        return NextResponse.json(
          { error: "Forbidden: You only have read access to this document." },
          { status: 403 }
        );
      }
    }

    const updated = await prisma.document.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title: title.trim() || "Untitled Document" } : {}),
        ...(content !== undefined
          ? { content: typeof content === "string" ? content : JSON.stringify(content) }
          : {}),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const doc = await prisma.document.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Only document owner can delete
    if (userId && doc.ownerId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: Only the document owner can delete this document." },
        { status: 403 }
      );
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
