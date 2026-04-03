import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from './PageWrapper.jsx';

// Import all pages
import Home from '../pages/Home.jsx';
import WorkPage from '../pages/WorkPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import AllReadsPage from '../pages/AllReadsPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import Login from '../pages/Login.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import AdminProjects from '../pages/admin/AdminProjects.jsx';
import AdminExperience from '../pages/admin/AdminExperience.jsx';
import AdminSkills from '../pages/admin/AdminSkills.jsx';
import AdminReads from '../pages/admin/AdminReads.jsx';
import AdminMessages from '../pages/admin/AdminMessages.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/work" element={<PageWrapper><WorkPage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/reads" element={<PageWrapper><AllReadsPage /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects" 
          element={
            <ProtectedRoute>
              <PageWrapper><AdminProjects /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/experience" 
          element={
            <ProtectedRoute>
              <PageWrapper><AdminExperience /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/skills" 
          element={
            <ProtectedRoute>
              <PageWrapper><AdminSkills /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reads" 
          element={
            <ProtectedRoute>
              <PageWrapper><AdminReads /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/messages" 
          element={
            <ProtectedRoute>
              <PageWrapper><AdminMessages /></PageWrapper>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}
