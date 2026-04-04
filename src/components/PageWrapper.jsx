import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { ScrollTrigger } from '../utils/gsapPlugins.js';

const pageVariants = {
  initial: { 
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.33, 1, 0.68, 1],
      delay: 0.3 // Delay content reveal until sweep is halfway
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.4, 
      ease: [0.33, 1, 0.68, 1] 
    } 
  }
};

const overlayVariants = {
  initial: {
    clipPath: 'inset(0% 0 0% 0)', // Full cover
  },
  animate: {
    clipPath: 'inset(0% 0 100% 0)', // Swipe UP to reveal (bottom to top)
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.1,
    },
  },
  exit: {
    clipPath: 'inset(0% 0 0% 0)', // Swipe UP to cover (bottom to top)
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export default function PageWrapper({ children }) {
  const lenis = useLenis();

  useEffect(() => {
    // Immediate scroll reset when component mounts
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
    >
      <motion.div variants={pageVariants}>
        {children}
      </motion.div>
      <motion.div
        className="page-transition-overlay"
        variants={overlayVariants}
        onAnimationComplete={handleAnimationComplete}
        style={{
          transform: 'none',
          pointerEvents: 'auto', // Block clicks during transition
          zIndex: 10001
        }}
      />
    </motion.div>
  );
}
