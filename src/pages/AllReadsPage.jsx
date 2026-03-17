import { useState, useRef, useEffect } from 'react';
import { gsap, Flip, ScrollTrigger } from '../utils/gsapPlugins.js';
import BookCard from '../components/ui/BookCard.jsx';
import books from '../data/books.js';
import './AllReadsPage.css';

const categories = ['All', 'Design', 'Tech', 'Productivity', 'Business'];
const rotations = [-2, 1.5, -1, 2.5, -1.5, 2, -0.5, 1];

export default function AllReadsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const gridRef = useRef(null);

  const filteredBooks = activeFilter === 'All'
    ? books
    : books.filter(b => b.category === activeFilter);

  const handleFilter = (category) => {
    if (!gridRef.current || !Flip) {
      setActiveFilter(category);
      return;
    }

    const state = Flip.getState(gridRef.current.children);
    setActiveFilter(category);

    // After React re-renders, animate with Flip
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.04,
        absolute: true,
        onEnter: elements => gsap.fromTo(elements,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5 }
        ),
        onLeave: elements => gsap.to(elements,
          { opacity: 0, scale: 0.8, duration: 0.3 }
        ),
      });
    });
  };

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children;
      if (cards?.length) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.3,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="reads-page">
      <div className="container">
        <div className="reads-page__header">
          <h1 className="heading-hero">ALL MY READS</h1>
        </div>

        <div className="reads-page__filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`reads-page__filter ${activeFilter === cat ? 'reads-page__filter--active' : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="reads-page__grid" ref={gridRef}>
          {filteredBooks.map((book, i) => (
            <div key={book.id} data-flip-id={`book-${book.id}`} className="reads-page__card-wrap">
              <BookCard
                book={book}
                index={i}
                rotation={rotations[i % rotations.length]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
