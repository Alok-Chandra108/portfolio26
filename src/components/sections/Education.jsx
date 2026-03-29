import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import educationData from '../../data/education.js';
import './Education.css';

export default function Education() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const itemsRef = useRef([]);

  const addToRefs = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  useEffect(() => {
    itemsRef.current = [];
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Center Line Progress
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            end: 'bottom 80%',
            scrub: 1,
          }
        }
      );

      // 2. Animate the education details sliding in softly
      itemsRef.current.forEach((item, i) => {
        const isOdd = i % 2 === 0;
        const startX = window.innerWidth > 900 ? (isOdd ? -40 : 40) : 30;

        gsap.fromTo(item, 
          { x: startX, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="education section" ref={sectionRef}>
      <div className="education__wrapper">
        <div className="education__header">
          <h2>Education</h2>
          <span className="sub-label">(My Academic Journey)</span>
        </div>

        <div className="education__timeline">
          {/* Vertical central tracking line */}
          <div className="education__line">
            <div className="education__line-progress" ref={lineRef}></div>
          </div>

          {/* Education Milestone Cards */}
          {educationData.map((item, index) => (
            <div className="education__item" key={item.id}>
              <div className="education__node"></div>
              <div className="education__content" ref={addToRefs}>
                <span className="education__year">{item.year}</span>
                <h3 className="education__degree">{item.degree}</h3>
                <h4 className="education__institution">{item.institution}</h4>
                <p className="education__description">{item.description}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
