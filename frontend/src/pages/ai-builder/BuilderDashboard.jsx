import React, { useEffect, useState } from 'react';
import { useAiBuilder } from '../../hooks/useAiBuilder';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BuilderDashboard = () => {
  const { projects, loading, fetchProjects, createNewProject, updateProjectById, deleteProjectById } = useAiBuilder();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', industry: '', description: '' });
  const [editProjectData, setEditProjectData] = useState(null);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const project = await createNewProject(newProject);
    if (project) {
      setShowCreateModal(false);
      setNewProject({ name: '', industry: '', description: '' });
      navigate(`/builder/project/${project._id}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editProjectData) return;
    const updated = await updateProjectById(editProjectData._id, {
      name: editProjectData.name,
      industry: editProjectData.industry,
      description: editProjectData.description
    });
    if (updated) {
      setShowEditModal(false);
      setEditProjectData(null);
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation(); // prevent navigation
    if (window.confirm("Are you sure you want to delete this project? This will permanently delete all associated pages, components, and chat history. This action cannot be undone.")) {
      await deleteProjectById(projectId);
    }
  };

  const openEditModal = (e, proj) => {
    e.stopPropagation();
    setEditProjectData(proj);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Website Builder
          </h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          >
            + Create New AI Website
          </button>
        </div>

        {loading && <p className="text-gray-400">Loading your projects...</p>}

        {!loading && projects.length === 0 && (
          <div className="text-center py-20 bg-[#18181b] rounded-2xl border border-gray-800">
            <h3 className="text-2xl font-semibold mb-4 text-gray-300">No Projects Yet</h3>
            <p className="text-gray-500 mb-8">Start building your next masterpiece with the power of AI.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-semibold transition-colors"
            >
              Start Generating
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => (
            <div 
              key={proj._id} 
              onClick={() => navigate(`/builder/project/${proj._id}`)}
              className="bg-[#18181b] border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] group"
            >
              <div className="h-40 bg-gray-900 rounded-lg mb-4 relative overflow-hidden group/preview">
                {/* Scaled Iframe for Live Thumbnail */}
                <iframe 
                  src={`/preview/${proj._id}`}
                  className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none border-0"
                  title={`${proj.name} Preview`}
                  loading="lazy"
                  scrolling="no"
                  tabIndex="-1"
                />
                {/* Overlay for hover effects and buttons */}
                <div className="absolute inset-0 bg-black/40 group-hover/preview:bg-black/10 transition-colors z-10 flex items-center justify-center">
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => openEditModal(e, proj)} className="p-2 bg-black/80 rounded hover:bg-black text-gray-300 hover:text-white transition-colors shadow-lg" title="Edit Project Details">
                      <Pencil size={16} />
                    </button>
                    <button onClick={(e) => handleDelete(e, proj._id)} className="p-2 bg-black/80 rounded hover:bg-black text-gray-300 hover:text-red-500 transition-colors shadow-lg" title="Delete Project">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 truncate">{proj.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{proj.description || 'No description provided.'}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span className="px-3 py-1 bg-gray-800 rounded-full">{proj.industry || 'General'}</span>
                <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gray-900/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Let AI plan your website</h2>
              <form onSubmit={handleCreate}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder-gray-500 shadow-inner"
                    placeholder="e.g., Nexus AI Corp"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editProjectData && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gray-900/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Edit Project Details</h2>
              <form onSubmit={handleUpdate}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={editProjectData.name}
                    onChange={(e) => setEditProjectData({...editProjectData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder-gray-500 shadow-inner"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuilderDashboard;
