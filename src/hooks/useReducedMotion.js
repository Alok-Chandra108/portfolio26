import { useEffect, useState } from 'react';

/**
 * Hook to detect and respond to prefers-reduced-motion media query.
 * Returns true if user prefers reduced motion.
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Check initial state
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    // Listen for changes
    const handler = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

/**
 * Hook that returns GSAP config adjusted for reduced motion.
 * When reduced motion is preferred, returns config with minimal/zero durations.
 */
export function useGSAPReducedMotionConfig(baseConfig = {}) {
  const prefersReduced = useReducedMotion();
  
  if (prefersReduced) {
    return {
      ...baseConfig,
      duration: 0,
      ease: 'none',
      // For ScrollTrigger scrub, disable smooth scrub
      scrub: false,
    };
  }
  
  return baseConfig;
}

export default useReducedMotion;
