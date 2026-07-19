import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../../utils/gsapPlugins.js';
import PillTag from '../ui/PillTag.jsx';
import DownloadCV from '../ui/DownloadCV.jsx';
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
  const cvBtnRef = useRef(null);
  const marqueeRef = useRef(null);
  const [subIndex, setSubIndex] = useState(0);
  const usedHues = useRef({}); // History of colors for each character index

  // Cycle subtitles
  useEffect(() => {
    const interval = setInterval(() => {
      setSubIndex(prev => (prev + 1) % subtitles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Subtitle transition
  useGSAP(() => {
    if (!subtitleRef.current) return;
    gsap.fromTo(subtitleRef.current,
      { y: 40, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'expo.out', overwrite: 'auto' }
    );
  }, { dependencies: [subIndex], scope: sectionRef });

  // Entry animations & Parallax
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("all", () => {
      // Heading words
      const words = headingRef.current?.querySelectorAll('.hero__word');
      if (words?.length) {
        gsap.from(words, {
          y: '110%',
          opacity: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 2.2, // synchronized with loader exit start
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
          delay: 2.8,
        });
      }

      // CV Button
      if (cvBtnRef.current) {
        gsap.from(cvBtnRef.current, {
          y: 30,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: 'power3.out',
          delay: 2.9,
        });
      }

      // Marquee
      if (marqueeRef.current) {
        gsap.from(marqueeRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 2.2,
        });
      }
    });

    mm.add("(min-width: 769px)", () => {
      // Parallax on heading only on larger screens to avoid mobile jitter
      if (headingRef.current) {
        gsap.to(headingRef.current, {
          y: 100,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }
    });

    // Cleanup matchMedia on unmount
    return () => mm.revert();
  }, { scope: sectionRef });

  const marqueeContent = 'AWS ✦ Docker ✦ Kubernetes ✦ Terraform ✦ CI/CD ✦ Linux ✦ DevOps ✦ Ansible ✦ Jenkins ✦ Prometheus ✦ Grafana ✦ Git ✦ Bash ✦ ';

  const handleMouseEnter = (key, e) => {
    if (!usedHues.current[key]) usedHues.current[key] = [];
    const history = usedHues.current[key];
    
    let newHue;
    let attempts = 0;
    const minDistance = 30; // Min degrees difference

    while (attempts < 50) {
      newHue = Math.floor(Math.random() * 360);
      // Ensure it's not too close to the last color or any in recent history
      const isUnique = history.every(h => {
        const diff = Math.abs(h - newHue);
        return diff > minDistance && diff < (360 - minDistance);
      });
      
      if (isUnique) break;
      attempts++;
    }

    history.push(newHue);
    if (history.length > 50) history.shift(); // Max history of 50 to allow some recycling eventually

    e.currentTarget.style.setProperty('--hover-color', `hsl(${newHue}, 80%, 65%)`);
  };

  const initialHues = useRef(null);
  if (initialHues.current === null) {
    // Lazy init — avoids regenerating the hue array on every render
    initialHues.current = 'ALOK CHANDRA'.split('').map(() => Math.floor(Math.random() * 360));
  }

  return (
    <section className="hero section" ref={sectionRef}>
      <div className="hero__annotation sub-label">(portfolio)</div>

      <div className="hero__heading-wrap container">
        <h1 className="hero__heading heading-hero" ref={headingRef}>
          {'ALOK CHANDRA'.split(' ').map((word, wIndex) => (
            <span key={wIndex} className="hero__word-wrap">
              <span className="hero__word">
                {word.split('').map((char, cIndex) => {
                  const charIdx = word.split('').slice(0, cIndex).length + (wIndex > 0 ? 'ALOK '.length : 0);
                  const globalIdx = `${wIndex}-${cIndex}`;
                  const initialHue = initialHues.current[charIdx] || 0;
                  
                  return (
                    <span
                      key={cIndex}
                      className="hero__char-wrap"
                      style={{ '--hover-color': `hsl(${initialHue}, 80%, 65%)` }}
                      onMouseEnter={(e) => handleMouseEnter(globalIdx, e)}
                    >
                      <span className="hero__char hero__char--main">{char}</span>
                      <span className="hero__char hero__char--clone" aria-hidden="true">{char}</span>
                    </span>
                  );
                })}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero__subtitle-wrap">
          <p className="hero__subtitle heading-section" ref={subtitleRef}>
            {subtitles[subIndex]}
          </p>
        </div>
      </div>

      <div className="hero__marquee" ref={marqueeRef}>
        <div className="hero__marquee-track">
          <span className="hero__marquee-text">{marqueeContent}</span>
          <span className="hero__marquee-text">{marqueeContent}</span>
          <span className="hero__marquee-text">{marqueeContent}</span>
        </div>
      </div>

      <div ref={cvBtnRef}>
        <DownloadCV />
      </div>
    </section>
  );
}
