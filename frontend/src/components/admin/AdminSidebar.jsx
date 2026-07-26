import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, Shield, Key, // My Account
  LayoutDashboard, // Workspace
  LayoutTemplate, BookOpen, Tag, Briefcase,
  LogOut, ChevronDown, ChevronRight
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, handleLogout, user, className = "" }) => {
  // State for tracking which accordion section is open
  const [openSections, setOpenSections] = useState({
    workspace: true, // Open by default
    content: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const menuGroups = [
    {
      id: 'account',
      title: 'My Account',
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'account_settings', label: 'Account Settings', icon: Settings },
        { id: 'security', label: 'Security Settings', icon: Shield },
        { id: 'password', label: 'Change Password', icon: Key },
      ]
    },
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'overview', label: 'Admin Dashboard', icon: LayoutDashboard },



        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'templates', label: 'Templates', icon: LayoutTemplate },

      ]
    }
  ];

  return (
    <div className={`flex-col shadow-2xl overflow-hidden bg-black ${className}`}>
      
      {/* 1. Fixed Header: Profile Card */}
      <div className="p-6 border-b border-[color:var(--border)] bg-gradient-to-br from-blue-500/10 to-purple-500/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
            </div>
            {/* Online Indicator */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[color:var(--background)] rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">
              {user?.name || 'Vp'} <span className="text-xs font-normal text-purple-500 ml-1 px-2 py-0.5 rounded-full bg-purple-500/10">Super Admin</span>
            </h2>
            <p className="text-sm text-foreground/60 truncate">{user?.email || 'vp0303739@gmail.com'}</p>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 scrollbar-track-transparent p-4">
        <nav className="flex flex-col gap-4">
          {menuGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1">
              {/* Group Header (Accordion Toggle) */}
              <button 
                onClick={() => toggleSection(group.id)}
                className="flex items-center justify-between px-2 py-2 text-xs font-bold uppercase tracking-wider text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                {group.title}
                {openSections[group.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {/* Group Items */}
              <AnimatePresence initial={false}>
                {openSections[group.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-1 overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl font-medium transition-all duration-300 relative group overflow-hidden ${
                            isActive 
                              ? 'text-white' 
                              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active-tab"
                              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <div className="relative z-10 flex items-center gap-3">
                            <Icon size={18} className={isActive ? 'text-white' : 'text-foreground/50 group-hover:text-blue-500 transition-colors'} />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          {/* Optional Badge */}
                          {item.badge && (
                            <div className="relative z-10 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {item.badge}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>

      {/* 3. Footer */}
      <div className="p-4 border-t border-[color:var(--border)] bg-black">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 hover:scale-[1.02] transition-all duration-300"
        >
          <LogOut size={18} />
          <span>Secure Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
