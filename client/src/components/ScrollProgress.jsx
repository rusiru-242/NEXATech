import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const current = Math.min(
              Math.max(window.scrollY / totalHeight, 0),
              1
            );
            setProgress(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

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
        className="h-full bg-gradient-to-r from-[#00E5FF]/70 via-[#00E5FF] to-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.7)] transition-transform duration-75 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}

export default ScrollProgress;
