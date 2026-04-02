import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import { skillsService } from '../../firebase/skillsService.js';
import './SkillsSection.css';

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const [skills, setSkills] = useState([]);
  
  // Row 1 Refs
  const row1ScrollRef = useRef(null);
  const row1AutoRef = useRef(null);
  
  // Row 2 Refs
  const row2ScrollRef = useRef(null);
  const row2AutoRef = useRef(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillsService.getSkills();
        setSkills(data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  const row1Skills = skills.filter(s => (s.row || 1) === 1);
  const row2Skills = skills.filter(s => s.row === 2);

  useEffect(() => {
    if (skills.length === 0) return;

    const ctx = gsap.context(() => {
      // Helper to create a robust marquee with scroll parallax
      const createMarquee = (autoRef, scrollRef, direction = 1) => {
        if (!autoRef.current || !scrollRef.current) return;

        // 1. Auto-run base movement
        gsap.to(autoRef.current, {
          x: direction === 1 ? "-50%" : "0%",
          duration: 40, // Slower base speed for more premium feel
          repeat: -1,
          ease: 'none',
        });

        if (direction === -1) {
          gsap.set(autoRef.current, { x: "-50%" });
        }

        // 2. Scroll Parallax
        // We use a larger xPercent to ensure the scroll direction is always dominant
        gsap.to(scrollRef.current, {
          xPercent: direction === 1 ? -25 : 25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true, // Tighter scrub prevents the "stuck" feeling
          }
        });
      };

      if (row1Skills.length > 0) createMarquee(row1AutoRef, row1ScrollRef, 1);
      if (row2Skills.length > 0) createMarquee(row2AutoRef, row2ScrollRef, -1);

    }, sectionRef);

    return () => ctx.revert();
  }, [skills, row1Skills.length, row2Skills.length]);

  if (skills.length === 0) return null;

  return (
    <section className="skills-section" ref={sectionRef}>
      <div className="skills-section__header container">
        <span className="skills-section__subtitle">Expertise</span>
        <h2 className="skills-section__title">I keep good skills.</h2>
      </div>

      <div className="skills-marquee-container">
        {/* ROW 1: MARQUEE LEFT */}
        {row1Skills.length > 0 && (
          <div className="skills-marquee-row-wrapper" ref={row1ScrollRef}>
            <div className="skills-marquee-row" ref={row1AutoRef}>
              {/* Increased clones (6x) to prevent gaps during high-parallax shifts */}
              {[...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills].map((skill, i) => (
                <SkillCard key={`row1-${skill.id}-${i}`} skill={skill} index={i + 1} />
              ))}
            </div>
          </div>
        )}

        {/* ROW 2: MARQUEE RIGHT */}
        {row2Skills.length > 0 && (
          <div className="skills-marquee-row-wrapper" ref={row2ScrollRef} style={{ marginLeft: '-20%' }}>
            <div className="skills-marquee-row" ref={row2AutoRef}>
              {[...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills].map((skill, i) => (
                <SkillCard key={`row2-${skill.id}-${i}`} skill={skill} index={i + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill, index }) {
  return (
    <div className="skill-card">
      <span className="skill-card__bg-number">{index.toString().padStart(2, '0')}</span>
      <img src={skill.logoUrl} alt={skill.name} className="skill-card__logo" />
      <h3 className="skill-card__name">{skill.name}</h3>
    </div>
  );
}
