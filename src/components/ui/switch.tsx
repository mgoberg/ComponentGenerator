import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Handle both callback patterns
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="inline-flex items-center">
        <div
          className={cn(
            "relative h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#383e3c]/30",
            checked ? "bg-[#1a2e29]/90" : "bg-gray-700/70",
            className
          )}
          onClick={() => onCheckedChange && onCheckedChange(!checked)}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={handleChange}
            ref={ref}
            {...props}
          />
          <span
            className={cn(
              "absolute left-0 inline-block h-4 w-4 translate-y-[-50%] rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out top-1/2",
              checked ? "translate-x-5" : "translate-x-1"
            )}
          />
        </div>
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
