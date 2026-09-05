import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../utils/gsapPlugins.js';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';
import Toast from '../components/ui/Toast.jsx';
import { messagesService } from '../firebase/messagesService';
import React, { Suspense, lazy } from 'react';
import './ContactPage.css';

const GlobeScene = lazy(() => import('../components/ui/Globe/GlobeScene.jsx'));

const MAX_MESSAGE_LENGTH = 1000;

export default function ContactPage() {
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const successRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', message: ''
  });
  const [touched, setTouched] = useState({
    name: false, email: false, message: false
  });
  const [errors, setErrors] = useState({
    name: '', email: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useGSAP(() => {
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
      gsap.from(successRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });
    }
  }, { dependencies: [isSuccess] });

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Name is required';
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
    } else if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value.trim())) error = 'Please enter a valid email address';
    } else if (name === 'message') {
      if (!value.trim()) error = 'Message is required';
      else if (value.trim().length < 10) error = 'Message should be at least 10 characters';
      else if (value.length > MAX_MESSAGE_LENGTH) error = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`;
    }
    return error;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateAll = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message)
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      setToast({ message: 'Please fix the errors in the form before submitting.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await messagesService.sendMessage(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
      setErrors({ name: '', email: '', message: '' });
      setToast({ message: 'Message sent successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to send message. Please check your network connection.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="contact-page contact-page--success">
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
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
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      <div className="container">
        <div className="contact-page__header" ref={headingRef}>
          <h1 className="heading-hero">LET'S TALK</h1>
          <p className="body-text contact-page__intro">
            Have a project in mind? Let's create something extraordinary together.
          </p>
        </div>

        <div className="contact-page__grid">
          <div ref={formRef}>
            <form className="contact-page__form" onSubmit={handleSubmit} noValidate>
              
              {/* Name Field */}
              <div className={`contact-page__field ${touched.name && errors.name ? 'contact-page__field--error' : ''} ${touched.name && !errors.name ? 'contact-page__field--valid' : ''}`}>
                <div className="contact-page__label-row">
                  <label className="sub-label">Your name</label>
                  {touched.name && !errors.name && <span className="field-valid-badge">✓ Valid</span>}
                </div>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="John Doe"
                />
                {touched.name && errors.name && (
                  <span className="contact-page__field-error">{errors.name}</span>
                )}
              </div>

              {/* Email Field */}
              <div className={`contact-page__field ${touched.email && errors.email ? 'contact-page__field--error' : ''} ${touched.email && !errors.email ? 'contact-page__field--valid' : ''}`}>
                <div className="contact-page__label-row">
                  <label className="sub-label">Your email</label>
                  {touched.email && !errors.email && <span className="field-valid-badge">✓ Valid</span>}
                </div>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="john@example.com"
                />
                {touched.email && errors.email && (
                  <span className="contact-page__field-error">{errors.email}</span>
                )}
              </div>

              {/* Message Field */}
              <div className={`contact-page__field ${touched.message && errors.message ? 'contact-page__field--error' : ''} ${touched.message && !errors.message ? 'contact-page__field--valid' : ''}`}>
                <div className="contact-page__label-row">
                  <label className="sub-label">Your message</label>
                  <span className="contact-page__char-counter mono-label">
                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  required
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={e => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  placeholder="Tell me about your project..."
                  rows={6}
                />
                {touched.message && errors.message && (
                  <span className="contact-page__field-error">{errors.message}</span>
                )}
              </div>

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

            <div className="contact-page__globe-wrapper" style={{ height: '400px', width: '100%', marginTop: '40px', borderRadius: '24px', overflow: 'hidden', background: '#050505', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
              <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '50px' }}>Loading Globe...</div>}>
                <GlobeScene />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
