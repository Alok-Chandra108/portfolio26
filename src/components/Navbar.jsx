import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { gsap, useGSAP } from '../utils/gsapPlugins.js';
import { useAudio } from '../context/AudioContext.jsx';
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
  const { isSoundEnabled, toggleSound } = useAudio();

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

  // Get contextSafe at top level for use in event handlers
  const { contextSafe } = useGSAP({ scope: navRef });

  useGSAP(() => {
    // Set initial position for C container
    if (charCInnerRef.current) {
      gsap.set(charCInnerRef.current, { yPercent: -50 });
    }
  }, { scope: navRef });

  // Menu open/close animation - with scope and contextSafe
  useGSAP(() => {
    if (!menuOverlayRef.current) return;

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(menuOverlayRef.current, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.7,
        ease: 'power4.inOut',
      });
      // Stagger animate menu links - wrapped in contextSafe
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
  }, { dependencies: [menuOpen], scope: navRef });

  const handleLogoHover = contextSafe(() => {
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
  });

  const handleLogoLeave = contextSafe(() => {
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
  });

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const navLinks = [
    { label: 'Work', path: '/work' },
    { label: 'Experience', path: '/experience' },
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
      <nav ref={navRef} className={`navbar ${scrolled && !menuOpen ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--menu-open' : ''}`}>
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
          <div className="navbar__status-wrap desktop-only">
            <StatusPulse />
          </div>

          <button 
            className="navbar__sound-toggle desktop-only" 
            onClick={toggleSound}
            aria-label="Toggle Sound"
            style={{ 
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', 
              color: 'var(--color-text)', borderRadius: '50%', width: '40px', height: '40px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            {isSoundEnabled ? '🔊' : '🔇'}
          </button>

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
                ref={el => {
                  if (i === 0) menuLinksRef.current = [];
                  menuLinksRef.current[i] = el;
                }}
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
              <div className="menu-overlay__status-mobile mobile-only">
                <StatusPulse />
              </div>
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
