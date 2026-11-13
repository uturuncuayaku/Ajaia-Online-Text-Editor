"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import AjaiaNavBar from "@/components/AjaiaNavBar";
import DocumentEditor from "@/components/Editor";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function DocumentClient({ documentId }: { documentId: string }) {
  const { currentUser, isLoading: isUserLoading } = useUser();

  const [document, setDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId || isUserLoading) return;

    const fetchDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParam = currentUser ? `?userId=${currentUser.id}` : "";
        const res = await fetch(`/api/documents/${documentId}${queryParam}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError("Document not found");
          } else if (res.status === 403) {
            setError("Access denied: You do not have permission to view this document.");
          } else {
            setError("Failed to load document");
          }
          return;
        }

        const data = await res.json();
        setDocument(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, currentUser, isUserLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <AjaiaNavBar isEditing={true} />

      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#97c2f8] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400">Opening document...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full rounded-2xl bg-white/[0.03] border border-white/10 p-8 text-center backdrop-blur-xl">
              <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{error}</h2>
              <p className="text-xs text-zinc-400 mb-6">
                Try switching personas using the top-right menu drawer to check if another account has access.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#97c2f8] text-[#001d6b] text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Documents
              </Link>
            </div>
          </div>
        ) : document ? (
          <DocumentEditor initialDocument={document} />
        ) : null}
      </main>
    </div>
  );
}
