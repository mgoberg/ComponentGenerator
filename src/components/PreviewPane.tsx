import React, { useState, useEffect } from "react";

interface PreviewPaneProps {
  code: string;
}

export default function PreviewPane({ code }: PreviewPaneProps) {
  const [iframeKey, setIframeKey] = useState(0);
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
      <!-- Content Security Policy for images -->
      <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline'; img-src * data: blob: https:; style-src 'self' 'unsafe-inline';">
      <style>
        /* Base styles */
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 
                       'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 16px;
          background-color: #0d0f10; 
          color: #ececf1;
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
    <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-80 shadow-md">
      <iframe
        key={iframeKey}
        srcDoc={iframeContent}
        title="Preview"
        className="w-full h-full"
        sandbox="allow-same-origin allow-scripts allow-downloads"
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => console.error("iframe loading error")}
      />
    </div>
  );
}
