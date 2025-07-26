import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";


const RichTextEditor = ({input, setInput}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Write a compelling course description...",
      }),
    ],
    content: input.description || "",
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[150px] p-4 rounded-md border border-gray-300 bg-white shadow-sm transition-shadow focus:ring-2 focus:ring-indigo-300 [&_ol]:list-decimal [&_ul]:list-disc",
      },
    },

    onUpdate({ editor }) {
      setInput({ ...input, description: editor.getHTML() });
    },
  });

  useEffect(() => {
  if (editor && input.description !== editor.getHTML()) {
    editor.commands.setContent(input.description || "");
  }
}, [input.description, editor]);



  if (!editor) return null;

  const buttonStyle = (isActive) =>
    `px-2 py-1 border rounded text-sm ${
      isActive ? "bg-indigo-600 text-white" : "bg-white hover:bg-gray-100"
    }`;



  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Course Description</label>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 bg-gray-50">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonStyle(editor.isActive("bold"))}>
          B
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonStyle(editor.isActive("italic"))}>
          I
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonStyle(editor.isActive("underline"))}>
          U
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonStyle(editor.isActive("heading", { level: 1 }))}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonStyle(editor.isActive("heading", { level: 2 }))}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonStyle(editor.isActive("bulletList"))}>
          • List
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonStyle(editor.isActive("orderedList"))}>
          1. List
        </button>
        <button onClick={() => editor.chain().focus().undo().run()} className={buttonStyle(false)}>↺ Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()} className={buttonStyle(false)}>↻ Redo</button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor}  />
    </div>
  );
};

export default RichTextEditor;