import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { Cpu, Tv, Bot } from "lucide-react";
import Reveal from "../Reveal";

const TOTAL_FRAMES = 300;

function getFrameSrc(index) {
  return `/animations/car/ezgif-frame-${String(index).padStart(3, "0")}.png`;
}

export function PowerWithoutCompromise() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const inViewRef = useRef(false);
  const lastRenderedIndex = useRef(0);

  // Scroll tracking (height = 300vh provides a long scrub distance)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progress for a heavier, cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    mass: 0.25,
  });

  // Gate canvas rendering with IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      inViewRef.current = true;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting && lastRenderedIndex.current > 0) {
          renderFrame(lastRenderedIndex.current);
        }
      },
      { rootMargin: "300px 0px 300px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Preload image sequence in non-blocking batches
  useEffect(() => {
    let dead = false;
    const images = new Array(TOTAL_FRAMES + 1);
    imagesRef.current = images;

    function loadFrame(i) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!dead && i === 1) renderFrame(1);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = getFrameSrc(i);
        images[i] = img;
      });
    }

    // Load first 25 frames immediately for instant responsiveness
    const EAGER = 25;
    const eagerLoads = [];
    for (let i = 1; i <= Math.min(EAGER, TOTAL_FRAMES); i++) {
      eagerLoads.push(loadFrame(i));
    }

    // Batch remaining frames into idle chunks
    Promise.all(eagerLoads).then(() => {
      let idx = EAGER + 1;
      function loadBatch() {
        if (dead) return;
        const BATCH = 25;
        const end = Math.min(idx + BATCH, TOTAL_FRAMES + 1);
        const promises = [];
        for (let i = idx; i < end; i++) {
          promises.push(loadFrame(i));
        }
        idx = end;
        Promise.all(promises).then(() => {
          if (idx <= TOTAL_FRAMES && !dead) {
            if ("requestIdleCallback" in window) {
              window.requestIdleCallback(loadBatch, { timeout: 400 });
            } else {
              setTimeout(loadBatch, 40);
            }
          }
        });
      }
      if (idx <= TOTAL_FRAMES && !dead) {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(loadBatch, { timeout: 400 });
        } else {
          setTimeout(loadBatch, 40);
        }
      }
    });

    return () => {
      dead = true;
    };
  }, []);

  const renderFrame = (index) => {
    if (index === lastRenderedIndex.current && index !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[index];
    if (img && img.complete && img.naturalWidth > 0) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastRenderedIndex.current = index;
    }
  };

  // Scrub canvas as scroll progress changes
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!inViewRef.current) return;
    // Map 0 -> 1 progress to 1 -> 300 frames
    const frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(latest * TOTAL_FRAMES)));
    renderFrame(frameIndex);
  });

  // --- CARD ANIMATION MAPPINGS ---
  
  // Card 1: High Performance (0 - 32% active)
  const c1Opacity = useTransform(smoothProgress, [0, 0.06, 0.26, 0.32], [0.45, 1, 1, 0.45]);
  const c1Scale = useTransform(smoothProgress, [0, 0.06, 0.26, 0.32], [0.97, 1, 1, 0.97]);
  const c1Border = useTransform(smoothProgress, [0, 0.06, 0.26, 0.32], ["rgba(255,255,255,0.1)", "rgba(0,229,255,0.3)", "rgba(0,229,255,0.3)", "rgba(255,255,255,0.1)"]);
  const c1Color = useTransform(smoothProgress, [0, 0.06, 0.26, 0.32], ["rgba(156,163,175,1)", "rgba(0,229,255,1)", "rgba(0,229,255,1)", "rgba(156,163,175,1)"]);

  // Card 2: Premium Displays (32% - 58% active)
  const c2Opacity = useTransform(smoothProgress, [0.26, 0.32, 0.52, 0.58], [0.45, 1, 1, 0.45]);
  const c2Scale = useTransform(smoothProgress, [0.26, 0.32, 0.52, 0.58], [0.97, 1, 1, 0.97]);
  const c2Border = useTransform(smoothProgress, [0.26, 0.32, 0.52, 0.58], ["rgba(255,255,255,0.1)", "rgba(0,229,255,0.3)", "rgba(0,229,255,0.3)", "rgba(255,255,255,0.1)"]);
  const c2Color = useTransform(smoothProgress, [0.26, 0.32, 0.52, 0.58], ["rgba(156,163,175,1)", "rgba(0,229,255,1)", "rgba(0,229,255,1)", "rgba(156,163,175,1)"]);

  // Card 3: Smart Selection (58% - 100% active - extended time and stays stable at end)
  const c3Opacity = useTransform(smoothProgress, [0.52, 0.58, 0.98, 1], [0.45, 1, 1, 1]);
  const c3Scale = useTransform(smoothProgress, [0.52, 0.58, 0.98, 1], [0.97, 1, 1, 1]);
  const c3Border = useTransform(smoothProgress, [0.52, 0.58, 0.98, 1], ["rgba(255,255,255,0.1)", "rgba(0,229,255,0.3)", "rgba(0,229,255,0.3)", "rgba(0,229,255,0.3)"]);
  const c3Color = useTransform(smoothProgress, [0.52, 0.58, 0.98, 1], ["rgba(156,163,175,1)", "rgba(0,229,255,1)", "rgba(0,229,255,1)", "rgba(0,229,255,1)"]);

  // Header "Compromise." word transition
  const titleColor = useTransform(smoothProgress, [0, 0.1], ["rgba(107,114,128,1)", "rgba(209,213,219,1)"]);

  // Overall visual layer opacity (keeps sequence subdued but highly visible now)
  const videoOpacity = useTransform(smoothProgress, [0, 0.08, 0.96, 1], [0.3, 0.85, 0.85, 0.7]);

  return (
    <section ref={containerRef} className="relative bg-[#050505]" style={{ height: "550vh" }}>
      {/* ── STICKY CONTAINER ── */}
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden pt-16 lg:pt-20">
        
        {/* CINEMATIC BACKGROUND CANVAS */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <motion.div 
            style={{ 
              opacity: videoOpacity,
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, black 25%, black 75%, rgba(0,0,0,0.4) 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, black 25%, black 75%, rgba(0,0,0,0.2) 90%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, black 25%, black 75%, rgba(0,0,0,0.4) 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, black 25%, black 75%, rgba(0,0,0,0.2) 90%, transparent 100%)",
              maskComposite: "intersect"
            }} 
            className="relative h-[80vh] w-full max-w-[1600px] overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              width={1920}
              height={1080}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Subtle dark gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* ── CONTENT LAYER ── */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 flex flex-col h-full justify-center lg:justify-start lg:pt-8">
          
          {/* Header */}
          <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="inline-block rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                  Ultimate Performance
                </span>
                <h2 className="mt-4 text-4xl font-black leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                  Power Without
                  <motion.span style={{ color: titleColor }} className="block">
                    Compromise.
                  </motion.span>
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={150}>
                <p className="text-sm leading-relaxed text-gray-400 sm:text-base sm:leading-7">
                  Engineered from the silicon up for uncompromising speed and
                  endurance. Every platform in our inventory is benchmarked to
                  sustain maximum wattage without throttling.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 flex-1 content-start">
            
            {/* CARD 1: High Performance */}
            <motion.div 
              style={{ opacity: c1Opacity, scale: c1Scale, borderColor: c1Border }}
              className="group relative rounded-2xl border bg-white/[0.03] p-8 backdrop-blur-xl transition-shadow"
            >
              <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                <span>SPEC // 01</span>
                <motion.div style={{ color: c1Color }}><Cpu size={16} /></motion.div>
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
                High Performance
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                Multi-threaded compute architectures and high-bandwidth memory
                engineered for extreme gaming, CAD, and real-time AI workloads.
              </p>
              <motion.div style={{ color: c1Color }} className="mt-6 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300">
                Direct Boost Enabled
              </motion.div>
            </motion.div>

            {/* CARD 2: Premium Displays */}
            <motion.div 
              style={{ opacity: c2Opacity, scale: c2Scale, borderColor: c2Border }}
              className="group relative rounded-2xl border bg-white/[0.03] p-8 backdrop-blur-xl transition-shadow"
            >
              <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                <span>SPEC // 02</span>
                <motion.div style={{ color: c2Color }}><Tv size={16} /></motion.div>
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
                Premium Displays
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                Ultra-dense OLED and high refresh-rate IPS experiences
                delivering 99.8% DCI-P3 color precision with true 10-bit color.
              </p>
              <motion.div style={{ color: c2Color }} className="mt-6 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300">
                Sub-1ms Response
              </motion.div>
            </motion.div>

            {/* CARD 3: Smart Selection */}
            <motion.div 
              style={{ opacity: c3Opacity, scale: c3Scale, borderColor: c3Border }}
              className="group relative rounded-2xl border bg-white/[0.03] p-8 backdrop-blur-xl transition-shadow"
            >
              <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                <span>SPEC // 03</span>
                <motion.div style={{ color: c3Color }}><Bot size={16} /></motion.div>
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
                Smart Selection
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                AI-powered tech assistant comparing specifications, bottleneck
                tolerances, and value ratios for your individual budget.
              </p>
              <motion.div style={{ color: c3Color }} className="mt-6 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300">
                Zero Guesswork
              </motion.div>
            </motion.div>

          </div>
          
          {/* Progress Indicator Line (Directly under cards) */}
          <div className="mt-8 hidden sm:block relative h-px w-full bg-white/10 overflow-hidden">
            <motion.div 
              style={{ scaleX: smoothProgress, transformOrigin: "left" }} 
              className="absolute inset-0 bg-[#00E5FF]" 
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default PowerWithoutCompromise;
