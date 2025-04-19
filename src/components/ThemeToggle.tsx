import React from "react";
import { useTheme } from "@/context/ThemeContext";

// This component is now just a visual element since we're using dark mode only
export default function ThemeToggle() {
  const { theme } = useTheme(); // Only using theme, not toggleTheme

  // Always showing dark mode icon for consistency
  return (
    <div className="p-2 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </div>
  );
}
