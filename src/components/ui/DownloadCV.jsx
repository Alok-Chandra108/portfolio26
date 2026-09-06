import { useRef, useEffect, useState } from 'react';
import { gsap } from '../../utils/gsapPlugins';
import { useAudio } from '../../context/AudioContext.jsx';
import { resumeService } from '../../firebase/resumeService';
import './DownloadCV.css';

export default function DownloadCV() {
  const buttonRef = useRef(null);
  const glowRef = useRef(null);
  const { playHover, playClick } = useAudio();
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    // Real-time synchronization with Firestore/Cloudinary
    const unsubscribe = resumeService.subscribeToResume((data) => {
      setResumeData(data);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    const glow = glowRef.current;
    if (!button || !glow) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Glow effect - move the glow element to the cursor position
      gsap.to(glow, {
        left: x,
        top: y,
        duration: 0.2,
        ease: 'power1.out',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
    };
  }, [resumeData?.resumeUrl]);

  // If no resume is uploaded, return empty (render nothing)
  if (!resumeData?.resumeUrl) {
    return null;
  }

  const downloadUrl = resumeService.getAttachmentUrl(resumeData.resumeUrl);
  const downloadFilename = resumeData.fileName || "Alok_Chandra_Resume.pdf";

  return (
    <div className="cv-button-container">
      <a 
        ref={buttonRef} 
        href={downloadUrl}
        download={downloadFilename}
        target="_blank"
        rel="noopener noreferrer"
        className="cv-button"
        onMouseEnter={() => playHover && playHover()}
        onClick={() => playClick && playClick()}
      >
        <div className="cv-button__bg-orbs">
          <div className="cv-orb cv-orb--1"></div>
          <div className="cv-orb cv-orb--2"></div>
          <div className="cv-orb cv-orb--3"></div>
        </div>
        <div ref={glowRef} className="cv-button__glow"></div>
        <span className="cv-button__text">Download CV</span>
        <span className="cv-button__icon">↓</span>
      </a>
    </div>
  );
}
