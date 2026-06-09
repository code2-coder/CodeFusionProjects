import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    services: ''
  });
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get('/api/packages');
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
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
        price: Number(formData.price),
        services: formData.services.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingId) {
        await axios.put(`/api/packages/${editingId}`, payload, config);
      } else {
        await axios.post('/api/packages', payload, config);
      }
      
      setFormData({ title: '', price: '', services: '' });
      setEditingId(null);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      alert(error.response?.data?.message || 'Error saving package');
    }
  };

  const handleEdit = (pkg) => {
    setFormData({
      title: pkg.title || '',
      price: pkg.price || '',
      services: (pkg.services || []).join(', ')
    });
    setEditingId(pkg._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        await axios.delete(`/api/packages/${id}`, config);
        fetchPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Error deleting package');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Manage Packages</h2>
      
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-[color:var(--border)] mb-8 space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4">{editingId ? 'Edit Package' : 'Add New Package'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Package Title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" required />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500" required />
          <textarea name="services" placeholder="Services (comma separated)" value={formData.services} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-[color:var(--border)] text-foreground focus:outline-none focus:border-blue-500 md:col-span-2 h-24" required />
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {editingId ? 'Update Package' : 'Add Package'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', price: '', services: '' }); }} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {packages.map(pkg => (
          <div key={pkg._id} className="p-4 bg-card rounded-xl border border-[color:var(--border)] flex justify-between items-center">
            <div>
              <p className="font-bold text-foreground">{pkg.title}</p>
              <p className="text-sm text-foreground/60">${pkg.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(pkg)} className="px-3 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors">Edit</button>
              <button onClick={() => handleDelete(pkg._id)} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {packages.length === 0 && <p className="text-foreground/60">No packages found.</p>}
      </div>
    </div>
  );
};

export default AdminPackages;
