import { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import ProjectCard from '../components/ui/ProjectCard.jsx';
import projects from '../data/projects.js';
import './WorkPage.css';

export default function WorkPage() {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children;
      if (cards?.length) {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.3,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="work-page">
      <div className="container">
        <div className="work-page__header">
          <h1 className="heading-hero">SELECTED WORK</h1>
          <span className="sub-label">(Projects)</span>
        </div>
        <div className="work-page__grid" ref={gridRef}>
          {projects.map(project => (
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
