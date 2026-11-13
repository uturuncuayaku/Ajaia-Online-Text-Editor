import { PrismaClient } from "@prisma/client";

export async function ensureSeeded(prisma: PrismaClient) {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) return;

    console.log("🌱 Database is empty. Seeding initial users and documents...");

    // Create seeded users
    const alice = await prisma.user.create({
      data: {
        id: "user-alice",
        name: "Alice Johnson",
        email: "alice@ajaia.com",
      },
    });

    const bob = await prisma.user.create({
      data: {
        id: "user-bob",
        name: "Bob Smith",
        email: "bob@ajaia.com",
      },
    });

    const charlie = await prisma.user.create({
      data: {
        id: "user-charlie",
        name: "Charlie Davis",
        email: "charlie@ajaia.com",
      },
    });

    // Create sample document 1
    const doc1 = await prisma.document.create({
      data: {
        title: "Welcome to Ajaia Docs",
        content: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Welcome to Ajaia Docs" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This is a collaborative document editor built for Ajaia LLC. You can create, edit, and share documents with your team.",
                },
              ],
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Core Features" }],
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", marks: [{ type: "bold" }], text: "Rich Text Editing" },
                        { type: "text", text: " — Bold, italic, underline, headings, and lists." },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", marks: [{ type: "bold" }], text: "File Import" },
                        { type: "text", text: " — Convert .txt and .md files into live drafts." },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", marks: [{ type: "bold" }], text: "Access Control" },
                        { type: "text", text: " — Share documents with Viewer vs Editor permissions." },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        ownerId: alice.id,
      },
    });

    // Create sample document 2
    const doc2 = await prisma.document.create({
      data: {
        title: "Project Roadmap Q1",
        content: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Project Roadmap — Q1 2027" }],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Key milestones and deliverables for the engineering team." },
              ],
            },
          ],
        }),
        ownerId: bob.id,
      },
    });

    // Shares
    await prisma.share.createMany({
      data: [
        { documentId: doc1.id, userId: bob.id, permission: "editor" },
        { documentId: doc1.id, userId: charlie.id, permission: "viewer" },
        { documentId: doc2.id, userId: alice.id, permission: "viewer" },
      ],
    });

    console.log("✅ Auto-seeding completed.");
  } catch (err) {
    console.error("Auto-seed error:", err);
  }
}
