"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { X, UserPlus, Trash2, Shield, Eye, Edit3, Check } from "lucide-react";
import toast from "react-hot-toast";

interface ShareModalProps {
  documentId: string;
  documentTitle: string;
  shares: Array<{
    id: string;
    userId: string;
    permission: string;
    user: { id: string; name: string; email: string };
  }>;
  ownerId: string;
  isOpen: boolean;
  onClose: () => void;
  onShareUpdated: () => void;
}

export default function ShareModal({
  documentId,
  documentTitle,
  shares,
  ownerId,
  isOpen,
  onClose,
  onShareUpdated,
}: ShareModalProps) {
  const { users, currentUser } = useUser();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [permission, setPermission] = useState<"viewer" | "editor">("viewer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Available users to share with (exclude owner and users already shared with)
  const availableUsers = users.filter(
    (u) => u.id !== ownerId && !shares.some((s) => s.userId === u.id)
  );

  const isOwner = currentUser?.id === ownerId;

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a team member");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: currentUser?.id,
          targetUserId: selectedUserId,
          permission,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to grant share permission");
      }

      toast.success("Document shared successfully!");
      setSelectedUserId("");
      onShareUpdated();
    } catch (err: any) {
      toast.error(err.message || "Failed to share document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (targetUserId: string, userName: string) => {
    try {
      const res = await fetch(
        `/api/documents/${documentId}/share?ownerId=${currentUser?.id}&targetUserId=${targetUserId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to revoke share");
      }

      toast.success(`Removed access for ${userName}`);
      onShareUpdated();
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke access");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-[#030919] border border-white/15 p-6 shadow-2xl text-[#f1f7ff] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Share &quot;{documentTitle}&quot;
              </h3>
              <p className="text-xs text-[#97c2f8]">Manage collaborator permissions</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form to grant access (Only if current user is owner) */}
          {isOwner ? (
            <form onSubmit={handleGrantAccess} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Select Team Member
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#97c2f8] transition-colors"
                  >
                    <option value="" className="bg-[#030919] text-zinc-400">
                      Choose someone...
                    </option>
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id} className="bg-[#030919] text-white">
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Role</label>
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value as "viewer" | "editor")}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#97c2f8] transition-colors"
                  >
                    <option value="viewer" className="bg-[#030919]">
                      Viewer
                    </option>
                    <option value="editor" className="bg-[#030919]">
                      Editor
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedUserId}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#97c2f8] hover:bg-[#b5d5fb] disabled:opacity-50 text-[#001d6b] font-medium px-4 py-2 text-sm transition-all shadow-[0_0_15px_rgba(151,194,248,0.25)] cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? "Sharing..." : "Grant Access"}</span>
              </button>
            </form>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200">
              Only the document owner can grant or revoke collaborator access.
            </div>
          )}

          {/* Current Collaborators */}
          <div className="mt-6">
            <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">
              People with access
            </h4>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {/* Owner Item */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center text-xs font-bold text-white">
                    {users.find((u) => u.id === ownerId)?.name[0] || "O"}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">
                      {users.find((u) => u.id === ownerId)?.name || "Owner"}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {users.find((u) => u.id === ownerId)?.email}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-[#97c2f8] border border-blue-500/30">
                  <Shield className="w-3 h-3" /> Owner
                </span>
              </div>

              {/* Shared users */}
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600/70 flex items-center justify-center text-xs font-bold text-white">
                      {share.user.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{share.user.name}</p>
                      <p className="text-[10px] text-zinc-400">{share.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        share.permission === "editor"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      }`}
                    >
                      {share.permission === "editor" ? (
                        <>
                          <Edit3 className="w-3 h-3" /> Editor
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" /> Viewer
                        </>
                      )}
                    </span>

                    {isOwner && (
                      <button
                        onClick={() => handleRevoke(share.userId, share.user.name)}
                        className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Revoke access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {shares.length === 0 && (
                <p className="text-xs text-zinc-400 py-3 text-center">
                  This document hasn&apos;t been shared with anyone yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
