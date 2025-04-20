import React, { useState, useRef, useEffect } from "react";
import { extractComponentName } from "@/utils/codeProcessor";

interface Component {
  id: string;
  name: string;
  code: string;
  implementationGuide: string;
  timestamp: Date;
}

interface ComponentHistoryProps {
  components: Component[];
  activeId: string | null;
  onSwitch: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ComponentHistory({
  components,
  activeId,
  onSwitch,
  onDelete,
}: ComponentHistoryProps) {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-[#2d2d33] hover:bg-[#3d3d43] text-gray-200 px-3 py-2 rounded-md transition-colors duration-200 flex items-center text-sm"
      >
        <span className="mr-2">📦</span> Components ({components.length})
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-[#202123] border border-[#444654] rounded-md shadow-lg z-dropdown">
          <div className="p-2 border-b border-[#444654]">
            <h3 className="font-medium text-sm text-gray-300">
              Component Library
            </h3>
          </div>

          <div className="max-h-80 overflow-y-auto py-1">
            {components.map((component) => (
              <div
                key={component.id}
                className={`px-3 py-2 border-l-2 flex flex-col hover:bg-[#2d2d33] cursor-pointer transition-colors
                  ${
                    activeId === component.id
                      ? "border-l-[#10a37f] bg-[#1e1e24]"
                      : "border-transparent"
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div
                    className="text-sm font-medium flex-1 mr-2"
                    onClick={() => onSwitch(component.id)}
                  >
                    <span className="flex items-center">
                      <span className="text-[#10a37f] mr-1">📝</span>{" "}
                      {component.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTime(component.timestamp)}
                  </span>
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onSwitch(component.id)}
                    className="text-xs bg-[#343439] hover:bg-[#424249] px-2 py-0.5 rounded transition-colors"
                    title="View this component"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(component.id);
                    }}
                    className="text-xs bg-[#343439] hover:bg-[#424249] hover:text-red-400 px-2 py-0.5 rounded transition-colors ml-auto"
                    title="Delete this component"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {components.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-gray-400">
                No saved components yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
