import React from "react";
import { extractComponentName, extractImports } from "@/utils/codeProcessor";

interface ImplementationGuideProps {
  guide: string;
  code?: string;
}

// Define a proper type for sections
interface GuideSection {
  title: string;
  content: string;
}

export default function ImplementationGuide({
  guide,
  code = "",
}: ImplementationGuideProps) {
  const componentName = extractComponentName(code);
  const imports = extractImports(code);

  if (!guide) {
    return (
      <div className="p-4 border border-[#444654]/30 rounded-md bg-[#202123]/50 backdrop-blur-xl">
        <p className="text-gray-400 italic">
          Generate code to see how your component works.
        </p>
      </div>
    );
  }

  const processGuide = (text: string): GuideSection[] => {
    let sections: GuideSection[] = [];
    let currentTitle = "Overview";
    let currentContent: string[] = [];

    const lines = text.split("\n");

    lines.forEach((line) => {
      const headerMatch = line.match(/^#{1,3}\s+(.+)$/);
      if (headerMatch) {
        if (currentContent.length > 0) {
          sections.push({
            title: currentTitle,
            content: currentContent.join("\n"),
          });
          currentContent = [];
        }
        currentTitle = headerMatch[1];
      } else {
        currentContent.push(line);
      }
    });

    if (currentContent.length > 0) {
      sections.push({
        title: currentTitle,
        content: currentContent.join("\n"),
      });
    }

    // Process each section and filter out unwanted sections (Props)
    const processedSections: GuideSection[] = [];

    for (const section of sections) {
      // Skip Props sections
      if (
        section.title.toLowerCase().includes("props") ||
        section.title.toLowerCase().includes("properties")
      ) {
        continue;
      }

      let content = section.content;

      // Code block formatting
      content = content.replace(
        /```([a-z]*)\n([\s\S]*?)```/g,
        '<pre class="bg-[#161b22]/70 p-3 my-3 rounded-md overflow-auto backdrop-blur-sm border border-[#444654]/30"><code>$2</code></pre>'
      );

      // Inline code formatting
      content = content.replace(
        /`([^`]+)`/g,
        "<code class='bg-[#161b22]/70 px-1.5 py-0.5 rounded text-sm border border-[#444654]/20'>$1</code>"
      );

      // Convert lists to proper HTML lists with bullet points and spacing
      content = content.replace(
        /(?:^|\n)(\s*)-\s+(.*?)(?=\n(\s*)-\s+|\n\n|$)/g,
        (match, indent, item) =>
          `\n<li class="ml-${
            indent.length * 4 || 2
          } mb-2 flex"><span class="text-[#1a2e29] mr-2">•</span> ${item}</li>`
      );

      // Wrap lists in ul tags
      if (content.includes("<li")) {
        // Replace the problematic regex using 's' flag with an alternative approach
        content = content.split("\n").join(" "); // Join lines for multiline matching
        content = content.replace(
          /(<li[^>]*>.*?<\/li>(\s*<li[^>]*>.*?<\/li>)*)/g,
          '<ul class="list-none pl-2 my-3 space-y-1">$1</ul>'
        );
      }

      // Convert plain paragraphs (lines that don't start with HTML tags)
      content = content.replace(
        /(?:^|\n)(?!<)([^\n<]+)(?=\n|$)/g,
        '\n<p class="mb-3 text-gray-300 leading-relaxed">$1</p>'
      );

      // Add processed section to our final array
      processedSections.push({
        title: section.title,
        content: content.trim(),
      });
    }

    return processedSections;
  };

  const guideSections = processGuide(guide);

  return (
    <div className="p-6 border border-[#444654]/30 rounded-md bg-[#202123]/50 backdrop-blur-xl overflow-auto shadow-md max-h-[28rem]">
      {/* Component Name and Imports Section */}
      <div className="mb-6 pb-4 border-b border-[#444654]/30">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 bg-[#1a2e29]/70 rounded-full flex items-center justify-center">
            <span className="text-xs text-[#10a37f]">C</span>
          </div>
          <h1 className="text-xl font-bold text-[#ececf1]">
            {componentName || "Component"}
          </h1>
        </div>

        {imports.length > 0 && (
          <div className="mt-4 p-3 bg-[#161b22]/50 rounded-md border border-[#444654]/30 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <svg
                className="h-4 w-4 mr-2 text-[#10a37f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <h3 className="font-medium text-sm text-gray-300">
                Required Imports
              </h3>
            </div>
            <pre className="text-xs overflow-auto p-2 rounded bg-[#0d0f10]/70 border border-[#444654]/20">
              {imports.join("\n")}
            </pre>
          </div>
        )}
      </div>

      {/* Rendered Guide Content */}
      <div className="implementation-guide">
        {guideSections.map((section, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="flex items-center mb-3">
              <div className="h-4 w-4 bg-[#1a2e29]/50 rounded flex items-center justify-center mr-2">
                <span className="text-xs text-[#10a37f]">{index + 1}</span>
              </div>
              <h2 className="text-lg font-semibold text-[#10a37f]">
                {section.title}
              </h2>
            </div>
            <div
              className="pl-6"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}
      </div>

      {/* Usage tips */}
      <div className="mt-6 pt-4 border-t border-[#444654]/30">
        <div className="flex">
          <div className="flex-shrink-0 h-8 w-8 bg-[#1a2e29]/30 rounded-full flex items-center justify-center mr-3">
            <svg
              className="h-4 w-4 text-[#10a37f]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-2">
              Quick Tips
            </h3>
            <ul className="text-xs text-gray-400 space-y-1.5">
              <li className="flex items-center">
                <span className="mr-1.5 text-[#10a37f]">•</span>
                <span>
                  Customize colors and sizes to match your design system
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-1.5 text-[#10a37f]">•</span>
                <span>Test the component in dark and light modes</span>
              </li>
              <li className="flex items-center">
                <span className="mr-1.5 text-[#10a37f]">•</span>
                <span>
                  Add the component to your component library for reuse
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
