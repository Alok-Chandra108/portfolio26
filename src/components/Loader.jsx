import { useEffect, useRef, useState } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import './Loader.css';

export default function Loader({ onComplete }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const counterRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial entrance: Drop in immediately, no fade-in delay (opacity starts 1)
      gsap.fromTo(contentRef.current, 
        { scale: 1.5, y: 30 },
        { scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      // 2. Fast counter animation 0 -> 100
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 1.8, // Slightly faster counter
        ease: "power2.out", // Smooth deceleration
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.floor(counter.val);
          }
        }
      });

      // 3. Exit animation
      gsap.delayedCall(2.2, () => {
        // The huge number slides out smoothly
        gsap.to(contentRef.current, {
          y: -150,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: "power4.inOut",
        });

        // The background overlay clips entirely, feeling extremely snappy
        gsap.to(overlayRef.current, {
          clipPath: 'inset(100% 0 0 0)',
          duration: 0.8,
          delay: 0.2, // Tighter delay
          ease: "expo.inOut",
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div className="loader-overlay" ref={overlayRef}>
      <div className="loader-content" ref={contentRef}>
        <div className="loader-counter-wrapper">
          <span className="loader-counter" ref={counterRef}>0</span>
          <span className="loader-percent">%</span>
        </div>
      </div>
      <div className="loader-hint">Initializing Environment</div>
    </div>
  );
}
