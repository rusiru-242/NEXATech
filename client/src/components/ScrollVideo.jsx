import { useEffect, useRef, useState } from "react";

// Configurable hero video path (place your video file at client/public/videos/nexatech-hero.mp4)
export const HERO_VIDEO_URL = "/videos/nexatech-hero.mp4";

export function ScrollVideo({ videoUrl = HERO_VIDEO_URL, className = "" }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useProceduralFallback, setUseProceduralFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let targetProgress = 0;
    let smoothedProgress = 0;
    const lerpFactor = 0.12;
    let isMounted = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Update target progress on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      targetProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Resize canvas with DPR capping (max 2)
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // ============================================================
    // PROCEDURAL CYBERNETIC AMBIENT FALLBACK (when video is absent)
    // ============================================================
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 800 + 200,
      baseRadius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const renderProcedural = (progress) => {
      const w = canvas.width;
      const h = canvas.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Deep space background with subtle dynamic vignette
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      const scrollShiftY = progress * h * 0.35;
      const glowGrad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.45 - scrollShiftY * 0.2,
        w * 0.05,
        w * 0.5,
        h * 0.45 - scrollShiftY * 0.2,
        w * 0.65
      );
      glowGrad.addColorStop(0, "rgba(0, 229, 255, 0.06)");
      glowGrad.addColorStop(0.5, "rgba(0, 150, 255, 0.02)");
      glowGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle cybernetic perspective grid
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1 * dpr;

      const gridSpacing = 80 * dpr;
      const gridOffsetY = (progress * 250 * dpr) % gridSpacing;
      for (let y = gridOffsetY; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Draw floating particles with scroll depth
      time += 0.015;
      particles.forEach((p) => {
        p.phase += p.pulseSpeed;
        const currentAlpha =
          p.alpha * (0.7 + 0.3 * Math.sin(p.phase));

        // Parallax vertical displacement based on z-depth
        const scrollParallax = (progress * 400 * (1000 / p.z)) * dpr;
        let px = (p.x * dpr + Math.sin(time + p.phase) * 15 * dpr) % w;
        if (px < 0) px += w;
        let py = ((p.y * dpr - scrollParallax + time * 20 * dpr) % h);
        if (py < 0) py += h;

        ctx.fillStyle = `rgba(0, 229, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.baseRadius * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle cyan horizon aura at bottom
      const bottomAura = ctx.createLinearGradient(0, h * 0.7, 0, h);
      bottomAura.addColorStop(0, "rgba(0, 229, 255, 0)");
      bottomAura.addColorStop(1, "rgba(0, 229, 255, 0.035)");
      ctx.fillStyle = bottomAura;
      ctx.fillRect(0, h * 0.7, w, h * 0.3);

      ctx.restore();
    };

    // ============================================================
    // VIDEO FRAME-SCRUB RENDERER (when video is available)
    // ============================================================
    const video = videoRef.current;

    const renderVideoFrame = (targetTime) => {
      if (!video || video.readyState < 2) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      if (!vw || !vh) return;

      // Object-cover crop math
      const cover = Math.max(cw / vw, ch / vh);
      const sw = cw / cover;
      const sh = ch / cover;
      const sx = (vw - sw) / 2;
      const sy = (vh - sh) / 2;

      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);

      // Subtle cinematic dark tint overlay so text remains razor sharp
      ctx.fillStyle = "rgba(5, 5, 5, 0.45)";
      ctx.fillRect(0, 0, cw, ch);
    };

    // Main animation loop
    const tick = () => {
      if (!isMounted) return;

      if (prefersReducedMotion) {
        smoothedProgress = 0;
      } else {
        smoothedProgress += (targetProgress - smoothedProgress) * lerpFactor;
      }

      if (videoLoaded && video && video.duration) {
        const duration = video.duration;
        const targetVideoTime = Math.min(
          duration * smoothedProgress,
          Math.max(duration - 0.05, 0)
        );

        // Seek video frame
        if (Math.abs(video.currentTime - targetVideoTime) > 0.015) {
          video.currentTime = targetVideoTime;
        }

        renderVideoFrame(targetVideoTime);
      } else {
        renderProcedural(smoothedProgress);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [videoLoaded]);

  // Video loader attempt
  useEffect(() => {
    let active = true;
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;

    const onLoadedData = () => {
      if (!active) return;
      videoRef.current = video;
      setVideoLoaded(true);
      setUseProceduralFallback(false);
    };

    const onError = () => {
      if (!active) return;
      // Graceful fallback to procedural ambient canvas without noisy console logs
      setUseProceduralFallback(true);
      setVideoLoaded(false);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("error", onError);

    return () => {
      active = false;
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("error", onError);
      video.src = "";
    };
  }, [videoUrl]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full object-cover"
      />
    </div>
  );
}

export default ScrollVideo;
