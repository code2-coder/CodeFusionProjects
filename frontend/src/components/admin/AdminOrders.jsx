import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, XCircle, Clock, Calendar, Mail, Phone, Edit, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form states
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    planName: '',
    amount: '',
    status: 'success'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/payments/orders`);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this order?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/payments/orders/${id}`);
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setFormData({
      userName: getCustomerName(order) === 'Unknown Customer' ? '' : getCustomerName(order),
      userEmail: getCustomerEmail(order),
      userPhone: getCustomerPhone(order),
      planName: order.planName || '',
      amount: order.amount || 0,
      status: order.status || 'pending'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/payments/orders/${editingOrder._id}`, {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        status: formData.status,
        amount: Number(formData.amount)
      });
      toast.success("Order updated successfully");
      setIsEditModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/orders/manual`, {
        ...formData,
        amount: Number(formData.amount)
      });
      toast.success("Manual order created successfully");
      setIsCreateModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create manual order");
    }
  };

  const openCreateModal = () => {
    setFormData({ userName: '', userEmail: '', userPhone: '', planName: '', amount: '', status: 'success' });
    setIsCreateModalOpen(true);
  };

  const getCustomerName = (order) => order.userName || order.user?.name || 'Unknown Customer';
  const getCustomerEmail = (order) => order.userEmail || order.user?.email || '';
  const getCustomerPhone = (order) => order.userPhone || order.user?.phone || '';

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      getCustomerName(order).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerEmail(order).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.planName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
            <CheckCircle2 size={14} /> Success
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
            <Clock size={14} /> Pending
          </span>
        );
      case 'failed':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20">
            <XCircle size={14} /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-500/10 text-gray-400 text-xs font-medium border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Order Management
            <span className="bg-blue-500/20 text-blue-400 py-0.5 px-2.5 rounded-full text-sm font-medium">
              {orders.length}
            </span>
          </h2>
          <p className="text-foreground/60 mt-1 text-sm">
            Monitor, edit, and manage all template and custom plan purchases.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Create Manual Order
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
          <input
            type="text"
            placeholder="Search by customer, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card/50 border border-[color:var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'success', 'pending', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'bg-card/50 text-foreground/60 hover:bg-card border border-[color:var(--border)]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-2xl border border-[color:var(--border)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-[color:var(--border)]">
                <th className="py-4 px-6 text-sm font-semibold text-foreground/70">Customer</th>
                <th className="py-4 px-6 text-sm font-semibold text-foreground/70">Item</th>
                <th className="py-4 px-6 text-sm font-semibold text-foreground/70">Amount</th>
                <th className="py-4 px-6 text-sm font-semibold text-foreground/70">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-foreground/70">Date</th>
                <th className="py-4 px-6 text-sm font-semibold text-foreground/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-foreground/50">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                        <p>Loading orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-foreground/50">
                        <Search className="w-12 h-12 mb-4 text-foreground/20" />
                        <p className="text-lg font-medium text-foreground/70">No orders found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                            {getCustomerName(order).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {getCustomerName(order)}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-foreground/50 mt-1">
                              {getCustomerEmail(order) && <span className="flex items-center gap-1"><Mail size={12} /> {getCustomerEmail(order)}</span>}
                              {getCustomerPhone(order) && <span className="flex items-center gap-1"><Phone size={12} /> {getCustomerPhone(order)}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <p className="font-medium text-foreground">{order.planName}</p>
                          <span className="font-mono text-[10px] text-foreground/40 mt-1">{order.orderId}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-foreground">₹{order.amount?.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                          <Calendar size={14} className="text-foreground/40" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 transition-opacity">
                          <button 
                            onClick={() => handleEditClick(order)}
                            className="p-2 text-foreground/50 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit Order"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(order._id)}
                            className="p-2 text-foreground/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Modal Form */}
      <AnimatePresence>
        {(isEditModalOpen || isCreateModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => { setIsEditModalOpen(false); setIsCreateModalOpen(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-[color:var(--border)] rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {isEditModalOpen ? 'Edit Order Details' : 'Create Manual Order'}
                </h3>
                <button 
                  onClick={() => { setIsEditModalOpen(false); setIsCreateModalOpen(false); }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={isEditModalOpen ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Customer Name</label>
                    <input 
                      type="text" 
                      value={formData.userName} 
                      onChange={e => setFormData({...formData, userName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.userPhone} 
                      onChange={e => setFormData({...formData, userPhone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 focus:outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.userEmail} 
                    onChange={e => setFormData({...formData, userEmail: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 focus:outline-none" 
                  />
                </div>

                {isCreateModalOpen && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Item / Plan Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.planName} 
                      onChange={e => setFormData({...formData, planName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 focus:outline-none" 
                      placeholder="e.g. Offline Web Package"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Amount (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.amount} 
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="success">Success</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => { setIsEditModalOpen(false); setIsCreateModalOpen(false); }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                  >
                    {isEditModalOpen ? 'Save Changes' : 'Create Order'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
