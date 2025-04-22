import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-[#444654]/30 bg-[#1a1b1f]/60 px-3 py-2 text-sm text-[#ececf1] placeholder:text-gray-400/60 focus:outline-none focus:ring-1 focus:ring-[#383e3c]/50 focus:border-[#383e3c]/50 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm shadow-inner transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
