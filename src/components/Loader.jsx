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
      // 1. Initial entrance: Drop in and scale down slightly
      gsap.fromTo(contentRef.current, 
        { scale: 1.5, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.8, ease: "power3.out" }
      );

      // 2. Fast counter animation 0 -> 100
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 2.2,
        ease: "expo.out", // Different easing for rapid start and slow finish
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.floor(counter.val);
          }
        }
      });

      // 3. Exit animation
      gsap.delayedCall(2.6, () => {
        // The huge number fades and slides out
        gsap.to(contentRef.current, {
          y: -120,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power4.in",
        });

        // The background overlay clips entirely
        gsap.to(overlayRef.current, {
          clipPath: 'inset(100% 0 0 0)', // Clips away by sliding down
          duration: 1.0,
          delay: 0.3,
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
