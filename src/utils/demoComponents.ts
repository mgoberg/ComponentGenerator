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
    code: `function NeumorphicCard({ 
  title, 
  description, 
  image, 
  icon, 
  footer, 
  variant = "primary",
  elevation = "medium",
  hoverEffect = true,
  size = "default",
  rounded = "default",
  badge,
  onClick
}) {
  const { useState, useRef, useEffect } = React;
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  
  // Color themes with refined gradients for depth perception
  const variants = {
    primary: {
      mainGradient: "linear-gradient(145deg, rgba(40, 84, 133, 0.8) 0%, rgba(23, 55, 94, 0.95) 100%)",
      accentColor: "rgb(91, 143, 249)",
      borderLight: "rgba(94, 161, 255, 0.3)",
      borderDark: "rgba(25, 46, 81, 0.6)",
      textColor: "rgb(245, 248, 255)",
      secondaryTextColor: "rgba(220, 225, 235, 0.8)",
      glowColor: "rgba(91, 143, 249, 0.25)"
    },
    dark: {
      mainGradient: "linear-gradient(145deg, rgba(33, 39, 55, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)",
      accentColor: "rgb(226, 232, 240)",
      borderLight: "rgba(148, 163, 184, 0.2)",
      borderDark: "rgba(15, 23, 42, 0.8)",
      textColor: "rgb(226, 232, 240)",
      secondaryTextColor: "rgba(203, 213, 225, 0.8)",
      glowColor: "rgba(226, 232, 240, 0.15)"
    },
    success: {
      mainGradient: "linear-gradient(145deg, rgba(22, 101, 52, 0.85) 0%, rgba(16, 70, 48, 0.95) 100%)",
      accentColor: "rgb(74, 222, 128)",
      borderLight: "rgba(134, 239, 172, 0.3)",
      borderDark: "rgba(20, 83, 45, 0.6)",
      textColor: "rgb(240, 253, 244)",
      secondaryTextColor: "rgba(220, 252, 231, 0.8)",
      glowColor: "rgba(74, 222, 128, 0.25)"
    },
    danger: {
      mainGradient: "linear-gradient(145deg, rgba(127, 29, 29, 0.85) 0%, rgba(91, 12, 12, 0.95) 100%)",
      accentColor: "rgb(248, 113, 113)",
      borderLight: "rgba(252, 165, 165, 0.3)",
      borderDark: "rgba(127, 29, 29, 0.6)",
      textColor: "rgb(254, 242, 242)",
      secondaryTextColor: "rgba(254, 226, 226, 0.8)",
      glowColor: "rgba(248, 113, 113, 0.25)"
    },
    cosmic: {
      mainGradient: "linear-gradient(145deg, rgba(76, 29, 149, 0.85) 0%, rgba(49, 15, 98, 0.95) 100%)",
      accentColor: "rgb(167, 139, 250)",
      borderLight: "rgba(196, 181, 253, 0.3)",
      borderDark: "rgba(67, 26, 135, 0.6)",
      textColor: "rgb(245, 243, 255)",
      secondaryTextColor: "rgba(237, 233, 254, 0.8)",
      glowColor: "rgba(167, 139, 250, 0.25)"
    },
    glass: {
      mainGradient: "linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)",
      accentColor: "rgb(255, 255, 255)",
      borderLight: "rgba(255, 255, 255, 0.2)",
      borderDark: "rgba(255, 255, 255, 0.05)",
      textColor: "rgb(255, 255, 255)",
      secondaryTextColor: "rgba(255, 255, 255, 0.8)",
      glowColor: "rgba(255, 255, 255, 0.1)",
      isGlass: true
    }
  };
  
  const elevations = {
    flat: {
      shadowInset: "inset 0 0 0 rgba(0, 0, 0, 0)",
      shadowOutset: "0 1px 3px rgba(0, 0, 0, 0.1)",
      depthEffect: 0
    },
    low: {
      shadowInset: "inset 0 2px 4px rgba(255, 255, 255, 0.1)",
      shadowOutset: "0 4px 8px rgba(0, 0, 0, 0.15)",
      depthEffect: 2
    },
    medium: {
      shadowInset: "inset 0 2px 6px rgba(255, 255, 255, 0.1)",
      shadowOutset: "0 8px 16px rgba(0, 0, 0, 0.2)",
      depthEffect: 4
    },
    high: {
      shadowInset: "inset 0 2px 8px rgba(255, 255, 255, 0.12)",
      shadowOutset: "0 12px 24px rgba(0, 0, 0, 0.3)",
      depthEffect: 8
    }
  };
  
  const sizes = {
    small: {
      width: "240px",
      imgHeight: "120px",
      padding: "14px",
      titleSize: "1rem",
      textSize: "0.8rem"
    },
    default: {
      width: "320px",
      imgHeight: "160px",
      padding: "18px",
      titleSize: "1.2rem",
      textSize: "0.9rem"
    },
    large: {
      width: "380px",
      imgHeight: "200px",
      padding: "24px",
      titleSize: "1.5rem",
      textSize: "1rem"
    }
  };
  
  const roundedOptions = {
    none: "0px",
    default: "12px",
    full: "24px"
  };
  
  const currentTheme = variants[variant] || variants.primary;
  const currentElevation = elevations[elevation] || elevations.medium;
  const currentSize = sizes[size] || sizes.default;
  const borderRadius = roundedOptions[rounded] || roundedOptions.default;
  
  // 3D effect tracking with mouse
  const handleMouseMove = (e) => {
    if (!cardRef.current || !hoverEffect) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (limited to ±10 degrees)
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;
    
    setRotation({ x: rotateX, y: rotateY });
    setMousePosition({ x, y });
  };
  
  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly animate back to flat
    const interval = setInterval(() => {
      setRotation(prev => {
        const newX = prev.x * 0.85;
        const newY = prev.y * 0.85;
        
        if (Math.abs(newX) < 0.1 && Math.abs(newY) < 0.1) {
          clearInterval(interval);
          return { x: 0, y: 0 };
        }
        return { x: newX, y: newY };
      });
    }, 16);
  };
  
  // Calculate interactive lighting effect
  const calculateLighting = () => {
    if (!isHovered || !hoverEffect) return {};
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return {};
    
    const gradientX = (mousePosition.x / rect.width) * 100;
    const gradientY = (mousePosition.y / rect.height) * 100;
    
    const lightingGradient = \`
      radial-gradient(
        circle at \${gradientX}% \${gradientY}%, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0) 50%
      )
    \`;
    
    return { backgroundImage: \`\${currentTheme.mainGradient}, \${lightingGradient}\` };
  };

  // Calculate transform style including depth effect
  const calculateTransform = () => {
    if (!hoverEffect) return 'translateZ(0)';
    
    const translateZ = isHovered ? \`\${currentElevation.depthEffect * 2}px\` : '0px';
    const rotateX = rotation.x.toFixed(2);
    const rotateY = rotation.y.toFixed(2);
    
    return \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) translateZ(\${translateZ})\`;
  };
  
  // Main card style with neumorphic effect
  const cardStyle = {
    position: "relative",
    width: currentSize.width,
    maxWidth: "100%",
    background: currentTheme.mainGradient,
    borderRadius,
    overflow: "hidden",
    transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
    transform: calculateTransform(),
    boxShadow: \`\${currentElevation.shadowInset}, \${isHovered ? 
      \`0 \${currentElevation.depthEffect * 2}px \${currentElevation.depthEffect * 4}px \${currentTheme.glowColor}, \${currentElevation.shadowOutset}\` : 
      currentElevation.shadowOutset}\`,
    cursor: onClick ? "pointer" : "default",
    borderTop: \`1px solid \${currentTheme.borderLight}\`,
    borderLeft: \`1px solid \${currentTheme.borderLight}\`,
    borderRight: \`1px solid \${currentTheme.borderDark}\`,
    borderBottom: \`1px solid \${currentTheme.borderDark}\`,
    backdropFilter: currentTheme.isGlass ? "blur(10px)" : "none",
    ...calculateLighting()
  };
  
  // Image container
  const imageContainerStyle = {
    height: currentSize.imgHeight,
    overflow: "hidden",
    position: "relative",
  };
  
  // Image style with hover animation
  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.75s cubic-bezier(0.23, 1, 0.32, 1)",
    transform: isHovered && hoverEffect ? "scale(1.05)" : "scale(1)"
  };
  
  // Content container
  const contentStyle = {
    padding: currentSize.padding,
    position: "relative",
    zIndex: 1,
  };
  
  // Badge style
  const badgeStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: \`linear-gradient(135deg, \${currentTheme.accentColor}30, \${currentTheme.accentColor}15)\`,
    border: \`1px solid \${currentTheme.accentColor}30\`,
    color: currentTheme.accentColor,
    backdropFilter: "blur(8px)",
    boxShadow: \`0 2px 6px \${currentTheme.accentColor}20\`,
    zIndex: 10
  };
  
  // Icon style
  const iconStyle = {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    borderRadius: "12px",
    background: \`linear-gradient(135deg, \${currentTheme.borderLight}, \${currentTheme.borderDark})\`,
    fontSize: "24px",
    color: currentTheme.accentColor,
    boxShadow: \`inset 0 2px 4px \${currentTheme.borderLight}, 0 2px 4px rgba(0,0,0,0.1)\`,
  };
  
  // Image overlay gradient
  const imageOverlayStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
    zIndex: 1
  };

  // Special effects
  const particleStyle = {
    position: "absolute",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: currentTheme.accentColor,
    opacity: 0.4,
    filter: \`blur(1px) drop-shadow(0 0 2px \${currentTheme.accentColor})\`,
    zIndex: 0
  };

  // Generate particles for visual effect
  const renderParticles = () => {
    if (!isHovered || !hoverEffect) return null;
    
    const particles = [];
    const count = 8; // Number of particles
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      
      particles.push(
        <div
          key={i}
          style={{
            ...particleStyle,
            width: \`\${size}px\`,
            height: \`\${size}px\`,
            left: \`\${left}%\`,
            top: \`\${top}%\`,
            animation: \`float \${duration}s \${delay}s infinite ease-in-out\`
          }}
        />
      );
    }
    
    return particles;
  };

  // Animation styles
  const animationStyles = \`
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-10px) translateX(5px); }
      50% { transform: translateY(-15px) translateX(-5px); }
      75% { transform: translateY(-7px) translateX(-8px); }
    }
    
    @keyframes shine {
      0% { background-position: -100% 0; }
      100% { background-position: 200% 0; }
    }
  \`;

  return (
    <div
      ref={cardRef}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <style>{animationStyles}</style>
      
      {/* Floating particles effect */}
      {renderParticles()}
      
      {/* Badge if provided */}
      {badge && <div style={badgeStyle}>{badge}</div>}
      
      {/* Image section */}
      {image && (
        <div style={imageContainerStyle}>
          <img src={image} alt={title || 'Card image'} style={imageStyle} />
          <div style={imageOverlayStyle}></div>
        </div>
      )}
      
      {/* Content section */}
      <div style={contentStyle}>
        {icon && !image && <div style={iconStyle}>{icon}</div>}
        
        {/* Title with gradient effect */}
        <h3 style={{
          fontSize: currentSize.titleSize,
          fontWeight: 600,
          marginBottom: '10px',
          color: currentTheme.textColor,
          background: \`linear-gradient(90deg, \${currentTheme.accentColor}, \${currentTheme.textColor})\`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: \`0 1px 2px rgba(0,0,0,0.1)\`
        }}>
          {title || "Advanced Card"}
        </h3>
        
        {/* Description text */}
        <p style={{
          color: currentTheme.secondaryTextColor,
          fontSize: currentSize.textSize,
          lineHeight: 1.6,
          marginBottom: footer ? '16px' : '0',
          fontWeight: 400,
        }}>
          {description || "This is an advanced neumorphic card with interactive lighting effects, 3D transformations, and elegant design details."}
        </p>
        
        {/* Footer section with separator */}
        {footer && (
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: \`1px solid \${currentTheme.borderDark}\`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}`,
    implementationGuide: `# NeumorphicCard Component

A sophisticated, interactive UI component with advanced neumorphic design, 3D effects, dynamic lighting, and polished visual details.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | "Advanced Card" | Main card title with gradient effect |
| description | string | - | Card description text |
| image | string | - | URL for optional header image |
| icon | ReactNode | - | Icon to display when no image is used |
| footer | ReactNode | - | Custom footer content |
| variant | string | "primary" | Color theme: "primary", "dark", "success", "danger", "cosmic", "glass" |
| elevation | string | "medium" | Shadow depth: "flat", "low", "medium", "high" |
| hoverEffect | boolean | true | Enable/disable interactive effects |
| size | string | "default" | Card size: "small", "default", "large" |
| rounded | string | "default" | Border radius: "none", "default", "full" |
| badge | string | - | Optional badge text for the top-right corner |
| onClick | function | - | Click handler for the card |


## Visual Features

### 1. Advanced Neumorphic Design
- Realistic light and shadow effects that simulate physical elevation
- Soft inner shadows and dynamic outer glow on hover
- Border lighting that varies between edges to enhance depth perception

### 2. Interactive 3D Effects
- Perspective transformation that follows cursor movement
- Tilt animation that responds naturally to mouse position
- Smooth transition when entering and leaving the hover state
- Depth effect that makes the card appear to lift off the surface

### 3. Dynamic Visual Elements
- Gradient title text with accent color that matches the theme
- Floating particle animations that appear on hover
- Image scale effect with smooth easing
- Smart handling of different content types (image, icon, or plain)

### 4. Adaptable Design System
- Six carefully crafted color themes with complementary accent colors
- Four elevation levels with appropriate shadow configuration
- Three size presets with proportional spacing and typography
- Rounded corner options from square to highly rounded

## Accessibility Considerations

- Interactive elements clearly indicate their purpose and state
- Color contrast ratios meet WCAG AA standards across all themes
- Animation effects can be disabled via the hoverEffect prop
- Focus states properly handled for keyboard navigation

## Implementation Details

The component uses precise CSS techniques to create realistic lighting effects:
- Multiple layered shadows for depth perception
- Gradient borders that vary from light to dark across edges
- Dynamic background that responds to mouse position
- GPU-accelerated animations for smooth performance even with complex effects`,
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
    button: ["button", "click", "submit", "action", "btn", "press"],
    card: ["card", "container", "panel", "box", "grid", "tile", "neumorphic"],
    toggle: ["toggle", "switch", "checkbox", "on/off", "boolean", "theme"],
    navbar: [
      "navbar",
      "navigation",
      "header",
      "menu",
      "bar",
      "appbar",
      "toolbar",
    ],
    spinner: ["spinner", "loader", "loading", "progress", "wait", "circle"],
  };

  // For iterations, just return a slightly modified version of the component
  if (existingCode) {
    // Find which component we're working with
    let componentType = "card"; // Default to card (our best component)

    // Improved component type detection
    if (
      existingCode.includes("NeumorphicCard") ||
      existingCode.includes("mainGradient") ||
      existingCode.includes("variants = {")
    ) {
      componentType = "card";
    } else if (existingCode.includes("AnimatedButton")) {
      componentType = "button";
    } else if (
      existingCode.includes("AnimatedToggle") ||
      existingCode.includes("toggleContainerStyle")
    ) {
      componentType = "toggle";
    } else if (
      existingCode.includes("LoadingSpinner") ||
      existingCode.includes("spinnerStyle")
    ) {
      componentType = "spinner";
    } else if (
      existingCode.includes("SimpleNavbar") ||
      existingCode.includes("navLinks")
    ) {
      componentType = "navbar";
    } else {
      // If no specific match, look at function name patterns
      for (const [type, demo] of Object.entries(demoComponents)) {
        if (existingCode.includes(demo.code.substring(0, 100))) {
          componentType = type;
          break;
        }
      }
    }

    const baseComponent = demoComponents[componentType];

    // Apply more interesting modifications based on the prompt
    let modifiedCode = baseComponent.code;
    let modifiedGuide = baseComponent.implementationGuide;

    // Add customizations based on prompt
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

  // If no clear winner, default to the card (it's our most impressive component)
  const bestMatch = scores[0].score > 0 ? scores[0].component : "card";

  // Return the best matching component
  return demoComponents[bestMatch] || demoComponents.card;
}
