import React, { useState } from "react";
import Head from "next/head";
import CodeEditor from "@/components/CodeEditor";
import ReactPreviewPane from "@/components/ReactPreviewPane";
import ImplementationGuide from "@/components/ImplementationGuide";
import { processGeneratedCode } from "@/utils/codeProcessor";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [implementationGuide, setImplementationGuide] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterationPrompt, setIterationPrompt] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

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
      setGeneratedCode(data.code);
      setImplementationGuide(data.implementationGuide || "");
      setHasGenerated(true);
    } catch (error: any) {
      console.error("Error generating code:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      setGeneratedCode(data.code);
      setImplementationGuide(data.implementationGuide || "");
      setIterationPrompt("");
    } catch (error: any) {
      console.error("Error generating code:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
              AI React UI Component Designer
            </h1>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6 max-w-7xl">
          <div className="mb-6 bg-[#202123] p-4 rounded-lg shadow-md">
            <label className="block text-sm font-medium mb-2">
              Describe the UI component you want to create:
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
                className="bg-[#10a37f] text-white px-4 py-2 rounded-md hover:bg-[#0e9170] focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition-colors duration-200"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⚙️</span>
                    Generating...
                  </>
                ) : hasGenerated ? (
                  "Regenerate"
                ) : (
                  "Generate"
                )}
              </button>
            </div>
            {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
          </div>

          {generatedCode && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#202123] p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-3">UI Component Code</h2>
                <CodeEditor code={generatedCode} onChange={setGeneratedCode} />
              </div>

              <div className="bg-[#202123] p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-3">Component Preview</h2>
                <ReactPreviewPane code={generatedCode} />
              </div>
            </div>
          )}

          {generatedCode && (
            <div className="mb-6 bg-[#202123] p-4 rounded-lg shadow-md">
              <label className="block text-sm font-medium mb-2">
                Iteration: Request changes or improvements to the component
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                  className="flex-1 p-3 border border-[#444654] rounded-md bg-[#2d2d33] text-white focus:outline-none focus:ring-2 focus:ring-[#10a37f]"
                  rows={2}
                  value={iterationPrompt}
                  onChange={(e) => setIterationPrompt(e.target.value)}
                  placeholder="Example: Change the color to blue, add a hover effect, make it more accessible, etc."
                />
                <button
                  className="bg-[#10a37f] text-white px-4 py-2 rounded-md hover:bg-[#0e9170] focus:outline-none focus:ring-2 focus:ring-[#10a37f] transition-colors duration-200"
                  onClick={handleIteration}
                  disabled={loading || !iterationPrompt.trim()}
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⚙️</span>
                      Applying...
                    </>
                  ) : (
                    "Apply Changes"
                  )}
                </button>
              </div>
            </div>
          )}

          {generatedCode && (
            <div className="bg-[#202123] p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-3">How to Implement</h2>
              <ImplementationGuide
                guide={implementationGuide}
                code={generatedCode}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
