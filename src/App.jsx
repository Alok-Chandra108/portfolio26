import { useEffect, useRef, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import AdminProjects from './pages/admin/AdminProjects.jsx';
import AdminExperience from './pages/admin/AdminExperience.jsx';
import AdminSkills from './pages/admin/AdminSkills.jsx';
import AdminReads from './pages/admin/AdminReads.jsx';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';


export const TransitionContext = createContext({});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
            <Route 
              path="/admin/projects" 
              element={
                <ProtectedRoute>
                  <AdminProjects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/experience" 
              element={
                <ProtectedRoute>
                  <AdminExperience />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/skills" 
              element={
                <ProtectedRoute>
                  <AdminSkills />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reads" 
              element={
                <ProtectedRoute>
                  <AdminReads />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
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
