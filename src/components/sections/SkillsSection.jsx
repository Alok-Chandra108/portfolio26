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
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const itemsContainerRef = useRef(null);
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
      // Row 1: Moves Left
      gsap.to(row1Ref.current, {
        xPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Row 2: Moves Right
      gsap.to(row2Ref.current, {
        xPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [skills]);

  // Duplicate items for a seamless look 
  // (though with scroll-triggered scrub, we don't necessarily need infinite loop, 
  // but extra items help cover the screen width)
  const paddedSkills = [...skills, ...skills, ...skills];

  return (
    <section className="skills-section" ref={sectionRef}>
      <div className="skills-section__header container">
        <span className="skills-section__subtitle">Expertise</span>
        <h2 className="skills-section__title">I keep good skills.</h2>
      </div>

      <div className="skills-marquee-container" ref={itemsContainerRef}>
        {/* TOP ROW */}
        <div className="skills-marquee-row" ref={row1Ref}>
          {paddedSkills.slice(0, Math.ceil(paddedSkills.length/2)).map((skill, i) => (
            <SkillCard key={`row1-${i}`} skill={skill} index={i + 1} />
          ))}
        </div>

        {/* BOTTOM ROW */}
        <div className="skills-marquee-row" ref={row2Ref} style={{ marginLeft: '-15%' }}>
          {paddedSkills.slice(Math.ceil(paddedSkills.length/2)).map((skill, i) => (
            <SkillCard key={`row2-${i}`} skill={skill} index={i + 1} />
          ))}
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
