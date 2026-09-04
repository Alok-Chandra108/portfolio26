import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // Disable browser scroll restoration to prevent landing at previous scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
    };

    resetScroll();

    // Call on next frame/tick to handle any asynchronous layout shifts or Framer Motion transitions
    const timer = setTimeout(resetScroll, 50);
    const raf = requestAnimationFrame(resetScroll);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [pathname, lenis]);

  return null;
}
