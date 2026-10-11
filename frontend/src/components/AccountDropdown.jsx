import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, Mail, ArrowRight, Sparkles, ShieldCheck, 
  FolderKanban, FileText, MessageSquare, X, UserPlus, Zap
} from 'lucide-react';

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Account Avatar Trigger Button */}
      <button 
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Account Menu"
        className={`relative p-2.5 rounded-full transition-all duration-300 focus:outline-none overflow-hidden group shadow-inner ${
          isOpen 
            ? 'bg-blue-500/10 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.35)] text-blue-400' 
            : 'bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-blue-500/40 text-white/80 hover:text-white'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <User size={18} className={`relative z-10 transition-colors duration-300 ${isOpen ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />

        {/* Subtle status indicator dot */}
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border border-black shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
      </button>

      {/* Invisible bridge for hover stability */}
      <div className="absolute top-full right-0 w-full h-4" />

      {/* Dropdown Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="absolute top-full right-0 mt-3 w-[340px] sm:w-[370px] bg-[#090a10]/95 backdrop-blur-3xl border border-white/[0.08] ring-1 ring-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_40px_rgba(59,130,246,0.12)] rounded-[2.25rem] z-50 overflow-hidden"
          >
            {/* Top ambient highlight glow */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Section */}
            <div className="p-6 pb-5 relative z-10 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-[0.15em] uppercase">
                  <Sparkles size={11} className="text-blue-400 animate-pulse" />
                  <span>Client Portal</span>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={15} />
                </button>
              </div>

              <h3 className="text-lg font-black text-white tracking-tight leading-snug">
                Welcome to CodeFusion
              </h3>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Sign in to manage your development projects, request instant quotes, and access the client workspace.
              </p>
            </div>

            {/* Actions Section */}
            <div className="p-5 flex flex-col gap-2.5 relative z-10">
              {/* Primary Action: Continue with Email */}
              <Link
                to="/login?mode=login"
                onClick={() => setIsOpen(false)}
                className="group relative flex items-center justify-between px-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(79,70,229,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.55)] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
                    <Mail size={15} className="text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white text-[13px] leading-tight">Continue with Email</span>
                    <span className="text-[10px] text-white/80 font-normal">Passwordless OTP login</span>
                  </div>
                </div>

                <ArrowRight size={16} className="text-white/80 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300 relative z-10" />
              </Link>

              {/* Secondary Action: Create Account */}
              <Link
                to="/login?mode=signup"
                onClick={() => setIsOpen(false)}
                className="group relative flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-white/85 hover:text-white font-medium text-xs transition-all duration-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-purple-400 group-hover:text-purple-300 border border-white/5">
                    <UserPlus size={14} />
                  </div>
                  <span>New client? <strong className="text-white font-semibold">Create an account</strong></span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Free</span>
              </Link>
            </div>

            {/* Portal Features Preview */}
            <div className="px-5 py-3 border-t border-white/[0.04] bg-white/[0.01] relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2.5">
                What you can do
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center text-center group hover:bg-white/[0.05] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1.5 border border-blue-500/20">
                    <FolderKanban size={13} />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90 leading-tight">Live Sprints</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Track builds</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center text-center group hover:bg-white/[0.05] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1.5 border border-purple-500/20">
                    <FileText size={13} />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90 leading-tight">Quotes</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Invoices & docs</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center text-center group hover:bg-white/[0.05] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1.5 border border-emerald-500/20">
                    <MessageSquare size={13} />
                  </div>
                  <span className="text-[11px] font-semibold text-white/90 leading-tight">Support</span>
                  <span className="text-[9px] text-white/40 mt-0.5">Direct chat</span>
                </div>
              </div>
            </div>

            {/* Footer Trust & Help Bar */}
            <div className="px-5 py-3.5 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40 relative z-10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>256-bit Secure OTP</span>
              </div>
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-blue-400 transition-colors font-medium flex items-center gap-1"
              >
                Need help?
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountDropdown;
