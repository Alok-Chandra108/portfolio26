import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapPlugins.js';
import BookCard from '../ui/BookCard.jsx';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import './MyReads.css';

const rotations = [-2, 1.5, -1, 2.5];

export default function MyReads() {
  const [displayBooks, setDisplayBooks] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchFeaturedBooks = async () => {
      try {
        const q = query(collection(db, "reads"), where("isFeatured", "==", true), limit(4));
        const querySnapshot = await getDocs(q);
        const booksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDisplayBooks(booksData);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedBooks();
  }, []);

  useGSAP(() => {
    if (loading || displayBooks.length === 0) return;
    
    // reset refs list to match currently rendered list safely
    cardRefs.current = cardRefs.current.slice(0, displayBooks.length);

    const mm = gsap.matchMedia();

    mm.add({
      isMobile: '(max-width: 767px)',
      isDesktop: '(min-width: 768px)',
    }, (ctx) => {
      const { isMobile } = ctx.conditions;

      /* ── Heading entrance ─────────────────── */
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: isMobile ? 30 : 140,
          opacity: 0,
          duration: isMobile ? 0.9 : 1.2,
          ease: isMobile ? 'power3.out' : 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isMobile ? 'top 85%' : 'top 75%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
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
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          }
        );
      }

      /* ── Cards fan-in entrance ───────────── */
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        gsap.from(card, {
          y: isMobile ? 24 : 100,
          rotation: 0,
          opacity: 0,
          duration: isMobile ? 0.75 : 1.05,
          delay: i * (isMobile ? 0.1 : 0.16),
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isMobile ? 'top 85%' : 'top 70%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });

        /* Only fan-rotate on desktop; grid layout on mobile stays flat */
        if (!isMobile) {
          gsap.to(card, {
            rotation: rotations[i],
            duration: 0.75,
            delay: 1.2 + i * 0.13,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          });
        }
      });

      /* ── Fan depth parallax (desktop only) ── */
      if (!isMobile) {
        // Single ScrollTrigger for all cards - more performant than 4 separate ones
        gsap.to(cardRefs.current, {
          y: (i, target) => {
            const depthOffset = [30, 50, 20, 60][i] || 40;
            return `-=${depthOffset}`;
          },
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
    });

    ScrollTrigger.refresh();

  }, { scope: sectionRef, dependencies: [loading, displayBooks] });

  return (
    <section className="my-reads section" ref={sectionRef}>
      <div className="container">
        <div className="my-reads__header">
          <h2 className="heading-hero my-reads__title will-animate" ref={headingRef}>MY READS</h2>
          <span className="sub-label my-reads__annotation">(04)</span>
        </div>

        <div className="my-reads__cards" ref={cardsContainerRef}>
          {/* Clear refs array to avoid stale references from previous renders */}
          {cardRefs.current.length = 0}
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', color: 'var(--color-muted)' }}>Loading top reads...</p>
          ) : displayBooks.length === 0 ? (
            <p style={{ textAlign: 'center', width: '100%', color: 'var(--color-muted)' }}>No featured reads yet.</p>
          ) : (
            displayBooks.map((book, i) => (
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
            ))
          )}
        </div>

        <div className="my-reads__cta">
          <AnimatedButton to="/reads">show me more</AnimatedButton>
        </div>
      </div>
    </section>
  );
}
