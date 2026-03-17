import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import ProjectCard from '../ui/ProjectCard.jsx';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import projects from '../../data/projects.js';
import './Work.css';

export default function Work() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading char cascade
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 75%',
          },
        });
      }

      // Cards stagger in
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="work section" ref={sectionRef}>
      <div className="container">
        <div className="work__header">
          <h2 className="heading-section" ref={headingRef}>
            Wanna see some good work?
          </h2>
          <span className="sub-label">(Work)</span>
        </div>

        <div className="work__grid">
          {projects.map((project, i) => (
            <div key={project.id} ref={el => cardsRef.current[i] = el}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <div className="work__cta">
          <AnimatedButton to="/work">show me more</AnimatedButton>
        </div>
      </div>
    </section>
  );
}
