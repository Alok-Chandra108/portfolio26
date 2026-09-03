import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapPlugins.js';
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

  useGSAP(() => {
    if (skills.length === 0) return;

    // Seamless marquee (NO FLASH / NO RESET)
    const createMarquee = (autoRef, scrollRef, direction = 1) => {
      if (!autoRef.current || !scrollRef.current) return;

      const container = autoRef.current;
      const totalWidth = container.scrollWidth / 2;

      // Set starting position for reverse row
      if (direction === -1) {
        gsap.set(container, { x: -totalWidth });
      }

      // Seamless infinite loop
      gsap.to(container, {
        x: `+=${direction * -totalWidth}`,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => {
            let value = parseFloat(x);
            return value % totalWidth;
          })
        }
      });

      // Scroll parallax
      gsap.to(scrollRef.current, {
        xPercent: direction === 1 ? -25 : 25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    };

    if (row1Skills.length > 0) createMarquee(row1AutoRef, row1ScrollRef, 1);
    if (row2Skills.length > 0) createMarquee(row2AutoRef, row2ScrollRef, -1);

    // Removed ScrollTrigger.refresh() - not needed in useGSAP

  }, { dependencies: [skills, row1Skills.length, row2Skills.length], scope: sectionRef });

  if (skills.length === 0) return null;

  return (
    <section className="skills-section" ref={sectionRef}>
      <div className="skills-section__header container">
        <span className="skills-section__subtitle">(EXPERTISE)</span>
        <h2 className="skills-section__title">I keep good skills.</h2>
      </div>

      <div className="skills-marquee-container">
        {/* ROW 1 */}
        {row1Skills.length > 0 && (
          <div className="skills-marquee-row-wrapper" ref={row1ScrollRef}>
            <div className="skills-marquee-row" ref={row1AutoRef}>
              {[...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills].map((skill, i) => (
                <SkillCard key={`row1-${skill.id}-${i}`} skill={skill} index={(i % row1Skills.length) + 1} />
              ))}
            </div>
          </div>
        )}

        {/* ROW 2 */}
        {row2Skills.length > 0 && (
          <div className="skills-marquee-row-wrapper" ref={row2ScrollRef} style={{ marginLeft: '-20%' }}>
            <div className="skills-marquee-row" ref={row2AutoRef}>
              {[...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills].map((skill, i) => (
                <SkillCard key={`row2-${skill.id}-${i}`} skill={skill} index={(i % row2Skills.length) + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill }) {
  return (
    <div className="skill-card">
      <div className="skill-card__logo-wrap">
        <img src={skill.logoUrl} alt={skill.name} className="skill-card__logo" loading="lazy" />
      </div>
      <h3 className="skill-card__name">{skill.name}</h3>
    </div>
  );
}