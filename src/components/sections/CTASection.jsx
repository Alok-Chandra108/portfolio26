import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import './CTASection.css';

export default function CTASection() {
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading entrance
      const lines = sectionRef.current?.querySelectorAll('.cta__line');
      if (lines?.length) {
        gsap.from(lines, {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-following circle
  useEffect(() => {
    if (!circleRef.current) return;

    const xSetter = gsap.quickSetter(circleRef.current, "x", "px");
    const ySetter = gsap.quickSetter(circleRef.current, "y", "px");

    const handleMouseMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      xSetter(mouseX - 100);
      ySetter(mouseY - 100);
    };

    const section = sectionRef.current;
    section?.addEventListener('mousemove', handleMouseMove);
    return () => section?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Link to="/contact" style={{ textDecoration: 'none' }}>
      <section
        className={`cta-section section ${isHovered ? 'cta-section--hovered' : ''}`}
        ref={sectionRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-cursor="hide"
      >
        <div className="cta__circle" ref={circleRef} />
        <div className="container cta__content">
          <p className="cta__line cta__line--1 heading-hero">READY TO SCALE...</p>
          <p className="cta__line cta__line--2 heading-hero">YOUR VISION?</p>
          <p className="cta__line cta__line--3 heading-section">LEAD THE ARCHITECTURE.</p>
        </div>
      </section>
    </Link>
  );
}
