import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../../utils/gsapPlugins.js';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import PillTag from '../ui/PillTag.jsx';
import './Services.css';

const services = [
  {
    num: '01',
    title: 'Infrastructure',
    skills: ['AWS', 'GCP', 'Terraform', 'Linux'],
  },
  {
    num: '02',
    title: 'CI/CD',
    skills: ['GitHub Actions', 'Jenkins', 'Docker', 'Git'],
  },
  {
    num: '03',
    title: 'Monitoring',
    skills: ['Prometheus', 'Grafana', 'Datadog', 'Logging'],
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const blocksRef = useRef([]);
  const linesRef = useRef([]);

  /* ── Ref Array Initialization (Phase 1 fix) ───────────────────────── */
  // Initialize ref arrays in useEffect BEFORE animations run
  useEffect(() => {
    blocksRef.current = Array(services.length + 1).fill(null); // +1 for CTA
    linesRef.current = Array(services.length).fill(null);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isMobile: '(max-width: 639px)',
      isDesktop: '(min-width: 640px)',
    }, (ctx) => {
      const { isMobile } = ctx.conditions;

      /* ── Heading clip-path reveal ─────────── */
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: isMobile ? 1.0 : 1.4,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          }
        );
      }

      /* ── Ruling lines draw ────────────────── */
      linesRef.current.forEach((line) => {
        if (!line) return;
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.0,
          ease: 'expo.inOut',
          scrollTrigger: { 
            trigger: line, 
            start: 'top 92%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
      });

      /* ── Service blocks — Per-block triggers ─── */
      const validBlocks = blocksRef.current.filter(Boolean);
      validBlocks.forEach((block, i) => {
        if (!block) return;
        
        gsap.from(block, {
          y: isMobile ? 24 : 50,
          opacity: 0,
          duration: isMobile ? 0.8 : 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });

        /* ── Skill pills "rain in" (desktop only) */
        if (!isMobile) {
          const pillContainers = block.querySelectorAll('.service-block__skill');
          if (pillContainers.length) {
            gsap.fromTo(pillContainers, 
              { y: -15, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.05,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                  trigger: block,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                  invalidateOnRefresh: true,
                },
              }
            );
          }
        }
      });
    });

  }, { scope: sectionRef });

  return (
    <section className="services section" ref={sectionRef}>
      <div className="container services__grid">
        <div className="services__left">
          <h2 className="heading-section will-animate" ref={headingRef}>
            I'm building a strong foundation in Cloud & DevOps
          </h2>
        </div>
        <div className="services__right">
          {services.map((service, i) => (
            <div
              key={service.num}
              className="service-block will-animate"
              ref={el => blocksRef.current[i] = el}
            >
              <div
                className="service-block__line"
                ref={el => linesRef.current[i] = el}
              />
              <div className="service-block__header">
                <span className="service-block__num mono-label">{service.num}</span>
                <h3 className="service-block__title">{service.title}</h3>
              </div>
              <ul className="service-block__skills">
                {service.skills.map(skill => (
                  <li key={skill} className="service-block__skill">
                    <PillTag variant="outline">{skill}</PillTag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="services__cta-wrap will-animate" ref={el => blocksRef.current[services.length] = el}>
            <AnimatedButton to="/contact" variant="lime">tell me more</AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  );
}
