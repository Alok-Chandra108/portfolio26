import { useState, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapPlugins.js';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import { aboutService } from '../../firebase/aboutService';
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
  const bodyRef = useRef(null);
  const stripRef = useRef(null);

  const defaultHeading = "I build robust infrastructure, because downtime is bad";
  const defaultBioShort = "I'm a Cloud & DevOps enthusiast passionate about architecting scalable, resilient systems that power modern applications. With a deep interest in automation, continuous integration, and cloud-native technologies, I bridge the gap between development and operations. Every project is an opportunity to optimize performance while ensuring high availability and secure deployments.";

  const [aboutData, setAboutData] = useState({
    heading: defaultHeading,
    bio: defaultBioShort,
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await aboutService.getAboutData();
        if (data) {
          setAboutData({
            heading: data.heading || defaultHeading,
            // For the homepage, we use bio1 from the data, or fallback to the short default bio
            bio: data.bio1 || defaultBioShort,
          });
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      }
    };
    fetchAboutData();
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isMobile: '(max-width: 639px)',
      isTablet: '(min-width: 640px) and (max-width: 1023px)',
      isDesktop: '(min-width: 1024px)',
    }, (ctx) => {
      const { isMobile, isDesktop } = ctx.conditions;

      /* ── Heading ─────────────────────── */
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: isMobile ? 28 : 70,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
      }

      /* ── Body paragraph fade-up ─────────── */
      if (bodyRef.current) {
        gsap.from(bodyRef.current, {
          y: isMobile ? 20 : 48,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
      }

      /* ── Photo strip ──────────────────────── */
      if (stripRef.current) {
        if (isMobile) {
          // Mobile: simple fade-up, NO x-translate (prevents overflow)
          gsap.from(stripRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          });
        } else {
          // Tablet / Desktop: slide in from right on enter
          gsap.from(stripRef.current, {
            x: isDesktop ? 140 : 70,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          });
        }

        // Desktop-only scrubbed parallax
        if (isDesktop) {
          gsap.to(stripRef.current, {
            y: 60,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    });

    // Removed ScrollTrigger.refresh() - not needed in useGSAP

  }, { scope: sectionRef });

  return (
    <section className="about section" ref={sectionRef}>
      <div className="container about__grid">
        <div className="about__text">
          <h2 className="heading-section will-animate" ref={headingRef}>
            {aboutData.heading}
          </h2>
          <p className="body-text about__body will-animate" ref={bodyRef}>
            {aboutData.bio}
          </p>
          <AnimatedButton to="/about">tell me more</AnimatedButton>
        </div>
        <div className="about__photos will-animate" ref={stripRef}>
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
