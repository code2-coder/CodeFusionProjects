import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminProjects from '../components/admin/AdminProjects';
import AdminPackages from '../components/admin/AdminPackages';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Admin Dashboard</h1>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'bg-card text-foreground border border-[color:var(--border)] hover:bg-blue-500/10'}`}
          >
            Manage Projects
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'packages' ? 'bg-blue-600 text-white' : 'bg-card text-foreground border border-[color:var(--border)] hover:bg-blue-500/10'}`}
          >
            Manage Packages
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-[color:var(--border)] p-8">
          {activeTab === 'projects' && <AdminProjects />}
          {activeTab === 'packages' && <AdminPackages />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
