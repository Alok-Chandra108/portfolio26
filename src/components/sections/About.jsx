import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import './About.css';

const photos = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&q=80',
  'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
];

export default function About() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const stripRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 72%',
          },
        });
      }

      // Photo strip entrance
      if (stripRef.current) {
        gsap.from(stripRef.current, {
          x: 200,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about section" ref={sectionRef}>
      <div className="container about__grid">
        <div className="about__text">
          <h2 className="heading-section" ref={headingRef}>
            I build robust infrastructure, because downtime is bad
          </h2>
          <p className="body-text about__body">
            I'm a Cloud & DevOps enthusiast passionate about architecting scalable,
            resilient systems that power modern applications. With a deep interest in
            automation, continuous integration, and cloud-native technologies, I bridge
            the gap between development and operations. Every project is an opportunity
            to optimize performance while ensuring high availability and secure deployments.
          </p>
          <AnimatedButton to="/about">tell me more</AnimatedButton>
        </div>
        <div className="about__photos" ref={stripRef}>
          <div className="about__photo-strip">
            {[...photos, ...photos].map((src, i) => (
              <div key={i} className="about__photo">
                <img src={src} alt="workspace" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
