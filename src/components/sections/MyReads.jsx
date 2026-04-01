import { useEffect, useRef, useCallback } from 'react';
import { gsap } from '../../utils/gsapPlugins.js';
import BookCard from '../ui/BookCard.jsx';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import books from '../../data/books.js';
import './MyReads.css';

const rotations = [-2, 1.5, -1, 2.5];
const displayBooks = books.slice(0, 4);

export default function MyReads() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);

  const handleCardHover = useCallback((hoveredIndex) => {
    cardRefs.current.forEach((card, i) => {
      if (!card || i === hoveredIndex) return;
      gsap.to(card, { scale: 0.97, duration: 0.3 });
    });
  }, []);

  const handleCardLeave = useCallback(() => {
    cardRefs.current.forEach((card) => {
      if (!card) return;
      gsap.to(card, { scale: 1, duration: 0.4 });
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isMobile: '(max-width: 767px)',
        isDesktop: '(min-width: 768px)',
      }, (ctx) => {
        const { isMobile } = ctx.conditions;

        /* ── Heading entrance ─────────────────── */
        if (headingRef.current) {
          gsap.from(headingRef.current, {
            y: isMobile ? 24 : 120,
            opacity: 0,
            duration: isMobile ? 0.7 : 0.9,
            ease: isMobile ? 'power3.out' : 'back.out(1.7)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: isMobile ? 'top 85%' : 'top 70%',
            },
          });
        }

        /* ── Title letter-spacing collapse (desktop) */
        if (!isMobile && headingRef.current) {
          gsap.fromTo(
            headingRef.current,
            { letterSpacing: '0.32em' },
            {
              letterSpacing: '0.04em',
              duration: 1,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
              },
            }
          );
        }

        /* ── Cards fan-in entrance ───────────── */
        cardRefs.current.forEach((card, i) => {
          if (!card) return;

          gsap.from(card, {
            y: isMobile ? 20 : 80,
            rotation: 0,
            opacity: 0,
            duration: isMobile ? 0.6 : 0.8,
            delay: i * (isMobile ? 0.07 : 0.12),
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: isMobile ? 'top 85%' : 'top 65%',
            },
          });

          /* Only fan-rotate on desktop; grid layout on mobile stays flat */
          if (!isMobile) {
            gsap.to(card, {
              rotation: rotations[i],
              duration: 0.4,
              delay: 0.9 + i * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 65%',
              },
            });
          }
        });

        /* ── Fan depth parallax (desktop only) ── */
        if (!isMobile) {
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            // Each card scrolls at slightly different y rate — creates 3D depth
            const depthOffset = [30, 50, 20, 60][i] || 40;
            gsap.to(card, {
              y: `-=${depthOffset}`,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5 + i * 0.2,
              },
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="my-reads section" ref={sectionRef}>
      <div className="container">
        <div className="my-reads__header">
          <h2 className="heading-hero my-reads__title will-animate" ref={headingRef}>MY READS</h2>
          <span className="sub-label my-reads__annotation">(04)</span>
        </div>

        <div className="my-reads__cards" ref={cardsContainerRef}>
          {displayBooks.map((book, i) => (
            <div
              key={book.id}
              ref={el => cardRefs.current[i] = el}
              className="my-reads__card-wrap will-animate"
            >
              <BookCard
                book={book}
                index={i}
                rotation={rotations[i]}
                onHover={handleCardHover}
                onLeave={handleCardLeave}
              />
            </div>
          ))}
        </div>

        <div className="my-reads__cta">
          <AnimatedButton to="/reads">show me more</AnimatedButton>
        </div>
      </div>
    </section>
  );
}
