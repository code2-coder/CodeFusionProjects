import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    demoUrl: '',
    galleryImages: '',
    previewVideo: '',
    tags: '',
    features: '',
    technologies: '',
    status: 'Draft'
  });
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchTemplates = async () => {
    try {
      const { data } = await axios.get('/api/templates');
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      let uploadedGalleryUrls = [];
      if (galleryFiles.length > 0) {
        const uploadData = new FormData();
        Array.from(galleryFiles).forEach(file => uploadData.append('images', file));
        const res = await axios.post('/api/upload/images', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` }
        });
        uploadedGalleryUrls = res.data.urls.map(url => `http://localhost:5000${url}`);
      }

      let uploadedVideoUrl = '';
      if (videoFile) {
        const uploadData = new FormData();
        uploadData.append('video', videoFile);
        const res = await axios.post('/api/upload/video', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` }
        });
        uploadedVideoUrl = `http://localhost:5000${res.data.url}`;
      }

      const existingGallery = formData.galleryImages ? formData.galleryImages.split(',').map(s => s.trim()).filter(s => s) : [];
      const finalGalleryImages = [...existingGallery, ...uploadedGalleryUrls];
      const finalPreviewVideo = uploadedVideoUrl || formData.previewVideo;

      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        galleryImages: finalGalleryImages,
        previewVideo: finalPreviewVideo,
        tags: formData.tags ? formData.tags.split(',').map(s => s.trim()).filter(s => s) : [],
        features: formData.features ? formData.features.split(',').map(s => s.trim()).filter(s => s) : [],
        technologies: formData.technologies ? formData.technologies.split(',').map(s => s.trim()).filter(s => s) : []
      };

      if (editingId) {
        await axios.put(`/api/templates/${editingId}`, payload, config);
      } else {
        await axios.post('/api/templates', payload, config);
      }
      
      setFormData({ 
        title: '', description: '', category: '', 
        price: '', demoUrl: '', 
        galleryImages: '', previewVideo: '', tags: '', features: '', 
        technologies: '', status: 'Draft' 
      });
      setGalleryFiles([]);
      setVideoFile(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert(error.response?.data?.message || 'Error saving template');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (tmpl) => {
    setFormData({
      title: tmpl.title || '',
      description: tmpl.description || '',
      category: tmpl.category || '',
      price: tmpl.price || 0,
      demoUrl: tmpl.demoUrl || '',
      galleryImages: (tmpl.galleryImages || []).join(', '),
      previewVideo: tmpl.previewVideo || '',
      tags: (tmpl.tags || []).join(', '),
      features: (tmpl.features || []).join(', '),
      technologies: (tmpl.technologies || []).join(', '),
      status: tmpl.status || 'Draft'
    });
    setEditingId(tmpl._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.delete(`/api/templates/${id}`, config);
        fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Error deleting template');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Manage Templates</h2>
      
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-[color:var(--border)] mb-8 space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4">{editingId ? 'Edit Template' : 'Add New Template'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Template Name" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" required />
          
          <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" required>
            <option value="" disabled>Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" required />
          <input type="url" name="demoUrl" placeholder="Website Link (Live Demo URL)" value={formData.demoUrl} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" />
          
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Gallery Images (Upload or Paste URLs)</label>
            <input type="text" name="galleryImages" placeholder="Paste existing or external URLs (comma separated)" value={formData.galleryImages} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 mb-2" />
            <input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(e.target.files)} className="w-full px-4 py-2 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-foreground/80">Preview Video (Upload or Paste URL)</label>
            <input type="text" name="previewVideo" placeholder="Paste existing or YouTube URL" value={formData.previewVideo} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 mb-2" />
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="w-full px-4 py-2 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-500 hover:file:bg-purple-500/20" />
          </div>

          <input type="text" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 md:col-span-2" />
          
          <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 md:col-span-2" required>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>

          <textarea name="description" placeholder="Full Description (Rich Text/HTML supported)" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 md:col-span-2 h-32" required />
          <textarea name="features" placeholder="Features (comma separated)" value={formData.features} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 h-24" />
          <textarea name="technologies" placeholder="Technologies (comma separated)" value={formData.technologies} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 h-24" />
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" disabled={isUploading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
            {isUploading ? 'Uploading & Saving...' : (editingId ? 'Update Template' : 'Add Template')}
          </button>
          {editingId && !isUploading && (
            <button type="button" onClick={() => { 
              setEditingId(null); 
              setFormData({ 
                title: '', description: '', category: '', 
                price: '', demoUrl: '', 
                galleryImages: '', previewVideo: '', tags: '', features: '', 
                technologies: '', status: 'Draft' 
              }); 
              setGalleryFiles([]);
              setVideoFile(null);
            }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {templates.map(tmpl => (
          <div key={tmpl._id} className="p-4 bg-card rounded-xl border border-[color:var(--border)] flex justify-between items-center">
            <div>
              <p className="font-bold text-foreground">{tmpl.title} <span className="text-xs font-normal bg-blue-500/10 text-blue-500 px-2 py-1 rounded ml-2">{tmpl.status}</span></p>
              <p className="text-sm text-foreground/60">{tmpl.category} - ₹{tmpl.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(tmpl)} className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors">Edit</button>
              <button onClick={() => handleDelete(tmpl._id)} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {templates.length === 0 && <p className="text-foreground/60">No templates found.</p>}
      </div>
    </div>
  );
};

export default AdminTemplates;
