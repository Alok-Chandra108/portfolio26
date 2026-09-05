import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }) {
  // Sound effects enabled toggle (for hover/extra effects)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const lastClickTimeRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem('site-sound-enabled');
    if (saved === 'true') {
      setIsSoundEnabled(true);
    } else {
      setIsSoundEnabled(false);
    }
  }, []);

  const getOrCreateAudioContext = useCallback(() => {
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioCtx(ctx);
    return ctx;
  }, [audioCtx]);

  const toggleSound = () => {
    setIsSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('site-sound-enabled', String(next));
      if (next) {
        getOrCreateAudioContext();
      }
      return next;
    });
  };

  // Crisp, subtle click sound - plays on every click by default
  const playClick = useCallback(() => {
    const now = performance.now();
    // Prevent double-firing within 40ms
    if (now - lastClickTimeRef.current < 40) return;
    lastClickTimeRef.current = now;

    try {
      const ctx = getOrCreateAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.035);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (e) {}
  }, [getOrCreateAudioContext]);

  // Global click listener so click sound plays by default on every user click
  useEffect(() => {
    const handleGlobalPointerDown = () => {
      playClick();
    };
    window.addEventListener('pointerdown', handleGlobalPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleGlobalPointerDown);
    };
  }, [playClick]);

  // Hover sound - only plays when user enabled extra sounds
  const playHover = useCallback(() => {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.02);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.02);
    } catch (e) {}
  }, [isSoundEnabled, audioCtx]);

  return (
    <AudioContext.Provider value={{ isSoundEnabled, toggleSound, playHover, playClick }}>
      {children}
    </AudioContext.Provider>
  );
}
