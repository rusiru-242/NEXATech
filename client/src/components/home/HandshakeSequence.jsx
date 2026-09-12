import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const FRAME_COUNT = 240;
const FRAME_BASE_PATH = "/animations/handshake/ezgif-frame-";
const FRAME_EXT = ".webp";
const FRAME_PAD_LENGTH = 3; // 001 … 240
const LERP = 0.1;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function padFrame(n) {
  return String(n).padStart(FRAME_PAD_LENGTH, "0");
}
function frameSrc(index) {
  return `${FRAME_BASE_PATH}${padFrame(index + 1)}${FRAME_EXT}`;
}
function clamp(v, lo, hi) {
  return Math.min(Math.max(v, lo), hi);
}

// ─────────────────────────────────────────────────────────────────────────────
// HandshakeSequence
//
// Renders a FULL-BLEED background Canvas — absolute inset-0, 100% × 100%.
// The canvas fills whatever parent container it lives in.
// Uses object-COVER scaling: the handshake fills the frame, centered.
//
// Props:
//   sectionRef  – ref to the outer scroll-section so we can compute progress
// ─────────────────────────────────────────────────────────────────────────────
export function HandshakeSequence({ sectionRef }) {
  const canvasRef   = useRef(null);
  const imagesRef   = useRef([]);
  const rafRef      = useRef(null);
  const smoothRef   = useRef(0);
  const drawnRef    = useRef(-1);
  const inViewRef   = useRef(false);

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
        img.onload  = () => { if (!dead) images[i] = img; res(); };
        img.onerror = () => res();
        img.src = frameSrc(i);
      });
    }

    const EAGER = 30;
    const eager = [];
    for (let i = 0; i < Math.min(EAGER, FRAME_COUNT); i++) eager.push(loadFrame(i));

    Promise.all(eager).then(() => {
      if (dead) return;
      let idx = EAGER;
      function batch() {
        if (dead || idx >= FRAME_COUNT) return;
        const end = Math.min(idx + 20, FRAME_COUNT);
        const p = [];
        for (let i = idx; i < end; i++) p.push(loadFrame(i));
        idx = end;
        Promise.all(p).then(() => {
          if (dead) return;
          "requestIdleCallback" in window
            ? window.requestIdleCallback(batch, { timeout: 500 })
            : setTimeout(batch, 60);
        });
      }
      "requestIdleCallback" in window
        ? window.requestIdleCallback(batch, { timeout: 500 })
        : setTimeout(batch, 60);
    });

    return () => { dead = true; imagesRef.current = []; };
  }, []);

  // ── Canvas resize — match parent size exactly ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr    = Math.min(window.devicePixelRatio || 1, 1.5);
      // parent is the sticky inner div (100vw × 100vh)
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth  : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      // force redraw at new size
      drawnRef.current = -1;
      const f = Math.round(smoothRef.current);
      if (f >= 0) drawFrame(f);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Draw — object-COVER, centered ─────────────────────────────────────────
  function drawFrame(frameIndex) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    const cw  = canvas.width;
    const ch  = canvas.height;

    // Base fill — matches page background; also clears previous frame
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);

    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    // ── object-cover math ────────────────────────────────────────────────────
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth  * scale;
    const dh = img.naturalHeight * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // ── Scroll + RAF ──────────────────────────────────────────────────────────
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
      const progress   = clamp(scrolledIn / cachedScrollable, 0, 1);
      target = Math.round(progress * (FRAME_COUNT - 1));
      startLoop();
    }

    function tick() {
      if (!alive || !inViewRef.current) {
        isRunning = false;
        return;
      }

      if (prefersReducedMotion) {
        const f = Math.floor(FRAME_COUNT * 0.85);
        if (drawnRef.current !== f) { drawFrame(f); drawnRef.current = f; }
        isRunning = false;
        return;
      }

      smoothRef.current += (target - smoothRef.current) * LERP;
      const f = Math.round(smoothRef.current);
      if (f !== drawnRef.current) { drawFrame(f); drawnRef.current = f; }

      // Idle sleep: stop loop when settled
      if (Math.abs(target - smoothRef.current) < 0.05 && f === drawnRef.current) {
        isRunning = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    // IntersectionObserver gates expensive RAF work
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

  // ── Render — just the canvas, styled absolute inset-0 ────────────────────
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
      style={{ display: "block" }}
    />
  );
}

export default HandshakeSequence;
