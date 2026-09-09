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
          "relative inline-flex items-center justify-center gap-2",
          "whitespace-nowrap font-bold text-[#00E5FF] transition-all duration-300",
          "disabled:pointer-events-none disabled:opacity-50",
          "outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/60",
          // Base style
          "rounded-[20px] px-6 py-3", // default dimensions, can be overridden by className
          "border border-white/10 backdrop-blur-xl",
          "bg-[linear-gradient(180deg,rgba(55,55,55,0.75),rgba(25,25,25,0.85))]",
          // Shadows: bottom dark shadow + top highlight inset
          "shadow-[0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]",
          // Hover state
          "hover:-translate-y-[1px] hover:brightness-110 hover:border-[#00E5FF]/35",
          "hover:shadow-[0_0_15px_rgba(0,229,255,0.2),0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]",
          // Active state
          "active:scale-95 active:translate-y-[1px]",
          "active:shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]",
          isActive && [
            "border-[#00E5FF]/35 bg-[linear-gradient(180deg,rgba(40,65,70,0.8),rgba(20,35,40,0.9))] shadow-[0_0_15px_rgba(0,229,255,0.2),0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]",
          ],
          className
        )}
        {...props}
      />
    );
  }
);
DarkGlassButton.displayName = "DarkGlassButton";
