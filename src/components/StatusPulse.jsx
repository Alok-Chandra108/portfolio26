import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { subscribeToStatus } from '../firebase/statusService';
import './StatusPulse.css';

export default function StatusPulse() {
  const [status, setStatus] = useState(null);
  const controls = useAnimationControls();

  useEffect(() => {
    const unsubscribe = subscribeToStatus((data) => {
      setStatus(data);
    });
    return () => unsubscribe();
  }, []);

  // Start infinite pulse animation
  useEffect(() => {
    controls.start({
      scale: [1, 2.2],
      opacity: [0.6, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut',
      },
    });

    return () => controls.stop();
  }, [controls]);

  if (!status) return null;

  const isOpen = status.state === 'open';
  const statusText = isOpen ? 'Open for work' : 'Busy with project';
  const pulseColor = isOpen ? '#10b981' : '#ef4444';

  return (
    <div className="status-pulse">
      <div className="status-pulse__dot-wrapper">
        <div
          className="status-pulse__dot"
          style={{ backgroundColor: pulseColor }}
        />
        <motion.div
          className="status-pulse__ring"
          animate={controls}
          style={{ backgroundColor: pulseColor }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={status.state}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 5 }}
          className="status-pulse__label mono-label"
        >
          {statusText}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
