import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash (anchor), scroll to that element; otherwise scroll to top
    if (hash) {
      // small timeout to allow DOM to settle
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
}
