"use client";

import React, { useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (createdDoc: any) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const { currentUser } = useUser();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["txt", "md"].includes(ext || "")) {
      toast.error("Unsupported file type. Please upload a .txt or .md file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5 MB limit.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser) {
      toast.error("Please choose a file to upload");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("ownerId", currentUser.id);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const newDoc = await res.json();
      toast.success(`"${newDoc.title}" imported successfully!`);
      setSelectedFile(null);
      onClose();
      onUploadSuccess(newDoc);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-[#030919] border border-white/15 p-6 shadow-2xl text-[#f1f7ff] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">Import Document</h3>
              <p className="text-xs text-[#97c2f8]">Convert .txt or .md into an editable draft</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5">
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                dragActive
                  ? "border-[#97c2f8] bg-[#001d6b]/30 shadow-[0_0_20px_rgba(151,194,248,0.25)]"
                  : "border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".txt,.md"
                onChange={handleChange}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-[#001d6b]/50 border border-[#97c2f8]/40 flex items-center justify-center mb-3 text-[#97c2f8]">
                <UploadCloud className="w-6 h-6" />
              </div>

              <p className="text-sm font-medium text-white text-center">
                Click to browse or drag & drop file
              </p>
              <p className="text-xs text-zinc-400 mt-1">Supports Markdown (.md) and Plain Text (.txt)</p>
              <p className="text-[11px] text-zinc-400 mt-1">Maximum file size: 5 MB</p>
            </div>

            {/* Selected File Card */}
            {selectedFile && (
              <div className="mt-4 p-3 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#97c2f8]" />
                  <div className="truncate max-w-[240px]">
                    <p className="text-xs font-medium text-white truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-zinc-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            )}

            {/* Submit button */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-xs font-medium rounded-xl text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="flex-1 px-4 py-2 text-xs font-medium rounded-xl text-[#001d6b] bg-[#97c2f8] hover:bg-[#b0d2fa] disabled:opacity-50 transition-all font-semibold shadow-[0_0_15px_rgba(151,194,248,0.3)] cursor-pointer"
              >
                {isUploading ? "Importing..." : "Create Document"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
