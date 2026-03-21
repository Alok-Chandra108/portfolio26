import { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on mobile/touch
    if (window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xTo = gsap.quickTo(ring, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseEnterLink = (e) => {
      // Fully hide the custom cursor when hovering over the navbar logo
      if (e.target.closest && e.target.closest('.navbar__logo')) {
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
        return;
      }

      // Check if the hovered element is part of the navbar or menu overlay
      if (e.target.closest && e.target.closest('.navbar, .menu-overlay')) {
        gsap.to(ring, {
          scale: 0.5,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
        });
        gsap.to(dot, { 
          scale: 1.5,
          duration: 0.2 
        });
        return;
      }

      gsap.to(ring, {
        scale: 2,
        backgroundColor: 'rgba(184, 255, 0, 0.15)',
        borderColor: 'rgba(184, 255, 0, 0.6)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
    };

    const handleMouseLeaveLink = (e) => {
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        backgroundColor: 'transparent',
        borderColor: 'var(--color-accent)',
        borderRadius: '50%',
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, { opacity: 1, scale: 1, duration: 0.2 });
    };

    const handleMouseEnterHide = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    const handleMouseLeaveHide = () => {
      gsap.to(dot, { opacity: 1, duration: 0.2 });
      gsap.to(ring, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Delegate hover events
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, .card, [data-cursor="pointer"]').forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterLink);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
      });
      document.querySelectorAll('[data-cursor="hide"]').forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterHide);
        el.addEventListener('mouseleave', handleMouseLeaveHide);
      });
    };

    // MutationObserver to re-bind on DOM changes
    const observer = new MutationObserver(() => {
      addHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    addHoverListeners();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' &&
    (window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window)) {
    return null;
  }

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
