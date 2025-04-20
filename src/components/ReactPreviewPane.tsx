import React, { useState, useEffect, Component, ErrorInfo } from "react";
import { extractComponentName } from "@/utils/codeProcessor";

// Simple error boundary to catch rendering errors
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Preview error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <div className="text-amber-500 mb-2">⚠️</div>
          <h3 className="text-amber-500 font-medium mb-1">Preview Error</h3>
          <p className="text-gray-400 text-sm">{this.state.errorMessage}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// In-app loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 relative">
          {/* Outer circle */}
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>

          {/* Spinner arc */}
          <div
            className="absolute inset-0 border-4 border-transparent border-t-[#10a37f] rounded-full animate-spin"
            style={{ animationDuration: "1s" }}
          ></div>

          {/* Inner highlight circle */}
          <div className="absolute inset-2 border-2 border-gray-800 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-400 text-sm animate-pulse">
          Loading component...
        </p>
      </div>
    </div>
  );
}

interface ReactPreviewPaneProps {
  code: string;
}

export default function ReactPreviewPane({ code }: ReactPreviewPaneProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [processedCode, setProcessedCode] = useState("");
  const [componentName, setComponentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Process code only when it changes
  useEffect(() => {
    if (!code) {
      setProcessedCode("");
      return;
    }

    setIsLoading(true);

    // Clean up code and extract component name
    let cleanCode = code
      .replace(/```(tsx|jsx|typescript|javascript|react|js)?\n/g, "")
      .replace(/```\s*$/g, "");

    // Pre-process the code to fix common issues
    cleanCode = fixCommonIssues(cleanCode);

    // Extract component name
    let extractedName = extractComponentName(cleanCode);
    if (!extractedName) {
      const arrowMatch = cleanCode.match(/const\s+(\w+)\s*=\s*\(?/);
      if (arrowMatch && arrowMatch[1]) {
        extractedName = arrowMatch[1];
      }
    }

    setComponentName(extractedName || "Component");
    setProcessedCode(cleanCode);
    setIsLoading(false);
  }, [code]);

  // Fix common issues in the code
  const fixCommonIssues = (code: string) => {
    if (!code) return "";

    let fixedCode = code;

    // Add missing keyframes definition if used
    if (
      (fixedCode.includes("keyframes") &&
        !fixedCode.includes("const keyframes =")) ||
      (fixedCode.includes("keyframes`") &&
        !fixedCode.includes("styled-components"))
    ) {
      fixedCode = `// Add missing keyframes function
const keyframes = (strings, ...values) => {
  if (typeof strings === 'string') return strings;
  return strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '');
};

${fixedCode}`;
    }

    // Fix specific animation issues seen in the errors
    if (fixedCode.includes("const spin = keyframes")) {
      fixedCode = fixedCode.replace(
        /const spin = keyframes`([^`]+)`/g,
        "const spin = `@keyframes spin { $1 }`"
      );

      // Also update animation references
      fixedCode = fixedCode.replace(/animation: \${spin}/g, "animation: spin");
    }

    return fixedCode;
  };

  useEffect(() => {
    if (processedCode) {
      setIframeKey((prev) => prev + 1);
    }
  }, [processedCode]);

  if (!code) {
    return (
      <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-80 shadow-md flex flex-col items-center justify-center text-gray-400 text-center p-4">
        <div className="w-16 h-16 mb-4 text-[#10a37f]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
            />
          </svg>
        </div>
        <p className="text-gray-500">Generate a component to see a preview</p>
        <p className="text-gray-600 text-xs mt-2">
          Interactive preview will appear here
        </p>
      </div>
    );
  }

  if (!processedCode || isLoading) {
    return (
      <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-80 shadow-md">
        <LoadingSpinner />
      </div>
    );
  }

  const sandboxContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Component Preview</title>
      <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background-color: #0d0f10;
          color: #ececf1;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        
        #root {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          box-sizing: border-box;
          overflow: hidden;
        }
        
        .component-container {
          max-width: 100%;
          max-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .error-message {
          color: #ff4d4f;
          background-color: rgba(255, 77, 79, 0.1);
          border: 1px solid rgba(255, 77, 79, 0.3);
          padding: 8px 12px;
          border-radius: 4px;
          margin: 8px 0;
          text-align: center;
          font-family: monospace;
          max-width: 80%;
        }

        /* Common animation keyframes */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Enhanced spinner for initial loading */
        .preview-spinner {
          display: inline-block;
          width: 50px;
          height: 50px;
          border: 3px solid rgba(16, 163, 127, 0.2);
          border-radius: 50%;
          border-top-color: #10a37f;
          animation: spin 1s ease-in-out infinite;
        }
      </style>
      <script>
        // Define keyframes function for the component to use
        function keyframes(strings, ...values) {
          if (typeof strings === 'string') return strings;
          const result = strings.reduce((acc, str, i) => {
            return acc + str + (values[i] || '');
          }, '');
          return result;
        }
      </script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    </head>
    <body>
      <div id="root">
        <!-- Initial loading state -->
        <div style="display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; flex-direction: column;">
          <div class="preview-spinner"></div>
          <p style="margin-top: 1rem; color: #888; font-size: 14px;">Rendering component...</p>
        </div>
      </div>
      <script type="text/babel">
        // Make React hooks available globally
        const { useState, useEffect, useRef, useCallback, useMemo, useContext, useReducer } = React;
        
        // Basic error handler
        window.addEventListener('error', (e) => {
          console.error('Preview error:', e.message);
          document.getElementById('root').innerHTML = 
            '<div class="error-message">Error: ' + e.message + '</div>';
        });
        
        // Create emulated styled-components functionality
        const styled = {
          div: (styles) => (props) => {
            const styleString = typeof styles === 'function' ? styles(props) : styles;
            const className = 'styled-' + Math.random().toString(36).substr(2, 9);
            
            // Add the styles to the document
            const styleElem = document.createElement('style');
            styleElem.innerHTML = \`.\${className} { \${styleString} }\`;
            document.head.appendChild(styleElem);
            
            return React.createElement('div', { className, ...props }, props.children);
          },
          // Add more HTML elements as needed
          span: (styles) => (props) => {
            // Similar implementation for span
            const styleString = typeof styles === 'function' ? styles(props) : styles;
            const className = 'styled-' + Math.random().toString(36).substr(2, 9);
            const styleElem = document.createElement('style');
            styleElem.innerHTML = \`.\${className} { \${styleString} }\`;
            document.head.appendChild(styleElem);
            return React.createElement('span', { className, ...props }, props.children);
          }
        };
        
        // For each HTML element, create a styled version
        ['button', 'input', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'li', 'section', 'article', 'main'].forEach(tag => {
          styled[tag] = styled.div;
        });
        
        // CSS helper for styled-components
        const css = (strings, ...values) => {
          return strings.reduce((acc, str, i) => {
            return acc + str + (values[i] || '');
          }, '');
        };
        
        // Default mock data for components
        const mockData = {
          items: [
            { id: 1, title: 'Item 1', description: 'Description 1', image: 'https://via.placeholder.com/150' },
            { id: 2, title: 'Item 2', description: 'Description 2', image: 'https://via.placeholder.com/150' },
          ],
          users: [
            { id: 1, name: 'User 1', avatar: 'https://via.placeholder.com/40' },
            { id: 2, name: 'User 2', avatar: 'https://via.placeholder.com/40' },
          ],
          onClick: () => console.log('clicked'),
          onChange: () => console.log('changed'),
          onSubmit: () => console.log('submitted'),
          children: 'Interactive Button',
          label: 'Interactive Component',
          text: 'Sample Content',
          value: 'Sample Value',
          title: 'Component Title',
          subtitle: 'Component Subtitle',
          description: 'This is a sample description for the component.',
          size: 'medium',
          variant: 'primary',
          color: '#10a37f',
          disabled: false,
          active: true,
          open: true,
          loading: false,
          error: false,
          success: false,
          progress: 75,
          max: 100,
          min: 0,
          step: 1,
          speed: 5, 
          direction: 'right',
        };
        
        try {
          // Add any global variables needed for the component
          window.styled = styled;
          window.css = css;
          window.React = React;
          
          // Execute the component code
          ${processedCode}
          
          // Try to find the component to render
          let componentToRender = window["${componentName}"];
          
          // If primary component not found, look for any React components
          if (typeof componentToRender !== 'function') {
            const components = Object.keys(window).filter(key => 
              typeof window[key] === 'function' && 
              /^[A-Z]/.test(key) && 
              !['React', 'ReactDOM'].includes(key)
            );
            
            if (components.length > 0) {
              componentToRender = window[components[0]];
            }
          }
          
          // Function to create an element with different props depending on component name
          const createElementWithAppropriateProps = (Component) => {
            // Check component name to provide more appropriate props
            const name = Component.name.toLowerCase();
            
            if (name.includes('button')) {
              return React.createElement(Component, {
                onClick: () => console.log('Button clicked'),
                variant: 'primary',
                size: 'medium',
                children: 'Interactive Button'
              });
            } 
            else if (name.includes('toggle') || name.includes('switch')) {
              return React.createElement(Component, {
                isOn: true,
                onChange: () => console.log('Toggle changed'),
                label: 'Toggle Switch'
              });
            }
            else if (name.includes('spinner') || name.includes('loader')) {
              return React.createElement(Component, {
                size: 48,
                color: '#10a37f',
                speed: 1
              });
            }
            else if (name.includes('card')) {
              return React.createElement(Component, {
                title: 'Card Title',
                description: 'This is a sample card with customized content for the preview.',
                image: 'https://via.placeholder.com/300x150',
                onClick: () => console.log('Card clicked')
              });
            }
            else {
              // Default props for other components
              return React.createElement(Component, mockData);
            }
          };
          
          // Render the component
          if (typeof componentToRender === 'function') {
            ReactDOM.createRoot(document.getElementById('root')).render(
              <div className="component-container">
                {createElementWithAppropriateProps(componentToRender)}
              </div>
            );
          } else {
            document.getElementById('root').innerHTML = 
              '<div class="error-message">No React component found in the code</div>';
          }
        } catch (error) {
          console.error('Component evaluation error:', error);
          document.getElementById('root').innerHTML = 
            '<div class="error-message">Error: ' + error.message + '</div>';
        }
      </script>
    </body>
    </html>
  `;

  return (
    <ErrorBoundary>
      <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-80 shadow-md relative">
        <iframe
          key={iframeKey}
          srcDoc={sandboxContent}
          title="React Component Preview"
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
    </ErrorBoundary>
  );
}
