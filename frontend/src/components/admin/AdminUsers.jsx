import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Shield, User, Mail, Phone, 
  Calendar, CheckCircle2, AlertCircle, Trash2, ArrowUpDown, 
  RefreshCw, MoreVertical, MessageCircle, ExternalLink, 
  Sparkles, Check, X, ShieldAlert, Briefcase, Download,
  Layers, Copy, ChevronDown, UserCheck, UserX
} from 'lucide-react';
import api from '../../api/client';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminUsers = ({ onNavigateToLeads }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [hasProjectsFilter, setHasProjectsFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals & Action States
  const [selectedUser, setSelectedUser] = useState(null); // Dossier Modal
  const [roleModalUser, setRoleModalUser] = useState(null); // Role change confirmation
  const [deleteModalUser, setDeleteModalUser] = useState(null); // Delete confirmation
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all users (Admin only)
  const fetchUsers = async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get('/api/auth/users');
      if (data.success && data.users) {
        setUsers(data.users);
      } else {
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error(err.response?.data?.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Update user role
  const handleUpdateRole = async (targetUserId, newRole) => {
    try {
      setActionLoading(true);
      const { data } = await api.put(`/api/auth/users/${targetUserId}/role`, { role: newRole });
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers(prev => prev.map(u => u._id === targetUserId ? { ...u, role: newRole } : u));
        if (selectedUser && selectedUser._id === targetUserId) {
          setSelectedUser(prev => ({ ...prev, role: newRole }));
        }
        setRoleModalUser(null);
      }
    } catch (err) {
      console.error('Role update error:', err);
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle verification status
  const handleToggleVerification = async (targetUser) => {
    try {
      const { data } = await api.put(`/api/auth/users/${targetUser._id}/verify`);
      if (data.success) {
        toast.success(`User marked as ${data.isVerified ? 'verified' : 'unverified'}`);
        setUsers(prev => prev.map(u => u._id === targetUser._id ? { ...u, isVerified: data.isVerified } : u));
        if (selectedUser && selectedUser._id === targetUser._id) {
          setSelectedUser(prev => ({ ...prev, isVerified: data.isVerified }));
        }
      }
    } catch (err) {
      console.error('Verification toggle error:', err);
      toast.error('Could not update verification status');
    }
  };

  // Delete user
  const handleDeleteUser = async (targetUserId) => {
    try {
      setActionLoading(true);
      const { data } = await api.delete(`/api/auth/users/${targetUserId}`);
      if (data.success) {
        toast.success('User account removed');
        setUsers(prev => prev.filter(u => u._id !== targetUserId));
        if (selectedUser && selectedUser._id === targetUserId) {
          setSelectedUser(null);
        }
        setDeleteModalUser(null);
      }
    } catch (err) {
      console.error('Delete user error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  // Export Users to CSV
  const exportUsersCSV = () => {
    if (!users.length) return;
    const headers = ['ID,Name,Email,Phone,Role,Verified,ProjectCount,JoinedDate\n'];
    const rows = users.map(u => [
      u._id,
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      u.role,
      u.isVerified ? 'Yes' : 'No',
      u.projectCount || 0,
      `"${new Date(u.createdAt).toISOString()}"`
    ].join(',')).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `codefusion_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('User directory exported as CSV');
  };

  // Copy to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  // Filter & Sort Logic
  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.phone && u.phone.includes(query)) ||
      u._id.toLowerCase().includes(query);

    const matchesRole = 
      roleFilter === 'All' ||
      (roleFilter === 'admin' && u.role === 'admin') ||
      (roleFilter === 'user' && u.role === 'user');

    const matchesVerification = 
      verificationFilter === 'All' ||
      (verificationFilter === 'verified' && u.isVerified) ||
      (verificationFilter === 'unverified' && !u.isVerified);

    const matchesProjects = 
      hasProjectsFilter === 'All' ||
      (hasProjectsFilter === 'has_projects' && (u.projectCount > 0)) ||
      (hasProjectsFilter === 'no_projects' && (!u.projectCount || u.projectCount === 0));

    return matchesSearch && matchesRole && matchesVerification && matchesProjects;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'projects') return (b.projectCount || 0) - (a.projectCount || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  // KPI Calculations
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const verifiedCount = users.filter(u => u.isVerified).length;
  const verifiedRate = totalUsers ? Math.round((verifiedCount / totalUsers) * 100) : 0;
  const clientWithProjects = users.filter(u => u.projectCount > 0).length;

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-24 text-center rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center p-8 space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <ShieldAlert size={28} />
        </div>
        <h3 className="text-lg font-bold text-white">Access Denied: Admin Privilege Required</h3>
        <p className="text-xs text-white/50 max-w-sm">
          Only system administrators are authorized to access the user and client directory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* ============================================================== */}
      {/* 1. EXECUTIVE HEADER & ACTIONS                                  */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>User & Client Directory</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  {totalUsers} Registered
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-white/50 mt-0.5">
                Centralized registry of all authenticated platform users, clients, and system administrators.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-blue-400' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportUsersCSV}
            disabled={!users.length}
            className="px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. KPI METRICS CARDS                                           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Total Accounts</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalUsers}</span>
            <span className="text-xs text-white/40 font-medium">all registered</span>
          </div>
          <div className="mt-2 text-[11px] text-white/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Passwordless OTP accounts</span>
          </div>
        </div>

        {/* Card 2: Platform Admins */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Platform Admins</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Shield size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-300">{adminCount}</span>
            <span className="text-xs text-white/40 font-medium">with console access</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-400/80 flex items-center gap-1.5">
            <ShieldAlert size={12} />
            <span>Elevated role privilege</span>
          </div>
        </div>

        {/* Card 3: Clients with Inquiries */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Active Leads & Clients</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-300">{clientWithProjects}</span>
            <span className="text-xs text-white/40 font-medium">submitted inquiries</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400/80 flex items-center gap-1.5">
            <Sparkles size={12} />
            <span>Engaged in consultation</span>
          </div>
        </div>

        {/* Card 4: Verified Accounts */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Verified Accounts</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{verifiedRate}%</span>
            <span className="text-xs text-white/40 font-medium">({verifiedCount} / {totalUsers})</span>
          </div>
          <div className="mt-2 w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" style={{ width: `${verifiedRate}%` }} />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. FILTER, SEARCH & SORT CONTROLS                              */}
      {/* ============================================================== */}
      <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone number, or User ID..."
            className="w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-white/80 text-xs font-semibold rounded-2xl pl-3.5 pr-8 py-3 outline-none cursor-pointer focus:border-blue-500/50"
            >
              <option value="All" className="bg-[#10111a] text-white">All Roles</option>
              <option value="admin" className="bg-[#10111a] text-white">Admins Only</option>
              <option value="user" className="bg-[#10111a] text-white">Clients Only</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>

          {/* Verification Filter */}
          <div className="relative">
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-white/80 text-xs font-semibold rounded-2xl pl-3.5 pr-8 py-3 outline-none cursor-pointer focus:border-blue-500/50"
            >
              <option value="All" className="bg-[#10111a] text-white">All Statuses</option>
              <option value="verified" className="bg-[#10111a] text-white">Verified</option>
              <option value="unverified" className="bg-[#10111a] text-white">Unverified</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>

          {/* Project Inquiries Filter */}
          <div className="relative">
            <select
              value={hasProjectsFilter}
              onChange={(e) => setHasProjectsFilter(e.target.value)}
              className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-white/80 text-xs font-semibold rounded-2xl pl-3.5 pr-8 py-3 outline-none cursor-pointer focus:border-blue-500/50"
            >
              <option value="All" className="bg-[#10111a] text-white">All Inquiries</option>
              <option value="has_projects" className="bg-[#10111a] text-white">With Inquiries</option>
              <option value="no_projects" className="bg-[#10111a] text-white">No Inquiries</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-white/80 text-xs font-semibold rounded-2xl pl-3.5 pr-8 py-3 outline-none cursor-pointer focus:border-blue-500/50"
            >
              <option value="newest" className="bg-[#10111a] text-white">Newest First</option>
              <option value="oldest" className="bg-[#10111a] text-white">Oldest First</option>
              <option value="projects" className="bg-[#10111a] text-white">Most Projects</option>
              <option value="name" className="bg-[#10111a] text-white">Name (A-Z)</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. USER DIRECTORY LIST / TABLE                                 */}
      {/* ============================================================== */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-white/40 gap-3">
          <RefreshCw className="animate-spin text-blue-400" size={28} />
          <span className="text-sm font-semibold">Retrieving platform users...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-3">
            <Users size={28} />
          </div>
          <h3 className="text-base font-bold text-white">No Users Found</h3>
          <p className="text-xs text-white/40 max-w-sm mt-1">
            {searchQuery || roleFilter !== 'All' || verificationFilter !== 'All'
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'No registered user accounts found in the database.'}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/[0.08] bg-black/40 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  <th className="py-4 px-5">User Details</th>
                  <th className="py-4 px-5">Contact Channels</th>
                  <th className="py-4 px-5">Role & Access</th>
                  <th className="py-4 px-5">Verification</th>
                  <th className="py-4 px-5">Project Leads</th>
                  <th className="py-4 px-5">Joined Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((u) => {
                  const isCurrent = currentUser?._id === u._id;
                  const rawPhone = (u.phone || '').replace(/[^0-9]/g, '');
                  const whatsAppPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

                  return (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Column 1: User Identity */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1.5px] shadow-md">
                              <div className="w-full h-full bg-[#0c0d18] rounded-[14px] flex items-center justify-center text-white font-black text-sm">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            </div>
                            {u.isVerified && (
                              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center" title="Verified Account">
                                <Check size={8} className="text-white" />
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
                                {u.name || 'Unnamed User'}
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-extrabold uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-white/40 font-mono block mt-0.5 truncate max-w-[160px]">
                              ID: {u._id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Contact Channels */}
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          {u.email ? (
                            <div className="flex items-center gap-1.5 text-xs text-white/80">
                              <Mail size={12} className="text-blue-400 flex-shrink-0" />
                              <a href={`mailto:${u.email}`} className="hover:text-blue-300 hover:underline truncate max-w-[170px]">
                                {u.email}
                              </a>
                            </div>
                          ) : (
                            <span className="text-xs text-white/30 italic">No email</span>
                          )}

                          {u.phone ? (
                            <div className="flex items-center gap-1.5 text-xs text-white/60">
                              <Phone size={12} className="text-emerald-400 flex-shrink-0" />
                              <a href={`tel:${u.phone}`} className="hover:text-emerald-300 hover:underline">
                                {u.phone}
                              </a>
                            </div>
                          ) : (
                            <span className="text-[11px] text-white/20 italic block">No mobile linked</span>
                          )}
                        </div>
                      </td>

                      {/* Column 3: Role & Access */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        }`}>
                          <Shield size={12} className={u.role === 'admin' ? 'text-purple-400' : 'text-blue-400'} />
                          <span>{u.role === 'admin' ? 'Platform Admin' : 'Client User'}</span>
                        </span>
                      </td>

                      {/* Column 4: Verification */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleToggleVerification(u)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            u.isVerified
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                          title="Click to toggle account verification status"
                        >
                          {u.isVerified ? <UserCheck size={12} /> : <UserX size={12} />}
                          <span>{u.isVerified ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </td>

                      {/* Column 5: Project Leads */}
                      <td className="py-4 px-5">
                        {u.projectCount > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold flex items-center gap-1">
                              <Briefcase size={11} />
                              <span>{u.projectCount} {u.projectCount === 1 ? 'Inquiry' : 'Inquiries'}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-white/30 italic">No inquiries</span>
                        )}
                      </td>

                      {/* Column 6: Joined Date */}
                      <td className="py-4 px-5 text-xs text-white/50">
                        <div className="space-y-0.5">
                          <span className="block text-white/80 font-medium">
                            {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="block text-[10px] text-white/40">
                            {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* Column 7: Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Button */}
                          {whatsAppPhone && (
                            <a
                              href={`https://wa.me/${whatsAppPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 text-white/60 hover:text-emerald-300 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}

                          {/* Email Client */}
                          {u.email && (
                            <a
                              href={`mailto:${u.email}`}
                              className="p-2 rounded-xl bg-white/[0.03] hover:bg-blue-500/20 border border-white/5 hover:border-blue-500/30 text-white/60 hover:text-blue-300 transition-colors"
                              title="Send Email"
                            >
                              <Mail size={14} />
                            </a>
                          )}

                          {/* View Dossier */}
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                            title="View Full Profile Details"
                          >
                            <ExternalLink size={14} />
                          </button>

                          {/* Change Role */}
                          {!isCurrent && (
                            <button
                              onClick={() => setRoleModalUser(u)}
                              className="p-2 rounded-xl bg-white/[0.03] hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 text-white/60 hover:text-purple-300 transition-colors cursor-pointer"
                              title="Change Role (Admin / Client)"
                            >
                              <Shield size={14} />
                            </button>
                          )}

                          {/* Delete Account */}
                          {!isCurrent && (
                            <button
                              onClick={() => setDeleteModalUser(u)}
                              className="p-2 rounded-xl bg-white/[0.03] hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-white/60 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. USER DOSSIER / DETAILS MODAL                                */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#090a12] border border-white/10 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden z-10 p-6 sm:p-8 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1.5px]">
                    <div className="w-full h-full bg-[#0c0d18] rounded-[14px] flex items-center justify-center text-white font-black text-xl">
                      {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedUser.name || 'Unnamed User'}</h3>
                    <p className="text-xs text-white/40 font-mono">User ID: {selectedUser._id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Snapshot Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Email Address</span>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold truncate">{selectedUser.email || 'None'}</span>
                    {selectedUser.email && (
                      <button
                        onClick={() => copyToClipboard(selectedUser.email, 'Email')}
                        className="text-white/40 hover:text-white"
                      >
                        <Copy size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Mobile Number</span>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold">{selectedUser.phone || 'None'}</span>
                    {selectedUser.phone && (
                      <button
                        onClick={() => copyToClipboard(selectedUser.phone, 'Phone number')}
                        className="text-white/40 hover:text-white"
                      >
                        <Copy size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Assigned Role</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                    selectedUser.role === 'admin'
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  }`}>
                    {selectedUser.role === 'admin' ? 'Super / Platform Admin' : 'Standard Client'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Verification Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                    selectedUser.isVerified
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  }`}>
                    {selectedUser.isVerified ? 'Verified OTP Account' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              {/* Project History Summary */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/50">Project Inquiries</span>
                  <span className="text-xs font-bold text-white">{selectedUser.projectCount || 0} Submitted</span>
                </div>
                <p className="text-xs text-white/40">
                  {selectedUser.projectCount > 0
                    ? `This client has initiated ${selectedUser.projectCount} project consultation inquiry leads on CodeFusion.`
                    : 'This user has not yet submitted any project development inquiries.'}
                </p>
              </div>

              {/* Timestamp Footnote */}
              <div className="text-[11px] text-white/40 flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span>Registered: {new Date(selectedUser.createdAt).toLocaleString()}</span>
                <span>Last Updated: {new Date(selectedUser.updatedAt || selectedUser.createdAt).toLocaleString()}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 6. ROLE CHANGE CONFIRMATION MODAL                              */}
      {/* ============================================================== */}
      <AnimatePresence>
        {roleModalUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRoleModalUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0d0e17] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Shield size={22} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Modify User Access Role</h3>
                <p className="text-xs text-white/50 mt-1">
                  Change permissions for <strong className="text-white">{roleModalUser.name}</strong> ({roleModalUser.email}).
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleUpdateRole(roleModalUser._id, 'admin')}
                  disabled={actionLoading || roleModalUser.role === 'admin'}
                  className={`w-full p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    roleModalUser.role === 'admin'
                      ? 'bg-purple-600/20 border-purple-500/40 text-purple-200'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
                  }`}
                >
                  <div className="text-left">
                    <span className="block font-bold">Platform Administrator</span>
                    <span className="text-[10px] text-white/40 block">Full access to leads, orders, templates, and user directory</span>
                  </div>
                  {roleModalUser.role === 'admin' && <Check size={16} className="text-purple-400" />}
                </button>

                <button
                  onClick={() => handleUpdateRole(roleModalUser._id, 'user')}
                  disabled={actionLoading || roleModalUser.role === 'user'}
                  className={`w-full p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    roleModalUser.role === 'user'
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-200'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
                  }`}
                >
                  <div className="text-left">
                    <span className="block font-bold">Standard Client User</span>
                    <span className="text-[10px] text-white/40 block">Standard access to project submissions and personal profile</span>
                  </div>
                  {roleModalUser.role === 'user' && <Check size={16} className="text-blue-400" />}
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRoleModalUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 7. DELETE CONFIRMATION MODAL                                   */}
      {/* ============================================================== */}
      <AnimatePresence>
        {deleteModalUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0d0e17] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Trash2 size={22} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Permanently Remove User?</h3>
                <p className="text-xs text-white/50 mt-1">
                  Are you sure you want to delete <strong className="text-white">{deleteModalUser.name}</strong> ({deleteModalUser.email})? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  onClick={() => setDeleteModalUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDeleteUser(deleteModalUser._id)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminUsers;
