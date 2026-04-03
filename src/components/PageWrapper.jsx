import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.4,
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
