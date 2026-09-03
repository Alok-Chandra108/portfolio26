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
  
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    experienceService.getExperience()
      .then(data => {
        const workData = data.filter(exp => exp.type !== 'education');
        setExperiences(workData.length > 0 ? workData : placeholderData);
      })
      .catch(() => setExperiences(placeholderData))
      .finally(() => setLoading(false));
  }, []);

  /* ── Horizontal Scroll GSAP ────────────────────────── */
  useGSAP(() => {
    if (loading || experiences.length === 0 || !trackRef.current) return;

    // Entrance animation for heading
    gsap.fromTo(headingRef.current,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      { 
        clipPath: 'inset(0 0% 0 0)', 
        duration: 1.4, 
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );

    // Desktop/Tablet: Horizontal Scroll Pin
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current;
      
      // Calculate how far to move left
      // scrollWidth is total width of track, clientWidth is what's visible
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80); // 80px buffer

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none"
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${track.scrollWidth}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      });

      return () => {
        tween.kill();
      };
    });

    // We don't need to return mm.revert() manually in useGSAP as it cleans up

  }, { dependencies: [loading, experiences], scope: sectionRef });

  const displayData = preview ? experiences.slice(0, 3) : experiences;

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
    <section className="experience" ref={sectionRef}>
      
      <div className="experience__sticky-header container">
        <span className="experience__label mono-label">(EXPERIENCE)</span>
        <h2 className="experience__heading" ref={headingRef}>
          Professional Journey
        </h2>
      </div>

      <div className="experience__scroll-wrapper">
        <div className="experience__track" ref={trackRef}>
          
          {/* Intro padding block so first card isn't flush against screen edge immediately */}
          <div className="experience__track-spacer"></div>

          {displayData.map((exp, i) => (
            <div key={exp.id} className="experience__panel">
              <div className="experience__panel-inner">
                
                {/* Background Role Stroke Typography */}
                <div className="experience__bg-role" aria-hidden="true">
                  {exp.role}
                </div>

                {/* Content Grid */}
                <div className="experience__panel-content">
                  <div className="experience__panel-meta">
                    <span className="experience__panel-index mono-label">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="experience__panel-date mono-label">
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  
                  <div className="experience__panel-main">
                    <h3 className="experience__panel-company">{exp.company}</h3>
                    <h4 className="experience__panel-role">{exp.role}</h4>
                    {exp.description && (
                      <p className="experience__panel-desc body-text">{exp.description}</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Outro padding block */}
          {preview && experiences.length > 3 && (
            <div className="experience__track-cta">
              <AnimatedButton to="/experience">View Full Journey</AnimatedButton>
            </div>
          )}
          <div className="experience__track-spacer"></div>

        </div>
      </div>
    </section>
  );
}
