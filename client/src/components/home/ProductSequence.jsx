import { useEffect, useRef } from "react";
import ScrollStoryText from "./ScrollStoryText";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — edit these constants to swap the sequence without code changes
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_COUNT = 240;
const FRAME_BASE_PATH = "/sequence/headphones2/ezgif-frame-";
const FRAME_EXT = ".png";
const FRAME_PAD_LENGTH = 3; // zero-pads to 001, 002, … 240

// How many pixels of scroll distance drives the whole sequence
// 700vh means the sequence plays over 7 full viewport-heights of scroll
const SECTION_VH = 7;

// Smooth easing factor (lower = smoother / lazier)
const LERP = 0.12;

// Story phases: each phase defines the scroll-progress window [start, end]
// and the text overlay DOM id that gets shown during that window.
const PHASES = [
  {
    id: "seq-phase-1",
    start: 0,
    end: 0.15,
    align: "left",
    label: "NEXATECH AUDIO",
    heading: (
      <>
        Engineered
        <br />
        <span className="text-white/40">to disappear.</span>
      </>
    ),
    body: "Premium wireless sound designed for focus, comfort, and everyday performance.",
  },
  {
    id: "seq-phase-2",
    start: 0.15,
    end: 0.4,
    align: "left",
    label: "PRECISION ENGINEERING",
    heading: (
      <>
        Precision in
        <br />
        <span className="text-white/40">every layer.</span>
      </>
    ),
    body: "Every component is designed around clarity, durability, comfort, and performance.",
  },
  {
    id: "seq-phase-3",
    start: 0.4,
    end: 0.65,
    align: "right",
    label: "INTERNAL TECHNOLOGY",
    heading: (
      <>
        Built from
        <br />
        <span className="text-white/40">the inside out.</span>
      </>
    ),
    bullets: [
      "Precision-tuned audio components",
      "Intelligent signal processing",
      "Carefully engineered internal structure",
    ],
  },
  {
    id: "seq-phase-4",
    start: 0.65,
    end: 0.85,
    align: "center",
    label: "PERFORMANCE",
    heading: (
      <>
        Performance
        <br />
        <span className="text-white/40">without compromise.</span>
      </>
    ),
    body: "Hardware, acoustics, and intelligent processing working together as one complete system.",
  },
  {
    id: "seq-phase-5",
    start: 0.85,
    end: 1.0,
    align: "center",
    label: "NEXATECH",
    heading: (
      <>
        Designed as one.
        <br />
        <span className="text-white/40">Built from many.</span>
      </>
    ),
    body: "Discover technology engineered around the way you live, work, play, and create.",
    ctas: [
      { label: "Shop Products", to: "/products", variant: "primary" },
      { label: "Ask NexaTech AI", to: "/ai-chat", variant: "secondary" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function padFrame(n) {
  return String(n).padStart(FRAME_PAD_LENGTH, "0");
}

function frameSrc(index) {
  // index is 0-based; filenames start at 001
  return `${FRAME_BASE_PATH}${padFrame(index + 1)}${FRAME_EXT}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductSequence — the main export
// ─────────────────────────────────────────────────────────────────────────────

export function ProductSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]); // preloaded Image objects
  const rafRef = useRef(null);
  const smoothedFrameRef = useRef(0);
  const currentFrameRef = useRef(0); // last drawn frame index
  const loadedCountRef = useRef(0);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // ── Preload frames ──────────────────────────────────────────────────────────
  useEffect(() => {
    const images = new Array(FRAME_COUNT);
    imagesRef.current = images;

    function loadFrame(index) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCountRef.current += 1;
          resolve();
        };
        img.onerror = () => resolve(); // graceful skip on missing frame
        img.src = frameSrc(index);
        images[index] = img;
      });
    }

    // Load first 30 frames immediately for fast first-paint
    const EAGER = 30;
    const eagerLoads = [];
    for (let i = 0; i < Math.min(EAGER, FRAME_COUNT); i++) {
      eagerLoads.push(loadFrame(i));
    }

    // Load remaining frames in idle batches after eager set
    Promise.all(eagerLoads).then(() => {
      let idx = EAGER;
      function loadBatch() {
        const BATCH = 20;
        const end = Math.min(idx + BATCH, FRAME_COUNT);
        const promises = [];
        for (let i = idx; i < end; i++) {
          promises.push(loadFrame(i));
        }
        idx = end;
        Promise.all(promises).then(() => {
          if (idx < FRAME_COUNT) {
            if ("requestIdleCallback" in window) {
              window.requestIdleCallback(loadBatch, { timeout: 400 });
            } else {
              setTimeout(loadBatch, 50);
            }
          }
        });
      }
      if (idx < FRAME_COUNT) {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(loadBatch, { timeout: 400 });
        } else {
          setTimeout(loadBatch, 50);
        }
      }
    });

    return () => {
      // clear refs
      imagesRef.current = [];
    };
  }, []);

  // ── Canvas resize ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Draw frame on canvas ────────────────────────────────────────────────────
  function drawFrame(frameIndex) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    const cw = canvas.width;
    const ch = canvas.height;

    // Background fill
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);

    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    // object-contain centred
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // ── Update text phase overlays (direct DOM mutation, no React state) ────────
  function updateTextOverlays(progress) {
    PHASES.forEach((phase) => {
      const el = document.getElementById(phase.id);
      if (!el) return;

      const { start, end } = phase;
      const fadeWindow = 0.04; // cross-fade width

      // How deep are we into this phase (0 → 1)?
      const phaseProgress = (progress - start) / (end - start);

      let opacity = 0;
      let ty = 28;

      if (progress >= start && progress <= end) {
        // Fade in during first fadeWindow of phase
        const fadeIn = clamp((progress - start) / fadeWindow, 0, 1);
        // Fade out during last fadeWindow of phase
        const fadeOut = clamp((end - progress) / fadeWindow, 0, 1);
        opacity = Math.min(fadeIn, fadeOut);
        ty = (1 - Math.min(fadeIn, 1)) * 28; // slides up as it fades in
      }

      if (prefersReducedMotion.current) {
        opacity = progress >= start && progress <= end ? 1 : 0;
        ty = 0;
      }

      el.style.opacity = opacity;
      el.style.transform = `translateY(${ty}px)`;
    });
  }

  // ── Scroll + RAF loop ───────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const section = sectionRef.current;
    if (!section) return;

    let targetFrame = 0;

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Scroll progress within the sticky range
      // scrollY goes from sectionTop to sectionTop + (sectionHeight - viewportHeight)
      const scrollable = sectionHeight - viewportHeight;
      const scrolledIn = window.scrollY - sectionTop;
      const raw = scrolledIn / scrollable;
      const progress = clamp(raw, 0, 1);

      targetFrame = Math.round(progress * (FRAME_COUNT - 1));

      // Update text overlays directly — no React state
      updateTextOverlays(progress);
    }

    function tick() {
      if (!isMounted) return;

      if (prefersReducedMotion.current) {
        // Static: always show frame 0
        if (currentFrameRef.current !== 0) {
          drawFrame(0);
          currentFrameRef.current = 0;
        }
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Smooth interpolation
      smoothedFrameRef.current +=
        (targetFrame - smoothedFrameRef.current) * LERP;
      const displayFrame = Math.round(smoothedFrameRef.current);

      if (displayFrame !== currentFrameRef.current) {
        drawFrame(displayFrame);
        currentFrameRef.current = displayFrame;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial sync
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const sectionHeightStyle = `${SECTION_VH * 100}vh`;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#050505]"
      style={{ height: sectionHeightStyle }}
      aria-label="NexaTech product engineering sequence"
    >
      {/* ── Sticky canvas container ── */}
      <div
        className="sticky top-0 z-0 h-screen w-full overflow-hidden"
        style={{ willChange: "transform" }}
      >
        {/* Background fill */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block"
          aria-hidden="true"
          style={{ display: "block" }}
        />

        {/* Top fade to blend with hero above */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-[#050505] to-transparent"
        />

        {/* Bottom fade to blend into next section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-[#050505] to-transparent"
        />

        {/* Ambient cyan glow centre */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/[0.04] blur-[120px]"
        />

        {/* Scroll progress indicator inside section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1 w-1 rounded-full bg-[#00E5FF]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Scroll to explore
            </span>
          </div>
        </div>

        {/* Thin left editorial rule */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-8 top-0 z-10 hidden w-px bg-gradient-to-b from-transparent via-white/5 to-transparent lg:block"
        />

        {/* ── Story text overlays ── */}
        {PHASES.map((phase) => (
          <ScrollStoryText
            key={phase.id}
            phaseId={phase.id}
            align={phase.align}
            label={phase.label}
            heading={phase.heading}
            body={phase.body}
            bullets={phase.bullets}
            ctas={phase.ctas}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductSequence;
