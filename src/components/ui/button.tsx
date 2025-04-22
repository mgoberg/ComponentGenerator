import * as React from "react";
import { cn } from "@/lib/utils";

// Button variants with more sophisticated colors
const VARIANTS = {
  default:
    "bg-[#2d2d33]/60 hover:bg-[#3d3d43]/60 text-gray-200 border border-[#444654]/40",
  primary:
    "bg-gray-700/70 hover:bg-gray-600/70 text-white border border-gray-600/40",
  brand:
    "bg-[#1a2e29]/90 hover:bg-[#1f3732]/90 text-gray-100 border border-[#234842]/50 transition-colors",
  outline:
    "border border-[#444654]/60 bg-transparent hover:bg-[#2d2d33]/40 text-gray-200",
};

// Button sizes as simple strings
const SIZES = {
  default: "py-2 px-4",
  sm: "py-1 px-3 text-sm",
  lg: "py-2.5 px-6 text-lg",
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
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4b45]/30 focus-visible:ring-offset-1 disabled:opacity-60 disabled:pointer-events-none backdrop-blur-sm";

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
