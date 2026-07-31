import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AiBuilderProvider } from './context/AiBuilderContext';

import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Contact from './components/Contact';

// Lazy load pages for performance (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const StartProject = lazy(() => import('./pages/StartProject'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Work = lazy(() => import('./pages/Work'));
const WorkDetail = lazy(() => import('./pages/WorkDetail'));
const Resources = lazy(() => import('./pages/Resources'));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const TemplateDetail = lazy(() => import('./pages/TemplateDetail'));
const BuilderDashboard = lazy(() => import('./pages/ai-builder/BuilderDashboard'));
const ProjectEditor = lazy(() => import('./pages/ai-builder/ProjectEditor'));
const ProjectPreview = lazy(() => import('./pages/ai-builder/ProjectPreview'));

// Simple loading fallback
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#000000] text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isBuilderRoute = location.pathname.startsWith('/builder');

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-300 relative selection:bg-white/20 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[120px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
        {!isBuilderRoute && <Navbar />}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<WorkDetail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<ResourceDetail />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:id" element={<TemplateDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/start-project" element={<StartProject />} />
            <Route path="/builder" element={<BuilderDashboard />} />
            <Route path="/builder/project/:projectId" element={<ProjectEditor />} />
            <Route path="/preview/:projectId" element={<ProjectPreview />} />
          </Routes>
        </Suspense>
      </div>

      {/* Floating WhatsApp Button */}
      {!isBuilderRoute && <WhatsAppButton />}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AiBuilderProvider>
          <Router>
            <AppContent />
          </Router>
        </AiBuilderProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
