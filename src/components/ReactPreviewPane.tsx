import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { extractComponentName } from "@/utils/codeProcessor";

interface ReactPreviewPaneProps {
  code: string;
}

export default function ReactPreviewPane({ code }: ReactPreviewPaneProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const { theme } = useTheme();
  const [processedCode, setProcessedCode] = useState("");
  const [extractedCss, setExtractedCss] = useState("");
  const [componentName, setComponentName] = useState("CustomComponent");

  // Process the React component code
  useEffect(() => {
    if (!code) {
      setProcessedCode("");
      setExtractedCss("");
      return;
    }

    // Clean up code (remove markdown formatting if any)
    let cleanCode = code
      .replace(/```(tsx|jsx|typescript|javascript|react|js)?\n/g, "")
      .replace(/```\s*$/g, "");

    // Extract component name
    const extractedName = extractComponentName(cleanCode);
    setComponentName(extractedName);

    // Extract CSS from comments
    let css = "";

    // Look for CSS in comments (/* ... */ or // CSS: ...)
    const cssCommentRegex = /\/\*\s*([\s\S]*?)\s*\*\//g;
    const cssLineCommentRegex = /\/\/\s*CSS:\s*(.*)/g;

    let match;
    while ((match = cssCommentRegex.exec(cleanCode)) !== null) {
      css += match[1] + "\n";
    }

    while ((match = cssLineCommentRegex.exec(cleanCode)) !== null) {
      css += match[1] + "\n";
    }

    // Remove the CSS comments from the code to avoid duplication
    cleanCode = cleanCode
      .replace(cssCommentRegex, "")
      .replace(cssLineCommentRegex, "");

    setProcessedCode(cleanCode);
    setExtractedCss(css);
  }, [code]);

  useEffect(() => {
    // Update the iframe key to reset the iframe when code changes
    if (processedCode) {
      setIframeKey((prev) => prev + 1);
    }
  }, [processedCode, extractedCss]);

  // If no code yet, show a placeholder
  if (!processedCode) {
    return (
      <div className="border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 overflow-hidden h-80 shadow-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-center p-4">
        Generate a component to see a preview
      </div>
    );
  }

  // Create a sandbox content with React and ReactDOM loaded from CDN
  const sandboxContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React UI Component Preview</title>
      
      <!-- Load React from CDN -->
      <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      
      <!-- Load Tailwind CSS for styling -->
      <script src="https://cdn.tailwindcss.com"></script>
      
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 16px;
          ${theme === "dark" ? "background-color:#1a202c;color:#e2e8f0;" : ""}
          transition: background-color 0.3s, color 0.3s;
          min-height: 100vh;
          position: relative;
        }
        
        /* Modal-specific styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        /* Input fields styling */
        input {
          display: block;
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }
        
        /* Button styling */
        button {
          padding: 10px 15px;
          margin: 10px 5px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:hover {
          background-color: #357ae8;
        }
        
        /* Social login button */
        .social-button {
          background-color: #ffffff;
          border: 1px solid #ddd;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .social-button img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        
        /* Extracted CSS from component */
        ${extractedCss}
        
        /* Common animation keyframes */
        @keyframes appear {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes spinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5), 0 0 10px rgba(0, 255, 0, 0.3); }
          50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.8), 0 0 30px rgba(0, 255, 0, 0.5); }
          100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5), 0 0 10px rgba(0, 255, 0, 0.3); }
        }
        
        @keyframes neonPulse {
          0% { 
            box-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3);
            border-color: rgba(0, 255, 255, 0.7);
          }
          50% { 
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.5); 
            border-color: rgba(0, 255, 255, 1);
          }
          100% { 
            box-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3);
            border-color: rgba(0, 255, 255, 0.7);
          }
        }
      </style>
    </head>
    <body>
      <div class="preview-container">
        <div class="responsive-container">
          <div id="root"></div>
        </div>
      </div>
      <div id="error"></div>
      
      <script type="text/babel">
        // Make React hooks available globally
        const {
          useState, 
          useEffect, 
          useRef, 
          useContext, 
          useReducer, 
          useCallback, 
          useMemo, 
          useLayoutEffect
        } = React;
        
        // Wrap in a try-catch to show errors in the UI
        try {
          ${processedCode}
          
          // Check if the component exists and render it
          if (typeof ${componentName} !== 'undefined') {
            // For modal components, we need to provide special props
            let defaultProps = {};
            let isModalComponent = ${componentName}.toString().toLowerCase().includes('modal');
            
            if (isModalComponent) {
              defaultProps = {
                isVisible: true,
                onDismiss: () => console.log('Modal dismissed'),
                onGoogleLogin: () => console.log('Google login clicked'),
                ...${componentName}.defaultProps
              };
            } else if (${componentName}.defaultProps) {
              defaultProps = ${componentName}.defaultProps;
            }
            
            ReactDOM.render(
              <div className="p-4">
                <${componentName} {...defaultProps} />
              </div>,
              document.getElementById('root')
            );
          } else {
            // Look for other component names in the code
            const possibleComponents = Object.keys(window).filter(key => 
              typeof window[key] === 'function' && 
              key !== 'React' && 
              key !== 'ReactDOM' &&
              key.charAt(0) === key.charAt(0).toUpperCase()
            );
            
            if (possibleComponents.length > 0) {
              // Try to render the first component found
              ReactDOM.render(
                <div className="p-4">
                  {React.createElement(window[possibleComponents[0]])}
                </div>,
                document.getElementById('root')
              );
            } else {
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').innerHTML = 
                'Could not find a UI component to render. Make sure your component is properly defined as a function or const.';
            }
          }
        } catch (error) {
          document.getElementById('error').style.display = 'block';
          document.getElementById('error').innerHTML = 'Error rendering component: ' + error.message;
          console.error('Component error:', error);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 overflow-hidden h-80 shadow-md">
      <iframe
        key={iframeKey}
        srcDoc={sandboxContent}
        title="React Component Preview"
        className="w-full h-full"
        sandbox="allow-scripts allow-modals"
        onError={(e) => console.error("iframe loading error", e)}
      />
    </div>
  );
}
