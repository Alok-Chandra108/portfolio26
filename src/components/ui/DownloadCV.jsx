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

      // Magnetic effect - move the button slightly towards the cursor
      // Calculating distance from the center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) * 0.2;
      const moveY = (y - centerY) * 0.2;

      gsap.to(button, {
        x: moveX,
        y: moveY,
        duration: 0.6,
        ease: 'power2.out',
      });

      // Glow effect - move the glow element to the cursor position
      gsap.to(glow, {
        left: x,
        top: y,
        duration: 0.2,
        ease: 'power1.out',
      });
    };

    const handleMouseLeave = () => {
      // Reset button position
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
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
