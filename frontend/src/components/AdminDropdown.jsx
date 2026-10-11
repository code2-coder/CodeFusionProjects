import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, LayoutDashboard, LogOut, X, Sparkles, ChevronRight, 
  MessageSquare, Briefcase, ShieldCheck, Zap, Users
} from 'lucide-react';

const MenuItem = ({ icon: Icon, label, href = "#", onClick, onSelect, active, badge }) => (
  <Link 
    to={href} 
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
      if (href !== "#" && onSelect) onSelect();
    }}
    className={`group relative flex items-center justify-between px-4 py-3 mx-2 my-1 text-sm font-medium rounded-2xl transition-all duration-300 overflow-hidden ${
      active 
        ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    
    <div className="flex items-center gap-3 relative z-10">
      <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-transparent text-white/50 group-hover:text-purple-400 group-hover:bg-white/10'}`}>
        <Icon size={16} className={active ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''} />
      </div>
      <span className="tracking-wide text-[13px]">{label}</span>
    </div>

    <div className="flex items-center gap-2 relative z-10">
      {badge && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          {badge}
        </span>
      )}
      <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300" />
    </div>
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
    if(handleLogout) handleLogout();
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
        aria-expanded={isOpen}
        aria-label="Admin Profile Menu"
        className="relative group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 text-white font-bold border border-white/20 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-500 focus:outline-none"
      >
        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 text-sm tracking-widest">{getInitials(user?.name)}</span>
        
        {/* Animated Online Indicator */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#09090b] rounded-full z-20">
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-full right-0 mt-3 w-[340px] sm:w-[370px] bg-[#090a12]/95 backdrop-blur-3xl border border-white/[0.08] ring-1 ring-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.85),0_0_50px_rgba(168,85,247,0.15)] rounded-[2.25rem] z-50 overflow-hidden"
          >
            {/* Top ambient highlight glow line */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent pointer-events-none" />

            {/* Header / Profile Info */}
            <div className="relative p-6 pb-5 overflow-hidden border-b border-white/[0.08]">
              {/* Subtle background glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[50px] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[50px] pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10 mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold tracking-[0.15em] uppercase">
                  <Sparkles size={11} className="text-purple-400" />
                  <span>{user?.role === 'admin' ? 'Super Admin' : 'Client Account'}</span>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex gap-4 items-center relative z-10">
                <div className="relative">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white text-lg font-black shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/20">
                    {getInitials(user?.name)}
                  </div>
                </div>
                <div className="flex flex-col flex-grow overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base truncate tracking-tight">{user?.name || 'User'}</h3>
                  </div>
                  <p className="text-xs text-white/50 truncate mt-0.5">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2.5 relative z-10">
              <div className="px-5 py-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">My Account</p>
              </div>
              <MenuItem 
                icon={UserIcon} 
                label="My Profile" 
                href="/profile"
                onSelect={() => setIsOpen(false)} 
              />
              
              {user?.role === 'admin' ? (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2 mx-4" />
                  
                  <div className="px-5 py-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Workspace & Operations</p>
                  </div>
                  <MenuItem 
                    active={false} 
                    icon={LayoutDashboard} 
                    label="Admin Console" 
                    href="/admin" 
                    onSelect={() => setIsOpen(false)} 
                  />
                  <MenuItem 
                    active={false} 
                    icon={Users} 
                    label="Users & Clients" 
                    href="/admin?tab=users" 
                    onSelect={() => setIsOpen(false)} 
                  />
                  <MenuItem 
                    active={true} 
                    icon={MessageSquare} 
                    label="Client Leads & Real-time Chat" 
                    href="/admin?tab=leads" 
                    badge="Live"
                    onSelect={() => setIsOpen(false)} 
                  />
                </>
              ) : (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2 mx-4" />
                  
                  <div className="px-5 py-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Client Projects</p>
                  </div>
                  <MenuItem 
                    active={true} 
                    icon={Briefcase} 
                    label="My Project Requests & Chat" 
                    href="/profile?tab=requests" 
                    badge="Portal"
                    onSelect={() => setIsOpen(false)} 
                  />
                </>
              )}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 relative z-10">
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 text-red-400 hover:text-red-300 font-bold py-3.5 rounded-2xl transition-all duration-300 border border-red-500/20 hover:border-red-500/40 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform duration-300 relative z-10" /> 
                <span className="tracking-wide relative z-10 text-xs">Sign Out</span>
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
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-[#100f18] border border-white/10 ring-1 ring-white/5 rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_0_80px_rgba(0,0,0,0.85),0_0_40px_rgba(225,29,72,0.15)] overflow-hidden"
            >
              {/* Decorative glows */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 blur-[60px]" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-rose-500/10 blur-[60px]" />
              
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-5 right-5 p-2 bg-white/5 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <X size={15} />
              </button>
              
              <div className="relative w-16 h-16 mx-auto mb-5 group">
                <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
                  <LogOut size={26} className="translate-x-[-1px]" />
                </div>
              </div>
              
              <h2 className="text-xl font-black text-white text-center mb-2 tracking-tight">Ready to sign out?</h2>
              <p className="text-center text-white/50 text-xs mb-6 px-2 leading-relaxed">
                You will need to sign back in with your email OTP to access the console.
              </p>
              
              <div className="flex gap-3 relative z-10">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-2xl hover:from-red-500 hover:to-rose-500 shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all text-xs"
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
