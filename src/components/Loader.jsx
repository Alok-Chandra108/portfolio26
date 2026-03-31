import { useEffect, useRef, useState } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import './Loader.css';

const hints = [
  "INITIALIZING INTERFACE",
  "FETCHING ASSETS",
  "OPTIMIZING RENDERER",
  "STAGING ENVIRONMENT"
];

export default function Loader({ onComplete }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const counterRef = useRef(null);
  const [hint, setHint] = useState(hints[0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial entrance: Drop in immediately
      gsap.fromTo(contentRef.current, 
        { scale: 1.5, y: 30 },
        { scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      // 2. Fast counter animation 0 -> 100
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.floor(counter.val);
          }
        }
      });

      // 3. Hint text rotation (scramble-like feeling)
      const hintInterval = setInterval(() => {
        setHint(hints[Math.floor(Math.random() * hints.length)]);
      }, 500);

        // 4. Exit animation
        gsap.delayedCall(2.2, () => {
          clearInterval(hintInterval);
          
          // CRITICAL: Remove the global helper class immediately to reveal original background 
          // while the loader is still covering the screen.
          document.body.classList.remove('site-is-loading');

          // The huge number slides out smoothly
          gsap.to(contentRef.current, {
            y: -150,
            opacity: 0,
            scale: 0.95,
            duration: 0.6, // Faster exit
            ease: "power4.inOut",
          });

          // The background overlay clips entirely
          gsap.to(overlayRef.current, {
            clipPath: 'inset(100% 0 0 0)',
            duration: 0.8,
            delay: 0.1, // Even tighter delay
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
      <div className="loader-grid"></div>
      <div className="loader-content" ref={contentRef}>
        <div className="loader-counter-wrapper">
          <span className="loader-counter" ref={counterRef}>0</span>
          <span className="loader-percent">%</span>
        </div>
      </div>
      <div className="loader-hint">{hint}</div>
    </div>
  );
}
