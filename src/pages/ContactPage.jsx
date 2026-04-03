import { useEffect, useRef, useState } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';
import { messagesService } from '../firebase/messagesService';
import './ContactPage.css';

export default function ContactPage() {
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const successRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!isSuccess) {
        gsap.from(headingRef.current, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          delay: 0.3,
        });
        gsap.from(formRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.6,
        });
      } else {
        gsap.from(successRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        });
      }
    });
    return () => ctx.revert();
  }, [isSuccess]);

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email is invalid";
    if (!formData.message.trim()) return "Message is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await messagesService.sendMessage(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="contact-page contact-page--success">
        <div className="container">
          <div className="contact-success" ref={successRef}>
            <div className="success-icon">✓</div>
            <h1 className="heading-hero">THANK YOU</h1>
            <p className="body-text">
              Your message has been received. I'll get back to you shortly!
            </p>
            <div style={{ marginTop: '40px' }}>
              <AnimatedButton onClick={() => setIsSuccess(false)}>send another</AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-page__header" ref={headingRef}>
          <h1 className="heading-hero">LET'S TALK</h1>
          <p className="body-text contact-page__intro">
            Have a project in mind? Let's create something extraordinary together.
          </p>
        </div>

        <div className="contact-page__grid">
          <div ref={formRef}>
            <form className="contact-page__form" onSubmit={handleSubmit}>
              <div className="contact-page__field">
                <label className="sub-label">Your name</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="contact-page__field">
                <label className="sub-label">Your email</label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div className="contact-page__field">
                <label className="sub-label">Your message</label>
                <textarea
                  required
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell me about your project..."
                  rows={6}
                />
              </div>
              
              {error && <p className="contact-page__error">{error}</p>}
              
              <div className="contact-page__submit">
                <AnimatedButton 
                  variant="lime" 
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'sending...' : 'send message'}
                </AnimatedButton>
              </div>
            </form>
          </div>

          <div className="contact-page__info">
            <div className="contact-page__info-block">
              <h4 className="sub-label">(Email)</h4>
              <a href="mailto:alokchandra2611@gmail.com" className="contact-page__info-link link-hover">
                alokchandra2611@gmail.com
              </a>
            </div>
            <div className="contact-page__info-block">
              <h4 className="sub-label">(Social)</h4>
              <a href="https://www.linkedin.com/in/alok-chandra108/" target="_blank" rel="noopener noreferrer" className="contact-page__info-link link-hover">LinkedIn</a>
              <a href="https://github.com/Alok-Chandra108/" target="_blank" rel="noopener noreferrer" className="contact-page__info-link link-hover">GitHub</a>
            </div>
            <div className="contact-page__info-block">
              <h4 className="sub-label">(Location)</h4>
              <p className="contact-page__info-link">India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
