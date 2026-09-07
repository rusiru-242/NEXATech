import { motion } from "framer-motion";
import { Activity, Cpu, Zap } from "lucide-react";

export function GlassCard({ className = "" }) {
  return (
    <>
      {/* Liquid-glass refraction filter definition */}
      <svg
        className="pointer-events-none absolute h-0 w-0"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="liquid-glass-refraction"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.015"
              numOctaves="3"
              result="noise"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              result="boosted_alpha"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 100 0"
            />
            <feGaussianBlur
              in="boosted_alpha"
              stdDeviation="45"
              result="blurred_alpha"
            />
            <feComponentTransfer in="blurred_alpha" result="edge_mask">
              <feFuncA type="linear" slope="-1.3" intercept="1" />
            </feComponentTransfer>
            <feComposite
              in="noise"
              in2="edge_mask"
              operator="arithmetic"
              k1="1"
              k2="0"
              k3="0"
              k4="0"
              result="masked_noise"
            />

            {/* Chromatic dispersion: R (scale 65), G (scale 56), B (scale 47) */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="masked_noise"
              scale="65"
              xChannelSelector="R"
              yChannelSelector="G"
              result="red_displaced"
            />
            <feColorMatrix
              in="red_displaced"
              type="matrix"
              result="red"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="masked_noise"
              scale="56"
              xChannelSelector="R"
              yChannelSelector="G"
              result="green_displaced"
            />
            <feColorMatrix
              in="green_displaced"
              type="matrix"
              result="green"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="masked_noise"
              scale="47"
              xChannelSelector="R"
              yChannelSelector="G"
              result="blue_displaced"
            />
            <feColorMatrix
              in="blue_displaced"
              type="matrix"
              result="blue"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend
              in="rg"
              in2="blue"
              mode="screen"
              result="chromatic_dispersion"
            />
          </filter>
        </defs>
      </svg>

      {/* Floating Refractive / Frosted Glass Telemetry Card */}
      <motion.aside
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.9,
          delay: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ y: -4 }}
        className={`group relative flex w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.035] p-7 text-white shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-[#00E5FF]/40 sm:p-8 ${className}`}
      >
        {/* Frost sheen overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/[0.08] via-transparent to-black/30 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),inset_0_-1px_2px_rgba(0,0,0,0.4)] transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Ambient cyan glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#00E5FF]/15 blur-[50px] transition-all duration-500 group-hover:bg-[#00E5FF]/25"
        />

        {/* Card Header */}
        <div className="relative z-10 border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                Core Specs
              </span>
            </div>
            <span className="font-mono text-xs text-gray-500">//01</span>
          </div>

          <h3 className="mt-2 text-lg font-bold tracking-tight text-white">
            Flagship Telemetry
          </h3>
        </div>

        {/* Card Body */}
        <div className="relative z-10 my-5 flex flex-col gap-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/[0.05]">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-200">
              <Cpu size={14} className="text-[#00E5FF]" />
              Neural Architecture V4.9
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
              Direct bus latency &lt;0.4ms across distributed multi-cluster AI
              coprocessors.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/[0.05]">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-200">
              <Zap size={14} className="text-[#00E5FF]" />
              Cryo-Vapor Dissipation
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
              Zero-throttle thermal containment sustaining 5.4GHz boost under
              continuous render load.
            </p>
          </div>
        </div>

        {/* Dynamic Signal Waveform */}
        <div className="relative z-10 pt-2">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-500">
            <span className="flex items-center gap-1.5">
              <Activity size={12} className="text-[#00E5FF]" />
              Harmonic Waveform
            </span>
            <span className="text-[#00E5FF]">99.8% Sync</span>
          </div>

          <svg
            className="w-full"
            viewBox="0 0 220 40"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 25 C10 25 12 35 18 35 C24 35 26 10 34 10 C42 10 44 32 52 32 C60 32 62 5 70 5 C78 5 80 34 88 34 C96 34 98 12 106 12 C114 12 116 30 124 30 C132 30 134 16 142 16 C150 16 152 28 160 28 C168 28 170 18 178 18 C186 18 188 26 196 26 C204 26 210 22 220 22"
              stroke="#00E5FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              className="opacity-90"
            />
          </svg>
        </div>
      </motion.aside>
    </>
  );
}

export default GlassCard;
