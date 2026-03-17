import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
import AnimatedButton from '../ui/AnimatedButton.jsx';
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
            start: 'top 75%',
          },
        });
      }

      // Service blocks stagger
      blocksRef.current.forEach((block, i) => {
        if (!block) return;

        gsap.from(block, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 80%',
          },
        });

        // Horizontal rule draw
        const hr = block.querySelector('.service-block__line');
        if (hr) {
          gsap.from(hr, {
            scaleX: 0,
            transformOrigin: 'left',
            duration: 0.8,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: block,
              start: 'top 80%',
            },
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
          <h2 className="heading-section" ref={headingRef}>
            I'm building a strong foundation in Cloud & DevOps
          </h2>
        </div>
        <div className="services__right">
          {services.map((service, i) => (
            <div
              key={service.num}
              className="service-block"
              ref={el => blocksRef.current[i] = el}
            >
              <div className="service-block__line" />
              <div className="service-block__header">
                <span className="service-block__num mono-label">{service.num}</span>
                <h3 className="service-block__title">{service.title}</h3>
              </div>
              <ul className="service-block__skills">
                {service.skills.map(skill => (
                  <li key={skill} className="service-block__skill">{skill}</li>
                ))}
              </ul>
            </div>
          ))}
          <AnimatedButton to="/contact">tell me more</AnimatedButton>
        </div>
      </div>
    </section>
  );
}
