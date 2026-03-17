import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import PillTag from '../ui/PillTag.jsx';
import './Hero.css';

const subtitles = [
  'building scalable infrastructure',
  'automating deployment pipelines',
  'architecting cloud solutions',
];

export default function Hero() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const pillsRef = useRef(null);
  const marqueeRef = useRef(null);
  const [subIndex, setSubIndex] = useState(0);

  // Cycle subtitles
  useEffect(() => {
    const interval = setInterval(() => {
      setSubIndex(prev => (prev + 1) % subtitles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Subtitle transition
  useEffect(() => {
    if (!subtitleRef.current) return;
    gsap.fromTo(subtitleRef.current,
      { y: 40, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'expo.out' }
    );
  }, [subIndex]);

  // Entry animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading words
      const words = headingRef.current?.querySelectorAll('.hero__word');
      if (words?.length) {
        gsap.from(words, {
          y: '110%',
          opacity: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 3.5, // after loader
        });
      }

      // Pills
      const pills = pillsRef.current?.children;
      if (pills?.length) {
        gsap.from(pills, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'back.out(2)',
          delay: 4.2,
        });
      }

      // Marquee
      if (marqueeRef.current) {
        gsap.from(marqueeRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 4.4,
        });
      }

      // Parallax on heading
      if (headingRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          animation: gsap.to(headingRef.current, { y: 100, ease: 'none' }),
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const marqueeContent = 'AWS ✦ Docker ✦ Kubernetes ✦ Terraform ✦ CI/CD ✦ Linux ✦ DevOps ✦ Ansible ✦ Jenkins ✦ Prometheus ✦ Grafana ✦ Git ✦ Bash ✦ ';

  return (
    <section className="hero section" ref={sectionRef}>
      <div className="hero__annotation sub-label">(portfolio)</div>

      <div className="hero__heading-wrap container">
        <h1 className="hero__heading heading-hero" ref={headingRef}>
          {'ALOK CHANDRA'.split(' ').map((word, i) => (
            <span key={i} className="hero__word-wrap">
              <span className="hero__word">{word}</span>
            </span>
          ))}
        </h1>

        <div className="hero__subtitle-wrap">
          <p className="hero__subtitle heading-section" ref={subtitleRef}>
            {subtitles[subIndex]}
          </p>
        </div>
      </div>

      <div className="hero__pills container" ref={pillsRef}>
        <PillTag variant="dark">(available for work)</PillTag>
        <PillTag variant="dark">(since 2022)</PillTag>
        <PillTag variant="dark">(based in India)</PillTag>
      </div>

      <div className="hero__marquee" ref={marqueeRef}>
        <div className="hero__marquee-track">
          <span className="hero__marquee-text">{marqueeContent}</span>
          <span className="hero__marquee-text">{marqueeContent}</span>
          <span className="hero__marquee-text">{marqueeContent}</span>
        </div>
      </div>
    </section>
  );
}
