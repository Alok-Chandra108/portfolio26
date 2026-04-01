import { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapPlugins.js';
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

  useEffect(() => {
    const ctx = gsap.context(() => {
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
                start: 'top 82%',
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
            scrollTrigger: { trigger: line, start: 'top 88%' },
          });
        });

        /* ── Service blocks — unified stagger ───
         *  Using a single ScrollTrigger on the container
         *  prevents the mobile waterfall jank of per-element triggers
         */
        const validBlocks = blocksRef.current.filter(Boolean);
        if (validBlocks.length) {
          gsap.from(validBlocks, {
            y: isMobile ? 24 : 50,
            opacity: 0,
            duration: isMobile ? 0.8 : 1.1,
            stagger: isMobile ? 0.1 : 0.16,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: isMobile ? 'top 78%' : 'top 70%',
            },
          });
        }

        /* ── Skill pills "rain in" (desktop only) */
        if (!isMobile) {
          validBlocks.forEach((block, i) => {
            const pills = block?.querySelectorAll('.pill-tag');
            if (!pills?.length) return;
            gsap.from(pills, {
              y: -20,
              opacity: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: 'back.out(1.4)',
              delay: 0.5 + i * 0.16,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
              },
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services section" ref={sectionRef}>
      <div className="container services__grid">
        <div className="services__left">
          <h2 className="heading-section will-animate" ref={headingRef}>
            I'm building a strong foundation in Cloud &amp; DevOps
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
          <AnimatedButton to="/contact" variant="lime">tell me more</AnimatedButton>
        </div>
      </div>
    </section>
  );
}
