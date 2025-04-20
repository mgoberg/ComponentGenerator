import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/tokyo-night-dark.css"; // Using Tokyo Night Dark theme

// Register the languages we need
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");

  // Tab key handling for better code editing experience
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = editorRef.current;
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

  // Sync scroll between textarea and highlighted code
  const handleScroll = () => {
    if (editorRef.current && preRef.current) {
      preRef.current.scrollTop = editorRef.current.scrollTop;
      preRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  // Update highlighted code whenever the input changes
  useEffect(() => {
    if (code) {
      try {
        const highlighted = hljs.highlight(code, {
          language: "typescript",
          ignoreIllegals: true,
        }).value;
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Highlighting error:", error);
        setHighlightedCode(code); // Fallback to plain text
      }
    } else {
      setHighlightedCode("");
    }
  }, [code]);

  return (
    <div className="syntax-editor relative h-80 rounded-md border border-[#444654] overflow-hidden bg-[#0d0f10]">
      {/* Copy button */}
      <div className="absolute top-0 right-0 z-20 m-2">
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded bg-[#2d2d33] hover:bg-[#3d3d43] text-gray-300 transition-colors"
          title="Copy code"
        >
          {isCopied ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Layered editor with syntax highlighting */}
      <div className="relative h-full w-full">
        {/* Syntax highlighted code display */}
        <pre
          ref={preRef}
          className="absolute inset-0 m-0 p-4 pointer-events-none overflow-auto whitespace-pre font-mono text-sm bg-[#0d0f10]"
        >
          <code
            className="language-tsx"
            dangerouslySetInnerHTML={{ __html: highlightedCode || "&nbsp;" }}
          />
        </pre>

        {/* Transparent textarea for editing */}
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm overflow-auto resize-none bg-transparent text-transparent caret-white z-10 focus:outline-none"
          style={{
            lineHeight: "1.5",
            tabSize: 2,
            caretColor: "#ffffff", // White cursor
            backgroundColor: "transparent", // Transparent background
          }}
        />
      </div>

      {/* Language indicator */}
      <div className="absolute bottom-0 right-0 p-1.5 text-xs text-gray-400 bg-[#161b22] rounded-tl-md">
        React TSX
      </div>
    </div>
  );
}

// Icons for copy button
function CopyIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
