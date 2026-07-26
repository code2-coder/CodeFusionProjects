import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardOverview from '../components/admin/DashboardOverview';



import AdminTemplates from '../components/admin/AdminTemplates';
import AdminCategories from '../components/admin/AdminCategories';
import AdminProjects from '../components/admin/AdminProjects';
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
    <div className="min-h-screen bg-black pt-24 pb-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px]" />
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

        {/* Mobile Header & Menu Toggle */}
        <div className="lg:hidden fixed top-24 left-4 z-50">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-full lg:max-w-[calc(100%-22rem)] min-w-0">
          
          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 flex flex-col items-center overflow-y-auto pb-12"
              >
                {/* Reusing AdminSidebar for Mobile Layout, but making it full width */}
                <AdminSidebar 
                  activeTab={activeTab} 
                  setActiveTab={handleTabChange} 
                  handleLogout={handleLogout}
                  user={user}
                  className="w-full max-w-sm h-auto flex rounded-3xl border border-[color:var(--border)]"
                />
              </motion.div>
            )}
          </AnimatePresence>

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
