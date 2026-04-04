import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapPlugins.js';
import { experienceService } from '../../firebase/experienceService.js';
import staticEducationData from '../../data/education.js';
import './Education.css';

export default function Education() {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const headingRef = useRef(null);
  const itemsRef = useRef([]);
  const nodesRef = useRef([]);

  useEffect(() => {
    experienceService.getExperience()
      .then(data => {
        const eduData = data.filter(exp => exp.type === 'education');
        setEducationData(eduData.length > 0 ? eduData : staticEducationData);
      })
      .catch(() => setEducationData(staticEducationData))
      .finally(() => setLoading(false));
  }, []);

  // Use useGSAP for cleanup and scoping
  useGSAP(() => {
    // Re-initialize arrays for refs to ensure they match current DOM across hot reloads
    itemsRef.current = [];
    nodesRef.current = [];
  }, { dependencies: [educationData], scope: sectionRef });

  useGSAP(() => {
    const mm = gsap.matchMedia();

    /* ── Timeline progress line ─────────────── */
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            end: 'bottom 88%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    /* ── Heading ─────────────────────── */
    if (headingRef.current) {
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { 
          trigger: headingRef.current, 
          start: 'top 90%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });
    }

    /* ── Device-aware item animations ────────── */
    mm.add({
      isMobile: '(max-width: 899px)',
      isDesktop: '(min-width: 900px)',
    }, (ctx) => {
      const { isMobile } = ctx.conditions;

      itemsRef.current.forEach((item, i) => {
        if (!item) return;

        const isOdd = i % 2 === 0;
        gsap.fromTo(
          item,
          {
            x: isMobile ? 0 : isOdd ? -50 : 50,
            y: isMobile ? 28 : 0,
            opacity: 0,
            scale: 0.96,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: isMobile ? 0.85 : 1.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          }
        );
      });

      /* ── Node pulse ring (all screens) ──── */
      nodesRef.current.forEach((node) => {
        if (!node) return;
        gsap.fromTo(
          node,
          { scale: 0.3, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: node,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          }
        );
      });
    });

    ScrollTrigger.refresh();

  }, { dependencies: [educationData, loading], scope: sectionRef });

  const addItem = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el);
  };
  const addNode = (el) => {
    if (el && !nodesRef.current.includes(el)) nodesRef.current.push(el);
  };

  return (
    <section className="education section" ref={sectionRef}>
      <div className="education__wrapper">
        <div className="education__header">
          <h2 ref={headingRef} className="will-animate">Education</h2>
          <span className="sub-label">(My Academic Journey)</span>
        </div>

        <div className="education__timeline">
          {/* Vertical central tracking line */}
          <div className="education__line">
            <div className="education__line-progress" ref={lineRef} />
          </div>

          {/* Education Milestone Cards */}
          {educationData.map((item, index) => (
            <div className="education__item" key={item.id}>
              <div className="education__node will-animate" ref={addNode} />
              <div className="education__content will-animate" ref={addItem}>
                <span className="education__year">{item.startDate || item.year}</span>
                <h3 className="education__degree">{item.role || item.degree}</h3>
                <h4 className="education__institution">{item.company || item.institution}</h4>
                <p className="education__description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
