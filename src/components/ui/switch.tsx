import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <div
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]",
          checked ? "bg-[#10a37f]" : "bg-gray-600",
          className
        )}
        data-state={checked ? "checked" : "unchecked"}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "pointer-events-none absolute flex h-full w-full items-center justify-center"
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 -mt-2 h-4 w-4 rounded-full bg-white shadow-lg transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
