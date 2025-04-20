import React, { useState, useRef, useEffect } from "react";

interface Iteration {
  id: string;
  prompt: string;
  timestamp: Date;
  isInitial: boolean;
}

interface PromptHistoryProps {
  iterations: Iteration[];
  activeId: string | null;
  onSwitch: (id: string) => void;
  onDelete: (id: string) => void;
  onIterate: (id: string) => void;
}

export default function PromptHistory({
  iterations,
  activeId,
  onSwitch,
  onDelete,
  onIterate,
}: PromptHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Truncate long prompts
  const truncatePrompt = (prompt: string, maxLength = 40): string => {
    return prompt.length > maxLength
      ? prompt.substring(0, maxLength) + "..."
      : prompt;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-[#2d2d33] hover:bg-[#3d3d43] text-gray-200 px-3 py-2 rounded-md transition-colors duration-200 flex items-center text-sm"
      >
        <span className="mr-2">📜</span> History ({iterations.length})
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-[#202123] border border-[#444654] rounded-md shadow-lg z-50">
          <div className="p-2 border-b border-[#444654]">
            <h3 className="font-medium text-sm text-gray-300">
              Previous Iterations
            </h3>
          </div>

          <div className="max-h-80 overflow-y-auto py-1">
            {iterations.map((iteration) => (
              <div
                key={iteration.id}
                className={`px-3 py-2 border-l-2 flex flex-col hover:bg-[#2d2d33] cursor-pointer transition-colors
                  ${
                    activeId === iteration.id
                      ? "border-l-[#10a37f] bg-[#1e1e24]"
                      : "border-transparent"
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div
                    className="text-sm font-medium flex-1 mr-2"
                    onClick={() => onSwitch(iteration.id)}
                  >
                    {iteration.isInitial ? (
                      <span className="flex items-center">
                        <span className="text-[#10a37f] mr-1">✨</span> Initial:{" "}
                        {truncatePrompt(iteration.prompt)}
                      </span>
                    ) : (
                      <span>{truncatePrompt(iteration.prompt)}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTime(iteration.timestamp)}
                  </span>
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onIterate(iteration.id)}
                    className="text-xs bg-[#343439] hover:bg-[#424249] px-2 py-0.5 rounded transition-colors"
                    title="Iterate from this version"
                  >
                    Iterate
                  </button>
                  <button
                    onClick={() => onSwitch(iteration.id)}
                    className="text-xs bg-[#343439] hover:bg-[#424249] px-2 py-0.5 rounded transition-colors"
                    title="View this version"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(iteration.id);
                    }}
                    className="text-xs bg-[#343439] hover:bg-[#424249] hover:text-red-400 px-2 py-0.5 rounded transition-colors ml-auto"
                    title="Delete this iteration"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
