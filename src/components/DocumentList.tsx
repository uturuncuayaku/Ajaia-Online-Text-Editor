"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import {
  FileText,
  Plus,
  Upload,
  Search,
  Users,
  Shield,
  Eye,
  Edit3,
  Clock,
  Sparkles,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

interface DocumentItem {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  updatedAt: string;
  isOwner: boolean;
  permission: "owner" | "editor" | "viewer";
  owner: { id: string; name: string; email: string };
  shares: Array<{ id: string; userId: string; permission: string }>;
}

interface DocumentListProps {
  documents: {
    all: DocumentItem[];
    owned: DocumentItem[];
    shared: DocumentItem[];
  };
  onNewDocument: () => void;
  onOpenUpload: () => void;
  onRefresh: () => void;
}

export default function DocumentList({
  documents,
  onNewDocument,
  onOpenUpload,
  onRefresh,
}: DocumentListProps) {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<"all" | "owned" | "shared">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const currentDocs = documents[activeTab] || [];
  const filteredDocs = currentDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (e: React.MouseEvent, docId: string, docTitle: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete "${docTitle}"?`)) return;

    try {
      const res = await fetch(`/api/documents/${docId}?userId=${currentUser?.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete");
      }

      toast.success("Document deleted");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete document");
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Welcome Banner Styled after Ajaia */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001d6b]/40 via-[#1e1b4b]/30 to-[#000000]/50 backdrop-blur-xl border border-white/15 p-6 sm:p-10 mb-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#97c2f8]/10 border border-[#97c2f8]/30 text-xs font-semibold text-[#97c2f8] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Native Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Collaborative Documents, <span className="text-[#97c2f8]">Intelligently Engineered</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-300">
            Welcome, <strong className="text-white">{currentUser?.name}</strong>. Create rich
            documents, import files, and collaborate across team members with granular access controls.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNewDocument}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#97c2f8] hover:bg-[#b5d5fb] text-[#001d6b] text-sm font-semibold shadow-[0_0_20px_rgba(151,194,248,0.3)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Document</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-sm font-medium transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#97c2f8]" />
              <span>Import .txt / .md</span>
            </button>
          </div>
        </div>

        {/* Ambient accent light */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-[#97c2f8]/10 blur-3xl pointer-events-none" />
      </div>

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#001d6b] text-white border border-[#97c2f8]/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All Documents ({documents.all.length})
          </button>
          <button
            onClick={() => setActiveTab("owned")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "owned"
                ? "bg-[#001d6b] text-white border border-[#97c2f8]/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            My Documents ({documents.owned.length})
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "shared"
                ? "bg-[#001d6b] text-white border border-[#97c2f8]/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Shared With Me ({documents.shared.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#97c2f8] transition-colors"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Create Card Trigger */}
        <div
          onClick={onNewDocument}
          className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#97c2f8]/50 cursor-pointer transition-all duration-200 min-h-[190px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#001d6b]/50 border border-[#97c2f8]/30 group-hover:scale-110 flex items-center justify-center text-[#97c2f8] transition-all">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="mt-3 text-sm font-semibold text-white group-hover:text-[#97c2f8] transition-colors">
            Create blank document
          </span>
          <span className="text-xs text-zinc-400 mt-0.5">Start fresh in rich-text</span>
        </div>

        {/* Document Cards */}
        {filteredDocs.map((doc) => {
          const isDocOwner = currentUser?.id === doc.ownerId;

          return (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#97c2f8]/40 hover:bg-white/[0.07] transition-all duration-200 shadow-lg min-h-[190px]"
            >
              <div>
                {/* Header row: Icon & Permission badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001d6b]/60 border border-[#97c2f8]/30 flex items-center justify-center text-[#97c2f8] group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Access tag */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        doc.permission === "owner"
                          ? "bg-blue-500/20 text-[#97c2f8] border-blue-500/30"
                          : doc.permission === "editor"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      }`}
                    >
                      {doc.permission === "owner" ? (
                        <>
                          <Shield className="w-3 h-3" /> Owner
                        </>
                      ) : doc.permission === "editor" ? (
                        <>
                          <Edit3 className="w-3 h-3" /> Editor
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" /> Viewer
                        </>
                      )}
                    </span>

                    {/* Delete button (Owner only) */}
                    {isDocOwner && (
                      <button
                        onClick={(e) => handleDelete(e, doc.id, doc.title)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white group-hover:text-[#97c2f8] transition-colors truncate">
                  {doc.title}
                </h3>

                {/* Owner info */}
                <p className="text-xs text-zinc-400 mt-1">
                  {isDocOwner ? "Owned by you" : `Owned by ${doc.owner.name}`}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(doc.updatedAt)}
                </span>

                {doc.shares && doc.shares.length > 0 && (
                  <span className="flex items-center gap-1 text-[#97c2f8]">
                    <Users className="w-3 h-3" />
                    {doc.shares.length} shared
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="text-center py-16 rounded-2xl bg-white/[0.02] border border-white/10 mt-6">
          <FileText className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No documents found</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No documents matched "${searchQuery}"`
              : activeTab === "owned"
              ? "You haven't created any documents yet."
              : activeTab === "shared"
              ? "No documents have been shared with your account yet."
              : "No documents available."}
          </p>
          <button
            onClick={onNewDocument}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#97c2f8] text-[#001d6b] text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Create Document
          </button>
        </div>
      )}
    </div>
  );
}
