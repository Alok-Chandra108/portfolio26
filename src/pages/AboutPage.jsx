import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../utils/gsapPlugins.js';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';
import './AboutPage.css';

export default function AboutPage() {
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const photoRef = useRef(null);
  const statsRefs = useRef([]);

  useGSAP(() => {
    // Header reveal
    gsap.from(headingRef.current, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.2,
    });

    // Content reveal
    gsap.from(contentRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.4,
    });

    // Premium Photo Mask Reveal
    if (photoRef.current) {
      gsap.fromTo(photoRef.current, 
        { clipPath: 'inset(100% 0 0 0)' },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          duration: 1.5, 
          ease: 'expo.inOut', 
          delay: 0.6 
        }
      );
    }

    // Floating Stats Counter Animation
    statsRefs.current.forEach((stat, i) => {
      if (!stat) return;
      const targetVal = parseFloat(stat.innerText);
      const isPercent = stat.innerText.includes('%');
      const isPlus = stat.innerText.includes('+');
      
      const obj = { val: 0 };
      gsap.to(obj, {
        val: targetVal,
        duration: 2,
        ease: 'power4.out',
        delay: 0.8 + (i * 0.1),
        scrollTrigger: {
          trigger: stat,
          start: 'top 90%',
        },
        onUpdate: () => {
          let output = obj.val.toFixed(isPercent ? 1 : 0);
          if (isPlus) output += '+';
          if (isPercent) output += '%';
          stat.innerText = output;
        }
      });
    });
  });

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-page__header" ref={headingRef}>
          <h1 className="heading-hero">ABOUT ME</h1>
          <span className="sub-label">(Who I Am)</span>
        </div>

        <div className="about-page__content" ref={contentRef}>
          <div className="about-page__left">
            <div className="about-page__photo" ref={photoRef}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                alt="Portrait"
                loading="lazy"
              />
            </div>
          </div>
          <div className="about-page__right">
            <h2 className="heading-section">
              I build robust infrastructure, because downtime is bad
            </h2>
            <p className="body-text about-page__bio">
              I'm a Cloud & DevOps enthusiast with a passion for architecting resilient,
              scalable systems. My journey started with a curiosity for how servers and networks
              operate, and it has evolved into a career dedicated to automating deployments and
              building secure, reliable cloud infrastructure.
            </p>
            <p className="body-text about-page__bio">
              I specialize in AWS, CI/CD pipelines, containerization, and Infrastructure as Code.
              When I'm not configuring clusters or writing automation scripts, you'll find me reading about
              system architecture, exploring new cloud services, or contributing to open-source tools.
            </p>

            <div className="about-page__stats">
              <div className="about-page__stat">
                <span className="about-page__stat-num" ref={el => statsRefs.current[0] = el}>4+</span>
                <span className="about-page__stat-label sub-label">Years Experience</span>
              </div>
              <div className="about-page__stat">
                <span className="about-page__stat-num" ref={el => statsRefs.current[1] = el}>20+</span>
                <span className="about-page__stat-label sub-label">Pipelines Built</span>
              </div>
              <div className="about-page__stat">
                <span className="about-page__stat-num" ref={el => statsRefs.current[2] = el}>99.9%</span>
                <span className="about-page__stat-label sub-label">Uptime Delivered</span>
              </div>
            </div>

            <AnimatedButton to="/contact">let's work together</AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
