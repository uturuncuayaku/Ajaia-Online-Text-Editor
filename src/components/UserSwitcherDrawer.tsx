"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import { X, Check, ShieldCheck, FileText, Share2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function UserSwitcherDrawer() {
  const { isDrawerOpen, closeDrawer, users, currentUser, switchUser } = useUser();

  if (!isDrawerOpen) return null;

  const handleSelectUser = (userId: string, userName: string) => {
    switchUser(userId);
    toast.success(`Switched active user to ${userName}`, {
      icon: "👤",
      style: {
        background: "#001d6b",
        color: "#f1f7ff",
        border: "1px solid rgba(151, 194, 248, 0.3)",
      },
    });
    closeDrawer();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarGradient = (userId: string) => {
    if (userId === "user-alice") return "from-blue-600 to-indigo-700 text-white";
    if (userId === "user-bob") return "from-purple-600 to-pink-700 text-white";
    return "from-teal-600 to-cyan-700 text-white";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop scrim */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#020612]/95 backdrop-blur-2xl border-l border-white/15 text-[#f1f7ff] shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#001d6b] flex items-center justify-center border border-[#97c2f8]/40 shadow-[0_0_15px_rgba(151,194,248,0.25)]">
                  <Sparkles className="w-4 h-4 text-[#97c2f8]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight">Switch Persona</h2>
                  <p className="text-xs text-[#97c2f8]/80">Simulated multi-user session</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close user switcher"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-zinc-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#97c2f8] shrink-0 mt-0.5" />
              <p>
                Switching users alters document ownership and permissions immediately, demonstrating Google Docs-style access controls.
              </p>
            </div>

            {/* User list */}
            <div className="mt-6 space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 px-1">
                Select Team Member
              </p>

              {users.map((user) => {
                const isActive = currentUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user.id, user.name)}
                    className={`group relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-[#001d6b]/35 border-[#97c2f8] shadow-[0_0_20px_rgba(151,194,248,0.2)]"
                        : "bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm bg-gradient-to-tr shadow-md ${getAvatarGradient(
                            user.id
                          )}`}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-white group-hover:text-[#97c2f8] transition-colors">
                              {user.name}
                            </span>
                            {isActive && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#97c2f8]/20 text-[#97c2f8] border border-[#97c2f8]/40">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-400 block">{user.email}</span>
                        </div>
                      </div>

                      {isActive ? (
                        <div className="w-6 h-6 rounded-full bg-[#97c2f8] text-[#001d6b] flex items-center justify-center shadow">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                          Switch →
                        </span>
                      )}
                    </div>

                    {/* Role & stats */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="text-zinc-300 font-medium">{user.roleTitle}</span>
                      <div className="flex items-center gap-3">
                        {user._count && (
                          <>
                            <span className="flex items-center gap-1" title="Owned documents">
                              <FileText className="w-3 h-3 text-[#97c2f8]" />
                              {user._count.ownedDocuments} owned
                            </span>
                            <span className="flex items-center gap-1" title="Shared with user">
                              <Share2 className="w-3 h-3 text-purple-400" />
                              {user._count.shares} shared
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-white/10 text-xs text-zinc-400 text-center">
            <p>Ajaia Online Text Editor · Simulated Auth Session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
