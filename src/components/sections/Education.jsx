import { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapPlugins.js';
import educationData from '../../data/education.js';
import './Education.css';

export default function Education() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const headingRef = useRef(null);
  const itemsRef = useRef([]);
  const nodesRef = useRef([]);

  useEffect(() => {
    itemsRef.current = [];
    nodesRef.current = [];
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ── Timeline progress line ─────────────── */
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
              end: 'bottom 88%', // constrained so it doesn't over-run on short mobile screens
              scrub: 1,
            },
          }
        );
      }

      /* ── Heading ────────────────────────────── */
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
        });
      }

      /* ── Device-aware item animations ────────── */
      mm.add({
        isMobile: '(max-width: 899px)',
        isDesktop: '(min-width: 900px)',
      }, (ctx) => {
        const { isMobile } = ctx.conditions;

        itemsRef.current.forEach((item, i) => {
          if (!item) return;

          // Mobile: y-only fade. Desktop: alternating x-slide.
          const isOdd = i % 2 === 0;
          gsap.fromTo(
            item,
            {
              x: isMobile ? 0 : isOdd ? -40 : 40,
              y: isMobile ? 20 : 0,
              opacity: 0,
              scale: 0.94,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              duration: isMobile ? 0.7 : 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
              },
            }
          );
        });

        /* ── Node pulse ring (all screens) ────── */
        nodesRef.current.forEach((node) => {
          if (!node) return;
          gsap.fromTo(
            node,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: node,
                start: 'top 90%',
              },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addItem = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el);
  };
  const addNode = (el) => {
    if (el && !nodesRef.current.includes(el)) nodesRef.current.push(el);
  };

  return (
    <section className="education section" ref={sectionRef}>
      <div className="education__wrapper">
        <div className="education__header">
          <h2 ref={headingRef} className="will-animate">Education</h2>
          <span className="sub-label">(My Academic Journey)</span>
        </div>

        <div className="education__timeline">
          {/* Vertical central tracking line */}
          <div className="education__line">
            <div className="education__line-progress" ref={lineRef} />
          </div>

          {/* Education Milestone Cards */}
          {educationData.map((item, index) => (
            <div className="education__item" key={item.id}>
              <div className="education__node will-animate" ref={addNode} />
              <div className="education__content will-animate" ref={addItem}>
                <span className="education__year">{item.year}</span>
                <h3 className="education__degree">{item.degree}</h3>
                <h4 className="education__institution">{item.institution}</h4>
                <p className="education__description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
