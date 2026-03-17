import { useRef } from 'react';
import { gsap } from '../../utils/gsapPlugins.js';
import './BookCard.css';

export default function BookCard({ book, index, rotation = 0, onHover, onLeave }) {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -12,
      rotation: 0,
      scale: 1.03,
      duration: 0.4,
      ease: 'power2.out',
      boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
    });
    if (onHover) onHover(index);
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      rotation: rotation,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.6)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    });
    if (onLeave) onLeave(index);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Read': return 'status--read';
      case 'Reading': return 'status--reading';
      default: return 'status--want';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Read': return '✓';
      case 'Reading': return '◐';
      default: return '○';
    }
  };

  return (
    <div
      className="book-card"
      ref={cardRef}
      style={{ transform: `rotate(${rotation}deg)` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="pointer"
    >
      <div className="book-card__cover">
        <img
          src={book.cover}
          alt={book.title}
          loading="lazy"
          style={{ aspectRatio: '3/4' }}
        />
      </div>
      <div className="book-card__info">
        <h4 className="book-card__title">{book.title}</h4>
        <p className="book-card__author">{book.author}</p>
        <span className={`book-card__status ${getStatusVariant(book.status)}`}>
          {getStatusIcon(book.status)} {book.status}
        </span>
      </div>
    </div>
  );
}
