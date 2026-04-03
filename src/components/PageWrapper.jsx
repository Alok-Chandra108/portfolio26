import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { ScrollTrigger } from '../utils/gsapPlugins.js';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
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

  const handleAnimationComplete = () => {
    // Crucial: Refresh ScrollTrigger once the page entrance is DONE
    // This ensures trigger depths are calculated against the Final layout
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onAnimationComplete={handleAnimationComplete}
      className="page-wrapper"
    >
      {children}
    </motion.div>
  );
}
