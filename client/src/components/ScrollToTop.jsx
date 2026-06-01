import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Prefer manual scroll restoration so browser won't restore previous position
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch (e) {
        // ignore
      }
    }

    // Use a couple of safe methods to ensure we end up at the very top
    const scrollToTop = () => {
      // immediate jump to top (more reliable than smooth for route changes)
      window.scrollTo(0, 0);
      // Some browsers use documentElement, some use body
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // Run after paint to ensure layout is ready
    requestAnimationFrame(() => {
      // run twice to defeat some browsers' restoration quirks
      scrollToTop();
      requestAnimationFrame(scrollToTop);
    });

    // Final fallback after small delay in case some layout changes happen
    setTimeout(() => {
      scrollToTop();

      // Also try scrolling the app root if present
      const rootEl = document.getElementById("root");
      if (rootEl) {
        try {
          rootEl.scrollTop = 0;
        } catch (e) {}
      }
    }, 50);

    // No cleanup needed here
  }, [pathname]);

  return null;
}

export default ScrollToTop;