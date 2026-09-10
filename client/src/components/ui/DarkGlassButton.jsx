import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export const DarkGlassButton = React.forwardRef(
  ({ className, asChild = false, isActive, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2.5",
          "whitespace-nowrap font-semibold text-white transition-all duration-300",
          "disabled:pointer-events-none disabled:opacity-50",
          "outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/60",
          // Modern Dark Glass aesthetic matching reference
          "rounded-2xl px-6 py-3",
          "border border-white/10 bg-[#0c0d12]/85 backdrop-blur-xl",
          "shadow-[0_2px_10px_rgba(0,0,0,0.5)]",
          // Hover state
          "hover:-translate-y-0.5 hover:border-[#00E5FF]/40 hover:bg-white/[0.06] hover:text-white",
          "hover:shadow-[0_0_15px_rgba(0,229,255,0.12)]",
          // Active state
          "active:scale-[0.98] active:translate-y-0",
          isActive && [
            "border-[#00E5FF]/40 bg-[#00E5FF]/10 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]",
          ],
          className
        )}
        {...props}
      />
    );
  }
);
DarkGlassButton.displayName = "DarkGlassButton";
