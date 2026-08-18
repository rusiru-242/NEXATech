import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash (anchor), scroll to that element; otherwise scroll to top
    if (hash) {
      // small timeout to allow DOM to settle
      setTimeout(() => {
        try {
          const el = document.querySelector(hash);

          if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } catch (err) {
          // swallow DOM errors to avoid crashing the app
          console.warn("ScrollToTop hash scroll failed:", err);
        }
      }, 0);
    } else {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch (err) {
        try {
          // fallback for browsers that don't support options
          window.scrollTo(0, 0);
        } catch (e) {
          console.warn("ScrollToTop scroll failed:", e);
        }
      }
    }
  }, [pathname, hash]);

  return null;
}
