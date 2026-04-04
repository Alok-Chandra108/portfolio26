import { useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ScrollTrigger } from '../utils/gsapPlugins.js';

/* ─────────────────────────────────────────────────────────────────
   VENETIAN BLIND PAGE TRANSITION (V3 — 'GREEN PARDA')
   Kinetic sequence: "Slam-Down" on Exit → "Peel-Up" on Entrance.
   Colors: Charcoal → Near-Black → Acid-Green (The Hero).
   Staggered delays and Z-index ensure 'Acid-Green' is the parda.
───────────────────────────────────────────────────────────────── */

const EASE = [0.76, 0, 0.24, 1];

const panels = [
  { color: '#b8ff00', z: 10005, exitDelay: 0.12, revealDelay: 0.18 }, // Brand Green (The Hero - Top)
  { color: '#1a1a18', z: 10004, exitDelay: 0.06, revealDelay: 0.08 }, // Charcoal (Middle)
  { color: '#0f0f0f', z: 10003, exitDelay: 0,    revealDelay: 0    }, // Black (Bottom)
];

const panelVariants = (panel) => ({
  initial: { clipPath: 'inset(0 0 0% 0)' },   // Starts FULLY covered (Entrance state)
  animate: {
    clipPath: 'inset(0 0 100% 0)',             // Peel UP to reveal new page
    transition: {
      duration: 0.75, // Slower reveal for the parda effect
      delay: panel.revealDelay,
      ease: EASE
    },
  },
  exit: {
    clipPath: 'inset(0 0 0% 0)',               // Slam DOWN from TOP to cover old page
    transition: {
      duration: 0.55,
      delay: panel.exitDelay,
      ease: EASE
    },
  },
});

const contentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.45,
      delay: 0.8, // Fade in once the green parda starts moving
      ease: 'linear'
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'linear'
    },
  },
};

export default function PageWrapper({ children }) {
  const lenis = useLenis();

  // Scroll to top on navigation — Lenis driven, layout effect to avoid visual pops
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [lenis]);

  // Refresh GSAP ScrollTrigger after the entrance transition finishes
  const handleTransitionComplete = (definition) => {
    if (definition === 'animate') {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-wrapper"
      onAnimationComplete={handleTransitionComplete}
    >
      {/* 🔹 Core Content — Fades in as the green parda peels 🔹 */}
      <motion.div variants={contentVariants}>
        {children}
      </motion.div>

      {/* 🔹 Venetian Blind Panels — Orchestrated Overlay 🔹 */}
      {panels.map((panel, i) => (
        <motion.div
          key={i}
          className="page-transition-panel"
          variants={panelVariants(panel)}
          style={{
            background: panel.color,
            zIndex: panel.z,
          }}
        />
      ))}
    </motion.div>
  );
}
