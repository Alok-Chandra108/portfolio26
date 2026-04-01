import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import PillTag from '../ui/PillTag.jsx';
import projects from '../../data/projects.js';
import './Work.css';

export default function Work() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const rowsRef = useRef([]);
  const linesRef = useRef([]);
  const previewRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  /* ── Scroll entrance animations ───────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading wipe reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
          }
        );
      }

      // Ruling lines draw in
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.1,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: line, start: 'top 88%' },
        });
      });

      // Row clip-path wipe with stagger on desktop, simple fade on mobile
      const mm = gsap.matchMedia();
      mm.add({
        isMobile: '(max-width: 639px)',
        isTablet: '(min-width: 640px) and (max-width: 1023px)',
        isDesktop: '(min-width: 1024px)',
      }, (ctx) => {
        const { isMobile } = ctx.conditions;

        rowsRef.current.forEach((row, i) => {
          if (!row) return;
          if (isMobile) {
            gsap.from(row, {
              y: 30,
              opacity: 0,
              duration: 0.9,
              delay: i * 0.1,
              ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 88%' },
            });
          } else {
            gsap.fromTo(
              row,
              { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
              {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.1,
                delay: i * 0.14,
                ease: 'expo.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
              }
            );
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Floating preview follows cursor (desktop only) ──── */
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    let raf;
    const xS = gsap.quickSetter(preview, 'x', 'px');
    const yS = gsap.quickSetter(preview, 'y', 'px');

    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        xS(e.clientX - rect.left + 24);
        yS(e.clientY - rect.top - 80);
      });
    };

    const section = sectionRef.current;
    const mq = window.matchMedia('(min-width: 1024px)');
    if (mq.matches) section?.addEventListener('mousemove', onMove);

    return () => {
      section?.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Preview show/hide on row hover ─────────────────── */
  const handleRowEnter = (project) => {
    setHoveredId(project.id);
    if (window.innerWidth < 1024) return;
    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleRowLeave = () => {
    setHoveredId(null);
    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.88,
      duration: 0.3,
      ease: 'power3.in',
    });
  };

  const hoveredProject = projects.find(p => p.id === hoveredId);

  return (
    <section className="work section" ref={sectionRef}>
      <div className="container">

        {/* Section header */}
        <div className="work__header">
          <h2 className="heading-section work__heading" ref={headingRef}>
            Selected Work
          </h2>
          <span className="sub-label">(Work)</span>
        </div>

        {/* Top ruling line */}
        <div
          className="work__rule"
          ref={el => linesRef.current[-1] = el}
          style={{ scaleX: 1 }}
        />

        {/* Numbered showcase list */}
        <div className="work__list">
          {projects.map((project, i) => (
            <div key={project.id}>
              <a
                href={project.link}
                className={`work__row ${hoveredId && hoveredId !== project.id ? 'work__row--dimmed' : ''}`}
                ref={el => rowsRef.current[i] = el}
                onMouseEnter={() => handleRowEnter(project)}
                onMouseLeave={handleRowLeave}
              >
                {/* Index */}
                <span className="work__row-num mono-label">{String(i + 1).padStart(2, '0')}</span>

                {/* Title */}
                <h3 className="work__row-title heading-card">{project.title}</h3>

                {/* Tags — hidden on mobile, shown on tablet+ */}
                <div className="work__row-tags">
                  {project.tags.map(tag => (
                    <PillTag key={tag} variant="outline">{tag}</PillTag>
                  ))}
                </div>

                {/* Mobile thumbnail */}
                <div className="work__row-thumb">
                  <img src={project.image} alt={project.title} loading="lazy" />
                </div>

                {/* Arrow */}
                <span className="work__row-arrow">→</span>
              </a>
              {/* Ruling line below each row */}
              <div className="work__rule" ref={el => linesRef.current[i] = el} />
            </div>
          ))}
        </div>

        {/* Floating preview image (desktop hover) */}
        <div className="work__preview" ref={previewRef} aria-hidden="true">
          <img
            src={hoveredProject?.image || projects[0].image}
            alt=""
            loading="eager"
          />
        </div>

        <div className="work__cta">
          <AnimatedButton to="/work">show me more</AnimatedButton>
        </div>
      </div>
    </section>
  );
}
