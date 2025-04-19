import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface PreviewPaneProps {
  code: string;
}

export default function PreviewPane({ code }: PreviewPaneProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const { theme } = useTheme();
  const [processedCode, setProcessedCode] = useState("");

  // Process the code to remove markdown formatting and separate CSS
  useEffect(() => {
    if (!code) {
      setProcessedCode("");
      return;
    }

    // Remove markdown code block markers (```html, ```)
    let cleanCode = code
      .replace(/```(html|css|javascript|js)?\n/g, "")
      .replace(/```\s*$/g, "");

    // Extract CSS if present in <style> tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
    const styleMatches = Array.from(cleanCode.matchAll(styleRegex));

    // Extract JS if present in <script> tags
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
    const scriptMatches = Array.from(cleanCode.matchAll(scriptRegex));

    setProcessedCode(cleanCode);
  }, [code]);

  useEffect(() => {
    // Update the iframe key to reset the iframe when code changes
    setIframeKey((prev) => prev + 1);
  }, [processedCode]);

  const iframeContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Base styles */
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 
                       'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 16px;
          ${
            theme === "dark" ? "background-color: #1a202c; color: #e2e8f0;" : ""
          }
          transition: background-color 0.3s, color 0.3s;
        }
        
        /* Default responsive styles */
        img {
          max-width: 100%;
          height: auto;
        }
        input, select, textarea, button {
          font-family: inherit;
          font-size: inherit;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      ${processedCode}
    </body>
    </html>
  `;

  return (
    <div className="border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 overflow-hidden h-80 shadow-md">
      <iframe
        key={iframeKey}
        srcDoc={iframeContent}
        title="Preview"
        className="w-full h-full"
        sandbox="allow-same-origin allow-scripts"
        onError={() => console.error("iframe loading error")}
      />
    </div>
  );
}
