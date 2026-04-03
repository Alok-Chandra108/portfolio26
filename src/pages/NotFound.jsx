import { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';
import './NotFound.css';

export default function NotFound() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const subRef = useRef(null);
  const btnRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set([textRef.current, subRef.current, btnRef.current], { 
        opacity: 0, 
        y: 40 
      });

      // 2. Entrance Animation
      const tl = gsap.timeline();
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.2
      })
      .to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.8')
      .to(btnRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.4');

      // 3. Floating Floating Animation for the 404 text
      gsap.to(textRef.current, {
        y: '+=20',
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });

      // 4. Subtle background movement
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to(backgroundRef.current, {
          x: xPos,
          y: yPos,
          duration: 1.5,
          ease: 'power2.out'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="not-found" ref={containerRef}>
      <div className="not-found__background" ref={backgroundRef}>
        <span className="not-found__bg-text">404</span>
        <span className="not-found__bg-text">404</span>
        <span className="not-found__bg-text">404</span>
      </div>

      <div className="container">
        <div className="not-found__content">
          <div className="not-found__header" ref={textRef}>
            <h1 className="not-found__title">404</h1>
            <div className="not-found__glitch-line"></div>
          </div>
          
          <div className="not-found__body" ref={subRef}>
            <h2 className="not-found__subtitle">Lost in the digital void?</h2>
            <p className="not-found__description">
              The page you're searching for has been moved or doesn't exist. 
              Let's get you back to the main realm.
            </p>
          </div>

          <div className="not-found__footer" ref={btnRef}>
            <AnimatedButton to="/">
              Return Home
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  );
}
