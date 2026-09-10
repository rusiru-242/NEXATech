import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * NexaButton
 *
 * Matches the reference design:
 * - Rounded rectangle shape (rounded-2xl)
 * - Primary: Solid NexaTech cyan (#00E5FF) with black text, left icon, right ArrowUpRight,
 *            and a restrained, subtle glow (glow gathiya adu karala)
 * - AI: Deep dark glass with white text, cyan Sparkles icon, and matching rounded-2xl border
 */
export const NexaButton = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "default",
      icon,
      arrow = true,
      arrowIcon,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const isPrimary = variant === "primary";
    const isAi = variant === "ai";

    const sizeClasses = {
      sm: "h-9 px-4 text-xs gap-2 rounded-xl",
      default: "h-11 px-5 sm:px-6 text-sm gap-2.5 rounded-2xl",
      lg: "h-12 px-6 sm:px-7 text-sm font-semibold gap-2.5 rounded-2xl",
    }[size] || "h-12 px-6 sm:px-7 text-sm font-semibold gap-2.5 rounded-2xl";

    return (
      <Comp
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center font-semibold tracking-normal",
          "select-none cursor-pointer transition-all duration-300 outline-none",
          "disabled:pointer-events-none disabled:opacity-40",
          "focus-visible:ring-2 focus-visible:ring-[#00E5FF]/60",
          sizeClasses,
          // Hover translate & active press
          "hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
          // Primary Variant: Solid Cyan with Black Text & subtle glow (glow adu karala)
          isPrimary && [
            "bg-[#00E5FF] text-black",
            // Reduced, tasteful glow (not overly bright/hazy)
            "shadow-[0_2px_10px_rgba(0,229,255,0.18)]",
            "hover:bg-[#00d6ee] hover:shadow-[0_4px_16px_rgba(0,229,255,0.28)]",
          ],
          // AI Variant: Dark Glass with White Text & Cyan Accent
          isAi && [
            "bg-[#0c0d12]/85 backdrop-blur-xl text-white",
            "border border-white/10 hover:border-[#00E5FF]/40 hover:bg-white/[0.06]",
            "shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(0,229,255,0.12)]",
          ],
          variant === "secondary" && [
            "bg-[#0c0d12]/85 backdrop-blur-xl text-gray-200 border border-white/10 hover:border-[#00E5FF]/30 hover:text-white",
          ],
          className
        )}
        {...props}
      >
        {/* Left icon */}
        {icon && (
          <span
            className={cn(
              "relative z-10 flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105",
              isPrimary ? "text-black" : isAi ? "text-[#00E5FF]" : "text-gray-300"
            )}
          >
            {icon}
          </span>
        )}

        {/* Text label */}
        <span className={cn("relative z-10 whitespace-nowrap", isPrimary ? "text-black" : "text-white")}>
          {children}
        </span>

        {/* Right Arrow (only on primary unless explicitly provided) */}
        {isPrimary && arrow && (
          <span className="relative z-10 flex shrink-0 items-center justify-center text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            {arrowIcon || <ArrowUpRight size={17} />}
          </span>
        )}

        {!isPrimary && arrowIcon && (
          <span className="relative z-10 flex shrink-0 items-center justify-center text-[#00E5FF] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            {arrowIcon}
          </span>
        )}
      </Comp>
    );
  }
);

NexaButton.displayName = "NexaButton";

export default NexaButton;
