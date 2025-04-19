import React, { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Sync scroll positions between textarea and preview
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Tab key handling for better code editing experience
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue =
        textarea.value.substring(0, start) +
        "  " +
        textarea.value.substring(end);

      onChange(newValue);

      // Move cursor position after the inserted tab
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  useEffect(() => {
    // Ensure Prism is available in the browser environment
    if (typeof window !== "undefined") {
      setTimeout(() => {
        Prism.highlightAll();
      }, 0);
    }
  }, [code]);

  return (
    <div className="relative border border-[#444654] rounded-md bg-[#0d0f10] text-white overflow-hidden h-80 shadow-md">
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="absolute top-0 left-0 w-full h-full p-4 font-mono text-transparent bg-transparent caret-white z-10 resize-none overflow-auto"
        spellCheck="false"
        style={{ caretColor: "#CBD5E0" }}
      />
      <pre
        ref={preRef}
        className="p-4 font-mono pointer-events-none overflow-auto h-full m-0"
      >
        <code className="language-tsx">{code || " "}</code>
      </pre>
      <div className="absolute bottom-0 right-0 p-2 text-xs text-gray-400 bg-[#202123] rounded-tl-md">
        React TSX
      </div>
    </div>
  );
}
