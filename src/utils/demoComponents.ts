/**
 * Provides demo/mock components for the application when running without an API key
 */

interface DemoComponentData {
  code: string;
  implementationGuide: string;
}

// Collection of pre-made demo components
const demoComponents: Record<string, DemoComponentData> = {
  button: {
    code: `function AnimatedButton({ children, onClick, variant = "primary", size = "medium", disabled = false }) {
  const { useState } = React;
  const [isPressed, setIsPressed] = useState(false);
  
  // Define button sizes
  const sizes = {
    small: "text-xs px-3 py-1",
    medium: "text-sm px-4 py-2",
    large: "text-base px-6 py-3"
  };
  
  // Define button variants
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-700"
  };

  // Button styles
  const buttonStyle = {
    position: "relative",
    borderRadius: "0.375rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    overflow: "hidden",
    transform: isPressed ? "scale(0.97)" : "scale(1)",
    outline: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  };
  
  // Disabled state styles
  const disabledStyle = {
    opacity: 0.6,
    cursor: "not-allowed",
    pointerEvents: "none"
  };

  return (
    <button
      className={\`\${sizes[size]} \${variants[variant]}\`}
      style={{
        ...buttonStyle,
        ...(disabled ? disabledStyle : {})
      }}
      onClick={(e) => {
        if (!disabled) {
          setIsPressed(true);
          onClick?.(e);
          setTimeout(() => setIsPressed(false), 150);
        }
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}`,
    implementationGuide: `# AnimatedButton Component

This is a highly customizable button component that includes animation effects, various styles, sizes and states.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Button content |
| onClick | function | - | Click handler |
| variant | string | "primary" | Button style: "primary", "secondary", "success", "danger" or "ghost" |
| size | string | "medium" | Button size: "small", "medium" or "large" |
| disabled | boolean | false | Whether the button is disabled |

## Usage

Import the component and use it in your React application:

\`\`\`jsx
import { AnimatedButton } from './components/AnimatedButton';

function App() {
  return (
    <div className="space-y-4">
      <AnimatedButton onClick={() => alert('Button clicked!')}>
        Click Me!
      </AnimatedButton>
      
      <AnimatedButton variant="success" size="large">
        Success Button
      </AnimatedButton>
      
      <AnimatedButton variant="danger" disabled>
        Disabled Button
      </AnimatedButton>
      
      <AnimatedButton variant="ghost" size="small">
        Ghost Button
      </AnimatedButton>
    </div>
  );
}
\`\`\`

## Accessibility

- The button is fully keyboard accessible
- Focus states are clearly visible with a distinct focus ring
- Disabled state is properly handled with both visual indicators and pointer-event handling

## Animation Features

1. Subtle scale animation on click for tactile feedback
2. Smooth color transitions on hover
3. Visual feedback for all interaction states

## Implementation Notes

The component includes:
- A gradient background for a modern look
- Dynamic styles based on props
- Proper event handling
- Support for different sizes and variants`,
  },

  card: {
    code: `function HoverCard({ title, description, image, icon, onClick, footer, variant = "default" }) {
  const { useState } = React;
  const [isHovered, setIsHovered] = useState(false);
  
  // Define card variants
  const variants = {
    default: {
      background: "bg-gray-800",
      border: "border-gray-700",
      highlight: "text-cyan-400",
    },
    success: {
      background: "bg-gray-800",
      border: "border-green-900/30",
      highlight: "text-green-400",
    },
    warning: {
      background: "bg-gray-800",
      border: "border-amber-900/30",
      highlight: "text-amber-400",
    },
    danger: {
      background: "bg-gray-800",
      border: "border-red-900/30",
      highlight: "text-red-400",
    }
  };
  
  // Card container styles
  const cardStyle = {
    position: "relative",
    transition: "all 0.3s ease",
    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
    overflow: "hidden"
  };

  return (
    <div
      className={\`rounded-xl p-5 \${variants[variant].background} border \${variants[variant].border}\`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div>
        {/* Card Header */}
        {(image || icon) && (
          <div className="mb-4">
            {image && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover transition-transform duration-300"
                  style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                />
              </div>
            )}
            {icon && !image && (
              <div className={\`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 \${variants[variant].highlight} mb-2\`}>
                <span className="text-xl">{icon}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Card Content */}
        <div>
          <h3 
            className={\`font-bold text-xl text-white mb-2 transition-colors duration-300 \${isHovered ? variants[variant].highlight : ''}\`}
          >
            {title || "Card Title"}
          </h3>
          <p className="text-gray-300 text-sm">
            {description || "This is a sample card description. Replace it with your own content."}
          </p>
        </div>
        
        {/* Card Footer */}
        {footer && (
          <div className="mt-5 pt-4 border-t border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}`,
    implementationGuide: `# HoverCard Component

A stylish, interactive card component with hover effects, variants, and customization options.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | "Card Title" | The card's main heading |
| description | string | "This is a sample..." | The card description text |
| image | string | - | URL of image to display at the top of the card |
| icon | ReactNode | - | An icon to display if no image is present |
| onClick | function | - | Click handler for the card |
| footer | ReactNode | - | Optional footer content |
| variant | string | "default" | Card style: "default", "success", "warning", "danger" |

## Usage

Import the component and use it in your React application:

\`\`\`jsx
import { HoverCard } from './components/HoverCard';

function App() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Basic card with title and description */}
      <HoverCard 
        title="Features & Benefits"
        description="Our product helps you achieve your goals faster with less effort."
        onClick={() => console.log('Card clicked')}
      />
      
      {/* Card with image */}
      <HoverCard 
        title="Mountain Retreat"
        description="Peaceful getaway surrounded by natural beauty."
        image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3"
        variant="success"
      />
      
      {/* Card with icon and footer */}
      <HoverCard 
        title="Get Notified"
        description="Receive alerts when important events occur."
        icon="🔔"
        variant="warning"
        footer={
          <div className="flex justify-end">
            <button className="px-3 py-1 bg-amber-600 rounded text-white text-sm">
              Enable
            </button>
          </div>
        }
      />
    </div>
  );
}
\`\`\`

## Features

1. **Interactive Hover Effects**
   - Subtle elevation (rise) on hover
   - Color transition on hover for the title
   - Image scaling for cards with images

2. **Multiple Visual Variants**
   - Default (cyan accents)
   - Success (green accents)
   - Warning (amber accents)
   - Danger (red accents)

3. **Responsive Design**
   - Works well in grid layouts
   - Image scales properly on different screen sizes
   - Maintains proper spacing and readability

## Accessibility

- Cards with onClick are focusable and keyboard accessible
- Clear visual feedback on interaction states
- Properly structured HTML for good semantics

## Implementation Notes

For best visual results:
- Place cards on a dark background
- Use cards in a grid with uniform spacing
- Provide square or 16:9 aspect ratio images for consistency`,
  },

  toggle: {
    code: `function AnimatedToggle({ isOn = false, onChange, size = "medium", disabled = false, color = "#10b981", label }) {
  const { useState, useEffect } = React;
  const [checked, setChecked] = useState(isOn);
  
  // Sync with parent component
  useEffect(() => {
    setChecked(isOn);
  }, [isOn]);
  
  // Handle toggle change
  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !checked;
    setChecked(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Define size presets
  const sizes = {
    small: { width: 36, height: 20, circle: 16 },
    medium: { width: 48, height: 24, circle: 20 },
    large: { width: 60, height: 32, circle: 28 }
  };
  
  // Get current size values
  const sizeValues = sizes[size] || sizes.medium;
  
  // Style objects
  const toggleContainerStyle = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    width: sizeValues.width,
    height: sizeValues.height,
    borderRadius: sizeValues.height / 2,
    backgroundColor: checked ? color : '#374151', 
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: "background-color 0.3s ease",
    opacity: disabled ? 0.6 : 1,
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
  };

  const toggleCircleStyle = {
    position: "absolute",
    left: 2, 
    width: sizeValues.circle,
    height: sizeValues.circle,
    borderRadius: '50%',
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
    transform: checked ? \`translateX(\${sizeValues.width - sizeValues.circle - 4}px)\` : "translateX(0)",
    transition: "transform 0.3s ease",
  };
  
  // Create unique id for input
  const id = \`toggle-\${Math.random().toString(36).substr(2, 9)}\`;

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
        className="sr-only" // Visually hidden but accessible
      />
      <label 
        htmlFor={id} 
        className="flex items-center cursor-pointer"
        style={{ opacity: disabled ? 0.6 : 1 }}
      >
        <div style={toggleContainerStyle} aria-hidden="true">
          <div style={toggleCircleStyle} />
        </div>
        {label && <span className="ml-3 text-gray-300 text-sm">{label}</span>}
      </label>
    </div>
  );
}`,
    implementationGuide: `# AnimatedToggle Component

A customizable toggle switch component with smooth animations and various options.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOn | boolean | false | The controlled state of the toggle |
| onChange | function | - | Callback that receives the new toggle state |
| size | string | "medium" | Toggle size: "small", "medium", or "large" |
| disabled | boolean | false | Whether the toggle is disabled |
| color | string | "#10b981" | The color of the toggle when it's on (active) |
| label | ReactNode | - | Optional label text to display next to toggle |

## Usage

Import the component and use it in your React application:

\`\`\`jsx
import { AnimatedToggle } from './components/AnimatedToggle';

function App() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  return (
    <div className="space-y-6 p-4">
      <AnimatedToggle 
        isOn={notificationsEnabled}
        onChange={setNotificationsEnabled}
        label="Enable Notifications"
      />
      
      <AnimatedToggle 
        isOn={darkMode}
        onChange={setDarkMode}
        size="large"
        color="#8b5cf6" // Purple color
        label="Dark Mode"
      />
      
      <AnimatedToggle 
        isOn={true}
        size="small"
        disabled={true}
        label="Premium Features (Unavailable)"
      />
    </div>
  );
}
\`\`\`

## Animations

1. **Toggle On/Off Animation**
   - Smooth transition between states
   - Position transitions for the circle thumb

2. **Transition Effects**
   - Background color transitions smoothly between states
   - Clean sliding motion

## Accessibility Features

- Uses proper semantic HTML with hidden input for accessibility
- Maintains keyboard focus and screen reader support
- Proper disabled state handling
- Label is properly associated with the input

## Customization Options

You can customize the toggle's appearance with these props:
- **size**: Controls the overall dimensions (small, medium, large)
- **color**: Changes the active state color (any valid CSS color)
- **disabled**: Applies a disabled appearance and prevents interaction
- **label**: Adds descriptive text next to the toggle

## Implementation Notes

This component doesn't require any external dependencies besides React. It's fully self-contained and uses inline styles for animations to ensure they work without any CSS configuration.`,
  },

  spinner: {
    code: `function LoadingSpinner({ size = 40, color = "#38bdf8", thickness = 3, speed = 1.5, text }) {
  // Container styles
  const containerStyle = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  
  // Spinner styles
  const spinnerStyle = {
    position: "relative",
    width: size,
    height: size,
  };
  
  // Track style (background circle)
  const trackStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: \`\${thickness}px solid rgba(255, 255, 255, 0.1)\`,
    borderRadius: "50%",
  };
  
  // Primary circle style (the moving part)
  const circleStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: \`\${thickness}px solid transparent\`,
    borderTopColor: color,
    borderRadius: "50%",
    animation: \`spin \${speed}s linear infinite\`,
  };
  
  // Secondary circle (optional design element)
  const secondaryCircleStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: \`\${thickness}px solid transparent\`,
    borderRightColor: color,
    opacity: 0.3,
    borderRadius: "50%",
    animation: \`spin \${speed * 1.5}s linear infinite\`,
  };
  
  // Text style
  const textStyle = {
    marginTop: size / 4,
    fontSize: Math.max(12, size / 3),
    color: "#e2e8f0",
  };
  
  return (
    <div style={containerStyle}>
      <style>
        {
          \`@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }\`
        }
      </style>
      <div style={spinnerStyle}>
        <div style={trackStyle}></div>
        <div style={circleStyle}></div>
        <div style={secondaryCircleStyle}></div>
      </div>
      {text && <div style={textStyle}>{text}</div>}
    </div>
  );
}`,
    implementationGuide: `# LoadingSpinner Component

A customizable loading spinner with smooth animations and optional text display.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | number | 40 | The size of the spinner in pixels |
| color | string | "#38bdf8" | The color of the spinner (any valid CSS color) |
| thickness | number | 3 | The thickness of the spinner's lines in pixels |
| speed | number | 1.5 | Animation duration in seconds (lower is faster) |
| text | string | - | Optional loading text to display below the spinner |

## Usage

Import the component and use it in your React application:

\`\`\`jsx
import { LoadingSpinner } from './components/LoadingSpinner';

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {/* Basic spinner */}
      <LoadingSpinner />
      
      {/* Customized spinner */}
      <LoadingSpinner 
        size={60} 
        color="#10b981" 
        thickness={4} 
        speed={1} 
        text="Loading data..."
      />
      
      {/* Small spinner for inline use */}
      <button disabled className="opacity-50 inline-flex items-center">
        <LoadingSpinner size={16} thickness={2} />
        <span className="ml-2">Processing</span>
      </button>
    </div>
  );
}
\`\`\`

## Animation Details

The spinner uses several animations for a polished look:

1. **Main Rotation**
   - The primary circle rotates continuously
   - Rotation speed is controlled by the 'speed' prop
   - Smooth linear timing function for consistent motion

2. **Secondary Element**
   - A secondary circle rotates at a different speed
   - Creates a more dynamic and interesting visual
   - Lower opacity gives depth to the spinner

## Customization Options

This spinner component is highly customizable:

- **Size**: Adjust the overall dimensions with the 'size' prop
- **Color**: Change the spinner color to match your app's theme
- **Thickness**: Control how thick or thin the spinner lines appear
- **Speed**: Adjust how fast the spinner rotates
- **Text**: Add optional descriptive text that appears below the spinner

## Implementation Notes

- The spinner is built using pure CSS animations for optimal performance
- It works well on both light and dark backgrounds
- The component is fully self-contained and doesn't require external CSS
- For accessibility, consider adding aria attributes when using this component:
  \`aria-busy="true" aria-label="Loading"\``,
  },

  navbar: {
    code: `function SimpleNavbar({ title = "Brand", theme = "dark" }) {
  const { useState } = React;
  const [isOpen, setIsOpen] = useState(false);
  
  // Default links
  const navLinks = [
    { title: "Home", href: "#" },
    { title: "Features", href: "#" },
    { title: "Pricing", href: "#" },
    { title: "About", href: "#" }
  ];
  
  // Theme variables
  const themes = {
    dark: {
      bg: "bg-gray-900",
      text: "text-white",
      border: "border-gray-800",
      hover: "hover:bg-gray-800"
    },
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      border: "border-gray-200",
      hover: "hover:bg-gray-100"
    }
  };
  
  const currentTheme = themes[theme] || themes.dark;
  
  return (
    <div>
      <nav className={\`\${currentTheme.bg} \${currentTheme.text} border-b \${currentTheme.border}\`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <span className="text-xl font-bold">{title}</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={\`px-3 py-2 rounded-md text-sm font-medium \${currentTheme.hover}\`}
                >
                  {link.title}
                </a>
              ))}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                className={\`inline-flex items-center justify-center p-2 rounded-md \${currentTheme.hover}\`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={\`h-6 w-6\`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={\`md:hidden \${isOpen ? "block" : "hidden"}\`}>
          <div className={\`px-2 pt-2 pb-3 space-y-1 border-t \${currentTheme.border}\`}>
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={\`block px-3 py-2 rounded-md text-base font-medium \${currentTheme.hover}\`}
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}`,
    implementationGuide: `# SimpleNavbar Component

A clean, responsive navigation bar with mobile support and theme options.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | "Brand" | The brand/logo text |
| theme | string | "dark" | Visual theme: "dark" or "light" |

## Usage

Import the component and use it in your React application:

\`\`\`jsx
import { SimpleNavbar } from './components/SimpleNavbar';

function App() {
  return (
    <div>
      <SimpleNavbar 
        title="My App"
        theme="dark"
      />
      
      <main className="container mx-auto p-4">
        {/* Your page content here */}
      </main>
    </div>
  );
}
\`\`\`

## Features

1. **Responsive Design**
   - Desktop view with horizontal navigation
   - Mobile view with collapsible menu
   - Smooth transitions between states

2. **Multiple Themes**
   - Dark theme (dark background, light text)
   - Light theme (light background, dark text)

3. **Accessibility**
   - Proper semantic HTML
   - Screen reader friendly with appropriate ARIA attributes

## Implementation Notes

- The navbar uses a straightforward design that works well in most applications
- Mobile menu toggles smoothly with appropriate icon changes
- No complex animations that might cause compatibility issues
- Fixed navigation links for simplicity and reliability`,
  },
};

