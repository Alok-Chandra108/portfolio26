import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../utils/gsapPlugins.js';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef();

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis 
      ref={lenisRef} 
      root 
      options={{ 
        duration: 1.5, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        syncTouch: true,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
