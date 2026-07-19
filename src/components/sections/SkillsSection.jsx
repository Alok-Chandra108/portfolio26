import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../../utils/gsapPlugins.js';
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

    const cleanups = [];

    // Seamless marquee (NO FLASH / NO RESET)
    const createMarquee = (autoRef, scrollRef, direction = 1) => {
      if (!autoRef.current || !scrollRef.current) return;

      const container = autoRef.current;
      const scrollEl = scrollRef.current;
      const totalWidth = container.scrollWidth / 2;

      gsap.to(container, {
        x: -totalWidth * direction,
        ease: 'none',
        duration: totalWidth / 50,
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth * direction)
        }
      });

      const handleWheel = (e) => {
        e.preventDefault();
        gsap.to(container, {
          x: `+=${e.deltaY * 0.5 * direction}`,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % totalWidth * direction)
          },
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      scrollEl.addEventListener('wheel', handleWheel, { passive: false });
      cleanups.push(() => scrollEl.removeEventListener('wheel', handleWheel));
    };

    // Only create marquees if elements exist
    if (row1Skills.length > 0 && row1AutoRef.current && row1ScrollRef.current) {
      createMarquee(row1AutoRef, row1ScrollRef, 1);
    }
    if (row2Skills.length > 0 && row2AutoRef.current && row2ScrollRef.current) {
      createMarquee(row2AutoRef, row2ScrollRef, -1);
    }

    return () => cleanups.forEach(fn => fn());
  }, { dependencies: [skills], scope: sectionRef });

  return (
    <section className="skills-section section" ref={sectionRef}>
      <div className="skills__wrapper">
        <div className="skills__header">
          <h2 className="heading-section">Technical Skills</h2>
          <span className="sub-label">(Tools & Technologies)</span>
        </div>

        {/* Row 1 — Left-to-Right */}
        <div className="skills__marquee-row">
          <div 
            className="skills__marquee-scroll" 
            ref={row1ScrollRef}
            onMouseEnter={e => gsap.to(e.currentTarget, { timeScale: 0.2, duration: 0.3 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { timeScale: 1, duration: 0.5 })}
          >
            <div className="skills__marquee-auto" ref={row1AutoRef}>
              {row1Skills.map(skill => (
                <div key={skill.id} className="skill-pill">
                  <span className="skill-pill__icon" style={{ backgroundImage: `url(${skill.icon})` }} />
                  <span className="skill-pill__name">{skill.name}</span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {row1Skills.map(skill => (
                <div key={`${skill.id}-clone`} className="skill-pill">
                  <span className="skill-pill__icon" style={{ backgroundImage: `url(${skill.icon})` }} />
                  <span className="skill-pill__name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 — Right-to-Left */}
        <div className="skills__marquee-row skills__marquee-row--reverse">
          <div 
            className="skills__marquee-scroll" 
            ref={row2ScrollRef}
            onMouseEnter={e => gsap.to(e.currentTarget, { timeScale: 0.2, duration: 0.3 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { timeScale: 1, duration: 0.5 })}
          >
            <div className="skills__marquee-auto" ref={row2AutoRef}>
              {row2Skills.map(skill => (
                <div key={skill.id} className="skill-pill">
                  <span className="skill-pill__icon" style={{ backgroundImage: `url(${skill.icon})` }} />
                  <span className="skill-pill__name">{skill.name}</span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {row2Skills.map(skill => (
                <div key={`${skill.id}-clone`} className="skill-pill">
                  <span className="skill-pill__icon" style={{ backgroundImage: `url(${skill.icon})` }} />
                  <span className="skill-pill__name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}