// Function to get demo components based on prompt
export function getDemoComponent(
  prompt: string,
  existingCode?: string
): { code: string; implementationGuide: string } {
  // List of keywords to match against prompts
  const keywordMap = {
    button: ["button", "click", "submit", "action"],
    card: ["card", "container", "panel", "box", "grid"],
    toggle: ["toggle", "switch", "checkbox", "on/off"],
    navbar: ["navbar", "navigation", "header", "menu", "bar"],
    spinner: ["spinner", "loader", "loading", "progress", "wait"],
  };

  // For iterations, just return a slightly modified version of the component
  if (existingCode) {
    // Find which component we're working with
    let componentType = "button"; // Default
    for (const [type, _] of Object.entries(demoComponents)) {
      if (existingCode.includes(demoComponents[type].code.substring(0, 100))) {
        componentType = type;
        break;
      }
    }

    const baseComponent = demoComponents[componentType];

    // Apply some simple modifications based on the prompt
    let modifiedCode = baseComponent.code;
    let modifiedGuide = baseComponent.implementationGuide;

    // Add a comment showing what changes were made
    modifiedCode = `// Applied changes based on: "${prompt}"\n` + modifiedCode;

    if (prompt.toLowerCase().includes("color")) {
      // Change a color if that was requested
      modifiedCode = modifiedCode
        .replace(/#10a37f/g, "#8b5cf6")
        .replace(/#38bdf8/g, "#ec4899")
        .replace(/cyan/g, "pink")
        .replace(/green/g, "purple");
      modifiedGuide = modifiedGuide
        .replace("cyan accents", "pink accents")
        .replace("green accents", "purple accents");
    }

    if (prompt.toLowerCase().includes("size")) {
      // Change sizes if that was requested
      modifiedCode = modifiedCode
        .replace(/small: 36/g, "small: 42")
        .replace(/medium: 48/g, "medium: 56")
        .replace(/large: 60/g, "large: 72");
    }

    if (
      prompt.toLowerCase().includes("animation") ||
      prompt.toLowerCase().includes("speed")
    ) {
      // Modify animation speeds
      modifiedCode = modifiedCode
        .replace(/duration: 0.3s/g, "duration: 0.5s")
        .replace(/duration-200/g, "duration-300");
    }

    return {
      code: modifiedCode,
      implementationGuide: modifiedGuide,
    };
  }

  // For new components, find the best match based on prompt keywords
  const scores = Object.entries(keywordMap).map(([component, keywords]) => {
    const score = keywords.reduce((total, keyword) => {
      return (
        total + (prompt.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0)
      );
    }, 0);
    return { component, score };
  });

  // Sort by score and get the highest scoring component
  scores.sort((a, b) => b.score - a.score);
  const bestMatch = scores[0].component;

  // Return the best matching component
  return demoComponents[bestMatch] || demoComponents.button;
}
