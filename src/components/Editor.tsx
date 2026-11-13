"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./Toolbar";
import ShareModal from "./ShareModal";
import { useUser } from "@/context/UserContext";
import {
  Share2,
  Trash2,
  CheckCircle,
  Clock,
  ArrowLeft,
  Shield,
  Eye,
  Edit,
  Download,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditorProps {
  initialDocument: {
    id: string;
    title: string;
    content: string;
    ownerId: string;
    owner: { id: string; name: string; email: string };
    shares: Array<{
      id: string;
      userId: string;
      permission: string;
      user: { id: string; name: string; email: string };
    }>;
  };
}

export default function DocumentEditor({ initialDocument }: EditorProps) {
  const router = useRouter();
  const { currentUser } = useUser();

  const [document, setDocument] = useState(initialDocument);
  const [title, setTitle] = useState(initialDocument.title);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Compute permission for current active user
  const isOwner = currentUser?.id === document.ownerId;
  const currentShare = document.shares.find((s) => s.userId === currentUser?.id);
  const permission = isOwner ? "owner" : currentShare?.permission || "viewer";
  const canEdit = isOwner || permission === "editor";

  // Parse initial content JSON
  let parsedContent = null;
  try {
    parsedContent = JSON.parse(document.content);
  } catch (e) {
    parsedContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: document.content || "" }],
        },
      ],
    };
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: canEdit
          ? "Start writing your document..."
          : "You have view-only access to this document.",
      }),
    ],
    content: parsedContent,
    editable: canEdit,
    onUpdate: ({ editor }) => {
      if (!canEdit) return;
      setSaveStatus("unsaved");

      // Auto-save debounced after 1 second
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveDocumentContent(editor.getJSON());
      }, 1000);
    },
  });

  // Re-evaluate editable mode when active user switches
  useEffect(() => {
    if (editor) {
      editor.setEditable(canEdit);
    }
  }, [canEdit, editor]);

  // Persist content to API
  const saveDocumentContent = async (jsonContent: any) => {
    if (!canEdit || !currentUser) return;
    setSaveStatus("saving");

    try {
      const res = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: JSON.stringify(jsonContent),
          userId: currentUser.id,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      setSaveStatus("saved");
    } catch (err) {
      console.error(err);
      setSaveStatus("unsaved");
      toast.error("Auto-save failed");
    }
  };

  // Title update
  const handleTitleBlur = async () => {
    if (!canEdit || !currentUser || title.trim() === document.title) return;
    setSaveStatus("saving");

    try {
      const res = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          userId: currentUser.id,
        }),
      });

      if (!res.ok) throw new Error("Rename failed");
      const updated = await res.json();
      setDocument((prev) => ({ ...prev, title: updated.title }));
      setSaveStatus("saved");
      toast.success("Document renamed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename document");
      setTitle(document.title);
    }
  };

  // Delete document
  const handleDelete = async () => {
    if (!isOwner) return;
    if (!confirm(`Are you sure you want to delete "${document.title}"?`)) return;

    try {
      const res = await fetch(`/api/documents/${document.id}?userId=${currentUser?.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Delete failed");
      }

      toast.success("Document deleted");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete document");
    }
  };

  // Refresh shares
  const refreshDocument = async () => {
    try {
      const res = await fetch(`/api/documents/${document.id}?userId=${currentUser?.id}`);
      if (res.ok) {
        const updated = await res.json();
        setDocument(updated);
      }
    } catch (err) {
      console.error("Failed to refresh document:", err);
    }
  };

  // Export to text file
  const handleExportText = () => {
    if (!editor) return;
    const text = editor.getText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as text file");
  };

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Back to all documents"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              disabled={!canEdit}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="text-xl sm:text-2xl font-bold bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-[#97c2f8] rounded px-1.5 py-0.5 border border-transparent hover:border-white/15 transition-all truncate max-w-sm sm:max-w-md"
              placeholder="Untitled Document"
            />
            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
              <span>Owner: {document.owner.name}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                {saveStatus === "saving" ? (
                  <>
                    <Clock className="w-3 h-3 text-amber-400 animate-spin" /> Saving...
                  </>
                ) : saveStatus === "saved" ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Saved
                  </>
                ) : (
                  <span className="text-amber-400">Unsaved changes</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Permission Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
              isOwner
                ? "bg-blue-500/20 text-[#97c2f8] border-blue-500/30"
                : permission === "editor"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
            }`}
          >
            {isOwner ? (
              <>
                <Shield className="w-3.5 h-3.5" /> Owner
              </>
            ) : permission === "editor" ? (
              <>
                <Edit className="w-3.5 h-3.5" /> Editor
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Viewer Only
              </>
            )}
          </span>

          {/* Export */}
          <button
            onClick={handleExportText}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Download plain text"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#001d6b] hover:bg-[#002a99] border border-[#97c2f8]/40 text-[#97c2f8] text-xs font-semibold shadow-[0_0_15px_rgba(151,194,248,0.2)] transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
            {document.shares.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#97c2f8] text-[#001d6b] text-[10px] font-bold flex items-center justify-center">
                {document.shares.length}
              </span>
            )}
          </button>

          {/* Delete Button (Owner Only) */}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-300 hover:text-red-200 transition-colors cursor-pointer"
              title="Delete document (Owner only)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Viewer Warning Notice if read-only */}
      {!canEdit && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
          <Eye className="w-4 h-4 shrink-0 text-amber-300" />
          <span>
            You have <strong>view-only</strong> permissions for this document. Ask{" "}
            <strong>{document.owner.name}</strong> to grant you Editor access to make changes.
          </span>
        </div>
      )}

      {/* Sticky formatting toolbar */}
      <div className="sticky top-[80px] z-20 mb-4">
        <Toolbar editor={editor} readOnly={!canEdit} />
      </div>

      {/* Rich Text Editor Card */}
      <div className="min-h-[520px] rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/15 p-8 sm:p-12 shadow-2xl transition-all focus-within:border-[#97c2f8]/50">
        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none text-zinc-100 focus:outline-none min-h-[440px]"
        />
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        documentId={document.id}
        documentTitle={document.title}
        shares={document.shares}
        ownerId={document.ownerId}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShareUpdated={refreshDocument}
      />
    </div>
  );
}
