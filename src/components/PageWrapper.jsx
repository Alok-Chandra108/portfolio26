import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ScrollTrigger } from '../utils/gsapPlugins.js';

/* ─────────────────────────────────────────────────────────────────
   VENETIAN BLIND PAGE TRANSITION
   3 horizontal panels sweep down to cover the screen on exit
   then peel back upward to reveal the new page on enter.
   Colors: charcoal → acid-green → near-black — brand signature.
───────────────────────────────────────────────────────────────── */

const EASE = [0.76, 0, 0.24, 1];

// Panel cover = slide IN from top (clipPath top→bottom)
// Panel peel  = slide AWAY to top (clipPath bottom→top)
function buildPanelVariants(delay) {
  return {
    initial: { clipPath: 'inset(0 0 100% 0)' },  // Hidden below
    animate: {
      clipPath: 'inset(0 0 100% 0)',              // Still hidden (no cover on entry start)
    },
    exit: {
      clipPath: 'inset(0 0 0% 0)',               // Slam DOWN to cover on exit
      transition: { duration: 0.55, delay, ease: EASE },
    },
  };
}

// Reverse panels: start from covering the screen, then peel away upward
function buildRevealPanelVariants(delay) {
  return {
    initial: { clipPath: 'inset(0 0 0% 0)' },   // Starts fully covering screen
    animate: {
      clipPath: 'inset(0 0 100% 0)',             // Peels upward (reveals new page)
      transition: { duration: 0.65, delay, ease: EASE },
    },
    exit: { clipPath: 'inset(0 0 100% 0)' },    // Already hidden on exit
  };
}

const panels = [
  { color: '#1a1a18', coverDelay: 0,    revealDelay: 0.14 },  // Charcoal
  { color: '#b8ff00', coverDelay: 0.08, revealDelay: 0.07 },  // Brand green
  { color: '#0f0f0f', coverDelay: 0.16, revealDelay: 0 },     // Near-black (last cover, first reveal)
];

// Content fades in once the last panel (near-black) finishes peeling
const contentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.45, delay: 0.9, ease: 'linear' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'linear' },
  },
};

export default function PageWrapper({ children }) {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [lenis]);

  const handleAnimationComplete = (definition) => {
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
      onAnimationComplete={handleAnimationComplete}
    >
      {/* Page Content — fades in after panels reveal */}
      <motion.div variants={contentVariants}>
        {children}
      </motion.div>

      {/* Venetian Blind Panels */}
      {panels.map((panel, i) => (
        <motion.div
          key={i}
          className="page-transition-panel"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={buildRevealPanelVariants(panel.revealDelay)}
          style={{
            background: panel.color,
            zIndex: 10003 - i,
          }}
        />
      ))}
    </motion.div>
  );
}
