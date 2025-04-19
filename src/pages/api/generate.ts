import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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
      "1. COMPONENT_CODE: Generate a modern React UI component with these requirements:\n" +
      "   - Create a visually appealing, accessible, and reusable UI component\n" +
      "   - Use JSX (not TypeScript) for compatibility with the preview system\n" +
      "   - Include appropriate props with default values for customization\n" +
      "   - IMPORTANT: Access React hooks by destructuring from React at the top of your component, like: const { useState, useEffect } = React;\n" +
      "   - For modals and popups, make sure to include styling for the overlay and container\n" +
      "   - For animations and transitions, incorporate them directly in the component using these methods:\n" +
      "     a) For simple animations, use inline style with the animation property\n" +
      "     b) For keyframes, include them without comments (directly in the style object or as CSS in backticks)\n" +
      "     c) Make sure all animations work in the preview by using standard CSS animations\n" +
      "   - Define the component as a named function that can be accessed globally (no imports/exports)\n" +
      "   - Make sure it's responsive and works well on all screen sizes\n" +
      "   - When building modals, make sure the modal is visible by default in the preview\n";

    // Claude API request
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-5-sonnet-20240620", // Using Claude 3.5 Sonnet, update to 3.7 when available
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: isIteration
              ? `You are a UI component expert who specializes in React. The user will provide an existing component and request specific changes or improvements. Respond with the updated component implementation and usage guide.

Provide your response in two separate parts:
1. COMPONENT_CODE: The updated React UI component with the requested changes.
2. IMPLEMENTATION_GUIDE: Write a guide explaining the changes made and how to use this UI component.

Follow the same format requirements as before, ensuring animations are properly implemented.

${prompt}`
              : `You are a UI component expert who specializes in React. Provide your response in two separate parts:

${systemPromptBase}
2. IMPLEMENTATION_GUIDE: Write a guide explaining how to use this UI component, including:
   - All available props and their purpose
   - How to integrate it into a React application
   - Required imports for a real application
   - Examples of different configurations or variants
   - Any accessibility considerations

Format your response exactly like this:
COMPONENT_CODE:
[Your React UI component code here]

IMPLEMENTATION_GUIDE:
[Your implementation instructions here]

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

    // Extract content from Claude's response
    const fullResponse = response.data.content[0].text;

    // Extract code and implementation guide using regex
    const codeMatch = fullResponse.match(
      /COMPONENT_CODE:([\s\S]*?)(?=IMPLEMENTATION_GUIDE:|$)/
    );
    const implementationMatch = fullResponse.match(
      /IMPLEMENTATION_GUIDE:([\s\S]*)/
    );

    let generatedCode = codeMatch ? codeMatch[1].trim() : fullResponse;
    let implementationGuide = implementationMatch
      ? implementationMatch[1].trim()
      : "";

    // Clean up potential markdown code blocks
    generatedCode = generatedCode
      .replace(/```(jsx|js|tsx|typescript|javascript|react)?\n/g, "")
      .replace(/```\s*$/g, "");

    // Remove import/export statements from the preview code as they won't work in browser
    generatedCode = generatedCode
      .replace(/import\s+.*?;?\n/g, "")
      .replace(/export\s+default\s+/g, "");

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
