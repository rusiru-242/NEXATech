import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

/**
 * ScrollStoryText
 * Renders a single storytelling phase overlay on top of the canvas.
 * Visibility is driven by CSS opacity/transform via inline style so we never
 * update React state on every scroll frame — only the parent's
 * `visibilityRef` DOM element styles are mutated directly.
 *
 * Props:
 *   phaseId       – unique DOM id (used by parent to target the element)
 *   align         – "left" | "right" | "center"
 *   label         – small uppercase eyebrow label
 *   heading       – main large heading (JSX allowed)
 *   body          – paragraph body text
 *   bullets       – optional string[]
 *   ctas          – optional [{ label, to, variant }]
 */
export function ScrollStoryText({
  phaseId,
  align = "left",
  label,
  heading,
  body,
  bullets,
  ctas,
}) {
  const alignClass =
    align === "right"
      ? "items-end text-right"
      : align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  const bgGradient =
    align === "left"
      ? "linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 28%, rgba(0,0,0,0.20) 50%, transparent 68%)"
      : align === "right"
      ? "linear-gradient(270deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 28%, rgba(0,0,0,0.20) 50%, transparent 68%)"
      : "radial-gradient(ellipse at center, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.30) 38%, transparent 70%)";

  return (
    <div
      id={phaseId}
      className={`pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-8 sm:px-16 lg:px-24 ${alignClass}`}
      style={{
        opacity: 0,
        transform: "translateY(28px)",
        transition: "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)",
        willChange: "opacity, transform",
        background: bgGradient,
      }}
    >
      <div
        className={`flex flex-col gap-4 ${
          align === "center" ? "items-center" : align === "right" ? "items-end" : "items-start"
        }`}
        style={{ textShadow: "0 2px 18px rgba(0,0,0,0.45)" }}
      >
        {/* Eyebrow label */}
        {label && (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
            {label}
          </span>
        )}

        {/* Main heading */}
        <h2 className="max-w-lg text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white/95 sm:text-5xl lg:text-6xl">
          {heading}
        </h2>

        {/* Body copy */}
        {body && (
          <p className="max-w-sm text-sm leading-relaxed text-[#cdd2d7]/80 sm:text-base">
            {body}
          </p>
        )}

        {/* Bullet points */}
        {bullets && bullets.length > 0 && (
          <ul className="mt-1 flex flex-col gap-2">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs font-medium text-[#cdd2d7]/80"
              >
                <span className="h-px w-4 bg-[#00E5FF]/60" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* CTA buttons */}
        {ctas && ctas.length > 0 && (
          <div className="pointer-events-auto mt-4 flex flex-wrap items-center gap-3">
            {ctas.map((cta, i) =>
              cta.variant === "primary" ? (
                <Link
                  key={i}
                  to={cta.to}
                  className="group flex items-center gap-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#00E5FF] backdrop-blur-md transition-all duration-300 hover:border-[#00E5FF]/80 hover:bg-[#00E5FF]/20"
                >
                  <span>{cta.label}</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              ) : (
                <Link
                  key={i}
                  to={cta.to}
                  className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white/70 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:text-white"
                >
                  <Sparkles size={13} className="text-[#00E5FF]" />
                  <span>{cta.label}</span>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScrollStoryText;
