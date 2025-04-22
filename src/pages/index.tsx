import React, { useState, useEffect } from "react";
import Head from "next/head";
import CodeEditor from "@/components/CodeEditor";
import ReactPreviewPane from "@/components/ReactPreviewPane";
import ImplementationGuide from "@/components/ImplementationGuide";
import PromptHistory from "@/components/PromptHistory";
import ComponentHistory from "@/components/ComponentHistory";
import ImageUploader from "@/components/ImageUploader";
import VersionInfo from "@/components/VersionInfo";
import { appConfig } from "@/config/appConfig";
import { extractComponentName } from "@/utils/codeProcessor";
import { getDemoComponent } from "@/utils/demoComponents";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [contextImage, setContextImage] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(true);

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

  // Find the initial prompt from the iteration history
  const getInitialPrompt = (): string => {
    if (iterationHistory.length === 0) return "";
    const initialIteration = iterationHistory.find((i) => i.isInitial);
    return initialIteration ? initialIteration.prompt : "";
  };

  // Handle first-time generation
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let data;

      if (demoMode) {
        // Get mock data from the demo components
        data = getDemoComponent(prompt);
        // Short artificial delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            contextImage: contextImage, // Include the image data when sending the request
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to generate code");
        }

        data = await response.json();
      }

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
      let data;

      if (demoMode) {
        // Get mock iteration data
        data = getDemoComponent(iterationPrompt, generatedCode);
        // Short artificial delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
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

        data = await response.json();
      }

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
        <title>CompGen - React Component Generator</title>
        <meta
          name="description"
          content="Generate React UI components with AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Added ambient background with glass UI */}
      <div className="min-h-screen bg-[#0d0f10] text-[#ececf1] relative overflow-hidden">
        {/* Ambient light backgrounds with pulse animation */}
        <div className="absolute top-[-350px] left-[-350px] w-[700px] h-[700px] rounded-full bg-[#2563eb]/10 blur-[150px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-[-350px] right-[-350px] w-[700px] h-[700px] rounded-full bg-[#10a37f]/10 blur-[150px] pointer-events-none animate-pulse-slow-alt"></div>

        <header className="border-b border-[#444654]/40 bg-[#202123]/60 shadow-sm backdrop-blur-xl relative z-10">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl md:text-2xl font-bold">
              CompGen - React Component Generator
            </h1>

            {/* Demo Mode Toggle - Changed to always show "API Mode" */}
            <div className="flex items-center space-x-2">
              <Switch
                id="demo-mode"
                checked={demoMode}
                onCheckedChange={(checked) => {
                  console.log("Setting demo mode to:", checked);
                  setDemoMode(checked);
                }}
              />
              <Label htmlFor="demo-mode" className="text-sm">
                API Mode
              </Label>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6 max-w-5xl relative z-10">
          {!hasGenerated ? (
            // Initial prompt box - only shown before first generation
            <Card className="mb-6 backdrop-blur-xl bg-[#202123]/50 border-[#444654]/30 shadow-lg">
              <CardHeader>
                {demoMode && (
                  <div className="mb-4 bg-[#10a37f10] border-l-4 border-[#10a37f] p-3 rounded backdrop-blur-xl">
                    <p className="text-sm text-[#ececf1]">
                      <span className="font-bold">Demo Mode Active:</span> Using
                      pre-generated examples instead of the API. No API key
                      required in this mode.
                    </p>
                  </div>
                )}

                <Label className="text-sm font-medium mb-2 flex items-center">
                  Describe the UI component you want to create:
                </Label>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Examples: A toggle switch with animation, A card component with hover effects, A responsive navigation bar, A custom select dropdown, etc."
                    className="bg-[#2d2d33]/50 backdrop-blur-sm"
                  />

                  {/* Add the ImageUploader component */}
                  <ImageUploader
                    onImageSelect={setContextImage}
                    selectedImage={contextImage}
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="brand"
                      onClick={handleGenerate}
                      disabled={loading}
                      className="px-4 py-2 rounded-md"
                    >
                      {loading ? (
                        <>
                          <span className="inline-block animate-spin mr-2">
                            ◐
                          </span>
                          Generating...
                        </>
                      ) : (
                        "Generate Component"
                      )}
                    </Button>
                  </div>
                </div>
                {error && (
                  <div className="mt-2 text-sm text-red-500">{error}</div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Display area for initial prompt */}
              <div className="flex mb-1.5 text-sm text-gray-400 items-center px-1">
                <span className="font-medium mr-2">Initial prompt:</span>
                <span className="italic truncate">{getInitialPrompt()}</span>
              </div>

              {/* New generation button - shown after first generation */}
              <div className="flex mb-6 gap-3">
                <Button
                  onClick={handleNewGeneration}
                  variant="outline"
                  size="sm"
                  className="bg-[#2d2d33]/60 hover:bg-[#3d3d43]/60 text-gray-200 backdrop-blur-sm"
                >
                  New Component
                </Button>

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
            </>
          )}

          {generatedCode && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="backdrop-blur-xl bg-[#202123]/50 border-[#444654]/30 shadow-lg h-full">
                  <CardHeader className="pb-2">
                    <CardTitle>UI Component Code</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 h-full">
                    <CodeEditor
                      code={generatedCode}
                      onChange={setGeneratedCode}
                    />
                  </CardContent>
                </Card>

                {/* Component Preview Card - Made taller */}
                <Card className="backdrop-blur-xl bg-[#202123]/50 border-[#444654]/30 shadow-lg h-full">
                  <CardHeader className="pb-2">
                    <CardTitle>Component Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 h-full">
                    <ReactPreviewPane code={generatedCode} />
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-6 backdrop-blur-xl bg-[#202123]/50 border-[#444654]/30 shadow-lg">
                <CardHeader>
                  <Label className="text-sm font-medium mb-2 flex items-center">
                    Iteration: Request changes or improvements
                  </Label>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Textarea
                      id="iteration-input"
                      className="flex-1 bg-[#2d2d33]/50 backdrop-blur-sm"
                      rows={2}
                      value={iterationPrompt}
                      onChange={(e) => setIterationPrompt(e.target.value)}
                      placeholder="Example: Change the color to blue, add a hover effect, make it more accessible, etc."
                    />
                    <Button
                      variant="brand"
                      onClick={handleIteration}
                      disabled={loading || !iterationPrompt.trim()}
                      className="h-auto whitespace-nowrap"
                    >
                      {loading ? (
                        <>
                          <span className="inline-block animate-spin mr-2">
                            ◐
                          </span>
                          Applying...
                        </>
                      ) : (
                        "Apply Changes"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-[#202123]/50 border-[#444654]/30 shadow-lg">
                <CardHeader>
                  <CardTitle>How your component works</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImplementationGuide
                    guide={implementationGuide}
                    code={generatedCode}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </main>

        {/* Version info component */}
        <VersionInfo
          version={appConfig.version}
          lastUpdated={appConfig.lastUpdated}
        />
      </div>
    </>
  );
}
