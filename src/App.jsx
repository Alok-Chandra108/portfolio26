import { useEffect, useState, createContext } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger } from './utils/gsapPlugins.js';

import Navbar from './components/Navbar.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Loader from './components/Loader.jsx';
import Footer from './components/Footer.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import AnimatedRoutes from './components/AnimatedRoutes.jsx';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary.jsx';


// List of known routes to check against
const VALID_ROUTES = [
  '/', 
  '/work', 
  '/about', 
  '/reads', 
  '/contact', 
  '/login', 
  '/admin', 
  '/admin/projects', 
  '/admin/experience', 
  '/admin/skills', 
  '/admin/reads', 
  '/admin/messages',
  '/admin/about',
  '/experience'
];

function AppContent() {
  const location = useLocation();
  const is404 = !VALID_ROUTES.includes(location.pathname);
  const [isLoading, setIsLoading] = useState(!is404);

  // Global ScrollTrigger Refresh & Layout Monitoring
  useEffect(() => {
    // 1. Static Listeners
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    // 2. Dynamic Layout Monitoring (ResizeObserver)
    // This catches internal layout shifts that window 'resize' misses
    let resizeTimeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150); // Debounce to prevent layout thrashing
    });

    const rootElement = document.getElementById('root');
    if (rootElement) observer.observe(rootElement);

    // 3. Initial refresh sequence
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.removeEventListener('load', handleLoad);
      observer.disconnect();
      clearTimeout(resizeTimeout);
      clearTimeout(timeout);
    };
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Refresh again after loader is gone and layout might have shifted
    setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  return (
    <>
        {isLoading && <Loader onComplete={handleLoadComplete} />}
        <CustomCursor />
        <ErrorBoundary>
          <SmoothScroll>
            <Navbar />
            <main>
              <AnimatedRoutes />
            </main>
            <Footer />
          </SmoothScroll>
        </ErrorBoundary>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
