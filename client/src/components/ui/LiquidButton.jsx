import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// LIQUID GLASS BUTTON
// A frosted-glass button with SVG displacement-map refraction effect.
// ─────────────────────────────────────────────────────────────────────────────

const liquidbuttonVariants = cva(
  [
    "inline-flex items-center justify-center cursor-pointer gap-2",
    "whitespace-nowrap rounded-full text-sm font-semibold",
    "transition-[color,box-shadow,transform] duration-300",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/60",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:scale-105 text-white",
        cyan:
          "bg-transparent hover:scale-105 text-[#00E5FF]",
        dark:
          "bg-transparent hover:scale-105 text-gray-200",
      },
      size: {
        sm:   "h-8 px-4 text-xs gap-1.5",
        default: "h-10 px-6 py-2",
        lg:   "h-12 px-8 text-base",
        xl:   "h-14 px-10 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
);

/**
 * GlassFilter — hidden SVG that defines the CSS backdrop-filter refraction.
 * Rendered once inside each LiquidButton so filter IDs are scoped per button.
 */
function GlassFilter({ id = "container-glass" }) {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter
          id={id}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * LiquidButton
 *
 * Props:
 *  - variant: "default" | "cyan" | "dark"
 *  - size: "sm" | "default" | "lg" | "xl" | "icon"
 *  - asChild: boolean — renders children as the root element via Radix Slot
 *  - className, ...rest: forwarded to the button element
 */
export function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  filterId,
  ...props
}) {
  // Each button gets a unique filter id to avoid conflicts when multiple exist on the page
  const uid = React.useId();
  const id = filterId || `lg-${uid.replace(/:/g, "")}`;
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="liquid-button"
      className={cn(
        "relative",
        liquidbuttonVariants({ variant, size, className })
      )}
      {...props}
    >
      {/* Prismatic glass shadow shell */}
      <div
        className={cn(
          "absolute inset-0 z-0 rounded-full transition-all duration-300",
          // Light mode glass — inner highlight + outer glow
          "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(255,255,255,0.25),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.4),inset_0_0_6px_6px_rgba(255,255,255,0.06),inset_0_0_2px_2px_rgba(255,255,255,0.04),0_0_16px_rgba(0,229,255,0.12)]",
          // Dark mode glass — invert reflection source
          "dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
        )}
      />

      {/* Distortion backdrop layer */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-full"
        style={{ backdropFilter: `url("#${id}")` }}
      />

      {/* Frosted fill */}
      <div className="absolute inset-0 rounded-full bg-white/[0.06] backdrop-blur-md" />

      {/* Content on top */}
      <span className="pointer-events-none relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* SVG filter definition */}
      <GlassFilter id={id} />
    </Comp>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METAL BUTTON
// A physical, chrome-grade metallic press button with layered gradients.
// ─────────────────────────────────────────────────────────────────────────────

const COLOR_VARIANTS = {
  default: {
    outer: "bg-gradient-to-b from-[#1a1a1a] to-[#8a8a8a]",
    inner: "bg-gradient-to-b from-[#FAFAFA] via-[#3E3E3E] to-[#E5E5E5]",
    button: "bg-gradient-to-b from-[#B9B9B9] to-[#969696]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]",
  },
  cyan: {
    outer: "bg-gradient-to-b from-[#004a5a] to-[#00aec4]",
    inner: "bg-gradient-to-b from-[#b3f5ff] via-[#007a8c] to-[#d0f9ff]",
    button: "bg-gradient-to-b from-[#00E5FF] to-[#009ab0]",
    textColor: "text-[#001a1f]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(0_200_230_/_60%)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
    inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
    button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
    textColor: "text-[#FFFDE5]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(178_140_2_/_100%)]",
  },
  dark: {
    outer: "bg-gradient-to-b from-[#000] to-[#333]",
    inner: "bg-gradient-to-b from-[#555] via-[#111] to-[#444]",
    button: "bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(0_0_0_/_80%)]",
  },
};

function ShineEffect({ isPressed }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-full transition-opacity duration-300",
        isPressed ? "opacity-30" : "opacity-0"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}

export const MetalButton = React.forwardRef(function MetalButton(
  { children, className, variant = "default", onClick, ...props },
  ref
) {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const colors = COLOR_VARIANTS[variant] || COLOR_VARIANTS.default;
  const transition = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";

  return (
    <div
      className={cn(
        "relative inline-flex transform-gpu rounded-full p-[1.5px] will-change-transform",
        colors.outer
      )}
      style={{
        transform: isPressed
          ? "translateY(2.5px) scale(0.98)"
          : "translateY(0) scale(1)",
        boxShadow: isPressed
          ? "0 1px 2px rgba(0,0,0,0.2)"
          : isHovered && !isTouchDevice
          ? "0 6px 20px rgba(0,229,255,0.2)"
          : "0 3px 10px rgba(0,0,0,0.15)",
        transition,
      }}
    >
      {/* Inner gradient ring */}
      <div
        className={cn(
          "absolute inset-[1px] rounded-full will-change-transform",
          colors.inner
        )}
        style={{
          filter:
            isHovered && !isPressed && !isTouchDevice
              ? "brightness(1.08)"
              : "none",
          transition,
        }}
      />

      {/* Button face */}
      <button
        ref={ref}
        className={cn(
          "relative z-10 m-[1.5px] rounded-full",
          "inline-flex h-11 cursor-pointer items-center justify-center overflow-hidden",
          "px-7 py-2 text-sm font-bold leading-none will-change-transform outline-none",
          colors.button,
          colors.textColor,
          colors.textShadow,
          className
        )}
        style={{
          transform: isPressed ? "scale(0.97)" : "scale(1)",
          filter:
            isHovered && !isPressed && !isTouchDevice
              ? "brightness(1.05)"
              : "none",
          transition,
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
        onMouseEnter={() => { if (!isTouchDevice) setIsHovered(true); }}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
        onClick={onClick}
        {...props}
      >
        <ShineEffect isPressed={isPressed} />
        {children}
        {isHovered && !isPressed && !isTouchDevice && (
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10" />
        )}
      </button>
    </div>
  );
});

MetalButton.displayName = "MetalButton";
