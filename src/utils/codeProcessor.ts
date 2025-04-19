/**
 * Processes raw code from AI generation by removing markdown formatting
 * and handling special content like CSS and JavaScript.
 */
export function processGeneratedCode(rawCode: string): string {
  if (!rawCode) return "";

  // Remove markdown code block markers (```tsx, etc.)
  let cleanCode = rawCode
    .replace(/```(tsx|jsx|typescript|javascript|react|js)?\n/g, "")
    .replace(/```\s*$/g, "");

  // Handle any trailing spaces or unnecessary line breaks
  cleanCode = cleanCode.trim();

  return cleanCode;
}

/**
 * Extracts CSS from a code string, either from <style> tags or from CSS blocks
 */
export function extractCSS(code: string): string {
  if (!code) return "";

  // Try to extract from style tags first
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
  const styleMatches = Array.from(code.matchAll(styleRegex));

  if (styleMatches.length > 0) {
    return styleMatches.map((match) => match[1]).join("\n\n");
  }

  // If no style tags, check if this is a CSS-only block
  if (!code.includes("<") && (code.includes("{") || code.includes("@media"))) {
    return code;
  }

  return "";
}

/**
 * Extracts JavaScript from a code string in <script> tags
 */
export function extractJavaScript(code: string): string {
  if (!code) return "";

  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  const scriptMatches = Array.from(code.matchAll(scriptRegex));

  if (scriptMatches.length > 0) {
    return scriptMatches.map((match) => match[1]).join("\n\n");
  }

  return "";
}

/**
 * Extracts component name from React component code
 */
export function extractComponentName(code: string): string {
  if (!code) return "Component";

  // Try to match various component definition patterns
  // Function declarations: function MyComponent() { ... }
  const functionMatch = code.match(/function\s+([A-Z]\w+)\s*\(/);
  if (functionMatch && functionMatch[1]) {
    return functionMatch[1];
  }

  // Arrow function constants: const MyComponent = () => { ... }
  const constArrowMatch = code.match(/const\s+([A-Z]\w+)\s*=\s*\([^)]*\)\s*=>/);
  if (constArrowMatch && constArrowMatch[1]) {
    return constArrowMatch[1];
  }

  // Standard constants: const MyComponent = function() { ... }
  const constFunctionMatch = code.match(/const\s+([A-Z]\w+)\s*=\s*function/);
  if (constFunctionMatch && constFunctionMatch[1]) {
    return constFunctionMatch[1];
  }

  // React.memo, forwardRef: const MyComponent = React.memo(...)
  const memoMatch = code.match(
    /const\s+([A-Z]\w+)\s*=\s*React\.(memo|forwardRef)/
  );
  if (memoMatch && memoMatch[1]) {
    return memoMatch[1];
  }

  // Default component name
  return "Component";
}

/**
 * Extracts imports from React component code
 */
export function extractImports(code: string): string[] {
  if (!code) return [];

  const importRegex = /import\s+.*from\s+['"].*['"]/g;
  return Array.from(code.match(importRegex) || []);
}
