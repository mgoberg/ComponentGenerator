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

  // Fix common undefined .map() errors by adding safety checks
  cleanCode = cleanCode.replace(/(\w+)\.map\(/g, "($1 || []).map(");

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
  // Default component name
  let componentName = "CustomComponent";

  // Try to find export default function ComponentName or const ComponentName =
  const functionComponentRegex = /export\s+default\s+function\s+(\w+)/;
  const constComponentRegex =
    /const\s+(\w+)\s*=\s*(?:\(\s*(\{.*?\})\s*\)\s*=>|React\.memo|React\.forwardRef)/;

  const functionMatch = code.match(functionComponentRegex);
  const constMatch = code.match(constComponentRegex);

  if (functionMatch && functionMatch[1]) {
    componentName = functionMatch[1];
  } else if (constMatch && constMatch[1]) {
    componentName = constMatch[1];
  }

  return componentName;
}

/**
 * Extracts imports from React component code
 */
export function extractImports(code: string): string[] {
  if (!code) return [];

  const importRegex = /import\s+.*?from\s+['"].*?['"]\s*;?/g;
  return code.match(importRegex) || [];
}
