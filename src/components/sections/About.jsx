import { useState, useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../../utils/gsapPlugins.js';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import { aboutService } from '../../firebase/aboutService';
import './About.css';

const photos = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
];

export default function About() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);
  const photosRef = useRef([]);
  const badgeRef = useRef(null);

  const defaultHeading = "I build robust infrastructure, because downtime is bad";
  const defaultBioShort = "I'm a Cloud & DevOps enthusiast passionate about architecting scalable, resilient systems that power modern applications. With a deep interest in automation, continuous integration, and cloud-native technologies, I bridge the gap between development and operations.";

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
      isMobile: '(max-width: 767px)',
      isDesktop: '(min-width: 768px)',
    }, (ctx) => {
      const { isMobile } = ctx.conditions;

      /* ── Heading ─────────────────────── */
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: isMobile ? 28 : 60,
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

      /* ── Body paragraph ─────────── */
      if (bodyRef.current) {
        gsap.from(bodyRef.current, {
          y: isMobile ? 20 : 40,
          opacity: 0,
          duration: 1.0,
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

      /* ── Photo collage stagger ── */
      const validPhotos = photosRef.current.filter(Boolean);
      if (validPhotos.length) {
        gsap.fromTo(validPhotos,
          { opacity: 0, scale: 0.88, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          }
        );
      }

      /* ── Badge pop-in ── */
      if (badgeRef.current) {
        gsap.from(badgeRef.current, {
          scale: 0.6,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(2)',
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    });

  }, { scope: sectionRef });

  return (
    <section className="about section" ref={sectionRef}>
      <div className="container about__grid">
        <div className="about__text">
          <span className="about__label mono-label">(ABOUT ME)</span>
          <h2 className="about__heading will-animate" ref={headingRef}>
            {aboutData.heading}
          </h2>
          <p className="body-text about__body will-animate" ref={bodyRef}>
            {aboutData.bio}
          </p>
          <AnimatedButton to="/about">tell me more</AnimatedButton>
        </div>

        <div className="about__photos will-animate">
          <div className="about__photo-collage">
            {photos.map((src, i) => (
              <div
                key={i}
                className="about__photo"
                ref={el => photosRef.current[i] = el}
              >
                <img src={src} alt="workspace" loading="lazy" />
              </div>
            ))}
            <div className="about__badge" ref={badgeRef}>
              <span className="about__badge-dot" />
              Open for work
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
