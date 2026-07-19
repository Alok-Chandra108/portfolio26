import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import './Footer.css';

export default function Footer() {
  const talkRef = useRef(null);
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) {
      // Use Lenis smooth scroll instead of GSAP ScrollToPlugin
      // which bypasses Lenis and causes scroll jank
      lenis.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__big-text" ref={talkRef}>
          <div className="footer__word-wrap">
            <span className="footer__word">Let's</span>
          </div>
          <div className="footer__word-wrap">
            <span className="footer__word">talk</span>
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__col">
            <h4 className="footer__col-label sub-label">(Connect)</h4>
            <a href="mailto:alokchandra2611@gmail.com" className="footer__link link-hover">alokchandra2611@gmail.com</a>
            <span className="footer__link">India</span>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-label sub-label">(Discover)</h4>
            <Link to="/work" className="footer__link link-hover">Work</Link>
            <Link to="/about" className="footer__link link-hover">About</Link>
            <Link to="/reads" className="footer__link link-hover">Reads</Link>
            <Link to="/contact" className="footer__link link-hover">Contact</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-label sub-label">(Follow)</h4>
            <a href="https://www.linkedin.com/in/alok-chandra108/" target="_blank" rel="noopener noreferrer" className="footer__social link-hover">LinkedIn</a>
            <a href="https://github.com/Alok-Chandra108/" target="_blank" rel="noopener noreferrer" className="footer__social link-hover">GitHub</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright mono-label">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <button className="footer__back-top mono-label" onClick={scrollToTop}>
            ↑ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
