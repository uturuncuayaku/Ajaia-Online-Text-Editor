import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to convert plain text into Tiptap JSON
function textToTiptapJson(text: string) {
  const lines = text.split(/\r?\n/);
  const contentNodes = [];

  for (const line of lines) {
    if (line.trim().length === 0) {
      contentNodes.push({ type: "paragraph", content: [] });
    } else {
      contentNodes.push({
        type: "paragraph",
        content: [{ type: "text", text: line }],
      });
    }
  }

  return {
    type: "doc",
    content: contentNodes.length > 0 ? contentNodes : [{ type: "paragraph", content: [] }],
  };
}

// Helper to convert Markdown into structured Tiptap JSON
function markdownToTiptapJson(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const contentNodes: any[] = [];
  let inBulletList = false;
  let inOrderedList = false;
  let currentListItems: any[] = [];

  const flushList = () => {
    if (inBulletList && currentListItems.length > 0) {
      contentNodes.push({
        type: "bulletList",
        content: [...currentListItems],
      });
      currentListItems = [];
      inBulletList = false;
    }
    if (inOrderedList && currentListItems.length > 0) {
      contentNodes.push({
        type: "orderedList",
        content: [...currentListItems],
      });
      currentListItems = [];
      inOrderedList = false;
    }
  };

  const parseInlineMarks = (rawText: string) => {
    // Simple inline parser for bold and italic
    const marks: any[] = [];
    let text = rawText;

    // Check heading or plain
    return [{ type: "text", text }];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      flushList();
      continue;
    }

    // Heading checks (# H1, ## H2, ### H3)
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h1Match) {
      flushList();
      contentNodes.push({
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: h1Match[1] }],
      });
      continue;
    }

    if (h2Match) {
      flushList();
      contentNodes.push({
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: h2Match[1] }],
      });
      continue;
    }

    if (h3Match) {
      flushList();
      contentNodes.push({
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: h3Match[1] }],
      });
      continue;
    }

    // Bullet list checks (* item, - item)
    const bulletMatch = line.match(/^[\*\-]\s+(.+)$/);
    if (bulletMatch) {
      if (inOrderedList) flushList();
      inBulletList = true;
      currentListItems.push({
        type: "listItem",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: bulletMatch[1] }],
          },
        ],
      });
      continue;
    }

    // Numbered list checks (1. item)
    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      if (inBulletList) flushList();
      inOrderedList = true;
      currentListItems.push({
        type: "listItem",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: orderedMatch[1] }],
          },
        ],
      });
      continue;
    }

    // Blockquote
    const quoteMatch = line.match(/^>\s*(.+)$/);
    if (quoteMatch) {
      flushList();
      contentNodes.push({
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: quoteMatch[1] }],
          },
        ],
      });
      continue;
    }

    // Default paragraph
    flushList();
    contentNodes.push({
      type: "paragraph",
      content: [{ type: "text", text: line }],
    });
  }

  flushList();

  return {
    type: "doc",
    content: contentNodes.length > 0 ? contentNodes : [{ type: "paragraph", content: [] }],
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const ownerId = formData.get("ownerId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ownerId) {
      return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
    }

    // Check size limit: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5 MB limit" },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!["txt", "md"].includes(extension || "")) {
      return NextResponse.json(
        { error: "Unsupported file type. Only .txt and .md files are allowed." },
        { status: 400 }
      );
    }

    const fileText = await file.text();
    let tiptapContent;

    if (extension === "md") {
      tiptapContent = markdownToTiptapJson(fileText);
    } else {
      tiptapContent = textToTiptapJson(fileText);
    }

    // Extract title from filename (strip extension)
    const title = fileName.replace(/\.[^/.]+$/, "");

    const newDoc = await prisma.document.create({
      data: {
        title: title || "Imported Document",
        content: JSON.stringify(tiptapContent),
        ownerId,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: true,
      },
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json({ error: "Failed to process file upload" }, { status: 500 });
  }
}
