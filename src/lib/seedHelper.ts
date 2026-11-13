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

    // 1. Alice Doc 1: Welcome to Ajaia Docs
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
              content: [{ type: "text", text: "Core Capabilities" }],
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

    // 2. Alice Doc 2: Product Strategy & Guidelines
    const docAlice2 = await prisma.document.create({
      data: {
        title: "Product Strategy & Guidelines",
        content: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Product Strategy & Team Principles" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Our core mission is delivering rapid, AI-native internal tools with clear scope and uncompromising quality.",
                },
              ],
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Guiding Principles" }],
            },
            {
              type: "orderedList",
              content: [
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Prioritize depth in critical workflows over superficial breadth." }] }],
                },
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Maintain strict type safety and zero-downtime database migrations." }] }],
                },
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Design intuitive interfaces matching Ajaia's dark aesthetic." }] }],
                },
              ],
            },
          ],
        }),
        ownerId: alice.id,
      },
    });

    // 3. Bob Doc: Project Roadmap Q1
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
            {
              type: "orderedList",
              content: [
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Scaffolding & DB Schema completion" }] }],
                },
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "File upload (.txt/.md) parser integration" }] }],
                },
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Vercel production verification" }] }],
                },
              ],
            },
          ],
        }),
        ownerId: bob.id,
      },
    });

    // 4. Charlie Doc: Design Feedback & UI System
    const docCharlie = await prisma.document.create({
      data: {
        title: "Design System & UX Feedback",
        content: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Design System & UI Notes" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Review of the Ajaia website design tokens: background swirl canvas, sky blue highlights (#97c2f8), and slide-out persona drawer.",
                },
              ],
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Feedback Summary" }],
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Canvas waves maintain 60 FPS performance." }] }],
                },
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "Glassmorphism cards provide strong visual contrast." }] }],
                },
              ],
            },
          ],
        }),
        ownerId: charlie.id,
      },
    });

    // Shares
    await prisma.share.createMany({
      data: [
        { documentId: doc1.id, userId: bob.id, permission: "editor" },
        { documentId: doc1.id, userId: charlie.id, permission: "viewer" },
        { documentId: docAlice2.id, userId: bob.id, permission: "viewer" },
        { documentId: doc2.id, userId: alice.id, permission: "viewer" },
        { documentId: doc2.id, userId: charlie.id, permission: "viewer" },
        { documentId: docCharlie.id, userId: alice.id, permission: "editor" },
        { documentId: docCharlie.id, userId: bob.id, permission: "editor" },
      ],
    });

    console.log("✅ Auto-seeding completed with multi-user documents.");
  } catch (err) {
    console.error("Auto-seed error:", err);
  }
}
