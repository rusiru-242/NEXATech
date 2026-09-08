import { useRef } from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowUpRight } from "lucide-react";
import Reveal from "../Reveal";
import { LiquidButton } from "../ui/LiquidButton";
import GamingPCSequence from "./GamingPCSequence";

/**
 * GamingSectionWithPC
 *
 * PC canvas is a FULL-BLEED cinematic background (right-biased).
 * Text content is completely locked in place while the PC builds.
 *
 * Layer order (bottom → top):
 *   z-0   #050505 base fill
 *   z-1   GamingPCSequence canvas (absolute inset-0, full viewport)
 *   z-10  Cinematic gradient overlays
 *   z-20  Foreground left content (static — no movement)
 */
export function GamingSectionWithPC() {
  const sectionRef = useRef(null);

  return (
    /* Outer: tall enough for the 240-frame animation to play */
    <section
      ref={sectionRef}
      className="relative border-y border-white/10"
      style={{ height: "400vh" }}
    >
      {/* ── Sticky inner: pins the visual scene while outer scrolls ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ════════ LAYER 0 — dark base ════════ */}
        <div className="absolute inset-0 z-0 bg-[#050505]" />

        {/* ════════ LAYER 1 — Full-bleed PC canvas (right-biased) ════════ */}
        <GamingPCSequence sectionRef={sectionRef} fullBleed />

        {/* ════════ LAYER 2 — Cinematic gradient overlays (z-10) ════════ */}

        {/* Strong left dark gradient — keeps text readable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[65%]"
          style={{
            background:
              "linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.88) 40%, rgba(5,5,5,0.45) 70%, transparent 100%)",
          }}
        />

        {/* Soft right edge fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[20%]"
          style={{
            background:
              "linear-gradient(to left, rgba(5,5,5,0.60) 0%, transparent 100%)",
          }}
        />

        {/* Top vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
          style={{
            background: "linear-gradient(to bottom, rgba(5,5,5,0.80) 0%, transparent 100%)",
          }}
        />

        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32"
          style={{
            background: "linear-gradient(to top, rgba(5,5,5,0.80) 0%, transparent 100%)",
          }}
        />

        {/* Cyan radial glow — centred on the PC (right side) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 72% 52%, rgba(0,229,255,0.07) 0%, transparent 65%)",
          }}
        />

        {/* Oversized OVERCLOCK watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 left-1/2 z-10 -translate-x-1/2 select-none text-[18vw] font-black uppercase leading-none tracking-tighter text-white/[0.015]"
        >
          OVERCLOCK
        </div>

        {/* ════════ LAYER 3 — Foreground left content (z-20, fully static) ════════ */}
        <div className="absolute inset-0 z-20 flex items-center px-6 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <Reveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    <Flame size={12} />
                    Extreme Gaming &amp; Workstations
                  </span>

                  <h2 className="mt-5 text-4xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                    BUILT FOR
                    <span className="block text-[#00E5FF]">PURE SPEED.</span>
                  </h2>

                  <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base sm:leading-8">
                    Push your boundaries with hardware precision-tuned for zero
                    stutter. Liquid-cooled rigs, ultra-low latency memory, and
                    maximum-TGP graphics cards delivering uncompromised framerates.
                  </p>
                </Reveal>

                {/* Performance telemetry row */}
                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
                  <Reveal delay={100}>
                    <div>
                      <span className="text-2xl font-black text-white sm:text-4xl">240Hz+</span>
                      <p className="mt-1 text-[11px] font-mono uppercase text-gray-500">Peak Refresh</p>
                    </div>
                  </Reveal>
                  <Reveal delay={180}>
                    <div>
                      <span className="text-2xl font-black text-[#00E5FF] sm:text-4xl">0.03ms</span>
                      <p className="mt-1 text-[11px] font-mono uppercase text-gray-500">Pixel Response</p>
                    </div>
                  </Reveal>
                  <Reveal delay={260}>
                    <div>
                      <span className="text-2xl font-black text-white sm:text-4xl">4K UHD</span>
                      <p className="mt-1 text-[11px] font-mono uppercase text-gray-500">Native Clarity</p>
                    </div>
                  </Reveal>
                </div>

                <Reveal delay={300}>
                  <div className="mt-8">
                    <Link to="/products?category=Gaming" className="focus:outline-none">
                      <LiquidButton
                        variant="cyan"
                        size="lg"
                        className="group gap-3 px-8 text-xs font-bold uppercase tracking-wider text-[#00E5FF]"
                      >
                        <span>Explore Gaming Rigs</span>
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </LiquidButton>
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>

      </div>{/* /sticky */}
    </section>
  );
}

export default GamingSectionWithPC;
