import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Shield, Key, LayoutDashboard, FolderKanban, FileEdit, Clock, Star,
  Briefcase, LayoutTemplate, BookOpen, PenTool, Image as ImageIcon, Bell, Megaphone, Activity,
  Sun, Moon, Monitor, Palette, Globe, Calendar, Keyboard, FileText, HelpCircle, 
  MessageSquare, Bug, Lightbulb, PlusCircle, Upload, PenBox, LogOut, X
} from 'lucide-react';

const AdminDropdown = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const toggleTheme = (theme) => {
    // Basic theme toggle simulation
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else if (theme === 'light') document.documentElement.classList.remove('dark');
    // For 'system', we'd normally check matchMedia, but we'll leave as placeholder
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setIsOpen(false);
    handleLogout();
  };

  const MenuItem = ({ icon: Icon, label, href = "#", badge, onClick }) => (
    <Link 
      to={href} 
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
        if (href !== "#") setIsOpen(false);
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
            className="absolute top-full right-0 mt-4 w-[320px] max-h-[80vh] overflow-y-auto glass-card border border-[color:var(--border)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl z-50 custom-scrollbar"
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
              <MenuItem icon={User} label="My Profile" />
              <MenuItem icon={Settings} label="Account Settings" />
              <MenuItem icon={Shield} label="Security Settings" />
              <MenuItem icon={Key} label="Change Password" />

              <div className="h-px bg-[color:var(--border)] my-2 mx-2"></div>

              <SectionHeader title="Workspace" />
              <MenuItem icon={LayoutDashboard} label="Admin Dashboard" href="/admin" />
              <MenuItem icon={FolderKanban} label="My Projects" />
              <MenuItem icon={FileEdit} label="Draft Content" />
              <MenuItem icon={Clock} label="Recently Edited" />
              <MenuItem icon={Star} label="Favorites" />

              <div className="h-px bg-[color:var(--border)] my-2 mx-2"></div>

              <SectionHeader title="Content Management" />
              <MenuItem icon={Briefcase} label="Work (Portfolio)" href="/admin" />
              <MenuItem icon={LayoutTemplate} label="Templates" />
              <MenuItem icon={BookOpen} label="Resources" href="/admin" />
              <MenuItem icon={PenTool} label="Blog" />
              <MenuItem icon={ImageIcon} label="Media Library" />

              <div className="h-px bg-[color:var(--border)] my-2 mx-2"></div>

              <SectionHeader title="Notifications" />
              <MenuItem icon={Bell} label="View Notifications" badge="3" />
              <MenuItem icon={Megaphone} label="Announcements" />
              <MenuItem icon={Activity} label="Activity Log" />

              <div className="h-px bg-[color:var(--border)] my-2 mx-2"></div>

              <SectionHeader title="Appearance" />
              <div className="flex gap-2 px-4 py-2">
                <button onClick={() => toggleTheme('light')} className="flex-1 py-2 bg-[color:var(--secondary)] rounded-lg flex items-center justify-center text-[color:var(--foreground)] hover:bg-[color:var(--border)] transition-colors tooltip-trigger" title="Light Mode">
                  <Sun size={16} />
                </button>
                <button onClick={() => toggleTheme('dark')} className="flex-1 py-2 bg-black text-white rounded-lg flex items-center justify-center border border-white/10 hover:bg-neutral-900 transition-colors tooltip-trigger" title="Dark Mode">
                  <Moon size={16} />
                </button>
                <button onClick={() => toggleTheme('system')} className="flex-1 py-2 bg-[color:var(--secondary)] rounded-lg flex items-center justify-center text-[color:var(--foreground)] hover:bg-[color:var(--border)] transition-colors tooltip-trigger" title="System Theme">
                  <Monitor size={16} />
                </button>
              </div>
              <MenuItem icon={Palette} label="Accent Color Picker" />

              <div className="h-px bg-[color:var(--border)] my-2 mx-2"></div>

              <SectionHeader title="Preferences" />
              <MenuItem icon={Globe} label="Language" />
              <MenuItem icon={Calendar} label="Time Zone" />
              <MenuItem icon={Keyboard} label="Keyboard Shortcuts" />

              <div className="h-px bg-[color:var(--border)] my-2 mx-2"></div>

              <SectionHeader title="Help" />
              <MenuItem icon={FileText} label="Documentation" />
              <MenuItem icon={HelpCircle} label="Support Center" />
              <MenuItem icon={MessageSquare} label="Contact Support" />
              <MenuItem icon={Bug} label="Report a Bug" />
              <MenuItem icon={Lightbulb} label="Feature Request" />

              <div className="h-px bg-[color:var(--border)] my-2 mx-2"></div>

              <SectionHeader title="Quick Actions" />
              <div className="px-3 pb-2 pt-1 grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-colors text-purple-400 group">
                  <PlusCircle size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-center">New Project</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-colors text-blue-400 group">
                  <Upload size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-center">Upload Template</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl hover:bg-pink-500/20 transition-colors text-pink-400 group">
                  <PenBox size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-center">Write Blog</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl hover:bg-orange-500/20 transition-colors text-orange-400 group">
                  <ImageIcon size={20} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-center">Upload Media</span>
                </button>
              </div>

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
              className="relative bg-[color:var(--card)] border border-[color:var(--border)] rounded-3xl p-8 max-w-sm w-full shadow-2xl"
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
