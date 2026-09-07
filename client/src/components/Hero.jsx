import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "./GlassCard";

export function Hero() {
  const techLabels = ["/ PERFORMANCE", "/ INNOVATION", "/ SMART TECHNOLOGY"];

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] w-full flex-col justify-between overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
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
            <span
              key={idx}
              className="transition hover:text-white"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero Main Content Grid: Diagonal Editorial Balance */}
      <div className="relative z-10 mx-auto my-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 py-10 lg:grid-cols-12 lg:gap-8 lg:py-16">
        {/* Left Column: Heading, Body, CTAs */}
        <div className="lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
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
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
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
            transition={{
              duration: 0.8,
              delay: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <Link
              to="/products"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-[#00E5FF] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#2bf0ff] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]"
            >
              <span>Shop Products</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              to="/ai-chat"
              className="group inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-[#00E5FF]/40 hover:bg-white/[0.08] hover:text-[#00E5FF]"
            >
              <Sparkles size={15} className="text-[#00E5FF]" />
              <span>Ask NexaTech AI</span>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Floating Glass Card */}
        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <GlassCard />
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
    </section>
  );
}

export default Hero;