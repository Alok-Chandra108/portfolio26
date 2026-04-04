import { useState, useRef, useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapPlugins.js';
import { experienceService } from '../../firebase/experienceService.js';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import './Experience.css';

// Placeholder data to show while Firestore is empty
const placeholderData = [
  {
    id: 'p1',
    role: 'DevOps Engineer',
    company: 'Your Company',
    location: 'Remote',
    startDate: 'Jan 2023',
    endDate: null,
    isCurrent: true,
    description: 'Add your experience via the admin dashboard to populate this section with your real data.',
  },
];

export default function Experience({ preview = false }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const itemsRef = useRef([]);
  const markerRef = useRef(null);

  useEffect(() => {
    experienceService.getExperience()
      .then(data => {
        const workData = data.filter(exp => exp.type !== 'education');
        setExperiences(workData.length > 0 ? workData : placeholderData);
      })
      .catch(() => setExperiences(placeholderData))
      .finally(() => setLoading(false));
  }, []);

  /* ── Entrance Animations ─────────────────────────── */
  useGSAP(() => {
    if (loading || experiences.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        invalidateOnRefresh: true,
      }
    });

    // Heading clip-path wipe
    tl.fromTo(headingRef.current,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'expo.out' }
    );

    // Stagger items from bottom
    tl.fromTo(itemsRef.current.filter(Boolean),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out' },
      '-=0.8'
    );

    // Progress line draw
    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        }
      );
    }

    ScrollTrigger.refresh();
  }, { dependencies: [loading, experiences], scope: sectionRef });

  /* ── Active marker animation ─────────────────────── */
  useGSAP(() => {
    if (!markerRef.current || experiences.length === 0) return;
    const targetY = activeIndex * (100 / (experiences.length || 1));
    gsap.to(markerRef.current, {
      top: `${targetY}%`,
      duration: 0.5,
      ease: 'power3.inOut',
    });
  }, { dependencies: [activeIndex, experiences], scope: sectionRef });

  const displayData = preview ? experiences.slice(0, 3) : experiences;
  const active = displayData[activeIndex] || {};

  if (loading) {
    return (
      <section className="experience section" ref={sectionRef}>
        <div className="container">
          <div className="experience__loading">
            <p className="mono-label" style={{ opacity: 0.5 }}>Loading professional journey...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="experience section" ref={sectionRef}>
      <div className="container">

        {/* Header */}
        <div className="experience__header">
          <div className="experience__header-left">
            <span className="sub-label experience__label">(Experience)</span>
            <h2 className="heading-section experience__heading" ref={headingRef}>
              Professional<br />Journey
            </h2>
          </div>
          <div className="experience__header-right">
            <p className="experience__count mono-label">
              {String(activeIndex + 1).padStart(2, '0')} / {String(displayData.length).padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="experience__layout">

          {/* Left — Timeline Rail */}
          <div className="experience__rail">
            <div className="experience__rail-track">
              <div className="experience__rail-progress" ref={lineRef} />
              <div className="experience__rail-marker" ref={markerRef} />
            </div>

            <div className="experience__list">
              {displayData.map((exp, i) => (
                <button
                  key={exp.id}
                  className={`experience__item ${i === activeIndex ? 'experience__item--active' : ''}`}
                  ref={el => itemsRef.current[i] = el}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  aria-selected={i === activeIndex}
                >
                  <span className="experience__item-index mono-label">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="experience__item-meta">
                    <span className="experience__item-role">{exp.role}</span>
                    <span className="experience__item-company">{exp.company}</span>
                  </div>
                  <span className="experience__item-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right — Detail Panel */}
          <div className="experience__panel">
            <ExperiencePanel data={active} key={active.id} />
          </div>
        </div>

        {/* CTA */}
        {preview && experiences.length > 3 && (
          <div className="experience__cta">
            <AnimatedButton to="/experience">view full journey</AnimatedButton>
          </div>
        )}

      </div>
    </section>
  );
}

/* ── Detail Panel — animates on data change ─────────── */
function ExperiencePanel({ data }) {
  const panelRef = useRef(null);

  useGSAP(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 20, clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.65, ease: 'expo.out' }
    );
  }, { scope: panelRef });

  return (
    <div className="experience__panel-inner" ref={panelRef}>
      {/* Company + Period */}
      <div className="experience__panel-top">
        <div>
          <p className="experience__panel-company">{data.company}</p>
          <p className="experience__panel-period mono-label">
            {data.startDate} — {data.isCurrent ? 'Present' : data.endDate}
            {data.location && ` · ${data.location}`}
          </p>
        </div>
        {data.isCurrent && (
          <span className="experience__panel-badge">Current</span>
        )}
      </div>

      {/* Role */}
      <h3 className="experience__panel-role">{data.role}</h3>

      {/* Divider */}
      <div className="experience__panel-divider" />

      {/* Description */}
      {data.description && (
        <p className="experience__panel-desc body-text">{data.description}</p>
      )}

      {/* Corner accent */}
      <div className="experience__panel-accent" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100 L100 0" stroke="var(--color-accent)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M20 100 L100 20" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
