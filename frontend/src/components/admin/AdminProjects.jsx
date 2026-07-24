import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    content: '',
    client: '',
    technologies: '',
    tags: '',
    featuredImage: '',
    gallery: '',
    demoUrl: '',
    githubUrl: '',
    featured: false,
    published: true,
    seoTitle: '',
    seoDescription: ''
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
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map(item => item.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(item => item.trim()).filter(Boolean),
        gallery: formData.gallery.split(',').map(item => item.trim()).filter(Boolean)
      };

      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, payload, config);
      } else {
        await axios.post('/api/projects', payload, config);
      }
      
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.message || 'Error saving project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', slug: '', category: '', description: '', content: '',
      client: '', technologies: '', tags: '', featuredImage: '',
      gallery: '', demoUrl: '', githubUrl: '', featured: false,
      published: true, seoTitle: '', seoDescription: ''
    });
    setEditingId(null);
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      category: project.category || '',
      description: project.description || '',
      content: project.content || '',
      client: project.client || '',
      technologies: (project.technologies || []).join(', '),
      tags: (project.tags || []).join(', '),
      featuredImage: project.featuredImage || '',
      gallery: (project.gallery || []).join(', '),
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
      published: project.published !== undefined ? project.published : true,
      seoTitle: project.seoTitle || '',
      seoDescription: project.seoDescription || ''
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
      <h2 className="text-2xl font-bold mb-6 text-[color:var(--foreground)]">Manage Work / Projects</h2>
      
      <form onSubmit={handleSubmit} className="bg-[color:var(--card)] p-6 rounded-xl border border-[color:var(--border)] mb-8 space-y-4">
        <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required />
          <input type="text" name="slug" placeholder="Slug (e.g. my-project)" value={formData.slug} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required />
          <input type="text" name="client" placeholder="Client Name" value={formData.client} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          
          <div className="md:col-span-2">
            <textarea name="description" placeholder="Short Description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required rows="3"></textarea>
          </div>

          <div className="md:col-span-2 text-black bg-white rounded-xl overflow-hidden border border-[color:var(--border)]">
            <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} placeholder="Rich Text Content Overview..." className="h-48 mb-12" />
          </div>

          <input type="text" name="featuredImage" placeholder="Featured Image URL" value={formData.featuredImage} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          <input type="text" name="gallery" placeholder="Gallery Image URLs (comma separated)" value={formData.gallery} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          
          <input type="text" name="technologies" placeholder="Technologies (comma separated)" value={formData.technologies} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          <input type="text" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />

          <input type="text" name="demoUrl" placeholder="Live Demo URL" value={formData.demoUrl} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          <input type="text" name="githubUrl" placeholder="GitHub URL" value={formData.githubUrl} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />

          <input type="text" name="seoTitle" placeholder="SEO Title" value={formData.seoTitle} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          <input type="text" name="seoDescription" placeholder="SEO Description" value={formData.seoDescription} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />

          <div className="flex items-center gap-4 py-2 text-[color:var(--foreground)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5" />
              Featured Project
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleInputChange} className="w-5 h-5" />
              Published
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project._id} className="p-4 bg-[color:var(--card)] rounded-xl border border-[color:var(--border)] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="font-bold text-[color:var(--foreground)]">{project.title} <span className="text-xs text-blue-400 font-normal ml-2">{project.category}</span></p>
              <p className="text-sm text-[color:var(--foreground)] opacity-60">/{project.slug} {project.published ? '(Published)' : '(Draft)'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors">Edit</button>
              <button onClick={() => handleDelete(project._id)} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-[color:var(--foreground)] opacity-60">No projects found.</p>}
      </div>
    </div>
  );
};

export default AdminProjects;
