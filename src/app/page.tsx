"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import AjaiaNavBar from "@/components/AjaiaNavBar";
import DocumentList from "@/components/DocumentList";
import UploadModal from "@/components/UploadModal";
import toast from "react-hot-toast";

export default function HomePage() {
  const router = useRouter();
  const { currentUser, isLoading: isUserLoading } = useUser();

  const [documents, setDocuments] = useState<{
    all: any[];
    owned: any[];
    shared: any[];
  }>({
    all: [],
    owned: [],
    shared: [],
  });
  const [isDocsLoading, setIsDocsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!currentUser) return;
    setIsDocsLoading(true);

    try {
      const res = await fetch(`/api/documents?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      toast.error("Failed to load documents");
    } finally {
      setIsDocsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchDocuments();
    }
  }, [currentUser, fetchDocuments]);

  // Create new document action
  const handleNewDocument = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Document",
          ownerId: currentUser.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to create document");

      const created = await res.json();
      toast.success("New document created!");
      router.push(`/documents/${created.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create document");
    }
  };

  const handleUploadSuccess = (createdDoc: any) => {
    router.push(`/documents/${createdDoc.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ajaia Top Navigation Banner */}
      <AjaiaNavBar
        onNewDocument={handleNewDocument}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isDocsLoading && isUserLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#97c2f8] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400">Loading documents...</p>
            </div>
          </div>
        ) : (
          <DocumentList
            documents={documents}
            onNewDocument={handleNewDocument}
            onOpenUpload={() => setIsUploadOpen(true)}
            onRefresh={fetchDocuments}
          />
        )}
      </main>

      {/* Upload File Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
