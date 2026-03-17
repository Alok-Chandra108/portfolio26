import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from '../utils/gsapPlugins.js';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuLinksRef = useRef([]);
  const logoRef = useRef(null);
  const navigate = useNavigate();

  // Scroll-triggered navbar style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu open/close animation
  useEffect(() => {
    if (!menuOverlayRef.current) return;

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(menuOverlayRef.current, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.7,
        ease: 'power4.inOut',
      });
      // Stagger animate menu links
      menuLinksRef.current.forEach((link, i) => {
        if (!link) return;
        gsap.fromTo(link,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.3 + i * 0.08, ease: 'expo.out' }
        );
      });
    } else {
      gsap.to(menuOverlayRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'power4.inOut',
        onComplete: () => {
          document.body.style.overflow = '';
        }
      });
    }
  }, [menuOpen]);

  const handleLogoHover = () => {
    gsap.to(logoRef.current, {
      rotation: 360,
      scale: 1.1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      onComplete: () => gsap.set(logoRef.current, { rotation: 0 }),
    });
  };

  const handleNavClick = (path) => {
    setMenuOpen(false);
    setTimeout(() => navigate(path), 500);
  };

  const navLinks = [
    { label: 'Work', path: '/work' },
    { label: 'About', path: '/about' },
    { label: 'My Reads', path: '/reads' },
    { label: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { label: 'LinkedIn', url: '#' },
    { label: 'GitHub', url: '#' },
    { label: 'Dribbble', url: '#' },
    { label: 'Twitter', url: '#' },
  ];

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <Link to="/" className="navbar__logo" onMouseEnter={handleLogoHover}>
          <div className="navbar__logo-circle" ref={logoRef}>
            <span>00</span>
          </div>
        </Link>

        <div className="navbar__right">
          <Link to="/contact" className="navbar__cta-btn">
            <span>LET'S TALK</span>
            <span className="navbar__cta-arrow">→</span>
          </Link>
          <button
            className="navbar__menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>
            <div className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}>
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <div ref={menuOverlayRef} className="menu-overlay">
        <div className="menu-overlay__content">
          <div className="menu-overlay__links">
            {navLinks.map((link, i) => (
              <button
                key={link.path}
                ref={el => menuLinksRef.current[i] = el}
                className="menu-overlay__link"
                onClick={() => handleNavClick(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="menu-overlay__sidebar">
            <div className="menu-overlay__socials">
              {socialLinks.map(s => (
                <a key={s.label} href={s.url} className="menu-overlay__social link-hover">
                  {s.label}
                </a>
              ))}
            </div>
            <div className="menu-overlay__info">
              <p className="mono-label">hello@portfolio.dev</p>
              <p className="mono-label">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
