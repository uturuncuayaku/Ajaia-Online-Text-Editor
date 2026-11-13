import { Suspense } from "react";
import DocumentClient from "./DocumentClient";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="w-8 h-8 border-2 border-[#97c2f8] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DocumentClient documentId={id} />
    </Suspense>
  );
}
