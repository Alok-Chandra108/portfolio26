import { useEffect, useRef, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './utils/gsapPlugins.js';

import Navbar from './components/Navbar.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Loader from './components/Loader.jsx';
import PageTransition from './components/PageTransition.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import WorkPage from './pages/WorkPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AllReadsPage from './pages/AllReadsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';


export const TransitionContext = createContext({});
export const LenisContext = createContext(null);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('hasVisited');
  });
  const [transitioning, setTransitioning] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Pause scroll while loading
  useEffect(() => {
    if (lenisRef.current) {
      if (isLoading) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [isLoading]);

  const handleLoadComplete = () => {
    sessionStorage.setItem('hasVisited', 'true');
    setIsLoading(false);
  };

  return (
    <LenisContext.Provider value={lenisRef}>
      <TransitionContext.Provider value={{ transitioning, setTransitioning }}>
        {isLoading && <Loader onComplete={handleLoadComplete} />}
        <CustomCursor />
        <Navbar />
        <PageTransition />
        <ScrollToTop />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reads" element={<AllReadsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </TransitionContext.Provider>
    </LenisContext.Provider>
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
