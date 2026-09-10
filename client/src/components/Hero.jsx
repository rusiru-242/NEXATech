import { useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import MacBookSequence from "./home/MacBookSequence";
import NexaButton from "./ui/NexaButton";

export function Hero() {
  const sectionRef = useRef(null);
  const techLabels = ["/ PERFORMANCE", "/ INNOVATION", "/ SMART TECHNOLOGY"];

  return (
    /**
     * Outer: 210vh gives MacBook sequence enough room to animate.
     * No overflow-hidden here — that would break position:sticky.
     */
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "340vh" }}
    >
      {/* ── Sticky inner: pinned immediately below navbar (top-20 = 80px) ── */}
      <div className="sticky top-20 h-[calc(100vh-5rem)] w-full overflow-hidden">

        {/* ─────────────────────────────────────────────────────────────
            MacBook canvas — absolutely positioned on the right side.
            Enlarged display with 16:9 ratio and generous width.
            z-0 so it sits behind text but above pure background.
        ───────────────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="hero-macbook-container pointer-events-none absolute z-0"
        >
          {/* Subtle cyan ambient glow behind the video to match existing theme */}
          <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_65%_45%,rgba(0,229,255,0.035),transparent_60%)]" />

          <MacBookSequence sectionRef={sectionRef} />

          {/* Left-side dark gradient overlay to blend seamlessly into the #050505 background (desktop only) */}
          <div 
            className="absolute inset-0 z-10 hidden lg:block"
            style={{
              background: "linear-gradient(90deg, #050505 0%, rgba(5,5,5,0.85) 15%, rgba(5,5,5,0.35) 35%, transparent 55%)"
            }}
          />
        </div>

        {/* ─────────────────────────────────────────────────────────────
            Hero content layer — identical to original, z-10.
        ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between px-6 py-5 sm:px-10 sm:py-6 lg:px-16">

          {/* Decorative Editorial Vertical Rules (Desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-6 top-0 hidden flex-col items-center justify-between text-gray-800 opacity-60 md:flex lg:left-10"
          >
            <span className="h-16 w-px bg-white/10" />
            <span className="text-[10px] font-mono text-gray-600">+</span>
            <span className="flex-1 w-px bg-white/10" />
            <span className="text-[10px] font-mono text-gray-600">+</span>
            <span className="h-16 w-px bg-white/10" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-6 top-0 hidden flex-col items-center justify-between text-gray-800 opacity-60 md:flex lg:right-10"
          >
            <span className="h-16 w-px bg-white/10" />
            <span className="text-[10px] font-mono text-gray-600">+</span>
            <span className="flex-1 w-px bg-white/10" />
            <span className="text-[10px] font-mono text-gray-600">+</span>
            <span className="h-16 w-px bg-white/10" />
          </div>

          {/* Top Section Labels */}
          <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between pt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                Premium Technology
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden items-center gap-6 text-[11px] font-medium tracking-[0.2em] text-gray-500 md:flex"
            >
              {techLabels.map((label, idx) => (
                <span key={idx} className="transition hover:text-white">
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero Main Content — left column only; MacBook overlays the right */}
          <div className="relative z-10 mx-auto my-auto w-full max-w-7xl py-4 lg:py-8">
            <div className="max-w-[58%] lg:max-w-[55%]">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl"
              >
                TECHNOLOGY.
                <span className="mt-1 block bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent">
                  BUILT DIFFERENT.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base sm:leading-7"
              >
                Precision-engineered electronics, high-refresh displays, and
                AI-accelerated performance curated for the next generation of
                creators, developers, and competitive gamers.
              </motion.p>

              {/* Action CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5"
              >
                {/* Primary CTA — Solid Cyan with Reduced Glow & Black Text */}
                <Link to="/products" className="focus:outline-none">
                  <NexaButton
                    variant="primary"
                    size="lg"
                    icon={<ShoppingBag size={18} />}
                  >
                    Start Shopping
                  </NexaButton>
                </Link>

                {/* Secondary CTA — Dark Glass with Cyan Sparkles */}
                <Link to="/ai-chat" className="focus:outline-none">
                  <NexaButton
                    variant="ai"
                    size="lg"
                    icon={<Sparkles size={18} />}
                  >
                    <span>
                      Ask <span className="text-[#00E5FF]">NexaTech</span> AI
                    </span>
                  </NexaButton>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Bottom Ticker / Brand Statement */}
          <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.2em] text-gray-500">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
              NexaTech Flagship Catalog 2026
            </span>
            <span className="hidden sm:inline text-gray-600">
              Curated Hardware • Verified Authentic
            </span>
            <span>Scroll to Explore ↓</span>
          </div>

        </div>{/* /content layer */}
      </div>{/* /sticky */}
    </section>
  );
}

export default Hero;