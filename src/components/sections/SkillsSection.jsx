import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import { skillsService } from '../../firebase/skillsService.js';
import './SkillsSection.css';

const DEFAULT_SKILLS = [
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
  { name: 'GCP', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
  { name: 'Terraform', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { name: 'Jenkins', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' },
  { name: 'GitHub Actions', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Prometheus', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg' },
  { name: 'Grafana', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg' },
  { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
];

export default function SkillsSection() {
  const sectionRef = useRef(null);
  
  // Row 1 Refs
  const row1ScrollRef = useRef(null);
  const row1AutoRef = useRef(null);
  
  // Row 2 Refs
  const row2ScrollRef = useRef(null);
  const row2AutoRef = useRef(null);

  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillsService.getSkills();
        if (data && data.length > 0) {
          setSkills(data);
        } else {
          setSkills(DEFAULT_SKILLS);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        setSkills(DEFAULT_SKILLS);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    if (skills.length === 0) return;

    const ctx = gsap.context(() => {
      // --- ROW 1 (Moves Left) ---
      
      // Auto-run (Row 1: Left)
      gsap.to(row1AutoRef.current, {
        x: "-50%",
        duration: 30,
        repeat: -1,
        ease: 'none',
      });

      // Scroll Parallax (Reacts to scroll speed/direction)
      gsap.to(row1ScrollRef.current, {
        xPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // --- ROW 2 (Moves Right) ---
      
      // Auto-run (Slow baseline movement - Starts from offset)
      gsap.set(row2AutoRef.current, { x: "-50%" });
      gsap.to(row2AutoRef.current, {
        x: "0%",
        duration: 30,
        repeat: -1,
        ease: 'none',
      });

      // Scroll Parallax (Reacts to scroll speed/direction)
      gsap.to(row2ScrollRef.current, {
        xPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [skills]);

  // Use 4x clones for absolute seamlessness (3x set width + overlap)
  const paddedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <section className="skills-section" ref={sectionRef}>
      <div className="skills-section__header container">
        <span className="skills-section__subtitle">Expertise</span>
        <h2 className="skills-section__title">I keep good skills.</h2>
      </div>

      <div className="skills-marquee-container">
        {/* ROW 1: MARQUEE LEFT */}
        <div className="skills-marquee-row-wrapper" ref={row1ScrollRef}>
          <div className="skills-marquee-row" ref={row1AutoRef}>
            {paddedSkills.slice(0, Math.ceil(paddedSkills.length/2)).map((skill, i) => (
              <SkillCard key={`row1-${i}`} skill={skill} index={i + 1} />
            ))}
          </div>
        </div>

        {/* ROW 2: MARQUEE RIGHT */}
        <div className="skills-marquee-row-wrapper" ref={row2ScrollRef} style={{ marginLeft: '-20%' }}>
          <div className="skills-marquee-row" ref={row2AutoRef}>
            {paddedSkills.slice(Math.ceil(paddedSkills.length/2)).map((skill, i) => (
              <SkillCard key={`row2-${i}`} skill={skill} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, index }) {
  return (
    <div className="skill-card">
      <span className="skill-card__bg-number">{index.toString().padStart(2, '0')}</span>
      <img src={skill.logoUrl || skill.logo} alt={skill.name} className="skill-card__logo" />
      <h3 className="skill-card__name">{skill.name}</h3>
    </div>
  );
}
