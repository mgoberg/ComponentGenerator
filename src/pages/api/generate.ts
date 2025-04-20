import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Define the structure of Claude API content items
interface ContentItem {
  type: string;
  text: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Check if this is an iteration request (contains existing code)
    const isIteration = prompt.includes("Based on this component:");

    const systemPromptBase =
      "1. COMPONENT_CODE: Create a visually stunning React UI component with these specifications:\n" +
      "   - Design the component with modern, elegant aesthetics (subtle gradients, soft shadows, rounded corners)\n" +
      "   - Incorporate thoughtful animations and micro-interactions that enhance usability\n" +
      "   - Use a cohesive color scheme with carefully selected complementary colors\n" +
      "   - Balance whitespace effectively for a clean, professional appearance\n" +
      "   - Ensure the component is fully accessible (ARIA attributes, keyboard navigation, sufficient contrast)\n" +
      "   - Make the component responsive with fluid layouts that work across all screen sizes\n" +
      "   - Include meaningful props with sensible defaults for easy customization\n" +
      "   - Add smooth transitions between states (hover, active, focus, etc.)\n" +
      "   - Incorporate subtle, delightful details that make the component feel polished\n\n" +
      "   Technical requirements:\n" +
      "   - Use pure JSX/JavaScript (no TypeScript) for preview compatibility\n" +
      "   - Access React hooks with destructuring: const { useState, useEffect } = React;\n" +
      "   - Define the component as a named function to make it globally accessible\n" +
      "   - For animations: Use keyframes in template literals or inline styles\n" +
      "   - For complex components: Handle edge cases and provide fallbacks\n" +
      "   - Ensure clean event handling with proper cleanup in useEffect when needed\n" +
      "   - Ensure all dynamic elements are properly initialized to prevent 'undefined' errors\n" +
      "   - For modals and popups, make them visible by default in the preview\n";

    // Claude API request
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-5-sonnet-20240620", // Using Claude 3.5 Sonnet explicitly
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: isIteration
              ? `You're an expert UI designer and React developer known for creating beautiful, visually stunning components with perfect animations and interactions. A user has provided an existing component and wants specific improvements. Please update it while maintaining or enhancing its visual appeal.

Provide your response in two separate parts:
1. COMPONENT_CODE: The updated React UI component with the requested changes, making it more visually appealing and polished.
2. IMPLEMENTATION_GUIDE: A clear guide explaining the changes and how to use this enhanced component.

Make sure animations are smooth, design is modern, and code is clean.

${prompt}`
              : `You're an expert UI designer and React developer known for creating beautiful, visually stunning components with perfect animations and interactions. Create a component that will impress users with its polish and elegance.

${systemPromptBase}
2. IMPLEMENTATION_GUIDE: Write a helpful guide explaining how to use this component:
   - Detail all available props and their purpose
   - Explain how to integrate the component into a React application
   - List required imports for a real-world implementation
   - Provide examples of different configurations or variants
   - Include accessibility considerations and best practices
   - Highlight any special features or animations worth noting

Structure your response exactly like this:
COMPONENT_CODE:
[Your beautiful React UI component code]

IMPLEMENTATION_GUIDE:
[Your clear, well-organized implementation guide]

${prompt}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    // Extract content from Claude's response - handle both string and object formats
    let fullResponse = "";

    try {
      // Handle response structure based on Claude API version
      if (response.data && response.data.content) {
        // Handle array of content blocks (Claude 3.7 format)
        if (Array.isArray(response.data.content)) {
          fullResponse = response.data.content
            .filter((item: ContentItem) => item.type === "text")
            .map((item: ContentItem) => item.text)
            .join("\n");
        }
        // Handle single content object
        else if (
          typeof response.data.content === "object" &&
          response.data.content.text
        ) {
          fullResponse = response.data.content.text;
        }
        // Handle direct text content (Claude 3.5 format)
        else if (typeof response.data.content === "string") {
          fullResponse = response.data.content;
        }
      }
    } catch (err) {
      console.error("Error parsing Claude response:", err);
      fullResponse = JSON.stringify(response.data);
    }

    // Extract code and implementation guide using regex
    const codeMatch = fullResponse.match(
      /COMPONENT_CODE:(?:\s*)([\s\S]*?)(?=IMPLEMENTATION_GUIDE:|$)/i
    );

    const implementationMatch = fullResponse.match(
      /IMPLEMENTATION_GUIDE:(?:\s*)([\s\S]*)/i
    );

    let generatedCode = "";
    let implementationGuide = "";

    if (codeMatch && codeMatch[1]) {
      generatedCode = codeMatch[1].trim();
    } else {
      // If we can't extract the code using regex, use a fallback approach
      const parts = fullResponse.split(/IMPLEMENTATION_GUIDE:/i);
      if (parts.length > 0) {
        generatedCode = parts[0].replace(/COMPONENT_CODE:/i, "").trim();
      } else {
        generatedCode = fullResponse;
      }
    }

    if (implementationMatch && implementationMatch[1]) {
      implementationGuide = implementationMatch[1].trim();
    } else {
      const parts = fullResponse.split(/IMPLEMENTATION_GUIDE:/i);
      if (parts.length > 1) {
        implementationGuide = parts[1].trim();
      }
    }

    // Clean up potential markdown code blocks
    generatedCode = generatedCode
      .replace(/```(jsx|js|tsx|typescript|javascript|react)?\n/g, "")
      .replace(/```\s*$/g, "");

    // Remove import/export statements from the preview code as they won't work in browser
    generatedCode = generatedCode
      .replace(/import\s+.*?;?\n/g, "")
      .replace(/export\s+default\s+/g, "");

    // Fix common recursive requestAnimationFrame issues
    generatedCode = generatedCode.replace(
      /requestAnimationFrame\(function\s+animate\(\)/g,
      "const animate = function()"
    );
    generatedCode = generatedCode.replace(
      /requestAnimationFrame\(animate\)/g,
      "requestAnimationFrame(animate)"
    );

    // Fix specific issues with animation frames
    if (
      generatedCode.includes("requestAnimationFrame") &&
      generatedCode.includes("setRotation")
    ) {
      const animFrameFix = `
        let animationFrameId;
        
        const animate = () => {
          setRotation((prevRotation) => (prevRotation + speed) % 360);
          animationFrameId = requestAnimationFrame(animate);
        };
        
        animationFrameId = requestAnimationFrame(animate);
        
        return () => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
        };
      `;

      // Try to replace problematic animation frame code with the fixed version
      generatedCode = generatedCode.replace(
        /const\s+animationFrame\s*=\s*requestAnimationFrame\(\s*function\s+animate\(\)\s*\{[\s\S]*?return\s*\(\)\s*=>\s*cancelAnimationFrame\(\s*animationFrame\s*\);/,
        animFrameFix
      );
    }

    // If the code still contains markdown formatting or is just the word "object"
    if (
      generatedCode === "object" ||
      (!generatedCode.includes("function") && !generatedCode.includes("=>"))
    ) {
      return res.status(500).json({
        error:
          "Failed to parse the generated component code. Please try again.",
      });
    }

    return res.status(200).json({
      code: generatedCode,
      implementationGuide: implementationGuide,
    });
  } catch (error: any) {
    console.error("Claude API error:", error.response?.data || error.message);
    return res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to generate code",
    });
  }
}
