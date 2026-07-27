import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, LayoutDashboard, LogOut, X, Sparkles, ChevronRight
} from 'lucide-react';

const MenuItem = ({ icon: Icon, label, href = "#", onClick, onSelect, active }) => (
  <Link 
    to={href} 
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
      if (href !== "#" && onSelect) onSelect();
    }}
    className={`group relative flex items-center justify-between px-4 py-3 mx-2 my-1 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden ${
      active 
        ? 'text-white bg-white/10 shadow-inner' 
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    
    <div className="flex items-center gap-3 relative z-10">
      <div className={`p-1.5 rounded-lg transition-colors duration-300 ${active ? 'bg-white/10 text-purple-400' : 'bg-transparent text-white/50 group-hover:text-purple-400 group-hover:bg-white/10'}`}>
        <Icon size={16} />
      </div>
      <span className="tracking-wide">{label}</span>
    </div>
    <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300 relative z-10" />
  </Link>
);

const AdminDropdown = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowLogoutModal(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setIsOpen(false);
    handleLogout();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600/80 to-blue-600/80 text-white font-bold border border-white/20 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 focus:outline-none"
      >
        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative z-10 text-sm tracking-widest">{getInitials(user?.name)}</span>
        
        {/* Animated Online Indicator */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full z-20">
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
        </span>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(5px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-4 w-[340px] bg-[#09090b]/95 backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] rounded-3xl z-50 overflow-hidden"
          >
            {/* Header / Profile Info */}
            <div className="relative p-6 overflow-hidden border-b border-white/5">
              {/* Subtle background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
              
              <div className="flex gap-4 items-center relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-white/20">
                  {getInitials(user?.name)}
                </div>
                <div className="flex flex-col flex-grow overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-lg truncate tracking-tight">{user?.name || 'User'}</h3>
                    {user?.role === 'admin' && <Sparkles size={14} className="text-purple-400" />}
                  </div>
                  <p className="text-[11px] font-bold text-purple-400 uppercase tracking-widest mt-0.5">
                    {user?.role === 'admin' ? 'Super Admin' : 'Member'}
                  </p>
                  <p className="text-xs text-white/50 truncate mt-1">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-3">
              <div className="px-5 py-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">My Account</p>
              </div>
              <MenuItem 
                icon={UserIcon} 
                label="My Profile" 
                href="/profile"
                onSelect={() => setIsOpen(false)} 
              />
              
              {user?.role === 'admin' && (
                <>
                  <div className="h-px bg-white/5 my-3 mx-4" />
                  
                  <div className="px-5 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Workspace</p>
                  </div>
                  <MenuItem active={true} icon={LayoutDashboard} label="Admin Console" href="/admin" onSelect={() => setIsOpen(false)} />
                </>
              )}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold py-3.5 rounded-2xl transition-all duration-300 border border-red-500/20 hover:border-red-500/40 group"
              >
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform duration-300" /> 
                <span className="tracking-wide">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#09090b] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Decorative top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-red-500/50 blur-sm" />

              <button 
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-5 right-5 p-2 bg-white/5 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
              
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <LogOut size={28} className="translate-x-[-2px]" />
              </div>
              
              <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">Ready to leave?</h2>
              <p className="text-center text-white/60 text-sm mb-8 px-4 leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all text-sm"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDropdown;
