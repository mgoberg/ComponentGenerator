import React, { useState, useEffect } from "react";
import { extractComponentName } from "@/utils/codeProcessor";

interface ReactPreviewPaneProps {
  code: string;
}

export default function ReactPreviewPane({ code }: ReactPreviewPaneProps) {
  const [iframeKey, setIframeKey] = useState(0);
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
      <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-80 shadow-md flex items-center justify-center text-gray-400 text-center p-4">
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
      
      <!-- Content Security Policy for images -->
      <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src * data: blob: https: http:; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.tailwindcss.com;">
      
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
          background-color: #0d0f10;
          color: #ececf1;
          min-height: 100vh;
          position: relative;
        }
        
        /* Image handling */
        img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        
        .image-fallback {
          background: #202123;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 150px;
          color: #9ca3af;
          border: 1px dashed #444654;
        }
        
        /* Modal-specific styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
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
          border: 1px solid #444654;
          border-radius: 4px;
          font-size: 16px;
          background-color: #2d2d33;
          color: #ececf1;
        }
        
        /* Button styling */
        button {
          padding: 10px 15px;
          margin: 10px 5px;
          background-color: #10a37f;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:hover {
          background-color: #0e9170;
        }
        
        /* Social login button */
        .social-button {
          background-color: #2d2d33;
          border: 1px solid #444654;
          color: #ececf1;
          display: flex;
          align-items: center;
          justify-content: center;
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
          0% { box-shadow: 0 0 5px rgba(16, 163, 127, 0.5), 0 0 10px rgba(16, 163, 127, 0.3); }
          50% { box-shadow: 0 0 20px rgba(16, 163, 127, 0.8), 0 0 30px rgba(16, 163, 127, 0.5); }
          100% { box-shadow: 0 0 5px rgba(16, 163, 127, 0.5), 0 0 10px rgba(16, 163, 127, 0.3); }
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
        
        // Helper function to prevent "map of undefined" errors
        const safeArray = (arr) => Array.isArray(arr) ? arr : [];
        
        // Common data structures often used in components
        const EMPTY_ARRAY = [];
        const EMPTY_OBJECT = {};
        const DEFAULT_ITEMS = [
          { id: 1, title: 'Item 1', content: 'Content 1', image: 'https://via.placeholder.com/150' },
          { id: 2, title: 'Item 2', content: 'Content 2', image: 'https://via.placeholder.com/150' },
          { id: 3, title: 'Item 3', content: 'Content 3', image: 'https://via.placeholder.com/150' }
        ];
        
        // Image component with fallback
        const SafeImage = ({ src, alt, className, width, height, ...props }) => {
          const [error, setError] = React.useState(false);
          const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
          
          if (error) {
            return (
              <div className={\`image-fallback \${className || ''}\`} style={{ width: width || '150px', height: height || '150px' }}>
                <img src={fallbackSrc} alt={alt || 'Image not available'} {...props} />
              </div>
            );
          }
          
          return (
            <img 
              src={src} 
              alt={alt || 'Component preview image'} 
              className={className} 
              width={width}
              height={height}
              onError={() => setError(true)}
              {...props}
            />
          );
        };
        
        // Make SafeImage available globally
        window.SafeImage = SafeImage;
        
        // Patch Array.prototype.map to handle undefined
        const originalMap = Array.prototype.map;
        Array.prototype.map = function(...args) {
          if (this === undefined || this === null) {
            console.warn('Attempted to call map on undefined or null');
            return EMPTY_ARRAY;
          }
          return originalMap.apply(this, args);
        };
        
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
            
            // Common props that might be needed by components
            defaultProps = {
              items: DEFAULT_ITEMS,
              data: DEFAULT_ITEMS,
              images: [
                'https://via.placeholder.com/150',
                'https://via.placeholder.com/300',
                'https://via.placeholder.com/200'
              ],
              image: 'https://via.placeholder.com/400',
              src: 'https://via.placeholder.com/400',
              avatar: 'https://via.placeholder.com/100',
              ...defaultProps
            };
            
            // Process the component code to replace img tags with SafeImage
            const ComponentWithSafeImages = (props) => {
              const renderWithSafeImages = (children) => {
                if (!children) return children;
                
                if (Array.isArray(children)) {
                  return children.map(renderWithSafeImages);
                }
                
                if (typeof children === 'object' && children.type === 'img') {
                  return <SafeImage {...children.props} />;
                }
                
                if (children.props && children.props.children) {
                  return React.cloneElement(
                    children,
                    { ...children.props },
                    renderWithSafeImages(children.props.children)
                  );
                }
                
                return children;
              };
              
              try {
                const component = <${componentName} {...props} />;
                return component;
              } catch (error) {
                console.error("Error rendering with safe images:", error);
                return <${componentName} {...props} />;
              }
            };
            
            ReactDOM.render(
              <div className="p-4">
                <ComponentWithSafeImages {...defaultProps} />
              </div>,
              document.getElementById('root')
            );
          } else {
            // Look for other component names in the code
            const possibleComponents = Object.keys(window).filter(key => 
              typeof window[key] === 'function' && 
              key !== 'React' && 
              key !== 'ReactDOM' &&
              key !== 'SafeImage' &&
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
          let errorMessage = error.message;
          
          // Special handling for common errors
          if (errorMessage.includes("Cannot read properties of undefined (reading 'map')")) {
            errorMessage = "Error: Attempted to call .map() on an undefined variable. Check your data initialization.";
          }
          
          document.getElementById('error').style.display = 'block';
          document.getElementById('error').innerHTML = 'Error rendering component: ' + errorMessage;
          console.error('Component error:', error);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-80 shadow-md">
      <iframe
        key={iframeKey}
        srcDoc={sandboxContent}
        title="React Component Preview"
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-downloads allow-modals"
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={(e) => console.error("iframe loading error", e)}
      />
    </div>
  );
}
