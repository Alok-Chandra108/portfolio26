import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { gsap } from '../utils/gsapPlugins.js';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuLinksRef = useRef([]);
  const logoBgRef = useRef(null);
  const charAInnerRef = useRef(null);
  const charCInnerRef = useRef(null);
  const navigate = useNavigate();

  const lenis = useLenis(({ scroll }) => {
    setScrolled(scroll > 80);
  });

  useEffect(() => {
    // Set initial position for C container
    gsap.set(charCInnerRef.current, { yPercent: -50 });
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
    // Rotate background
    gsap.to(logoBgRef.current, {
      rotation: 180,
      duration: 0.8,
      ease: 'power3.out',
    });
    // Move A up (displays second A)
    gsap.to(charAInnerRef.current, {
      yPercent: -50,
      duration: 0.8,
      ease: 'power3.out',
    });
    // Move C down (displays top C)
    gsap.to(charCInnerRef.current, {
      yPercent: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  const handleLogoLeave = () => {
    // Reverse background
    gsap.to(logoBgRef.current, {
      rotation: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
    // Reset A
    gsap.to(charAInnerRef.current, {
      yPercent: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
    // Reset C
    gsap.to(charCInnerRef.current, {
      yPercent: -50,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const navLinks = [
    { label: 'Work', path: '/work' },
    { label: 'About', path: '/about' },
    { label: 'My Reads', path: '/reads' },
    { label: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/alok-chandra108/' },
    { label: 'GitHub', url: 'https://github.com/Alok-Chandra108/' },
  ];

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <Link 
          to="/" 
          className="navbar__logo" 
          onMouseEnter={handleLogoHover}
          onMouseLeave={handleLogoLeave}
        >
          <div className="navbar__logo-square">
            <div className="navbar__logo-bg" ref={logoBgRef}></div>
            
            <div className="navbar__logo-char-wrap">
              <div ref={charAInnerRef} style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="navbar__logo-char">A</span>
                <span className="navbar__logo-char">A</span>
              </div>
            </div>

            <div className="navbar__logo-char-wrap">
              <div ref={charCInnerRef} style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="navbar__logo-char">C</span>
                <span className="navbar__logo-char">C</span>
              </div>
            </div>
            
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
              <p className="mono-label">alokchandra2611@gmail.com</p>
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
