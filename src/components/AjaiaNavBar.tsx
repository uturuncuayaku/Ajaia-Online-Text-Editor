"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Plus, Upload, User, ChevronDown, Menu } from "lucide-react";

interface AjaiaNavBarProps {
  onNewDocument?: () => void;
  onOpenUpload?: () => void;
  isEditing?: boolean;
}

export default function AjaiaNavBar({ onNewDocument, onOpenUpload, isEditing = false }: AjaiaNavBarProps) {
  const { currentUser, openDrawer } = useUser();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full h-[72px] bg-[#000000]/80 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Ajaia Brand Logo & Editor Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Geometric Ajaia Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#001d6b] via-[#1e1b4b] to-[#000] border border-[#97c2f8]/30 flex items-center justify-center shadow-[0_0_15px_rgba(151,194,248,0.2)] group-hover:border-[#97c2f8]/60 transition-all">
              <span className="font-bold text-lg tracking-tighter text-[#97c2f8]">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#97c2f8] transition-colors">
                Ajaia
              </span>
              <span className="text-[10px] tracking-wider uppercase text-zinc-400 font-medium">
                Online Text Editor
              </span>
            </div>
          </Link>

          <span className="hidden md:inline-block w-px h-6 bg-white/15 mx-1" />

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                !isEditing
                  ? "text-[#97c2f8] bg-white/5 font-medium"
                  : "text-zinc-300 hover:text-white hover:bg-white/5"
              }`}
            >
              All Documents
            </Link>
          </nav>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              title="Import .txt or .md file"
            >
              <Upload className="w-3.5 h-3.5 text-[#97c2f8]" />
              <span className="hidden sm:inline">Import</span>
            </button>
          )}

          {onNewDocument && (
            <button
              onClick={onNewDocument}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-[#001d6b] bg-[#97c2f8] hover:bg-[#b0d2fa] transition-all shadow-[0_0_15px_rgba(151,194,248,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Doc</span>
            </button>
          )}

          {/* User Switcher Trigger (Ajaia Drawer Button) */}
          <button
            onClick={openDrawer}
            className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-[#97c2f8]/40 transition-all cursor-pointer group"
            title="Open user switcher drawer"
            aria-label="Switch user"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-xs border border-white/20">
              {currentUser ? getInitials(currentUser.name) : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-white group-hover:text-[#97c2f8] transition-colors leading-tight">
                {currentUser?.name || "Select User"}
              </span>
              <span className="text-[10px] text-zinc-400 leading-tight">Switch Persona</span>
            </div>
            <Menu className="w-4 h-4 text-zinc-400 group-hover:text-[#97c2f8] transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}
