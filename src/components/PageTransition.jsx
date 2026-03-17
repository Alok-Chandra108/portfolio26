import { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../utils/gsapPlugins.js';
import { TransitionContext } from '../App.jsx';

export default function PageTransition() {
  const overlayRef = useRef(null);
  const { setTransitioning } = useContext(TransitionContext);
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    const overlay = overlayRef.current;
    if (!overlay) return;

    setTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => setTransitioning(false)
    });

    tl.set(overlay, { transformOrigin: 'bottom', scaleY: 0 })
      .to(overlay, {
        scaleY: 1,
        duration: 0.6,
        ease: 'power4.inOut',
      })
      .set(overlay, { transformOrigin: 'top' })
      .to(overlay, {
        scaleY: 0,
        duration: 0.5,
        ease: 'power4.inOut',
        delay: 0.1,
      });
  }, [location.pathname, setTransitioning]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--color-accent)',
        zIndex: 10000,
        transform: 'scaleY(0)',
        pointerEvents: 'none',
      }}
    />
  );
}
