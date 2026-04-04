import { useRef } from 'react';
import { gsap, useGSAP } from '../utils/gsapPlugins.js';
import Experience from '../components/sections/Experience.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import './ExperiencePage.css';

export default function ExperiencePage() {
  const headingRef = useRef(null);

  useGSAP(() => {
    gsap.from(headingRef.current, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.3,
    });
  });

  return (
    <div className="experience-page">
      <div className="container">
        <div className="experience-page__header" ref={headingRef}>
          <h1 className="heading-hero">EXPERIENCE</h1>
          <span className="sub-label">(Professional Journey)</span>
        </div>
      </div>
      {/* Full Experience section — not in preview mode */}
      <Experience preview={false} />
      <CTASection />
    </div>
  );
}
