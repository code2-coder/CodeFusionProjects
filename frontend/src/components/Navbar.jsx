import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Mail, Search, Sparkles, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import AdminDropdown from './AdminDropdown';
import AccountDropdown from './AccountDropdown';

const navItems = [
  { label: 'Home', href: '/#home' },
  {
    label: 'Solutions',
    href: '/solutions',
    dropdown: [
      { label: 'Web Development', href: '/solutions#solutions-grid' },
      { label: 'Mobile App Development', href: '/solutions#solutions-grid' },
      { label: 'Desktop App Development', href: '/solutions#solutions-grid' },
      { label: 'Cloud', href: '/solutions#solutions-grid' },
      { label: 'Cybersecurity', href: '/solutions#solutions-grid' },
      { label: 'Deployment', href: '/solutions#solutions-grid' },
      { label: 'Customized Software Development', href: '/solutions#solutions-grid' }
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
              className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl py-3 z-50"
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



const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

  const toggleMobileDropdown = (label) => {
    setMobileDropdownOpen(mobileDropdownOpen === label ? null : label);
  };

  useEffect(() => {
    if (!mobileMenuOpen) {
      const timer = setTimeout(() => setMobileDropdownOpen(null), 0);
      return () => clearTimeout(timer);
    }
  }, [mobileMenuOpen]);

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
              className="relative flex items-center gap-2 cursor-pointer group"
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
                <AdminDropdown user={user} handleLogout={handleLogout} />
              ) : (
                <AccountDropdown />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 text-white/70 rounded-full bg-white/[0.03] border border-transparent hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 shadow-inner focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {mobileMenuOpen ? <X size={20} className="text-blue-400" /> : <Menu size={20} />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -15, filter: 'blur(10px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    staggerChildren: 0.05,
                    delayChildren: 0.05
                  }
                },
                exit: {
                  opacity: 0,
                  y: -15,
                  filter: 'blur(10px)',
                  transition: {
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="lg:hidden absolute top-[calc(100%+1rem)] left-6 right-6 p-6 flex flex-col gap-1 shadow-[0_30px_60px_rgba(0,0,0,0.85)] overflow-hidden rounded-[2.25rem] bg-black/95 backdrop-blur-3xl border border-white/[0.08] z-40"
            >
              {/* Backlight Glows */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl z-0 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl z-0 pointer-events-none" />

              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
                  }}
                  className="relative z-10"
                >
                  {item.dropdown ? (
                    <div className="flex flex-col border-b border-white/[0.06] py-1">
                      <button
                        onClick={() => toggleMobileDropdown(item.label)}
                        className="flex items-center justify-between w-full text-white/95 font-bold py-3 hover:text-blue-400 transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronDown size={15} className={`transition-transform duration-300 ${mobileDropdownOpen === item.label ? 'rotate-180 text-blue-400' : 'text-white/40'}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileDropdownOpen === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col pl-4 pb-3 gap-2.5 bg-white/[0.01] rounded-2xl border border-white/[0.03] p-2 mt-1 mb-2">
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  to={subItem.href}
                                  className="text-white/60 hover:text-white transition-colors text-sm py-1.5 flex items-center gap-2 group"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 group-hover:bg-blue-400 transition-colors"></span>
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-white/90 font-bold py-3.5 border-b border-white/[0.06] hover:text-blue-400 transition-colors block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                }}
                className="flex flex-col gap-3 mt-6 sm:hidden relative z-10"
              >
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
                  <div className="p-5 rounded-3xl flex flex-col gap-3 mt-4 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="pb-3 border-b border-white/[0.08] relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-[0.15em] uppercase mb-2">
                        <Sparkles size={11} className="text-blue-400" />
                        <span>Client Portal</span>
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight">Welcome to CodeFusion</h4>
                      <p className="text-xs text-white/50 mt-0.5">Sign in to track projects & manage quotes</p>
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                      <Link 
                        to="/login?mode=login" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="py-3 px-4 font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl text-xs flex items-center justify-between shadow-[0_0_20px_rgba(79,70,229,0.35)]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                            <Mail size={13} className="text-white" />
                          </div>
                          <span>Continue with Email</span>
                        </div>
                        <ArrowRight size={14} />
                      </Link>

                      <Link 
                        to="/login?mode=signup" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="py-2.5 px-4 font-semibold bg-white/[0.04] border border-white/10 hover:border-white/20 text-white text-xs rounded-2xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <UserPlus size={13} className="text-purple-400" />
                          <span>Create Account</span>
                        </div>
                        <span className="text-[10px] text-purple-400 font-bold">Free</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 text-[10px] text-white/40">
                      <ShieldCheck size={12} className="text-emerald-400" />
                      <span>Passwordless OTP • 256-bit encrypted</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
