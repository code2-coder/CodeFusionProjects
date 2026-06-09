import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectName: '',
    projectURL: '',
    projectCode: '',
    demo: '',
    images: ''
  });
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/api/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      const payload = {
        ...formData,
        images: formData.images.split(',').map(img => img.trim()).filter(img => img)
      };

      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, payload, config);
      } else {
        await axios.post('/api/projects', payload, config);
      }
      
      setFormData({ projectName: '', projectURL: '', projectCode: '', demo: '', images: '' });
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.message || 'Error saving project');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      projectName: project.projectName || '',
      projectURL: project.projectURL || '',
      projectCode: project.projectCode || '',
      demo: project.demo || '',
      images: (project.images || []).join(', ')
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.delete(`/api/projects/${id}`, config);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Manage Projects</h2>
      
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-[color:var(--border)] mb-8 space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" required />
          <input type="text" name="projectURL" placeholder="Project URL" value={formData.projectURL} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" required />
          <input type="text" name="projectCode" placeholder="Project Code" value={formData.projectCode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" />
          <input type="text" name="demo" placeholder="Demo URL" value={formData.demo} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" />
          <input type="text" name="images" placeholder="Image URLs (comma separated)" value={formData.images} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 md:col-span-2" />
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ projectName: '', projectURL: '', projectCode: '', demo: '', images: '' }); }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project._id} className="p-4 bg-card rounded-xl border border-[color:var(--border)] flex justify-between items-center">
            <div>
              <p className="font-bold text-foreground">{project.projectName}</p>
              <p className="text-sm text-foreground/60">{project.projectURL}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors">Edit</button>
              <button onClick={() => handleDelete(project._id)} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-foreground/60">No projects found.</p>}
      </div>
    </div>
  );
};

export default AdminProjects;
