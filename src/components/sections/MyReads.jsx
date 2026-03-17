import { useEffect, useRef, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapPlugins.js';
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
      // Heading entrance
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 120,
          opacity: 0,
          duration: 0.9,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });
      }

      // Cards entrance and settle into tilted rotation
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 80,
          rotation: 0,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        });

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
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="my-reads section" ref={sectionRef}>
      <div className="container">
        <div className="my-reads__header">
          <h2 className="heading-hero my-reads__title" ref={headingRef}>MY READS</h2>
          <span className="sub-label my-reads__annotation">(04)</span>
        </div>

        <div className="my-reads__cards" ref={cardsContainerRef}>
          {displayBooks.map((book, i) => (
            <div
              key={book.id}
              ref={el => cardRefs.current[i] = el}
              className="my-reads__card-wrap"
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
