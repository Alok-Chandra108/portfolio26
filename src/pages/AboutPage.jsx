import { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';
import './AboutPage.css';

export default function AboutPage() {
  const headingRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        delay: 0.3,
      });
      gsap.from(contentRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-page__header" ref={headingRef}>
          <h1 className="heading-hero">ABOUT ME</h1>
          <span className="sub-label">(Who I Am)</span>
        </div>

        <div className="about-page__content" ref={contentRef}>
          <div className="about-page__left">
            <div className="about-page__photo">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                alt="Portrait"
                loading="lazy"
              />
            </div>
          </div>
          <div className="about-page__right">
            <h2 className="heading-section">
              I build to beat boring, because boring is bad
            </h2>
            <p className="body-text about-page__bio">
              I'm a creative developer with a passion for crafting exceptional digital
              experiences. My journey started with a curiosity for how things work on the
              web, and it has evolved into a career dedicated to pushing the boundaries
              of what's possible with modern web technologies.
            </p>
            <p className="body-text about-page__bio">
              I specialize in React, GSAP animations, and building performant, beautiful
              interfaces that users love. When I'm not coding, you'll find me reading about
              design, exploring new technologies, or working on creative side projects.
            </p>

            <div className="about-page__stats">
              <div className="about-page__stat">
                <span className="about-page__stat-num">4+</span>
                <span className="about-page__stat-label sub-label">Years Experience</span>
              </div>
              <div className="about-page__stat">
                <span className="about-page__stat-num">30+</span>
                <span className="about-page__stat-label sub-label">Projects Completed</span>
              </div>
              <div className="about-page__stat">
                <span className="about-page__stat-num">15+</span>
                <span className="about-page__stat-label sub-label">Happy Clients</span>
              </div>
            </div>

            <AnimatedButton to="/contact">let's work together</AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
