import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — edit these to swap the sequence
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_COUNT   = 240;
const FRAME_PATH    = "/sequence/gamingpc/ezgif-frame-";
const FRAME_EXT     = ".png";
const FRAME_PAD     = 3;   // zero-pad to 001 … 240
const LERP          = 0.11; // smoothing (lower = smoother/slower)

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function pad(n)     { return String(n).padStart(FRAME_PAD, "0"); }
function src(i)     { return `${FRAME_PATH}${pad(i + 1)}${FRAME_EXT}`; }
function clamp(v,a,b) { return Math.min(Math.max(v, a), b); }

// ─────────────────────────────────────────────────────────────────────────────
// GamingPCSequence
//
// Props:
//   sectionRef   – ref to the outer tall scroll-section
//   className    – extra Tailwind classes for the canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────
export function GamingPCSequence({ sectionRef, className = "", fullBleed = false }) {
  const canvasRef   = useRef(null);
  const imagesRef   = useRef([]);
  const rafRef      = useRef(null);
  const smoothRef   = useRef(0);
  const drawnRef    = useRef(-1);
  const inViewRef   = useRef(false);

  const reduceMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // ── Preload ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const imgs = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = imgs;
    let dead = false;

    function load(i) {
      return new Promise(res => {
        const img  = new Image();
        img.onload  = () => { if (!dead) imgs[i] = img; res(); };
        img.onerror = () => res();
        img.src = src(i);
      });
    }

    // Eager: first 30
    const eager = [];
    for (let i = 0; i < Math.min(30, FRAME_COUNT); i++) eager.push(load(i));

    Promise.all(eager).then(() => {
      if (dead) return;
      let idx = 30;
      function batch() {
        if (dead || idx >= FRAME_COUNT) return;
        const end = Math.min(idx + 20, FRAME_COUNT);
        const p = [];
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

  // ── Canvas resize ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // fullBleed: always use full viewport; otherwise use parent dimensions
      const w = fullBleed ? window.innerWidth  : (canvas.parentElement?.clientWidth  ?? window.innerWidth);
      const h = fullBleed ? window.innerHeight : (canvas.parentElement?.clientHeight ?? window.innerHeight);
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      drawnRef.current = -1; // force redraw at new size
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [fullBleed]);

  // ── Draw ─────────────────────────────────────────────────────────────────────
  function drawFrame(idx) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[idx];
    const cw  = canvas.width;
    const ch  = canvas.height;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);

    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    if (fullBleed) {
      // Scale to exactly fill canvas height → no top/bottom gap.
      // Then right-align the image so PC's right edge is flush with canvas right edge.
      // Wide images (landscape) naturally get cropped on the left — right side always gapless.
      const scale = ch / img.naturalHeight;       // height-fit: fills full vertical
      const dw    = img.naturalWidth  * scale;
      const dh    = ch;                            // exact canvas height, no gap
      const dx    = cw - dw;                      // right-flush: right edge = canvas right
      const dy    = 0;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      // object-contain — never crop any part of the PC
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth  * scale;
      const dh = img.naturalHeight * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }
  }

  // ── Scroll + RAF ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let alive  = true;
    let target = 0;

    // IntersectionObserver to gate expensive work
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
      // scrollable = tall outer height minus one viewport height (the sticky window)
      const scrollable = sec.offsetHeight - window.innerHeight;
      const scrolledIn = window.scrollY - sec.offsetTop;
      const progress   = clamp(scrolledIn / Math.max(scrollable, 1), 0, 1);
      target = Math.round(progress * (FRAME_COUNT - 1));
    }

    function tick() {
      if (!alive) return;

      if (reduceMotion) {
        // Show first frame static
        if (drawnRef.current !== 0) { drawFrame(0); drawnRef.current = 0; }
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (inViewRef.current) {
        smoothRef.current += (target - smoothRef.current) * LERP;
        const f = clamp(Math.round(smoothRef.current), 0, FRAME_COUNT - 1);
        if (f !== drawnRef.current) { drawFrame(f); drawnRef.current = f; }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (observer) observer.disconnect();
    };
  }, [sectionRef]);

  // ── Render ───────────────────────────────────────────────────────────────────
  if (fullBleed) {
    // Full-bleed: absolute inset-0, fills entire sticky viewport
    return (
      <div className="absolute inset-0 z-[1]" aria-hidden="true">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{ display: "block" }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* Subtle cyan ambient glow behind PC — matches cyan PURE SPEED. branding */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 52%, rgba(0,229,255,0.06) 0%, transparent 65%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 block h-full w-full"
        style={{ display: "block" }}
      />
    </div>
  );
}

export default GamingPCSequence;
