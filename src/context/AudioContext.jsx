import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('site-sound-enabled');
    if (saved === 'true') {
      setIsSoundEnabled(true);
    }
  }, []);

  const toggleSound = () => {
    setIsSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('site-sound-enabled', String(next));
      
      // Initialize audio context on first user interaction if enabled
      if (next && !audioCtx) {
        initAudio();
      }
      return next;
    });
  };

  const initAudio = () => {
    if (!audioCtx) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioCtx(ctx);
    }
  };

  // Very lightweight synthesized hover tick
  const playHover = useCallback(() => {
    if (!isSoundEnabled || !audioCtx) return;
    
    // Resume context if suspended (browser policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }, [isSoundEnabled, audioCtx]);

  // Very lightweight synthesized click pop
  const playClick = useCallback(() => {
    if (!isSoundEnabled || !audioCtx) return;
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }, [isSoundEnabled, audioCtx]);

  return (
    <AudioContext.Provider value={{ isSoundEnabled, toggleSound, playHover, playClick }}>
      {children}
    </AudioContext.Provider>
  );
}
