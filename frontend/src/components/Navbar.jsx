import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Mail } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Templates', href: '/#templates' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Contact', href: '/#contact' }
];

const DesktopNavItem = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.dropdown) {
    return (
      <div
        className="relative group py-2"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-1 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors hover:text-gradient relative"
        >
          {item.label}
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full"></span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-2 z-50"
            >
              {item.dropdown.map((subItem, i) => (
                <a
                  key={i}
                  href={subItem.href}
                  className="block px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {subItem.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.a
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      href={item.href}
      className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors hover:text-gradient relative group py-2"
    >
      {item.label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full"></span>
    </motion.a>
  );
};

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="relative p-2.5 rounded-full bg-secondary/50 border border-[color:var(--border)] hover:bg-secondary hover:border-blue-500/50 transition-all duration-300 text-foreground group focus:outline-none overflow-hidden" 
        aria-label="Account"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <User size={20} className={`relative z-10 transition-colors duration-300 ${isOpen ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
      </button>

      {/* Invisible bridge to prevent closing when hovering between button and dropdown */}
      <div className="absolute top-full right-0 w-full h-4"></div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(5px)' }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full right-0 mt-3 w-64 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-2"
          >
            <div className="px-4 py-3 mb-2 border-b border-white/5">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-0.5">Welcome</p>
              <p className="text-sm font-semibold text-white/90">Sign in to your account</p>
            </div>

            <div className="flex flex-col gap-1">
              <Link
                to="/login"
                className="group relative flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/80 rounded-2xl hover:text-white transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-inner border border-white/5">
                  <Mail size={14} className="text-blue-400" />
                </div>
                <span className="relative z-10">Continue with Email</span>
              </Link>
              
              <button
                onClick={() => alert("Google Login coming soon!")}
                className="group relative w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/80 rounded-2xl hover:text-white transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-inner border border-white/5">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <span className="relative z-10">Continue with Google</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass-nav border-2 border-white rounded-2xl px-6 py-2 flex items-center justify-between transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/5' : ''}`}>

          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer -my-8 z-10"
            >
              <img src="/ai_logo.png" alt="Code Fusion Logo" className="w-26 h-26 md:w-32 md:h-32 object-contain drop-shadow-md brightness-0 invert" />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navItems.map((item, index) => (
                <DesktopNavItem key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:scale-105 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
                    Logout
                  </button>
                </>
              ) : (
                <AccountDropdown />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-foreground rounded-full hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="lg:hidden absolute top-full left-6 right-6 mt-4 glass-card p-6 flex flex-col gap-2 shadow-2xl overflow-hidden"
            >
              {navItems.map((item) => (
                <React.Fragment key={item.label}>
                  {item.dropdown ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-foreground font-bold py-2 border-b border-[color:var(--border)] opacity-50 uppercase text-xs tracking-wider">
                        {item.label}
                      </div>
                      <div className="flex flex-col pl-4 gap-2">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            className="text-foreground/80 font-semibold py-2 hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="text-foreground/80 font-semibold py-2 border-b border-[color:var(--border)] hover:text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </React.Fragment>
              ))}
              <div className="flex flex-col gap-3 mt-5 sm:hidden">
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-3 font-bold border border-purple-500/50 text-purple-400 rounded-xl hover:bg-purple-500/10 transition-colors text-center">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="py-3 font-bold bg-foreground text-background rounded-xl hover:scale-[1.02] transition-transform shadow-md">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="glass-card p-2 rounded-2xl flex flex-col gap-2 mt-4 bg-secondary/30">
                    <div className="px-3 py-2 border-b border-[color:var(--border)] mb-1">
                      <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">Welcome</p>
                      <p className="text-sm font-semibold text-foreground/90">Sign in to continue</p>
                    </div>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 font-semibold border border-[color:var(--border)] bg-background/50 rounded-xl hover:bg-secondary transition-colors text-foreground text-sm flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-[color:var(--border)] group-hover:border-blue-500/50 transition-colors">
                          <Mail size={14} className="text-blue-400" />
                        </div>
                        <span>Continue with Email</span>
                      </div>
                    </Link>
                    <button onClick={() => { alert("Google Login coming soon!"); setMobileMenuOpen(false); }} className="py-3 px-4 font-semibold bg-white/5 border border-[color:var(--border)] rounded-xl hover:bg-white/10 transition-all text-foreground text-sm flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5 group-hover:bg-white/20 transition-colors">
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </div>
                        <span>Continue with Google</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
