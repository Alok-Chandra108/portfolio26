import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import './CustomCursor.css';

/**
 * CustomCursor component that provides a premium, responsive cursor experience.
 * Optimized with GSAP quickTo and event delegation for performance.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const isVisible = useRef(false);
  
  // Store quickTo instances for cleanup
  const quickToRefs = useRef({
    dotX: null,
    dotY: null,
    ringX: null,
    ringY: null
  });
  
  // Store media query listener for cleanup
  const mediaQueryRef = useRef(null);
  
  // Track mobile state
  const [isMobile, setIsMobile] = useState(false);

  // Throttle mousemove with requestAnimationFrame
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const pendingUpdate = useRef(false);

  // Check mobile once on mount
  useEffect(() => {
    const checkMobile = () => {
      const mq = window.matchMedia('(max-width: 768px)');
      const isTouch = 'ontouchstart' in window;
      setIsMobile(mq.matches || isTouch);
    };
    
    checkMobile();
    
    // Listen for viewport changes
    const mq = window.matchMedia('(max-width: 768px)');
    mediaQueryRef.current = mq;
    
    const handler = (e) => {
      setIsMobile(e.matches || 'ontouchstart' in window);
    };
    
    mq.addEventListener('change', handler);
    
    return () => {
      mq.removeEventListener('change', handler);
      mediaQueryRef.current = null;
    };
  }, []);

  // Don't render or run on mobile
  if (isMobile) {
    return null;
  }

  // Throttled mouse position updater
  const updateCursorPosition = useCallback(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || !quickToRefs.current.dotX) return;

    quickToRefs.current.dotX(mousePos.current.x);
    quickToRefs.current.dotY(mousePos.current.y);
    quickToRefs.current.ringX(mousePos.current.x);
    quickToRefs.current.ringY(mousePos.current.y);
    
    pendingUpdate.current = false;
  }, []);

  const handleMouseMove = useCallback((e) => {
    mousePos.current.x = e.clientX;
    mousePos.current.y = e.clientY;
    
    if (!isVisible.current) {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot && ring) {
        gsap.to([dot, ring], { opacity: 1, scale: 1, duration: 0.3 });
        isVisible.current = true;
      }
    }
    
    if (!pendingUpdate.current) {
      pendingUpdate.current = true;
      rafId.current = requestAnimationFrame(updateCursorPosition);
    }
  }, [updateCursorPosition]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial state
    gsap.set([dot, ring], { opacity: 0, scale: 0, xPercent: -50, yPercent: -50 });

    // Create optimized quickTo instances
    quickToRefs.current.dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    quickToRefs.current.dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    quickToRefs.current.ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power2.out" });
    quickToRefs.current.ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power2.out" });

    const handleMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.2, ease: "power2.out" });
      gsap.to(dot, { scale: 1.5, duration: 0.2 });
    };

    const handleMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, scale: 0, duration: 0.3 });
      isVisible.current = false;
    };

    // Event Delegation for hover states
    const handleMouseOver = (e) => {
      const target = e.target;
      const clickable = target.closest('a, button, .card, [data-cursor="pointer"], .clickable');
      const hideCursor = target.closest('[data-cursor="hide"], .navbar__logo');
      const textCursor = target.closest('p, h1, h2, h3, h4, h5, h6, span, li');

      if (hideCursor) {
        gsap.to([dot, ring], { opacity: 0, scale: 0, duration: 0.2 });
      } else if (clickable) {
        gsap.to(ring, {
          scale: 1.8,
          backgroundColor: 'rgba(184, 255, 0, 0.12)',
          borderColor: 'rgba(184, 255, 0, 0.4)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else if (textCursor && !clickable) {
        gsap.to(ring, {
          scale: 1.2,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          duration: 0.3
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      const clickable = target.closest('a, button, .card, [data-cursor="pointer"], .clickable');
      const hideCursor = target.closest('[data-cursor="hide"], .navbar__logo');
      
      if (clickable || hideCursor) {
        gsap.to(ring, {
          scale: 1,
          opacity: 1,
          backgroundColor: 'transparent',
          borderColor: 'var(--color-accent)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, { opacity: 1, scale: 1, duration: 0.2 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      
      // Cancel pending RAF
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      // Kill quickTo instances to prevent memory leaks
      Object.values(quickToRefs.current).forEach(qt => {
        if (qt && qt.kill) qt.kill();
      });
      quickToRefs.current = { dotX: null, dotY: null, ringX: null, ringY: null };
    };
  }, [handleMouseMove]);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
