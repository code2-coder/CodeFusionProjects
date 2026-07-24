import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardOverview from '../components/admin/DashboardOverview';
import AdminProjects from '../components/admin/AdminProjects';
import AdminPackages from '../components/admin/AdminPackages';
import AdminResources from '../components/admin/AdminResources';
import { motion, AnimatePresence } from 'framer-motion';

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
      case 'packages':
        return <AdminPackages />;
      case 'resources':
        return <AdminResources />;
      default:
        return <DashboardOverview />;
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] pt-24 pb-12 relative overflow-hidden">
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
        <main className="flex-1 w-full max-w-full lg:max-w-[calc(100%-20rem)] min-w-0">
          
          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="lg:hidden fixed inset-0 z-40 bg-[color:var(--background)]/95 backdrop-blur-xl pt-24 px-6 flex flex-col"
              >
                <div className="flex justify-between items-center mb-8 pl-14">
                   <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Admin
                  </h2>
                </div>
                
                <div className="flex flex-col gap-4">
                  {['overview', 'projects', 'packages', 'resources'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
                      className={`text-xl font-bold py-4 border-b border-[color:var(--border)] text-left ${activeTab === tab ? 'text-blue-500' : 'text-[color:var(--foreground)] opacity-70'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                  <button onClick={handleLogout} className="text-xl font-bold py-4 text-red-500 text-left mt-8">
                    Logout
                  </button>
                </div>
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
