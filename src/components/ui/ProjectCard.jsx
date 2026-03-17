import { useRef } from 'react';
import { gsap } from '../../utils/gsapPlugins.js';
import PillTag from './PillTag.jsx';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const arrowRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      duration: 0.4,
      ease: 'power2.out',
      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    });
    gsap.to(imageRef.current, {
      scale: 1.06,
      duration: 0.6,
      ease: 'power2.out',
    });
    gsap.to(arrowRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'back.out(2)',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    });
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    });
    gsap.to(arrowRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
    });
  };

  return (
    <a
      href={project.link}
      className={`project-card project-card--${project.type}`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-card__image">
        <img
          ref={imageRef}
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{ aspectRatio: project.type === 'tall' ? '3/4' : '16/9' }}
        />
      </div>
      <div className="project-card__content">
        <h3 className="project-card__title heading-card">{project.title}</h3>
        <p className="project-card__desc body-text">{project.description}</p>
        <div className="project-card__tags">
          {project.tags.map(tag => (
            <PillTag key={tag} variant="outline">{tag}</PillTag>
          ))}
        </div>
      </div>
      <div className="project-card__arrow" ref={arrowRef}>→</div>
    </a>
  );
}
