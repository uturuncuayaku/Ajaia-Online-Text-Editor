import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.share.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();

  // Create seeded users
  const alice = await prisma.user.create({
    data: {
      id: "user-alice",
      name: "Alice Johnson",
      email: "alice@ajaia.com",
      avatarUrl: null,
    },
  });

  const bob = await prisma.user.create({
    data: {
      id: "user-bob",
      name: "Bob Smith",
      email: "bob@ajaia.com",
      avatarUrl: null,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      id: "user-charlie",
      name: "Charlie Davis",
      email: "charlie@ajaia.com",
      avatarUrl: null,
    },
  });

  // Create sample documents
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
            content: [{ type: "text", text: "Features" }],
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
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Rich text editing",
                      },
                      {
                        type: "text",
                        text: " — Bold, italic, underline, headings, and lists",
                      },
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
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "File upload",
                      },
                      {
                        type: "text",
                        text: " — Import .txt and .md files as new documents",
                      },
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
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Sharing",
                      },
                      {
                        type: "text",
                        text: " — Share documents with teammates as viewer or editor",
                      },
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
              {
                type: "text",
                text: "Key milestones and deliverables for the first quarter.",
              },
            ],
          },
          {
            type: "orderedList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Launch internal beta" },
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
                      { type: "text", text: "User feedback collection" },
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
                      { type: "text", text: "Public release preparation" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
      ownerId: bob.id,
    },
  });

  // Share doc1 with Bob (editor) and Charlie (viewer)
  await prisma.share.create({
    data: {
      documentId: doc1.id,
      userId: bob.id,
      permission: "editor",
    },
  });

  await prisma.share.create({
    data: {
      documentId: doc1.id,
      userId: charlie.id,
      permission: "viewer",
    },
  });

  // Share doc2 with Alice (viewer)
  await prisma.share.create({
    data: {
      documentId: doc2.id,
      userId: alice.id,
      permission: "viewer",
    },
  });

  console.log("✅ Seeded users:", [alice.name, bob.name, charlie.name]);
  console.log("✅ Seeded documents:", [doc1.title, doc2.title]);
  console.log("✅ Seeded shares: 3");
  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
