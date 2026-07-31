import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardOverview from '../components/admin/DashboardOverview';



import AdminTemplates from '../components/admin/AdminTemplates';
import AdminCategories from '../components/admin/AdminCategories';
import AdminProjects from '../components/admin/AdminProjects';
import AdminOrders from '../components/admin/AdminOrders';
import { motion, AnimatePresence } from 'framer-motion';

// A generic placeholder for unbuilt pages
const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] bg-card rounded-3xl border border-[color:var(--border)] shadow-sm">
    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
      <Rocket size={40} className="text-blue-500" />
    </div>
    <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
    <p className="text-foreground/60 text-lg text-center max-w-md">
      This section is currently under development. Check back soon for exciting new features!
    </p>
  </div>
);

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;



      case 'projects':
        return <AdminProjects />;
      case 'categories':
        return <AdminCategories />;
      case 'templates':
        return <AdminTemplates />;
      case 'orders':
        return <AdminOrders />;
      
      // Placeholders for all the other requested tabs
      case 'profile': return <ComingSoon title="My Profile" />;
      case 'account_settings': return <ComingSoon title="Account Settings" />;
      case 'security': return <ComingSoon title="Security Settings" />;
      case 'password': return <ComingSoon title="Change Password" />;
      

      
      case 'portfolio': return <ComingSoon title="Work (Portfolio)" />;
      case 'blog': return <ComingSoon title="Blog" />;
      case 'media': return <ComingSoon title="Media Library" />;
      
      case 'view_notifications': return <ComingSoon title="Notifications" />;
      case 'announcements': return <ComingSoon title="Announcements" />;
      case 'activity_log': return <ComingSoon title="Activity Log" />;
      
      case 'accent_color': return <ComingSoon title="Accent Color Picker" />;
      case 'language': return <ComingSoon title="Language" />;
      case 'timezone': return <ComingSoon title="Time Zone" />;
      case 'shortcuts': return <ComingSoon title="Keyboard Shortcuts" />;
      
      case 'docs': return <ComingSoon title="Documentation" />;
      case 'support': return <ComingSoon title="Support Center" />;
      case 'contact': return <ComingSoon title="Contact Support" />;
      case 'bug_report': return <ComingSoon title="Report a Bug" />;
      case 'feature_req': return <ComingSoon title="Feature Request" />;
      
      case 'new_project': return <ComingSoon title="New Project" />;
      case 'upload_template': return <ComingSoon title="Upload Template" />;
      case 'write_blog': return <ComingSoon title="Write Blog" />;
      case 'upload_media': return <ComingSoon title="Upload Media" />;

      default:
        return <DashboardOverview />;
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  // Wrapper to handle tab changes and close mobile menu
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black pt-36 lg:pt-28 pb-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-[72px] sm:top-[80px] inset-x-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-white/70 hover:text-white rounded-xl bg-white/[0.03] border border-white/[0.08]"
          >
            <Menu size={20} />
          </button>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
            {activeTab === 'overview' ? 'Dashboard' : activeTab.replace('_', ' ')}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex gap-8">
        
        {/* Desktop Sidebar */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleLogout={handleLogout}
          user={user}
          className="w-80 h-[calc(100vh-6rem)] sticky top-24 glass-card border border-[color:var(--border)] rounded-3xl hidden lg:flex"
        />

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="lg:hidden fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] h-full z-50 bg-black border-r border-white/[0.08] flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/95">Navigation</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-white/40 hover:text-white rounded-lg bg-white/[0.03] border border-white/[0.08]"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Scrollable Sidebar Wrapper inside Drawer */}
                <div className="flex-1 overflow-y-auto">
                  <AdminSidebar 
                    activeTab={activeTab} 
                    setActiveTab={handleTabChange} 
                    handleLogout={handleLogout}
                    user={user}
                    className="w-full h-full border-0 shadow-none bg-transparent flex"
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-full lg:max-w-[calc(100%-22rem)] min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
