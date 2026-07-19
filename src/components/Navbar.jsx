import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { gsap, useGSAP } from '../utils/gsapPlugins.js';
import StatusPulse from './StatusPulse';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuLinksRef = useRef([]); // Dynamic array populated by callback refs
  const logoBgRef = useRef(null);
  const charAInnerRef = useRef(null);
  const charCInnerRef = useRef(null);
  const navigate = useNavigate();

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const lenis = useLenis(({ scroll }) => {
    if (mountedRef.current) {
      setScrolled(scroll > 80);
    }
  });

  const { contextSafe } = useGSAP({ scope: navRef });

  useGSAP(() => {
    // Set initial position for C container
    gsap.set(charCInnerRef.current, { yPercent: -50 });
  }, { scope: navRef });

  // Menu open/close animation - with contextSafe and proper cleanup
  useGSAP(() => {
    if (!menuOverlayRef.current) return;

    const animateMenu = contextSafe(() => {
      if (menuOpen) {
        document.body.style.overflow = 'hidden';
        
        // Overlay animation
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
    });

    animateMenu();

    // Cleanup on unmount or menuOpen change
    return () => {
      // Kill any running animations
      gsap.killTweensOf(menuOverlayRef.current);
      menuLinksRef.current.forEach((link) => {
        if (link) gsap.killTweensOf(link);
      });
      // Ensure body overflow is restored
      document.body.style.overflow = '';
    };
  }, { dependencies: [menuOpen], scope: navRef });

  const handleLogoHover = contextSafe(() => {
    // Rotate background
    gsap.to(logoBgRef.current, {
      rotation: 360,
      duration: 1.2,
      ease: 'power2.out',
    });
    
    // Animate A & C characters
    gsap.to(charAInnerRef.current, { yPercent: -50, duration: 0.4, ease: 'power2.out' });
    gsap.to(charCInnerRef.current, { yPercent: 50, duration: 0.4, ease: 'power2.out' });
  });

  const handleLogoLeave = contextSafe(() => {
    gsap.to(charAInnerRef.current, { yPercent: 0, duration: 0.4, ease: 'power2.out' });
    gsap.to(charCInnerRef.current, { yPercent: -50, duration: 0.4, ease: 'power2.out' });
  });

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (path === '/') {
      navigate(path);
      if (typeof lenis?.scrollTo === 'function') {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      navigate(path);
    }
    closeMenu();
  };

  const navLinks = [
    { label: 'Work', path: '/work' },
    { label: 'Experience', path: '/experience' },
    { label: 'Education', path: '/education' },
    { label: 'Skills', path: '/skills' },
    { label: 'About', path: '/about' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} ref={navRef}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={(e) => handleNavClick(e, '/')}>
          <div className="navbar__logo-bg" ref={logoBgRef}>
            <span className="navbar__char" ref={charAInnerRef}>A</span>
            <span className="navbar__char navbar__char--c">LOK <span ref={charCInnerRef}>C</span>HANDRA</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__desktop">
          <ul className="navbar__list">
            {navLinks.map((link, i) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className="navbar__link"
                  onClick={(e) => handleNavClick(e, link.path)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <StatusPulse />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`navbar__menu-btn ${menuOpen ? 'navbar__menu-btn--open' : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="navbar__menu-line navbar__menu-line--1" />
          <span className="navbar__menu-line navbar__menu-line--2" />
          <span className="navbar__menu-line navbar__menu-line--3" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className="navbar__overlay" 
        ref={menuOverlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="navbar__overlay-inner">
          <ul className="navbar__overlay-list">
            {navLinks.map((link, i) => (
              <li key={link.path} className="navbar__overlay-item">
                <Link
                  to={link.path}
                  className="navbar__overlay-link"
                  ref={(el) => { menuLinksRef.current[i] = el; }}
                  onClick={(e) => handleNavClick(e, link.path)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <StatusPulse className="navbar__overlay-pulse" />
        </div>
      </div>
    </nav>
  );
}
