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

    const xTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseEnterLink = () => {
      gsap.to(ring, {
        scale: 2,
        backgroundColor: 'rgba(184, 255, 0, 0.15)',
        borderColor: 'rgba(184, 255, 0, 0.6)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
    };

    const handleMouseLeaveLink = () => {
      gsap.to(ring, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'var(--color-accent)',
        borderRadius: '50%',
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, { opacity: 1, duration: 0.2 });
    };

    const handleMouseEnterHeading = () => {
      gsap.to(ring, {
        scale: 3,
        borderRadius: '4px',
        rotation: 15,
        backgroundColor: 'rgba(184, 255, 0, 0.08)',
        borderColor: 'rgba(184, 255, 0, 0.4)',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Delegate hover events
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, .card, [data-cursor="pointer"]').forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterLink);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
      });
      document.querySelectorAll('h1, h2, h3, .heading-hero, .heading-section').forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterHeading);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
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
