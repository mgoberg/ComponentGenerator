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
      <div className="p-4 border dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400 italic">
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
    processed = processed.replace(/^#{1,6}\s+(.+)$/gm, "<strong>$1</strong>");

    // Replace code snippets with styled code
    processed = processed.replace(
      /`([^`]+)`/g,
      "<code class='bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm'>$1</code>"
    );

    // Convert line breaks to paragraphs
    const paragraphs = processed.split(/\n\n+/).map((p) => {
      // If paragraph already has HTML tags or is a list item, return as is
      if (p.includes("<li>")) {
        return `<ul class="list-disc pl-5 my-2">${p}</ul>`;
      }
      if (p.trim().startsWith("<")) return p;
      return `<p>${p.replace(/\n/g, "<br>")}</p>`;
    });

    return paragraphs.join("");
  };

  return (
    <div className="p-4 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 overflow-auto shadow-md max-h-96">
      {imports.length > 0 && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h3 className="font-bold text-sm mb-2">Required Imports:</h3>
          <pre className="text-xs overflow-auto p-2 bg-gray-200 dark:bg-gray-800 rounded">
            {imports.join("\n")}
          </pre>
        </div>
      )}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: processGuide(guide) }}
      />
    </div>
  );
}
