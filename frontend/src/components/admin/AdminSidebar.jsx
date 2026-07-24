import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Package, 
  BookOpen, 
  LogOut,
  Settings
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, handleLogout }) => {

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <div className="w-72 h-[calc(100vh-8rem)] sticky top-24 glass-card border border-[color:var(--border)] rounded-3xl p-6 flex-col hidden lg:flex shadow-2xl">
      <div className="mb-8 px-4">
        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Admin
        </h2>
        <p className="text-[color:var(--foreground)] opacity-50 text-xs font-semibold uppercase tracking-widest mt-1">
          Dashboard
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold transition-all duration-300 relative group overflow-hidden ${
                isActive 
                  ? 'text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                  : 'text-[color:var(--foreground)] opacity-70 hover:opacity-100 hover:bg-[color:var(--secondary)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-blue-400 transition-colors'} />
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-[color:var(--border)]">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-[color:var(--foreground)] opacity-70 hover:opacity-100 hover:bg-[color:var(--secondary)] transition-all duration-300"
        >
          <Settings size={20} />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-red-500 opacity-80 hover:opacity-100 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
