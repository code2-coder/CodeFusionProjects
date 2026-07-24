import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Mail, Search } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import AdminDropdown from './AdminDropdown';

const navItems = [
  { label: 'Home', href: '/#home' },
  {
    label: 'Solutions',
    href: '/solutions',
    dropdown: [
      { label: 'Website Development', href: '/solutions#solutions-grid' },
      { label: 'eCommerce Development', href: '/solutions#solutions-grid' },
      { label: 'Web Application Development', href: '/solutions#solutions-grid' },
      { label: 'Mobile App Development', href: '/solutions#solutions-grid' },
      { label: 'UI/UX Design', href: '/solutions#solutions-grid' },
      { label: 'Website Redesign', href: '/solutions#solutions-grid' },
      { label: 'Website Maintenance', href: '/solutions#solutions-grid' },
      { label: 'Cloud & DevOps', href: '/solutions#solutions-grid' },
      { label: 'AI Solutions', href: '/solutions#solutions-grid' },
      { label: 'SEO & Performance Optimization', href: '/solutions#solutions-grid' }
    ]
  },
  {
    label: 'Work',
    dropdown: [
      { label: 'By Industry', isHeader: true },
      { label: 'Healthcare & Dental', href: '/#industry-healthcare' },
      { label: 'Hotels & Hospitality', href: '/#industry-hotels' },
      { label: 'Restaurants & Cafes', href: '/#industry-restaurants' },
      { label: 'Real Estate', href: '/#industry-real-estate' },
      { label: 'Construction', href: '/#industry-construction' },
      { label: 'Education', href: '/#industry-education' },
      { label: 'Beauty & Salon', href: '/#industry-beauty' },
      { label: 'Travel & Tourism', href: '/#industry-travel' },
      { label: 'Finance', href: '/#industry-finance' },
      { label: 'Startups', href: '/#industry-startups' },
      { label: 'By Project Type', isHeader: true },
      { label: 'Business Websites', href: '/#project-business' },
      { label: 'Landing Pages', href: '/#project-landing' },
      { label: 'eCommerce Stores', href: '/#project-ecommerce' },
      { label: 'Web Applications', href: '/#project-web-apps' },
      { label: 'Mobile Apps', href: '/#project-mobile' },
      { label: 'Admin Dashboards', href: '/#project-admin' },
      { label: 'SaaS Platforms', href: '/#project-saas' }
    ]
  },
  { label: 'Templates', href: '/#templates' },
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
        <motion.a
          href={item.href || '#'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-1 text-sm font-semibold text-[color:var(--foreground)] opacity-80 hover:opacity-100 transition-colors relative group-hover:text-blue-400"
        >
          {item.label}
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:w-full"></span>
        </motion.a>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-2 z-50 max-h-[70vh] overflow-y-auto"
            >
              {item.dropdown.map((subItem, i) => (
                subItem.isHeader ? (
                  <div key={i} className="block px-5 py-2 text-xs font-bold text-white/50 uppercase tracking-widest mt-1 mb-1">
                    {subItem.label}
                  </div>
                ) : (
                  <a
                    key={i}
                    href={subItem.href}
                    className="block px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {subItem.label}
                  </a>
                )
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
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-foreground/70 hover:text-foreground rounded-full hover:bg-secondary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <AdminDropdown user={user} handleLogout={handleLogout} />
                  ) : (
                    <button onClick={handleLogout} className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:scale-105 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
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
                      <a href={item.href || '#'} className="text-[color:var(--foreground)] font-bold py-2 border-b border-[color:var(--border)] opacity-50 hover:opacity-100 transition-colors uppercase text-xs tracking-wider block" onClick={() => setMobileMenuOpen(false)}>
                        {item.label}
                      </a>
                      <div className="flex flex-col pl-4 gap-2">
                        {item.dropdown.map((subItem) => (
                          subItem.isHeader ? (
                            <div key={subItem.label} className="text-foreground/50 font-bold py-1 text-xs uppercase tracking-wider mt-2">
                              {subItem.label}
                            </div>
                          ) : (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              className="text-foreground/80 font-semibold py-2 hover:text-foreground transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </a>
                          )
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
