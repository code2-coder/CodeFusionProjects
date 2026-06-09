import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import WhatsAppButton from './components/WhatsAppButton';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-300 relative selection:bg-white/20 selection:text-white">
          {/* Background Effects */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-blob" />
            <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[120px] animate-blob animation-delay-4000" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>

          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>

          {/* Floating WhatsApp Button */}
          <WhatsAppButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
