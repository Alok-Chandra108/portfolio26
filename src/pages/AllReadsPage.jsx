import { useState, useRef, useEffect } from 'react';
import { gsap, useGSAP, Flip, ScrollTrigger } from '../utils/gsapPlugins.js';
import BookCard from '../components/ui/BookCard.jsx';
import SEO from '../components/ui/SEO.jsx';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './AllReadsPage.css';

const categories = ['All', 'Design', 'Tech', 'Productivity', 'Business', 'Self-Help', 'Fiction', 'Non-Fiction'];
const rotations = [-2, 1.5, -1, 2.5, -1.5, 2, -0.5, 1];

export default function AllReadsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reads"));
        const booksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

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
  useGSAP(() => {
    if (loading || books.length === 0) return;
    
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
  }, { dependencies: [loading, books] });

  return (
    <div className="reads-page">
      <SEO 
        title="My Reads — Recommended Books & Catalog" 
        description="Explore books, reading notes, recommendations, and literature curated by Alok Chandra across Tech, Product, Design, and Engineering leadership."
      />
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
          {loading ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-muted)", padding: "40px 0" }}>
              Loading reading catalog...
            </p>
          ) : filteredBooks.length === 0 ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-muted)", padding: "40px 0" }}>
              No books found in this category.
            </p>
          ) : (
            filteredBooks.map((book, i) => (
              <div key={book.id} data-flip-id={`book-${book.id}`} className="reads-page__card-wrap">
                <BookCard
                  book={book}
                  index={i}
                  rotation={rotations[i % rotations.length]}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
