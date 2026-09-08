import { useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Bot, ArrowUpRight } from "lucide-react";
import Reveal from "../Reveal";
import { LiquidButton } from "../ui/LiquidButton";
import HandshakeSequence from "./HandshakeSequence";

/**
 * AISectionWithHandshake
 *
 * The handshake frame sequence is the FULL cinematic background of this
 * section. All existing AI text and the Suggested Inquiries panel float
 * as foreground layers above the full-bleed animation.
 *
 * Layer order (bottom → top):
 *   z-0   HandshakeSequence canvas  (absolute inset-0, object-cover)
 *   z-10  Cinematic gradient overlays (left dark, right dark, vignette, glow)
 *   z-20  Foreground content (left text + right glass panel)
 *
 * Scroll architecture:
 *   outer <section>  — 180vh tall — drives scroll progress
 *   inner sticky div — 100vh      — stays pinned while outer scrolls
 */
export function AISectionWithHandshake() {
  const sectionRef = useRef(null);

  return (
    /* ── Outer: tall enough for the 240-frame sequence to play fully ── */
    <section
      id="ai"
      ref={sectionRef}
      className="relative border-b border-white/10"
      style={{ height: "320vh" }}
    >
      {/* ── Sticky inner: pins the visual scene while user scrolls ─────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ════════════════════════════════════════════════════════
            LAYER 0 — #050505 base (below canvas)
        ════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 z-0 bg-[#050505]" />

        {/* ════════════════════════════════════════════════════════
            LAYER 1 — Full-bleed handshake canvas
        ════════════════════════════════════════════════════════ */}
        <HandshakeSequence sectionRef={sectionRef} />

        {/* ════════════════════════════════════════════════════════
            LAYER 2 — Cinematic overlays (z-10)
        ════════════════════════════════════════════════════════ */}

        {/* Left dark gradient — keeps AI text readable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[52%]"
          style={{
            background:
              "linear-gradient(to right, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.82) 45%, rgba(5,5,5,0.30) 75%, transparent 100%)",
          }}
        />

        {/* Right dark gradient — keeps inquiry panel readable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[52%]"
          style={{
            background:
              "linear-gradient(to left, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.75) 40%, rgba(5,5,5,0.20) 75%, transparent 100%)",
          }}
        />

        {/* Top vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36"
          style={{
            background: "linear-gradient(to bottom, rgba(5,5,5,0.75) 0%, transparent 100%)",
          }}
        />

        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36"
          style={{
            background: "linear-gradient(to top, rgba(5,5,5,0.80) 0%, transparent 100%)",
          }}
        />

        {/* Subtle cyan radial glow — robot-hand centre */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 52%, rgba(0,229,255,0.07) 0%, transparent 38%)",
          }}
        />

        {/* ════════════════════════════════════════════════════════
            LAYER 3 — Foreground content (z-20)
        ════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 z-20 flex items-center px-6 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">

            {/* 12-col grid — left content | breathing space | right panel */}
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-4">

              {/* ── LEFT: existing AI content — every word unchanged ── */}
              <div className="lg:col-span-5">
                <Reveal>
                  {/* Badge */}
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    <Sparkles size={12} />
                    NexaTech AI Intelligence
                  </span>

                  {/* Heading */}
                  <h2 className="mt-5 text-4xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl">
                    Your Personal
                    <span className="block text-gray-500">Tech Advisor.</span>
                  </h2>

                  {/* Description */}
                  <p className="mt-6 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base sm:leading-8">
                    Ask about hardware compatibility, compare products side by
                    side, or get tailored recommendations calibrated to your
                    budget and exact use case.
                  </p>

                  {/* CTA */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link to="/ai-chat" className="focus:outline-none">
                      <LiquidButton
                        variant="cyan"
                        size="lg"
                        className="group gap-2.5 px-7 text-xs font-bold uppercase tracking-wider text-[#00E5FF]"
                      >
                        <Sparkles size={15} />
                        <span>Start Chat with AI</span>
                      </LiquidButton>
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* ── CENTRE: empty — this is where the canvas shines through ── */}
              <div className="hidden lg:col-span-2 lg:block" aria-hidden="true" />

              {/* ── RIGHT: existing Suggested Inquiries panel — unchanged ── */}
              <div className="lg:col-span-5">
                <Reveal delay={150}>
                  <div className="space-y-4 rounded-3xl border border-white/15 bg-black/40 p-7 backdrop-blur-xl sm:p-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
                        <Bot size={16} className="text-[#00E5FF]" />
                        Suggested Inquiries
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">
                        REAL-TIME CHAT
                      </span>
                    </div>

                    {[
                      "Recommend the best laptop under Rs. 250,000 for programming",
                      "Compare RTX 4070 Ti vs RTX 4080 for 4K video editing",
                      "Which noise-canceling headphones offer the longest battery life?",
                    ].map((promptText, idx) => (
                      <Link
                        key={idx}
                        to="/ai-chat"
                        className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] p-4 text-xs text-gray-300 transition hover:border-[#00E5FF]/40 hover:bg-white/[0.08] hover:text-white"
                      >
                        <span className="max-w-[85%]">{promptText}</span>
                        <ArrowUpRight
                          size={15}
                          className="text-gray-500 transition group-hover:text-[#00E5FF]"
                        />
                      </Link>
                    ))}
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

export default AISectionWithHandshake;
