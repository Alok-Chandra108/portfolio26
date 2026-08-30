import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from '../../utils/gsapPlugins.js';
import { useAudio } from '../../context/AudioContext.jsx';
import './CommandPalette.css';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { isSoundEnabled, toggleSound, playHover, playClick } = useAudio();

  const commands = [
    { id: 'home', label: 'Go to Home', action: () => navigate('/') },
    { id: 'work', label: 'Go to Work', action: () => navigate('/work') },
    { id: 'experience', label: 'Go to Experience', action: () => navigate('/experience') },
    { id: 'about', label: 'Go to About', action: () => navigate('/about') },
    { id: 'reads', label: 'Go to My Reads', action: () => navigate('/reads') },
    { id: 'contact', label: 'Go to Contact', action: () => navigate('/contact') },
    { id: 'admin', label: 'Admin Dashboard', action: () => navigate('/admin') },
    { id: 'sound', label: `Toggle Sound (${isSoundEnabled ? 'On' : 'Off'})`, action: () => toggleSound() },
  ];

  const filteredCommands = commands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
      );
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (overlayRef.current) {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.2 });
    }
  }, [isOpen]);

  const executeCommand = (command) => {
    playClick();
    command.action();
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
      playHover();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
      playHover();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[activeIndex]) {
        executeCommand(filteredCommands[activeIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-overlay" ref={overlayRef} onClick={() => setIsOpen(false)}>
      <div className="cmd-modal" ref={modalRef} onClick={e => e.stopPropagation()}>
        <div className="cmd-header">
          <input
            ref={inputRef}
            className="cmd-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands or pages..."
          />
        </div>
        <div className="cmd-list" ref={listRef}>
          {filteredCommands.length === 0 ? (
            <div className="cmd-empty mono-label">No commands found.</div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <button
                key={cmd.id}
                className={`cmd-item ${idx === activeIndex ? 'cmd-item--active' : ''}`}
                onClick={() => executeCommand(cmd)}
                onMouseEnter={() => { setActiveIndex(idx); playHover(); }}
              >
                <span>{cmd.label}</span>
                {idx === activeIndex && <span className="cmd-shortcut mono-label">Enter ↵</span>}
              </button>
            ))
          )}
        </div>
        <div className="cmd-footer mono-label">
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}
