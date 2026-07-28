import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { getImageUrl, handleImageError } from '../../utils';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
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
    published: true,
    seoTitle: '',
    seoDescription: '',
    completionDate: '',
    features: []
  });
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  // Category Dropdown State
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const categoryDropdownRef = useRef(null);

  // Feature CRUD State
  const [newFeature, setNewFeature] = useState('');
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);
  const [editFeatureText, setEditFeatureText] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
        setEditingCategoryId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/api/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
    fetchProjects();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileUpload = async (e, fieldName) => {
    const files = e.target.files;
    if (!files.length) return;

    const uploadData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadData.append('images', files[i]);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const { data } = await axios.post('/api/upload/images', uploadData, config);
      
      if (fieldName === 'gallery') {
        setFormData((prev) => {
          const currentGallery = prev.gallery ? prev.gallery.split(',').map(s=>s.trim()).filter(Boolean) : [];
          const newGallery = [...currentGallery, ...data.urls].join(', ');
          return { ...prev, gallery: newGallery };
        });
      } else if (fieldName === 'featuredImage') {
        setFormData(prev => ({ ...prev, featuredImage: data.urls[0] }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error.response?.data?.message || error.message));
    } finally {
      e.target.value = ''; // Reset file input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      const payload = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        technologies: formData.technologies ? formData.technologies.split(',').map(item => item.trim()).filter(Boolean) : [],
        tags: formData.tags ? formData.tags.split(',').map(item => item.trim()).filter(Boolean) : [],
        gallery: formData.gallery ? formData.gallery.split(',').map(item => item.trim()).filter(Boolean) : [],
        features: formData.features || []
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
      gallery: '', demoUrl: '', githubUrl: '',
      published: true, seoTitle: '', seoDescription: '', completionDate: '',
      features: []
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
      published: project.published !== undefined ? project.published : true,
      seoTitle: project.seoTitle || '',
      seoDescription: project.seoDescription || '',
      completionDate: project.completionDate ? project.completionDate.substring(0,10) : '',
      features: project.features || []
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

  // Category CRUD Handlers
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!newCategoryName.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/categories', { name: newCategoryName }, config);
      setNewCategoryName('');
      fetchCategories();
    } catch (error) { console.error(error); alert(error.response?.data?.message || 'Error creating category'); }
  };

  const handleUpdateCategory = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if(!editCategoryName.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/categories/${id}`, { name: editCategoryName }, config);
      if (formData.category === categories.find(c => c._id === id)?.name) {
          setFormData(prev => ({...prev, category: editCategoryName}));
      }
      setEditingCategoryId(null);
      setEditCategoryName('');
      fetchCategories();
    } catch (error) { console.error(error); alert(error.response?.data?.message || 'Error updating category'); }
  };

  const handleDeleteCategory = async (e, id, name) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this category?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/categories/${id}`, config);
        if (formData.category === name) {
          setFormData(prev => ({...prev, category: ''}));
        }
        fetchCategories();
      } catch (error) { console.error(error); alert(error.response?.data?.message || 'Error deleting category'); }
    }
  };

  // Feature CRUD Handlers
  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleUpdateFeature = (e, index) => {
    e.preventDefault();
    if (!editFeatureText.trim()) return;
    setFormData(prev => {
      const updatedFeatures = [...(prev.features || [])];
      updatedFeatures[index] = editFeatureText.trim();
      return { ...prev, features: updatedFeatures };
    });
    setEditingFeatureIndex(null);
    setEditFeatureText('');
  };

  const handleDeleteFeature = (e, index) => {
    e.preventDefault();
    setFormData(prev => {
      const updatedFeatures = [...(prev.features || [])];
      updatedFeatures.splice(index, 1);
      return { ...prev, features: updatedFeatures };
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[color:var(--foreground)]">Manage Work / Projects</h2>
      
      <form onSubmit={handleSubmit} className="bg-[color:var(--card)] p-6 rounded-xl border border-[color:var(--border)] mb-8 space-y-4">
        <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required />

          {/* Custom Category Dropdown with CRUD */}
          <div className="relative" ref={categoryDropdownRef}>
            <div 
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500 cursor-pointer flex justify-between items-center"
            >
              <span className={formData.category ? '' : 'opacity-60'}>{formData.category || 'Select Category'}</span>
              <span className="text-xs transition-transform duration-300" style={{ transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </div>
            
            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[color:var(--card)] border border-[color:var(--border)] rounded-xl shadow-2xl z-50 p-2 flex flex-col gap-2 max-h-80 overflow-y-auto">
                {/* Create new */}
                <div className="flex gap-2 p-2 border-b border-[color:var(--border)]">
                  <input 
                    type="text" 
                    placeholder="New category..." 
                    value={newCategoryName} 
                    onChange={e => setNewCategoryName(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreateCategory(e); } }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[color:var(--background)] border border-[color:var(--border)] text-sm text-[color:var(--foreground)] focus:outline-none focus:border-blue-500"
                  />
                  <button type="button" onClick={handleCreateCategory} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Add</button>
                </div>
                
                {/* List categories */}
                {categories.map(cat => (
                  <div key={cat._id} className="group flex items-center justify-between p-2 hover:bg-[color:var(--background)] rounded-lg transition-colors">
                    {editingCategoryId === cat._id ? (
                      <div className="flex gap-2 flex-1 items-center" onClick={e => e.stopPropagation()}>
                        <input 
                          type="text" 
                          value={editCategoryName} 
                          onChange={e => setEditCategoryName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateCategory(e, cat._id); } }}
                          className="flex-1 px-2 py-1 rounded bg-[color:var(--background)] border border-blue-500 text-sm text-[color:var(--foreground)] focus:outline-none"
                          autoFocus
                        />
                        <button type="button" onClick={(e) => handleUpdateCategory(e, cat._id)} className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1.5 rounded font-medium">Save</button>
                        <button type="button" onClick={() => setEditingCategoryId(null)} className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1.5 rounded font-medium">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div 
                          className="flex-1 cursor-pointer font-medium text-[color:var(--foreground)]"
                          onClick={() => {
                            setFormData(prev => ({...prev, category: cat.name}));
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          {cat.name} {formData.category === cat.name && <span className="ml-2 text-blue-500 text-xs">✓</span>}
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategoryId(cat._id);
                            setEditCategoryName(cat.name);
                          }} className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-2 py-1 rounded font-medium transition-colors">Edit</button>
                          <button type="button" onClick={(e) => handleDeleteCategory(e, cat._id, cat.name)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-2 py-1 rounded font-medium transition-colors">Del</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {categories.length === 0 && <p className="text-xs text-center p-3 opacity-50 text-[color:var(--foreground)]">No categories found.</p>}
              </div>
            )}
          </div>

          <input type="text" name="client" placeholder="Client Name" value={formData.client} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          
          <input type="text" name="demoUrl" placeholder="Live Demo URL" value={formData.demoUrl} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />

          <div className="md:col-span-2">
            <textarea name="description" placeholder="Short Description (Summary)" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required rows="2"></textarea>
          </div>

          <div className="md:col-span-2">
            <textarea name="content" placeholder="Project Overview (Detailed)" value={formData.content} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" rows="5"></textarea>
          </div>

          <div className="md:col-span-2">
            <input type="text" name="technologies" placeholder="Technologies Used (comma separated, e.g. React, Node.js)" value={formData.technologies} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-sm font-semibold text-[color:var(--foreground)] ml-2 opacity-70">Featured Image</label>
            <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'featuredImage')} className="w-full px-4 py-2 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer" />
            {formData.featuredImage && (
              <div className="mt-2 relative inline-block">
                <img src={getImageUrl(formData.featuredImage)} alt="Featured" className="w-20 h-20 object-cover rounded-md border border-[color:var(--border)]" onError={handleImageError} />
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700">×</button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-sm font-semibold text-[color:var(--foreground)] ml-2 opacity-70">Gallery Images</label>
            <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'gallery')} className="w-full px-4 py-2 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer" />
            {formData.gallery && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.gallery.split(',').map((url, i) => url.trim() && (
                  <div key={i} className="relative inline-block">
                    <img src={getImageUrl(url.trim())} alt="Gallery" className="w-20 h-20 object-cover rounded-md border border-[color:var(--border)]" onError={handleImageError} />
                    <button 
                      type="button" 
                      onClick={() => {
                        const newGallery = formData.gallery.split(',').map(s=>s.trim()).filter(s=>s!==url.trim()).join(', ');
                        setFormData(prev => ({ ...prev, gallery: newGallery }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Features CRUD */}
          <div className="md:col-span-2 p-5 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)]">
            <label className="text-sm font-semibold text-[color:var(--foreground)] opacity-70 mb-3 block ml-2">Project Features (Bullet Points)</label>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Add a new feature..." 
                value={newFeature} 
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(e); } }}
                className="flex-1 px-4 py-3 rounded-xl bg-[color:var(--card)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500"
              />
              <button type="button" onClick={handleAddFeature} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">Add Feature</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {(formData.features || []).map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[color:var(--card)] border border-[color:var(--border)] rounded-xl group hover:border-blue-500/30 transition-colors">
                  {editingFeatureIndex === index ? (
                    <div className="flex gap-2 flex-1 items-center">
                      <input 
                        type="text" 
                        value={editFeatureText} 
                        onChange={e => setEditFeatureText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateFeature(e, index); } }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[color:var(--background)] border border-blue-500 text-[color:var(--foreground)] focus:outline-none"
                        autoFocus
                      />
                      <button type="button" onClick={(e) => handleUpdateFeature(e, index)} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
                      <button type="button" onClick={() => setEditingFeatureIndex(null)} className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-blue-500 mt-1 font-bold">•</span>
                        <span className="text-[color:var(--foreground)] leading-relaxed">{feature}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => { setEditingFeatureIndex(index); setEditFeatureText(feature); }} className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg text-sm font-medium transition-colors">Edit</button>
                        <button type="button" onClick={(e) => handleDeleteFeature(e, index)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors">Del</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {(!formData.features || formData.features.length === 0) && (
                <p className="text-sm text-[color:var(--foreground)] opacity-50 text-center py-4">No features added yet.</p>
              )}
            </div>
          </div>



          {/* Completion Date */}
          <div className="flex flex-col gap-1 w-full justify-center">
            <label className="text-sm font-semibold text-[color:var(--foreground)] ml-2 opacity-70">Completion Date</label>
            <input 
              type="date" 
              name="completionDate" 
              value={formData.completionDate} 
              onChange={handleInputChange} 
              className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project._id} className="p-4 bg-[color:var(--card)] rounded-xl border border-[color:var(--border)] flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-[color:var(--border)] transition-colors">
            <div>
              <p className="font-bold text-[color:var(--foreground)] flex items-center gap-2">
                {project.title} 
                <span className="text-xs text-blue-400 font-medium ml-2 px-2 py-0.5 rounded-full bg-blue-500/10">{project.category}</span>
              </p>
              <p className="text-sm text-[color:var(--foreground)] opacity-60 mt-1">/{project.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(project)} className="px-4 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-medium transition-all">Edit</button>
              <button onClick={() => handleDelete(project._id)} className="px-4 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-all">Delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-[color:var(--foreground)] opacity-60 text-center py-8">No projects found.</p>}
      </div>
    </div>
  );
};

export default AdminProjects;
