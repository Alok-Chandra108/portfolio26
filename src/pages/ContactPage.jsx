import { useEffect, useRef, useState } from 'react';
import { gsap } from '../utils/gsapPlugins.js';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';
import './ContactPage.css';

export default function ContactPage() {
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '', email: '', message: ''
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-page__header" ref={headingRef}>
          <h1 className="heading-hero">LET'S TALK</h1>
          <p className="body-text contact-page__intro">
            Have a project in mind? Let's create something extraordinary together.
          </p>
        </div>

        <div className="contact-page__grid" ref={formRef}>
          <form className="contact-page__form" onSubmit={handleSubmit}>
            <div className="contact-page__field">
              <label className="sub-label">Your name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div className="contact-page__field">
              <label className="sub-label">Your email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
            <div className="contact-page__field">
              <label className="sub-label">Your message</label>
              <textarea
                value={formData.message}
                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell me about your project..."
                rows={6}
              />
            </div>
            <AnimatedButton variant="lime" onClick={handleSubmit}>send message</AnimatedButton>
          </form>

          <div className="contact-page__info">
            <div className="contact-page__info-block">
              <h4 className="sub-label">(Email)</h4>
              <a href="mailto:hello@portfolio.dev" className="contact-page__info-link link-hover">
                hello@portfolio.dev
              </a>
            </div>
            <div className="contact-page__info-block">
              <h4 className="sub-label">(Social)</h4>
              <a href="#" className="contact-page__info-link link-hover">LinkedIn</a>
              <a href="#" className="contact-page__info-link link-hover">GitHub</a>
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
