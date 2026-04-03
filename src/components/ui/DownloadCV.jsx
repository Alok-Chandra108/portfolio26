import { useRef, useEffect } from 'react';
import { gsap } from '../../utils/gsapPlugins';
import './DownloadCV.css';

export default function DownloadCV() {
  const buttonRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const glow = glowRef.current;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Glow effect - move the glow element to the cursor position
      gsap.to(glow, {
        left: x,
        top: y,
        duration: 0.2,
        ease: 'power1.out',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="cv-button-container">
      <button 
        ref={buttonRef} 
        className="cv-button"
        onClick={() => {
          // Placeholder for CV download logic
          console.log('Downloading CV...');
        }}
      >
        <div className="cv-button__bg-orbs">
          <div className="cv-orb cv-orb--1"></div>
          <div className="cv-orb cv-orb--2"></div>
          <div className="cv-orb cv-orb--3"></div>
        </div>
        <div ref={glowRef} className="cv-button__glow"></div>
        <span className="cv-button__text">Download CV</span>
        <span className="cv-button__icon">↓</span>
      </button>
    </div>
  );
}
