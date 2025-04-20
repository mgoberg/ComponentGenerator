import React from "react";
import { extractComponentName, extractImports } from "@/utils/codeProcessor";

interface ImplementationGuideProps {
  guide: string;
  code?: string;
}

export default function ImplementationGuide({
  guide,
  code = "",
}: ImplementationGuideProps) {
  const componentName = extractComponentName(code);
  const imports = extractImports(code);

  if (!guide) {
    return (
      <div className="p-4 border border-[#444654] rounded-md bg-[#2d2d33]">
        <p className="text-gray-400 italic">
          Generate code to see implementation instructions.
        </p>
      </div>
    );
  }

  // Process guide content to handle markdown-style formatting
  const processGuide = (text: string) => {
    // Replace markdown-style lists with HTML lists
    let processed = text.replace(/^\s*[\-\*]\s+(.+)$/gm, "<li>$1</li>");

    // Replace markdown-style headers
    processed = processed.replace(
      /^#{1,6}\s+(.+)$/gm,
      "<strong>$1</strong><br>"
    );

    // Handle code blocks with backticks - replace triple backticks with pre/code blocks
    processed = processed.replace(
      /```([a-z]*)\n([\s\S]*?)```/g,
      '<pre class="bg-[#161b22] p-2 my-2 rounded overflow-auto"><code>$2</code></pre>'
    );

    // Replace inline code with styled code (single backticks)
    processed = processed.replace(
      /`([^`]+)`/g,
      "<code class='bg-[#161b22] px-1.5 py-0.5 rounded text-sm'>$1</code>"
    );

    // Convert line breaks to paragraphs
    const paragraphs = processed.split(/\n\n+/).map((p) => {
      // If paragraph already has HTML tags or is a list item, return as is
      if (p.includes("<li>")) {
        return `<ul class="list-disc pl-5 my-2 space-y-1">
          ${p.replace(/<\/li>\s*<li>/g, "</li><li>")}
        </ul>`;
      }
      if (p.trim().startsWith("<")) return p;
      return `<p class="mb-3">${p.replace(/\n/g, "<br>")}</p>`;
    });

    return paragraphs.join("");
  };

  return (
    <div className="p-4 border border-[#444654] rounded-md bg-[#2d2d33] overflow-auto shadow-md max-h-96">
      {imports.length > 0 && (
        <div className="mb-4 p-3 bg-[#1a1a1d] rounded-md">
          <h3 className="font-bold text-sm mb-2">Required Imports:</h3>
          <pre className="text-xs overflow-auto p-2 bg-[#0d0f10] rounded">
            {imports.join("\n")}
          </pre>
        </div>
      )}
      <div
        className="prose prose-invert max-w-none prose-pre:bg-[#161b22] prose-pre:p-0 prose-code:bg-[#161b22]"
        dangerouslySetInnerHTML={{ __html: processGuide(guide) }}
      />
    </div>
  );
}
