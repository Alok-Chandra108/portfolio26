import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapPlugins.js';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import PillTag from '../ui/PillTag.jsx';
import { projectsService } from '../../firebase/projectsService';
import './Work.css';

export default function Work() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const rowsRef = useRef([]);
  const linesRef = useRef([]);
  const previewRef = useRef(null);
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  /* ── Data Fetching ───────────────────────── */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getProjects();
        setProjects(data.slice(0, 4)); // Only show top 4 on home section
      } catch (error) {
        console.error("Error fetching projects for Work section:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  /* ── Scroll entrance animations ───────────────────────── */
  useGSAP(() => {
    if (loading || projects.length === 0) return;

    // Heading wipe reveal
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: { 
            trigger: headingRef.current, 
            start: 'top 88%',
            invalidateOnRefresh: true,
          },
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
        scrollTrigger: { 
          trigger: line, 
          start: () => 'top 92%',
          invalidateOnRefresh: true,
        },
      });
    });

    // Row animations - Trigger Each Individually
    rowsRef.current.forEach((row, i) => {
      if (!row) return;
      
      gsap.fromTo(
        row,
        { 
          clipPath: window.innerWidth < 640 ? 'none' : 'inset(0 100% 0 0)', 
          y: window.innerWidth < 640 ? 30 : 0,
          opacity: window.innerWidth < 640 ? 0 : 1 
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: row,
            start: () => 'top 88%',
            invalidateOnRefresh: true,
            toggleActions: 'play none none none',
          },
        }
      );
    });
    
    // Critical: Refresh ScrollTrigger after dynamic content renders
    ScrollTrigger.refresh();

  }, { dependencies: [loading, projects], scope: sectionRef });

  /* ── Floating preview follows cursor (desktop only) ──── */
  useGSAP(() => {
    if (loading) return;

    const preview = previewRef.current;
    if (!preview) return;

    const xS = gsap.quickSetter(preview, 'x', 'px');
    const yS = gsap.quickSetter(preview, 'y', 'px');

    const onMove = contextSafe((e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      xS(e.clientX - rect.left + 24);
      yS(e.clientY - rect.top - 80);
    });

    const section = sectionRef.current;
    const mq = window.matchMedia('(min-width: 1024px)');
    
    if (mq.matches) {
      section?.addEventListener('mousemove', onMove);
    }

    return () => {
      section?.removeEventListener('mousemove', onMove);
    };
  }, { dependencies: [loading], scope: sectionRef });

  const { contextSafe } = useGSAP({ scope: sectionRef });

  /* ── Preview show/hide on row hover ─────────────────── */
  const handleRowEnter = contextSafe((project) => {
    setHoveredId(project.id);
    if (window.innerWidth < 1024) return;
    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power3.out',
    });
  });

  const handleRowLeave = contextSafe(() => {
    setHoveredId(null);
    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.88,
      duration: 0.3,
      ease: 'power3.in',
    });
  });

  const hoveredProject = projects.find(p => p.id === hoveredId);

  if (loading && projects.length === 0) {
    return (
      <section className="work section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="mono-label" style={{ opacity: 0.5 }}>Loading selected work...</p>
      </section>
    );
  }

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
            src={hoveredProject?.image || projects[0]?.image}
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
