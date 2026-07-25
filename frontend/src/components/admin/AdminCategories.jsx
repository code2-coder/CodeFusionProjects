import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      
      const payload = { name };

      if (editingId) {
        await axios.put(`/api/categories/${editingId}`, payload, config);
      } else {
        await axios.post('/api/categories', payload, config);
      }
      
      setName('');
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Note: Templates using this category might need to be updated.')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.delete(`/api/categories/${id}`, config);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Manage Categories</h2>
      
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-[color:var(--border)] mb-8 space-y-4 max-w-xl">
        <h3 className="text-xl font-semibold text-foreground mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Category Name (e.g. E-commerce)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" 
            required 
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {editingId ? 'Update Category' : 'Add Category'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { 
              setEditingId(null); 
              setName('');
            }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4 max-w-2xl">
        {categories.map(cat => (
          <div key={cat._id} className="p-4 bg-card rounded-xl border border-[color:var(--border)] flex justify-between items-center">
            <div>
              <p className="font-bold text-foreground text-lg">{cat.name}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cat)} className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors">Edit</button>
              <button onClick={() => handleDelete(cat._id)} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-foreground/60">No categories found.</p>}
      </div>
    </div>
  );
};

export default AdminCategories;
