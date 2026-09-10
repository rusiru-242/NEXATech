import { useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag } from "lucide-react";
import Reveal from "../Reveal";
import FutureSequence from "./FutureSequence";
import NexaButton from "../ui/NexaButton";

/**
 * FutureCTASection
 *
 * Cinematic scroll-driven sequence section for "STEP INTO THE FUTURE."
 * Uses the 300-frame sequence as a full-bleed animated background behind
 * the centered CTA headline and buttons.
 *
 * Architecture matches AISectionWithHandshake:
 *   - Outer: 200vh scroll wrapper
 *   - Inner: sticky top-0 h-screen overflow-hidden
 *   - Clean release directly into Footer with zero dead scroll
 */
export function FutureCTASection() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10"
      style={{ height: "350vh" }}
    >
      {/* ── Sticky inner: pins the scene for exactly 100vh of scroll ── */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* ── LAYER 0: Dark Base ── */}
        <div className="absolute inset-0 z-0 bg-[#050505]" />

        {/* ── LAYER 1: Full-Bleed 300-Frame Canvas Sequence ── */}
        <FutureSequence sectionRef={sectionRef} />

        {/* ── LAYER 2: Cinematic Gradient Overlays (z-1) ── */}

        {/* Center radial vignette — subtle darkening behind text so glowing waves shine through */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.15) 60%, transparent 100%)",
          }}
        />

        {/* Top fade — seamless blend with preceding section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-[#050505] to-transparent"
        />

        {/* Bottom fade — seamless blend into footer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-[#050505] to-transparent"
        />

        {/* ── LAYER 10: Centered CTA Content ── */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-10 lg:px-16">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#00E5FF]">
              What's Next
            </span>

            <h2 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              STEP INTO
              <span className="block text-gray-500">THE FUTURE.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
              Discover the latest premium devices or let NexaTech AI find the
              exact machine built for your workflow.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
              {/* Primary matching cyan CTA */}
              <Link to="/products" className="focus:outline-none">
                <NexaButton
                  variant="primary"
                  size="lg"
                  icon={<ShoppingBag size={18} />}
                >
                  Explore Collection
                </NexaButton>
              </Link>

              {/* Secondary matching AI glass CTA */}
              <Link to="/ai-chat" className="focus:outline-none">
                <NexaButton
                  variant="ai"
                  size="lg"
                  icon={<Sparkles size={17} />}
                >
                  <span>Consult <span className="text-[#00E5FF]">NexaTech</span> AI</span>
                </NexaButton>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default FutureCTASection;
