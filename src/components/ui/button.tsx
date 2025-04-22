import * as React from "react";
import { cn } from "@/lib/utils";

// Button variants as simple strings
const VARIANTS = {
  default:
    "bg-[#2d2d33] hover:bg-[#3d3d43] text-gray-200 border border-[#444654]",
  primary: "bg-gray-700 hover:bg-gray-600 text-white",
  brand: "bg-[#10a37f] text-white hover:bg-[#0e9170] transition-colors",
  outline: "border border-[#444654] bg-transparent hover:bg-[#2d2d33]",
};

// Button sizes as simple strings
const SIZES = {
  default: "py-2 px-4",
  sm: "py-1 px-3 text-sm",
  lg: "py-3 px-6 text-lg",
  icon: "p-2",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    return (
      <button
        className={cn(baseClasses, VARIANTS[variant], SIZES[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
