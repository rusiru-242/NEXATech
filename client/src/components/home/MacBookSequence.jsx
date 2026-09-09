import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_COUNT = 300;
const FRAME_BASE  = "/sequence/macbook/ezgif-frame-";
const FRAME_EXT   = ".png";
const FRAME_PAD   = 3;   // zero-pad: 001 … 300
const LERP        = 0.1; // smoothing (lower = smoother / slower catch-up)

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function pad(n)        { return String(n).padStart(FRAME_PAD, "0"); }
function src(i)        { return `${FRAME_BASE}${pad(i + 1)}${FRAME_EXT}`; }
function clamp(v,a,b)  { return Math.min(Math.max(v, a), b); }

// ─────────────────────────────────────────────────────────────────────────────
// MacBookSequence
//
// Props:
//   sectionRef – ref to the outer tall scroll-section for progress tracking
// ─────────────────────────────────────────────────────────────────────────────
export function MacBookSequence({ sectionRef }) {
  const canvasRef  = useRef(null);
  const imagesRef  = useRef([]);
  const rafRef     = useRef(null);
  const smoothRef  = useRef(0);
  const drawnRef   = useRef(-1);
  const inViewRef  = useRef(false);
  const targetRef  = useRef(0);

  const reduceMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // ── Preload ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const imgs = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = imgs;
    let dead = false;

    function load(i) {
      return new Promise(res => {
        const img    = new Image();
        img.onload   = () => {
          if (!dead) {
            imgs[i] = img;
            if (i === 0) {
              drawFrame(0);
              drawnRef.current = 0;
            }
          }
          res();
        };
        img.onerror  = () => res();
        img.src      = src(i);
      });
    }

    // Eager: first 30 frames immediately for fast first-paint
    const eager = [];
    for (let i = 0; i < Math.min(30, FRAME_COUNT); i++) eager.push(load(i));

    Promise.all(eager).then(() => {
      if (dead) return;
      let idx = 30;
      function batch() {
        if (dead || idx >= FRAME_COUNT) return;
        const end  = Math.min(idx + 20, FRAME_COUNT);
        const p    = [];
        for (let i = idx; i < end; i++) p.push(load(i));
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

    return () => { dead = true; imagesRef.current = []; };
  }, []);

  // ── Canvas resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr    = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth  : 700;
      const h = parent ? parent.clientHeight : 560;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      drawnRef.current = -1;
      // Immediately draw current frame upon resize
      const target = Math.max(0, Math.round(smoothRef.current));
      drawFrame(target);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Draw ──────────────────────────────────────────────────────────────────
  function drawFrame(idx) {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const img = imagesRef.current[idx];
    const cw  = canvas.width;
    const ch  = canvas.height;

    if (!img || !img.naturalWidth || !img.naturalHeight) return false;

    // Fully transparent background — hero bg shows through
    ctx.clearRect(0, 0, cw, ch);

    // object-contain: scale to fit, centred
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw    = img.naturalWidth  * scale;
    const dh    = img.naturalHeight * scale;
    const dx    = (cw - dw) / 2;
    const dy    = (ch - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    return true;
  }

  // ── Scroll + RAF ──────────────────────────────────────────────────────────
  useEffect(() => {
    let alive  = true;

    // IntersectionObserver to gate RAF when off-screen
    let observer = null;
    if (sectionRef?.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([e]) => { inViewRef.current = e.isIntersecting; },
        { rootMargin: "400px 0px 400px 0px" }
      );
      observer.observe(sectionRef.current);
    } else {
      inViewRef.current = true;
    }

    function onScroll() {
      const sec = sectionRef?.current;
      if (!sec) return;
      const scrollable = sec.offsetHeight - window.innerHeight;
      const startY = sec.offsetTop <= 120 ? 0 : sec.offsetTop;
      const scrolledIn = window.scrollY - startY;
      const progress   = clamp(scrolledIn / Math.max(scrollable, 1), 0, 1);
      targetRef.current = Math.round(progress * (FRAME_COUNT - 1));
    }

    function tick() {
      if (!alive) return;

      if (reduceMotion) {
        if (drawnRef.current !== 0) {
          if (drawFrame(0)) drawnRef.current = 0;
        }
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (inViewRef.current) {
        smoothRef.current += (targetRef.current - smoothRef.current) * LERP;
        const f = clamp(Math.round(smoothRef.current), 0, FRAME_COUNT - 1);
        if (f !== drawnRef.current) {
          if (drawFrame(f)) {
            drawnRef.current = f;
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial sync
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (observer) observer.disconnect();
    };
  }, [sectionRef]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative h-full w-full"
      aria-hidden="true"
      style={{
        maskImage:
          "radial-gradient(ellipse 96% 92% at 50% 50%, black 70%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 96% 92% at 50% 50%, black 70%, transparent 100%)",
      }}
    >
      {/* Subtle cyan ambient glow behind MacBook */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 55% 50%, rgba(0,229,255,0.09) 0%, rgba(0,180,220,0.03) 45%, transparent 72%)",
        }}
      />

      {/* Instant 1st-Frame Poster (renders immediately with HTML, zero blank flash) */}
      <img
        src="/sequence/macbook/ezgif-frame-001.png"
        alt="Apple Silicon M6 Architecture"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        className="pointer-events-none absolute inset-0 z-[5] block h-full w-full object-contain"
      />

      {/* Left fade — seamlessly merges into hero left content (desktop only) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[22%] hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.5) 45%, transparent 100%)",
        }}
      />

      {/* Top & bottom subtle feathering */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[10%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,7,18,0.8) 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[10%]"
        style={{
          background:
            "linear-gradient(to top, rgba(3,7,18,0.8) 0%, transparent 100%)",
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 block h-full w-full"
        style={{ display: "block" }}
      />
    </div>
  );
}

export default MacBookSequence;
