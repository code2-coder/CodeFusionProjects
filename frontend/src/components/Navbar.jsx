import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Mail, Search, Sparkles } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import AdminDropdown from './AdminDropdown';

const navItems = [
  { label: 'Home', href: '/#home' },
  {
    label: 'Solutions',
    href: '/solutions',
    dropdown: [
      { label: 'Enterprise Web Architecture', href: '/solutions#solutions-grid' },
      { label: 'High-Performance eCommerce', href: '/solutions#solutions-grid' },
      { label: 'Scalable Web Applications', href: '/solutions#solutions-grid' },
      { label: 'Native & Cross-Platform Mobile', href: '/solutions#solutions-grid' },
      { label: 'Luxury UI/UX Design', href: '/solutions#solutions-grid' },
      { label: 'Cloud Infrastructure & DevOps', href: '/solutions#solutions-grid' },
      { label: 'Applied AI & Automation', href: '/solutions#solutions-grid' },
      { label: 'Technical SEO & Performance', href: '/solutions#solutions-grid' }
    ]
  },
  { label: 'Work', href: '/work' },
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/#about' },
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            to={item.href || '#'}
            className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors relative group-hover:text-blue-400"
          >
            {item.label}
            <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
        </motion.div>

        {/* Invisible bridge to prevent dropdown closing when moving mouse */}
        <div className="absolute top-full left-0 w-full h-4"></div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl py-3 z-50"
            >
              <div className="px-5 py-2 mb-1">
                <span className="text-[10px] font-medium text-white/40 tracking-wider uppercase">Core Capabilities</span>
              </div>
              
              <div className="flex flex-col">
                {item.dropdown.map((subItem, i) => (
                  <Link
                    key={i}
                    to={subItem.href}
                    className="px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 block"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group py-2"
    >
      <Link
        to={item.href}
        className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
      >
        {item.label}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
      </Link>
    </motion.div>
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
        className="relative p-2.5 rounded-full bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-blue-500/50 transition-all duration-300 text-white group focus:outline-none overflow-hidden shadow-inner" 
        aria-label="Account"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <User size={18} className={`relative z-10 transition-colors duration-300 ${isOpen ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
      </button>

      {/* Invisible bridge */}
      <div className="absolute top-full right-0 w-full h-4"></div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(5px)' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full right-0 mt-3 w-64 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-3"
          >
            <div className="px-4 py-4 mb-2 border-b border-white/5 relative overflow-hidden rounded-xl bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Welcome</p>
              <p className="text-sm font-semibold text-white">Sign in to your account</p>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <Link
                to="/login"
                className="group relative flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/70 rounded-2xl hover:text-white transition-all overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-inner border border-white/10">
                  <Mail size={14} className="text-blue-400" />
                </div>
                <span className="relative z-10">Continue with Email</span>
              </Link>
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
  const [searchOpen, setSearchOpen] = useState(false);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative px-6 py-3 flex items-center justify-between rounded-[2rem] transition-all duration-500 ${scrolled ? 'bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'bg-white/[0.02] backdrop-blur-xl border border-white/5'}`}>
          
          {/* subtle interior glare */}
          {scrolled && <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none"></div>}

          {/* Logo */}
          <Link to="/" className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center -my-6">
                <img src="/ai_logo.png" alt="Code Fusion Logo" className="w-20 h-20 md:w-24 md:h-24 object-contain brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-500" />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
              {navItems.map((item, index) => (
                <DesktopNavItem key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-white/70 hover:text-white rounded-full bg-white/[0.03] border border-transparent hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 shadow-inner group"
              aria-label="Search"
            >
              <Search size={18} className="group-hover:text-blue-400 transition-colors" />
            </button>

            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <AdminDropdown user={user} handleLogout={handleLogout} />
                  ) : (
                    <button onClick={handleLogout} className="px-6 py-2.5 rounded-full bg-white/10 text-white border border-white/20 font-bold text-sm hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      Logout
                    </button>
                  )}
                </>
              ) : (
                <AccountDropdown />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 text-white/70 rounded-full bg-white/[0.03] border border-transparent hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 shadow-inner"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, height: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, height: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden absolute top-[calc(100%+1rem)] left-6 right-6 p-6 flex flex-col gap-2 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden rounded-[2rem] bg-black/90 backdrop-blur-3xl border border-white/10 z-40"
            >
              {navItems.map((item) => (
                <React.Fragment key={item.label}>
                  {item.dropdown ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-white/40 font-bold py-2 border-b border-white/10 uppercase text-[10px] tracking-[0.2em] block">
                        {item.label}
                      </div>
                      <div className="flex flex-col pl-4 gap-2 mb-2">
                        {item.dropdown.map((subItem) => (
                          subItem.isHeader ? (
                            <div key={subItem.label} className="text-blue-400 font-bold py-1 text-[10px] uppercase tracking-[0.2em] mt-3">
                              {subItem.label}
                            </div>
                          ) : (
                            <Link
                              key={subItem.label}
                              to={subItem.href}
                              className="text-white/70 font-semibold py-2 hover:text-white transition-colors text-sm"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-white/90 font-bold py-3 border-b border-white/10 hover:text-blue-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
              
              <div className="flex flex-col gap-3 mt-6 sm:hidden">
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-3 font-bold border border-purple-500/50 text-purple-400 rounded-xl hover:bg-purple-500/10 transition-colors text-center text-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="py-3 font-bold bg-white text-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg text-sm">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="p-4 rounded-2xl flex flex-col gap-3 mt-4 bg-white/[0.03] border border-white/5 shadow-inner">
                    <div className="pb-3 border-b border-white/10">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Welcome</p>
                      <p className="text-sm font-semibold text-white">Sign in to continue</p>
                    </div>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 font-semibold border border-white/10 bg-black/50 rounded-xl hover:bg-white/[0.05] hover:border-white/20 transition-all text-white text-sm flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                          <Mail size={14} className="text-blue-400" />
                        </div>
                        <span>Continue with Email</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
