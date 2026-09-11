import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION: 300 frames from /animations/last/ezgif-frame-001.png … 300.png
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_COUNT = 300;
const FRAME_BASE_PATH = "/animations/last/ezgif-frame-";
const FRAME_EXT = ".png";
const FRAME_PAD_LENGTH = 3;
const LERP = 0.1;

function padFrame(n) {
  return String(n).padStart(FRAME_PAD_LENGTH, "0");
}

function frameSrc(index) {
  return `${FRAME_BASE_PATH}${padFrame(index + 1)}${FRAME_EXT}`;
}

function clamp(v, lo, hi) {
  return Math.min(Math.max(v, lo), hi);
}

/**
 * FutureSequence
 *
 * Full-bleed canvas background for the "STEP INTO THE FUTURE" section.
 * Uses object-cover scaling to fill the viewport seamlessly.
 * Driven directly by scroll progress across sectionRef.
 */
export function FutureSequence({ sectionRef }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const smoothRef = useRef(0);
  const drawnRef = useRef(-1);
  const inViewRef = useRef(false);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // ── Preload ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const images = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = images;
    let dead = false;

    function loadFrame(i) {
      return new Promise((res) => {
        const img = new Image();
        img.onload = () => {
          if (!dead) {
            images[i] = img;
            if (i === 0 && drawnRef.current === -1) {
              drawFrame(0);
              drawnRef.current = 0;
            }
          }
          res();
        };
        img.onerror = () => res();
        img.src = frameSrc(i);
      });
    }

    // Eager load first 30 frames for fast first-paint
    const EAGER = 30;
    const eager = [];
    for (let i = 0; i < Math.min(EAGER, FRAME_COUNT); i++) eager.push(loadFrame(i));

    Promise.all(eager).then(() => {
      if (dead) return;
      let idx = EAGER;
      function batch() {
        if (dead || idx >= FRAME_COUNT) return;
        const end = Math.min(idx + 25, FRAME_COUNT);
        const p = [];
        for (let i = idx; i < end; i++) p.push(loadFrame(i));
        idx = end;
        Promise.all(p).then(() => {
          if (dead) return;
          "requestIdleCallback" in window
            ? window.requestIdleCallback(batch, { timeout: 400 })
            : setTimeout(batch, 50);
        });
      }
      "requestIdleCallback" in window
        ? window.requestIdleCallback(batch, { timeout: 400 })
        : setTimeout(batch, 50);
    });

    return () => {
      dead = true;
      imagesRef.current = [];
    };
  }, []);

  // ── Canvas resize ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      drawnRef.current = -1;
      const target = Math.max(0, Math.round(smoothRef.current));
      drawFrame(target);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Draw (object-cover, centered) ──────────────────────────────────────────
  function drawFrame(frameIndex) {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const img = imagesRef.current[frameIndex];
    const cw = canvas.width;
    const ch = canvas.height;

    if (!img || !img.naturalWidth || !img.naturalHeight) return false;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);

    // object-cover: fill entire canvas, centered
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    return true;
  }

  // ── Scroll + RAF ───────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    let isRunning = false;
    let target = 0;
    let cachedScrollable = 1;
    let cachedTop = 0;

    function measure() {
      const sec = sectionRef?.current;
      if (!sec) return;
      cachedScrollable = Math.max(sec.offsetHeight - window.innerHeight, 1);
      cachedTop = sec.offsetTop;
    }
    measure();

    function startLoop() {
      if (!isRunning && inViewRef.current && alive) {
        isRunning = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    function onScroll() {
      if (!inViewRef.current) return;
      const scrolledIn = window.scrollY - cachedTop;
      const progress = clamp(scrolledIn / cachedScrollable, 0, 1);
      target = Math.round(progress * (FRAME_COUNT - 1));
      startLoop();
    }

    function tick() {
      if (!alive || !inViewRef.current) {
        isRunning = false;
        return;
      }

      if (prefersReducedMotion) {
        if (drawnRef.current !== 0) {
          if (drawFrame(0)) drawnRef.current = 0;
        }
        isRunning = false;
        return;
      }

      smoothRef.current += (target - smoothRef.current) * LERP;
      const f = clamp(Math.round(smoothRef.current), 0, FRAME_COUNT - 1);
      if (f !== drawnRef.current) {
        if (drawFrame(f)) {
          drawnRef.current = f;
        }
      }

      // Idle sleep: stop loop when settled
      if (Math.abs(target - smoothRef.current) < 0.05 && f === drawnRef.current) {
        isRunning = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    let observer = null;
    if (sectionRef?.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([e]) => {
          inViewRef.current = e.isIntersecting;
          if (inViewRef.current) {
            measure();
            onScroll();
            startLoop();
          } else {
            isRunning = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
          }
        },
        { rootMargin: "300px 0px 300px 0px" }
      );
      observer.observe(sectionRef.current);
    } else {
      inViewRef.current = true;
      startLoop();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (observer) observer.disconnect();
    };
  }, [sectionRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 1st-frame instant poster to prevent any blank paint */}
      <img
        src="/animations/last/ezgif-frame-001.png"
        alt="Future sequence initial frame"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        className="pointer-events-none absolute inset-0 block h-full w-full object-cover"
      />

      <canvas
        ref={canvasRef}
        className="relative z-[2] block h-full w-full"
        style={{ display: "block" }}
      />
    </div>
  );
}

export default FutureSequence;
