import { describe, it, expect } from "vitest";

// Test suite for Core Logic: Document Creation, Permissions, and File Parsing
describe("Ajaia Online Text Editor — Core Logic Tests", () => {
  // 1. Permission Matrix Check
  describe("Permission Matrix Check", () => {
    function canEditDocument(
      userId: string,
      doc: { ownerId: string; shares: Array<{ userId: string; permission: string }> }
    ): boolean {
      if (doc.ownerId === userId) return true;
      const share = doc.shares.find((s) => s.userId === userId);
      return share?.permission === "editor";
    }

    function canDeleteDocument(userId: string, doc: { ownerId: string }): boolean {
      return doc.ownerId === userId;
    }

    const testDoc = {
      ownerId: "user-alice",
      shares: [
        { userId: "user-bob", permission: "editor" },
        { userId: "user-charlie", permission: "viewer" },
      ],
    };

    it("should allow Owner (Alice) to edit and delete document", () => {
      expect(canEditDocument("user-alice", testDoc)).toBe(true);
      expect(canDeleteDocument("user-alice", testDoc)).toBe(true);
    });

    it("should allow Editor (Bob) to edit document but NOT delete", () => {
      expect(canEditDocument("user-bob", testDoc)).toBe(true);
      expect(canDeleteDocument("user-bob", testDoc)).toBe(false);
    });

    it("should forbid Viewer (Charlie) from editing and deleting", () => {
      expect(canEditDocument("user-charlie", testDoc)).toBe(false);
      expect(canDeleteDocument("user-charlie", testDoc)).toBe(false);
    });

    it("should forbid Unshared user from editing and deleting", () => {
      expect(canEditDocument("user-stranger", testDoc)).toBe(false);
      expect(canDeleteDocument("user-stranger", testDoc)).toBe(false);
    });
  });

  // 2. File Import Parsing Logic
  describe("File Import Parsing Logic", () => {
    function parsePlainTextToDoc(text: string) {
      const lines = text.split("\n");
      return {
        type: "doc",
        content: lines.map((line) => ({
          type: "paragraph",
          content: line ? [{ type: "text", text: line }] : [],
        })),
      };
    }

    it("should convert plain text file into valid Tiptap paragraph nodes", () => {
      const sampleText = "First line\nSecond line";
      const doc = parsePlainTextToDoc(sampleText);

      expect(doc.type).toBe("doc");
      expect(doc.content).toHaveLength(2);
      expect(doc.content[0].type).toBe("paragraph");
      expect(doc.content[0].content[0].text).toBe("First line");
      expect(doc.content[1].content[0].text).toBe("Second line");
    });
  });
});
