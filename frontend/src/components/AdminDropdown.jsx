import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, Settings, Shield, Key, LayoutDashboard,
  LogOut, X
} from 'lucide-react';

const MenuItem = ({ icon: Icon, label, href = "#", badge, onClick, onSelect }) => (
  <Link 
    to={href} 
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
      if (href !== "#" && onSelect) onSelect();
    }}
    className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[color:var(--foreground)] opacity-70 hover:opacity-100 hover:bg-[color:var(--secondary)] rounded-xl transition-all group"
  >
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-[color:var(--foreground)] group-hover:text-purple-400 transition-colors" />
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

const SectionHeader = ({ title }) => (
  <div className="px-4 py-2 mt-2 text-[10px] font-bold uppercase tracking-widest text-[color:var(--foreground)] opacity-40">
    {title}
  </div>
);

const AdminDropdown = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key
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



  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 text-white font-bold border-2 border-[color:var(--border)] hover:border-purple-400 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
      >
        {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
        {/* Online Indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
      </button>

      {/* Main Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(5px)' }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-4 w-[320px] max-h-[80vh] overflow-y-auto bg-black border border-[color:var(--border)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl z-50 custom-scrollbar"
          >
            {/* Header Profile Info */}
            <div className="p-5 border-b border-[color:var(--border)] bg-[color:var(--secondary)]/30 backdrop-blur-md">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex flex-col flex-grow overflow-hidden">
                  <h3 className="font-bold text-[color:var(--foreground)] truncate">{user.name}</h3>
                  <p className="text-xs font-semibold text-purple-400 truncate">Super Admin</p>
                  <p className="text-xs text-[color:var(--foreground)] opacity-50 truncate mt-0.5">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[color:var(--foreground)] opacity-60 bg-[color:var(--background)] py-1.5 px-3 rounded-full w-max border border-[color:var(--border)]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
              </div>
            </div>

            <div className="p-2 flex flex-col gap-1">
              <SectionHeader title="My Account" />
              <MenuItem icon={User} label="My Profile" onSelect={() => setIsOpen(false)} />
              <MenuItem icon={Settings} label="Account Settings" onSelect={() => setIsOpen(false)} />
              <MenuItem icon={Shield} label="Security Settings" onSelect={() => setIsOpen(false)} />
              <MenuItem icon={Key} label="Change Password" onSelect={() => setIsOpen(false)} />

              <div className="h-px bg-[color:var(--border)] my-2 mx-2"></div>

              <SectionHeader title="Workspace" />
              <MenuItem icon={LayoutDashboard} label="Admin Dashboard" href="/admin" onSelect={() => setIsOpen(false)} />







            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-[color:var(--border)] bg-[color:var(--secondary)]/50 backdrop-blur-md sticky bottom-0">
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold py-3 rounded-xl transition-all border border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                <LogOut size={18} /> Logout
              </button>
              <div className="text-center mt-3 text-[10px] font-bold text-[color:var(--foreground)] opacity-30 uppercase tracking-widest">
                Version 1.0.0
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles for the dropdown */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}} />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#0a0a0a] border border-[color:var(--border)] rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-4 right-4 p-2 bg-[color:var(--secondary)] rounded-full hover:bg-[color:var(--border)] transition-colors"
              >
                <X size={16} />
              </button>
              
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut size={28} />
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">Ready to leave?</h2>
              <p className="text-center text-[color:var(--foreground)] opacity-70 mb-8">
                Are you sure you want to log out of your admin session?
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-[color:var(--secondary)] border border-[color:var(--border)] text-[color:var(--foreground)] font-bold rounded-xl hover:bg-[color:var(--border)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                >
                  Logout
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
