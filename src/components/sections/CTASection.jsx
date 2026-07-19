import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../../utils/gsapPlugins.js';
import './CTASection.css';

export default function CTASection() {
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const linesRef = useRef([]);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isMobile: '(max-width: 639px)',
      isDesktop: '(min-width: 640px)',
    }, (ctx) => {
      const { isMobile } = ctx.conditions;

      /* ── Line entrances ─────────────────── */
      const lines = linesRef.current.filter(Boolean);
      if (lines.length) {
        gsap.from(lines, {
          y: isMobile ? 30 : 100,
          opacity: 0,
          duration: isMobile ? 0.9 : 1.2,
          stagger: 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
      }

      /* ── Letter-spacing collapse (desktop) ── */
      if (!isMobile) {
        lines.forEach((line, i) => {
          gsap.fromTo(
            line,
            { letterSpacing: '0.2em' },
            {
              letterSpacing: '0.01em',
              duration: 1.3,
              delay: i * 0.2,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                invalidateOnRefresh: true,
              },
            }
          );
        });
      }
    });
  }, { scope: sectionRef });

  /* ── Cursor-following circle (desktop only) ── */
  useGSAP(() => {
    if (!circleRef.current || !sectionRef.current) return;
    if (window.matchMedia('(max-width: 639px)').matches) return;

    const xSetter = gsap.quickSetter(circleRef.current, 'x', 'px');
    const ySetter = gsap.quickSetter(circleRef.current, 'y', 'px');

    const handleMouseMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      xSetter(e.clientX - rect.left - 100);
      ySetter(e.clientY - rect.top - 100);
    };

    const section = sectionRef.current;
    section.addEventListener('mousemove', handleMouseMove);
    return () => section.removeEventListener('mousemove', handleMouseMove);
  }, { scope: sectionRef });

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
          <p className="cta__line cta__line--1 heading-hero will-animate" ref={el => linesRef.current[0] = el}>READY TO SCALE...</p>
          <p className="cta__line cta__line--2 heading-hero will-animate" ref={el => linesRef.current[1] = el}>YOUR VISION?</p>
          <p className="cta__line cta__line--3 heading-section will-animate" ref={el => linesRef.current[2] = el}>LEAD THE ARCHITECTURE.</p>
        </div>
      </section>
    </Link>
  );
}
