"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
  readOnly?: boolean;
}

export default function Toolbar({ editor, readOnly = false }: ToolbarProps) {
  if (!editor) return null;

  const btnClass = (isActive: boolean) =>
    `p-2 rounded-lg transition-all cursor-pointer ${
      readOnly ? "opacity-40 cursor-not-allowed text-zinc-500" : ""
    } ${
      isActive
        ? "bg-[#97c2f8]/20 text-[#97c2f8] border border-[#97c2f8]/40 shadow-[0_0_10px_rgba(151,194,248,0.2)]"
        : "text-zinc-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 rounded-xl bg-[#000000]/60 backdrop-blur-md border border-white/10 shadow-lg">
      {/* Text styles */}
      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive("underline"))}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/15 mx-1" />

      {/* Headings */}
      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive("heading", { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive("heading", { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/15 mx-1" />

      {/* Lists */}
      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
        title="Bulleted List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/15 mx-1" />

      {/* Blockquote & Code */}
      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={readOnly}
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btnClass(editor.isActive("code"))}
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/15 mx-1" />

      {/* Undo / Redo */}
      <button
        type="button"
        disabled={readOnly || !editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={readOnly || !editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
}
