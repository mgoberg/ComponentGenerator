import React, { useState, useEffect } from "react";
import Head from "next/head";
import CodeEditor from "@/components/CodeEditor";
import ReactPreviewPane from "@/components/ReactPreviewPane";
import ImplementationGuide from "@/components/ImplementationGuide";
import PromptHistory from "@/components/PromptHistory";
import ComponentHistory from "@/components/ComponentHistory";
import { extractComponentName } from "@/utils/codeProcessor";

// Define the structure for iteration history
interface Iteration {
  id: string;
  prompt: string;
  code: string;
  implementationGuide: string;
  timestamp: Date;
  isInitial: boolean;
}

// Define the structure for component history
interface Component {
  id: string;
  name: string;
  code: string;
  implementationGuide: string;
  timestamp: Date;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [implementationGuide, setImplementationGuide] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterationPrompt, setIterationPrompt] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  // Store iteration history
  const [iterationHistory, setIterationHistory] = useState<Iteration[]>([]);
  const [activeIterationId, setActiveIterationId] = useState<string | null>(
    null
  );

  // Store component history
  const [componentHistory, setComponentHistory] = useState<Component[]>([]);
  const [activeComponentId, setActiveComponentId] = useState<string | null>(
    null
  );

  // Handle first-time generation
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate code");
      }

      const data = await response.json();

      // Create a new iteration entry
      const newIteration: Iteration = {
        id: generateId(),
        prompt,
        code: data.code,
        implementationGuide: data.implementationGuide || "",
        timestamp: new Date(),
        isInitial: true,
      };

      // Update state with new data
      setGeneratedCode(data.code);
      setImplementationGuide(data.implementationGuide || "");
      setHasGenerated(true);

      // Add to history and set as active
      setIterationHistory([newIteration]);
      setActiveIterationId(newIteration.id);

      // Also add to component history
      const componentName =
        extractComponentName(data.code) ||
        "Component " + (componentHistory.length + 1);
      const newComponent: Component = {
        id: generateId(),
        name: componentName,
        code: data.code,
        implementationGuide: data.implementationGuide || "",
        timestamp: new Date(),
      };

      setComponentHistory((prev) => [...prev, newComponent]);
      setActiveComponentId(newComponent.id);

      // Clear the prompt field for future iterations
      setPrompt("");
    } catch (error: any) {
      console.error("Error generating code:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle subsequent iterations - update the activeComponentId's iterations
  const handleIteration = async () => {
    if (!iterationPrompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Based on this component: \n\n${generatedCode}\n\nMake the following changes: ${iterationPrompt}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate code");
      }

      const data = await response.json();

      // Create a new iteration entry
      const newIteration: Iteration = {
        id: generateId(),
        prompt: iterationPrompt,
        code: data.code,
        implementationGuide: data.implementationGuide || "",
        timestamp: new Date(),
        isInitial: false,
      };

      // Update state with new data
      setGeneratedCode(data.code);
      setImplementationGuide(data.implementationGuide || "");

      // Add to history and set as active
      setIterationHistory((prev) => [...prev, newIteration]);
      setActiveIterationId(newIteration.id);

      // Also update the current component's code in component history
      if (activeComponentId) {
        setComponentHistory((prev) =>
          prev.map((component) =>
            component.id === activeComponentId
              ? {
                  ...component,
                  code: data.code,
                  implementationGuide: data.implementationGuide || "",
                }
              : component
          )
        );
      }

      // Clear the iteration prompt for future iterations
      setIterationPrompt("");
    } catch (error: any) {
      console.error("Error generating code:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new generation (clearing the current one)
  const handleNewGeneration = () => {
    setHasGenerated(false);
    setGeneratedCode("");
    setImplementationGuide("");
    setPrompt("");
    setIterationPrompt("");
    setError(null);
    // Keep the history but clear the active iteration
    setActiveIterationId(null);
    setActiveComponentId(null);
  };

  // Handle switching between components in history
  const handleSwitchComponent = (componentId: string) => {
    const component = componentHistory.find((c) => c.id === componentId);
    if (component) {
      setGeneratedCode(component.code);
      setImplementationGuide(component.implementationGuide);
      setActiveComponentId(componentId);

      // Reset iteration history for this component
      setIterationHistory([
        {
          id: generateId(),
          prompt: `Loaded component: ${component.name}`,
          code: component.code,
          implementationGuide: component.implementationGuide,
          timestamp: new Date(),
          isInitial: true,
        },
      ]);
      setActiveIterationId(null);
    }
  };

  // Delete a component from history
  const handleDeleteComponent = (componentId: string) => {
    // Find the component to be deleted
    const componentIndex = componentHistory.findIndex(
      (c) => c.id === componentId
    );

    if (componentIndex === -1) return;

    // Update history
    const newHistory = [
      ...componentHistory.slice(0, componentIndex),
      ...componentHistory.slice(componentIndex + 1),
    ];
    setComponentHistory(newHistory);

    // If we're deleting the active component, switch to the most recent one
    if (activeComponentId === componentId) {
      if (newHistory.length > 0) {
        const newActiveComponent = newHistory[newHistory.length - 1];
        setGeneratedCode(newActiveComponent.code);
        setImplementationGuide(newActiveComponent.implementationGuide);
        setActiveComponentId(newActiveComponent.id);

        // Reset iteration history for this component
        setIterationHistory([
          {
            id: generateId(),
            prompt: `Loaded component: ${newActiveComponent.name}`,
            code: newActiveComponent.code,
            implementationGuide: newActiveComponent.implementationGuide,
            timestamp: new Date(),
            isInitial: true,
          },
        ]);
        setActiveIterationId(null);
      } else {
        // If no components left, reset to initial state
        handleNewGeneration();
      }
    }
  };

  // Handle switching between iterations in history
  const handleSwitchIteration = (iterationId: string) => {
    const iteration = iterationHistory.find((i) => i.id === iterationId);
    if (iteration) {
      setGeneratedCode(iteration.code);
      setImplementationGuide(iteration.implementationGuide);
      setActiveIterationId(iterationId);
    }
  };

  // Delete an iteration from history
  const handleDeleteIteration = (iterationId: string) => {
    // Find the iteration to be deleted
    const iterationIndex = iterationHistory.findIndex(
      (i) => i.id === iterationId
    );

    if (iterationIndex === -1) return;

    // Update history
    const newHistory = [
      ...iterationHistory.slice(0, iterationIndex),
      ...iterationHistory.slice(iterationIndex + 1),
    ];
    setIterationHistory(newHistory);

    // If we're deleting the active iteration, switch to the most recent one
    if (activeIterationId === iterationId) {
      if (newHistory.length > 0) {
        const newActiveIteration = newHistory[newHistory.length - 1];
        setGeneratedCode(newActiveIteration.code);
        setImplementationGuide(newActiveIteration.implementationGuide);
        setActiveIterationId(newActiveIteration.id);
      } else {
        // If no iterations left, reset to initial state
        handleNewGeneration();
      }
    }
  };

  // Iterate on an old iteration
  const handleIterateFromPast = (iterationId: string) => {
    const iteration = iterationHistory.find((i) => i.id === iterationId);
    if (iteration) {
      setGeneratedCode(iteration.code);
      setActiveIterationId(iterationId);
      // Focus on iteration input
      document.getElementById("iteration-input")?.focus();
    }
  };

  // Helper to generate unique IDs
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  };

  return (
    <>
      <Head>
        <title>AI React UI Component Designer</title>
        <meta
          name="description"
          content="Generate React UI components with AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0d0f10] text-[#ececf1]">
        <header className="border-b border-[#444654] bg-[#202123] shadow-sm">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl md:text-2xl font-bold">
              ✨ AI React UI Component Designer
            </h1>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6 max-w-7xl">
          {!hasGenerated ? (
            // Initial prompt box - only shown before first generation
            <div className="mb-6 bg-[#202123] p-4 rounded-lg shadow-md">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <span className="mr-2">🎨</span> Describe the UI component you
                want to create:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                  className="flex-1 p-3 border border-[#444654] rounded-md bg-[#2d2d33] text-white focus:outline-none focus:ring-2 focus:ring-[#10a37f]"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Examples: A toggle switch with animation, A card component with hover effects, A responsive navigation bar, A custom select dropdown, etc."
                />
                <button
                  className="bg-[#10a37f] text-white px-4 py-2 rounded-md hover:bg-[#0e9170] focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition-colors duration-200 flex items-center justify-center"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⚙️</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span> Generate
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-500">{error}</div>
              )}
            </div>
          ) : (
            // New generation button - shown after first generation
            <div className="flex mb-6 gap-3">
              <button
                onClick={handleNewGeneration}
                className="bg-[#2d2d33] hover:bg-[#3d3d43] text-gray-200 px-3 py-2 rounded-md transition-colors duration-200 flex items-center text-sm"
              >
                <span className="mr-2">🔄</span> New Component
              </button>

              {/* Component History Dropdown */}
              <ComponentHistory
                components={componentHistory}
                activeId={activeComponentId}
                onSwitch={handleSwitchComponent}
                onDelete={handleDeleteComponent}
              />

              {/* Iteration History Dropdown */}
              {iterationHistory.length > 1 && (
                <PromptHistory
                  iterations={iterationHistory}
                  activeId={activeIterationId}
                  onSwitch={handleSwitchIteration}
                  onDelete={handleDeleteIteration}
                  onIterate={handleIterateFromPast}
                />
              )}
            </div>
          )}

          {generatedCode && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#202123] p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-3 flex items-center">
                    <span className="mr-2">📝</span> UI Component Code
                  </h2>
                  <CodeEditor
                    code={generatedCode}
                    onChange={setGeneratedCode}
                  />
                </div>

                <div className="bg-[#202123] p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-3 flex items-center">
                    <span className="mr-2">👁️</span> Component Preview
                  </h2>
                  <ReactPreviewPane code={generatedCode} />
                </div>
              </div>

              <div className="mb-6 bg-[#202123] p-4 rounded-lg shadow-md">
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <span className="mr-2">🔧</span> Iteration: Request changes or
                  improvements
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    id="iteration-input"
                    className="flex-1 p-3 border border-[#444654] rounded-md bg-[#2d2d33] text-white focus:outline-none focus:ring-2 focus:ring-[#10a37f]"
                    rows={2}
                    value={iterationPrompt}
                    onChange={(e) => setIterationPrompt(e.target.value)}
                    placeholder="Example: Change the color to blue, add a hover effect, make it more accessible, etc."
                  />
                  <button
                    className="bg-[#10a37f] text-white px-4 py-2 rounded-md hover:bg-[#0e9170] focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition-colors duration-200 flex items-center justify-center"
                    onClick={handleIteration}
                    disabled={loading || !iterationPrompt.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="inline-block animate-spin mr-2">
                          ⚙️
                        </span>
                        Applying...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">✅</span> Apply Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-[#202123] p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <span className="mr-2">📚</span> How to Implement
                </h2>
                <ImplementationGuide
                  guide={implementationGuide}
                  code={generatedCode}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
