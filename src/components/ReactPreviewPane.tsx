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
  const [scale, setScale] = useState(1); // Added scale state for zoom controls

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
      <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-[400px] shadow-md flex flex-col items-center justify-center text-gray-400 text-center p-4">
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
      <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-[400px] shadow-md">
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
          padding: 24px;
          box-sizing: border-box;
          overflow: hidden; /* Changed from auto to hidden to prevent scrolling */
        }
        
        .component-container {
          max-width: 100%;
          max-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center center;
          transition: transform 0.2s ease;
        }
        
        /* Added wrapper for centering with proper dimensions */
        .component-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
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
        
        /* Zoom control styles */
        .zoom-controls {
          position: fixed;
          bottom: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
          background: rgba(30, 30, 30, 0.7);
          padding: 4px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
          z-index: 100;
        }
        
        .zoom-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(60, 60, 60, 0.5);
          color: white;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
        }
        
        .zoom-btn:hover {
          background: rgba(80, 80, 80, 0.5);
        }
        
        .zoom-level {
          padding: 0 8px;
          display: flex;
          align-items: center;
          color: rgba(255,255,255,0.8);
          font-size: 12px;
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
        
        // Add zoom functionality
        let currentScale = 1;
        
        function zoomIn() {
          currentScale = Math.min(currentScale + 0.1, 2);
          updateZoom();
        }
        
        function zoomOut() {
          currentScale = Math.max(currentScale - 0.1, 0.5);
          updateZoom();
        }
        
        function resetZoom() {
          currentScale = 1;
          updateZoom();
        }
        
        function updateZoom() {
          const container = document.querySelector('.component-container');
          if (container) {
            container.style.transform = \`scale(\${currentScale})\`;
            
            // Update display
            const display = document.getElementById('zoom-display');
            if (display) {
              display.textContent = \`\${Math.round(currentScale * 100)}%\`;
            }
          }
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
      
      <!-- Add zoom controls -->
      <div class="zoom-controls">
        <button class="zoom-btn" onclick="zoomOut()">-</button>
        <div class="zoom-level" id="zoom-display">100%</div>
        <button class="zoom-btn" onclick="zoomIn()">+</button>
        <button class="zoom-btn" onclick="resetZoom()" title="Reset zoom">↺</button>
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
          children: 'Click Me',
          label: 'Settings',
          text: 'Sample Content',
          value: 'Sample Value',
          title: 'Card Title',
          subtitle: 'Card Subtitle',
          description: 'This is a beautiful interactive component with advanced animations and effects.',
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
          image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
          icon: '⚡',
          badge: 'New',
          elevation: 'medium',
          hoverEffect: true,
          rounded: 'default',
          footer: React.createElement('button', {
            style: {
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              cursor: 'pointer'
            }
          }, 'Learn More'),
          isOn: true
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
            } else {
              // Try to find functions that might be components
              for (const key of Object.keys(window)) {
                if (typeof window[key] === 'function' && 
                   (processedCode.includes(\`function \${key}\`) || 
                    processedCode.includes(\`const \${key} =\`))) {
                  componentToRender = window[key];
                  break;
                }
              }
            }
          }
          
          // Function to create an element with different props depending on component name
          const createElementWithAppropriateProps = (Component) => {
            // Check component name to provide more appropriate props
            const name = Component.name.toLowerCase();
            
            // For NeumorphicCard, make sure we render it with proper data regardless of name detection
            if (name.includes('card') || name.includes('neumorphic') || 
                (typeof Component === 'function' && processedCode.includes('mainGradient'))) {
              
              return React.createElement(Component, {
                title: "Interactive Glass Card",
                description: "This card demonstrates 3D hover effects, dynamic lighting, and elegant transitions. Move your mouse over the card to see these effects in action.",
                image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
                badge: "Featured",
                variant: "cosmic",
                elevation: "medium",
                size: "small", // Changed to small to ensure it fits in the view without scrolling
                rounded: "default",
                onClick: () => console.log('Card clicked'),
                footer: React.createElement('button', {
                  style: {
                    backgroundColor: 'rgba(167, 139, 250, 0.15)',
                    color: 'rgb(167, 139, 250)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                    cursor: 'pointer',
                    fontWeight: 500
                  }
                }, 'View Details')
              });
            } 
            else if (name.includes('button')) {
              return React.createElement(Component, {
                onClick: () => console.log('Button clicked'),
                variant: 'primary',
                size: 'large',
                children: 'Interactive Button'
              });
            } 
            else if (name.includes('toggle') || name.includes('switch')) {
              return React.createElement(Component, {
                isOn: true,
                onChange: () => console.log('Toggle changed'),
                label: 'Enable Feature'
              });
            }
            else if (name.includes('spinner') || name.includes('loader')) {
              return React.createElement(Component, {
                size: 48,
                color: '#10a37f',
                speed: 1,
                text: 'Loading...'
              });
            }
            else if (name.includes('navbar')) {
              return React.createElement(Component, {
                title: 'Demo App',
                theme: 'dark'
              });
            }
            else {
              // For unknown components, make an educated guess based on the code
              if (processedCode.includes('mainGradient') || 
                  processedCode.includes('neumorphic') || 
                  processedCode.includes('card')) {
                
                return React.createElement(Component, {
                  title: "Interactive Card",
                  description: "This card demonstrates advanced visual effects and interactions.",
                  image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
                  badge: "New",
                  variant: "cosmic",
                });
              } else {
                return React.createElement(Component, mockData);
              }
            }
          };
          
          // Render the component
          if (typeof componentToRender === 'function') {
            ReactDOM.createRoot(document.getElementById('root')).render(
              <div className="component-wrapper">
                <div className="component-container">
                  {createElementWithAppropriateProps(componentToRender)}
                </div>
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
        
        // Initial zoom adjustment to make component fit without scrolling
        setTimeout(() => {
          const container = document.querySelector('.component-container');
          const wrapper = document.querySelector('.component-wrapper');
          
          if (container && wrapper) {
            // Check if component size exceeds the container
            const containerRect = container.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            
            if (containerRect.width > wrapperRect.width * 0.9 || 
                containerRect.height > wrapperRect.height * 0.9) {
              // Calculate appropriate scale
              const scaleX = (wrapperRect.width * 0.9) / containerRect.width;
              const scaleY = (wrapperRect.height * 0.9) / containerRect.height;
              const scale = Math.min(scaleX, scaleY, 1);
              
              if (scale < 1) {
                // Apply scale to fit component
                container.style.transform = \`scale(\${scale})\`;
                currentScale = scale;
                
                // Update display
                const display = document.getElementById('zoom-display');
                if (display) {
                  display.textContent = \`\${Math.round(scale * 100)}%\`;
                }
              }
            }
          }
        }, 200);
      </script>
    </body>
    </html>
  `;

  return (
    <ErrorBoundary>
      <div className="border border-[#444654] rounded-md bg-[#0d0f10] overflow-hidden h-[400px] shadow-md relative">
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
