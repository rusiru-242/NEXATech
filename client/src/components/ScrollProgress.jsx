import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const bar = barRef.current;
      if (!bar) return;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = Math.min(
          Math.max(window.scrollY / totalHeight, 0),
          1
        );
        bar.style.transform = `scaleX(${current})`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] w-full bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-[#00E5FF]/70 via-[#00E5FF] to-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.7)] transition-transform duration-75 ease-out"
        style={{
          transform: "scaleX(0)",
          transformOrigin: "left center",
          willChange: "transform",
        }}
      />
    </div>
  );
}

export default ScrollProgress;
