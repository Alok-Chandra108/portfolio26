import { useEffect, useState, createContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { gsap, ScrollTrigger } from './utils/gsapPlugins.js';

import Navbar from './components/Navbar.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Loader from './components/Loader.jsx';
import Footer from './components/Footer.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import AnimatedRoutes from './components/AnimatedRoutes.jsx';
import { AuthProvider } from './context/AuthContext';


export const TransitionContext = createContext({});

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  // Global ScrollTrigger Refresh
  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    const handleResize = () => {
      ScrollTrigger.refresh(true);
    };

    window.addEventListener('load', handleLoad);
    window.addEventListener('resize', handleResize);

    // Initial refresh after a small delay to ensure React has painted
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Refresh again after loader is gone and layout might have shifted
    setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  return (
    <TransitionContext.Provider value={{ transitioning, setTransitioning }}>
        {isLoading && <Loader onComplete={handleLoadComplete} />}
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </SmoothScroll>
    </TransitionContext.Provider>
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
