import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
    readingTime: '',
    tags: '',
    downloads: '',
    featured: false,
    published: true,
    seoTitle: '',
    seoDescription: ''
  });
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchResources = async () => {
    try {
      const { data } = await axios.get('/api/resources');
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    fetchResources();
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
        tags: formData.tags.split(',').map(item => item.trim()).filter(Boolean),
        downloads: formData.downloads.split(',').map(item => item.trim()).filter(Boolean)
      };

      if (editingId) {
        await axios.put(`/api/resources/${editingId}`, payload, config);
      } else {
        await axios.post('/api/resources', payload, config);
      }
      
      resetForm();
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert(error.response?.data?.message || 'Error saving resource');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', slug: '', category: '', excerpt: '', content: '',
      coverImage: '', author: '', readingTime: '', tags: '',
      downloads: '', featured: false, published: true,
      seoTitle: '', seoDescription: ''
    });
    setEditingId(null);
  };

  const handleEdit = (resource) => {
    setFormData({
      title: resource.title || '',
      slug: resource.slug || '',
      category: resource.category || '',
      excerpt: resource.excerpt || '',
      content: resource.content || '',
      coverImage: resource.coverImage || '',
      author: resource.author || '',
      readingTime: resource.readingTime || '',
      tags: (resource.tags || []).join(', '),
      downloads: (resource.downloads || []).join(', '),
      featured: resource.featured || false,
      published: resource.published !== undefined ? resource.published : true,
      seoTitle: resource.seoTitle || '',
      seoDescription: resource.seoDescription || ''
    });
    setEditingId(resource._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.delete(`/api/resources/${id}`, config);
        fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Error deleting resource');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[color:var(--foreground)]">Manage Resources</h2>
      
      <form onSubmit={handleSubmit} className="bg-[color:var(--card)] p-6 rounded-xl border border-[color:var(--border)] mb-8 space-y-4">
        <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-4">{editingId ? 'Edit Resource' : 'Add New Resource'}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Resource Title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required />
          <input type="text" name="slug" placeholder="Slug (e.g. my-resource)" value={formData.slug} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required />
          <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          
          <div className="md:col-span-2">
            <textarea name="excerpt" placeholder="Short Excerpt" value={formData.excerpt} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" required rows="3"></textarea>
          </div>

          <div className="md:col-span-2 text-black bg-white rounded-xl overflow-hidden border border-[color:var(--border)]">
            <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} placeholder="Rich Text Content..." className="h-48 mb-12" />
          </div>

          <input type="text" name="coverImage" placeholder="Cover Image URL" value={formData.coverImage} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          <input type="text" name="readingTime" placeholder="Reading Time (e.g., 5 min read)" value={formData.readingTime} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          
          <input type="text" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          <input type="text" name="downloads" placeholder="Download URLs (comma separated)" value={formData.downloads} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />

          <input type="text" name="seoTitle" placeholder="SEO Title" value={formData.seoTitle} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />
          <input type="text" name="seoDescription" placeholder="SEO Description" value={formData.seoDescription} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)] text-[color:var(--foreground)] focus:outline-none focus:border-blue-500" />

          <div className="flex items-center gap-4 py-2 text-[color:var(--foreground)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5" />
              Featured Resource
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleInputChange} className="w-5 h-5" />
              Published
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {editingId ? 'Update Resource' : 'Add Resource'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {resources.map(resource => (
          <div key={resource._id} className="p-4 bg-[color:var(--card)] rounded-xl border border-[color:var(--border)] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="font-bold text-[color:var(--foreground)]">{resource.title} <span className="text-xs text-blue-400 font-normal ml-2">{resource.category}</span></p>
              <p className="text-sm text-[color:var(--foreground)] opacity-60">/{resource.slug} {resource.published ? '(Published)' : '(Draft)'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(resource)} className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors">Edit</button>
              <button onClick={() => handleDelete(resource._id)} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {resources.length === 0 && <p className="text-[color:var(--foreground)] opacity-60">No resources found.</p>}
      </div>
    </div>
  );
};

export default AdminResources;
