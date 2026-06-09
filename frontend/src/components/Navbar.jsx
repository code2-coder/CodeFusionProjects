import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  {
    label: 'Solutions',
    dropdown: [
      { label: 'All Services', href: '#services' },
      { label: 'AI Builder', href: '#ai-builder' },
      { label: 'Ready Templates', href: '#templates' },
      { label: 'Domain Availability', href: '#domain' }
    ]
  },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
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
        <div className={`glass-nav rounded-2xl px-6 py-2 flex items-center justify-between transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/5' : ''}`}>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer -my-8 z-10"
          >
            <img src="/ai_logo.png" alt="Code Fusion Logo" className="w-26 h-26 md:w-32 md:h-32 object-contain drop-shadow-md brightness-0 invert" />
          </motion.div>

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
                <>
                  <Link to="/login" className="text-sm font-bold text-foreground/80 hover:text-foreground transition-colors">Login</Link>
                  <Link to="/register" className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:scale-105 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
                    Get Started
                  </Link>
                </>
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
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 font-bold border border-[color:var(--border)] rounded-xl hover:bg-secondary transition-colors text-foreground text-center">Login</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="py-3 font-bold bg-foreground text-background rounded-xl hover:scale-[1.02] transition-transform shadow-md text-center">Get Started</Link>
                  </>
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
