import { useEffect, useRef, useState } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import './Loader.css';

export default function Loader({ onComplete }) {
  const overlayRef = useRef(null);
  const counterRef = useRef(null);
  const progressRef = useRef(null);
  const lettersRef = useRef([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate counter from 0 to 100
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          setCount(Math.floor(counter.val));
        }
      });

      // Progress bar
      gsap.to(progressRef.current, {
        scaleX: 1,
        duration: 2.5,
        ease: "power2.inOut",
        transformOrigin: "left",
      });

      // Letter scramble effect (CSS animation fallback)
      lettersRef.current.forEach((letter, i) => {
        if (!letter) return;
        gsap.from(letter, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          delay: 0.1 + i * 0.06,
          ease: "power3.out",
        });
      });

      // Exit animation
      gsap.delayedCall(3.0, () => {
        // Letters fly upward
        lettersRef.current.forEach((letter, i) => {
          if (!letter) return;
          gsap.to(letter, {
            y: '-120%',
            opacity: 0,
            duration: 0.5,
            delay: i * 0.04,
            ease: "power4.in",
          });
        });

        // Counter flies up
        gsap.to(counterRef.current, {
          y: '-100%',
          opacity: 0,
          duration: 0.5,
          delay: 0.2,
          ease: "power4.in",
        });

        // Overlay clips away
        gsap.to(overlayRef.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          delay: 0.6,
          ease: "power4.inOut",
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  const letters = 'LOADING'.split('');

  return (
    <div className="loader-overlay" ref={overlayRef}>
      <div className="loader-content">
        <div className="loader-text">
          {letters.map((letter, i) => (
            <span
              key={i}
              ref={el => lettersRef.current[i] = el}
              className="loader-letter"
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="loader-counter" ref={counterRef}>
          {String(count).padStart(2, '0')}
        </div>
        <div className="loader-progress-track">
          <div className="loader-progress-bar" ref={progressRef} />
        </div>
      </div>
    </div>
  );
}
