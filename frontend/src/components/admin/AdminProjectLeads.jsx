import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import api from '../../api/client';
import { getSocket } from '../../utils/socket';
import { AuthContext } from '../../context/AuthContext';
import ProjectChatModal from '../common/ProjectChatModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Search, Filter, Clock, CheckCircle2, AlertCircle, 
  Send, User, Phone, Mail, Globe, DollarSign, Calendar, FileText, 
  ArrowUpRight, Sparkles, RefreshCw, X, Check, Shield, ChevronDown,
  Layers, ExternalLink, Zap
} from 'lucide-react';

const STATUS_CONFIG = {
  'Pending': { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: 'Pending Review', dot: 'bg-amber-400' },
  'Reviewed': { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: 'Reviewed', dot: 'bg-blue-400' },
  'In Progress': { color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', label: 'In Progress', dot: 'bg-purple-400' },
  'Completed': { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Completed', dot: 'bg-emerald-400' },
  'Rejected': { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: 'Archived', dot: 'bg-rose-400' },
};

const CANNED_RESPONSES = [
  "👋 Hello! We have received your project inquiry and our engineering team is reviewing the scope.",
  "📅 Would you be available for a brief 15-minute discovery call this week to finalize requirements?",
  "💼 We have prepared a customized proposal and development roadmap for your project.",
  "⚡ Everything looks great! We are ready to begin the sprint onboarding."
];

const AdminProjectLeads = () => {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null); // For Details Modal
  const [activeChatLead, setActiveChatLead] = useState(null); // For Live Chat Modal
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/project-requests');
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch project leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    // Initialize Socket.io connection for real-time leads updates
    const socket = getSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    // Real-time: new lead submitted by a client
    socket.on('new_project_lead', (newLead) => {
      setLeads((prev) => [newLead, ...prev]);
    });

    // Real-time: lead summary update (last message, unread counters)
    socket.on('project_lead_updated', ({ projectId, lastMessage, unreadByAdmin, unreadByClient }) => {
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === projectId
            ? { ...lead, lastMessage, unreadByAdmin, unreadByClient }
            : lead
        )
      );
    });

    return () => {
      socket.off('new_project_lead');
      socket.off('project_lead_updated');
    };
  }, []);

  // Open live chat for a specific lead
  const openChat = (lead) => {
    setActiveChatLead(lead);
    setLeads((prev) =>
      prev.map((l) => (l._id === lead._id ? { ...l, unreadByAdmin: 0 } : l))
    );
  };


  // Update lead status
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const { data } = await api.put(`/api/project-requests/${leadId}/status`, {
        status: newStatus,
      });

      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: data.status } : l))
      );

      if (activeChatLead && activeChatLead._id === leadId) {
        setActiveChatLead((prev) => ({ ...prev, status: data.status }));
      }
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: data.status }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Save admin internal notes
  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      const { data } = await api.put(`/api/project-requests/${selectedLead._id}/status`, {
        adminNotes,
      });
      setSelectedLead((prev) => ({ ...prev, adminNotes: data.adminNotes }));
      setLeads((prev) =>
        prev.map((l) => (l._id === selectedLead._id ? { ...l, adminNotes: data.adminNotes } : l))
      );
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.emailAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.websiteType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalLeads = leads.length;
  const pendingLeads = leads.filter((l) => l.status === 'Pending').length;
  const inProgressLeads = leads.filter((l) => l.status === 'In Progress').length;
  const completedLeads = leads.filter((l) => l.status === 'Completed').length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Header & Live Telemetry Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={11} className="text-blue-400" />
              Client Pipeline
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-time Sync Active</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Client Leads & Consultation Hub</h1>
          <p className="text-sm text-white/50 mt-1">
            Manage incoming project requests from <code className="text-white/70 bg-white/5 px-1.5 py-0.5 rounded">/start-project</code> and converse with clients in real-time.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all self-start md:self-center"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* 2. Executive KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Inquiries</span>
          <p className="text-3xl font-black text-white mt-1">{totalLeads}</p>
          <span className="text-xs text-white/40 mt-1 block">All registered leads</span>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Pending Review</span>
          <p className="text-3xl font-black text-amber-400 mt-1">{pendingLeads}</p>
          <span className="text-xs text-white/40 mt-1 block">Awaiting response</span>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Active Discussions</span>
          <p className="text-3xl font-black text-purple-400 mt-1">{inProgressLeads}</p>
          <span className="text-xs text-white/40 mt-1 block">In discovery / sprint</span>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Closed / Sprints</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">{completedLeads}</p>
          <span className="text-xs text-white/40 mt-1 block">Successful deliveries</span>
        </div>
      </div>

      {/* 3. Controls: Search Bar & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search business, client or website type..."
            className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Reviewed', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/5 hover:bg-white/[0.06]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Leads List / Cards */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-white/40 gap-3">
          <RefreshCw className="animate-spin text-blue-400" size={28} />
          <span className="text-xs font-semibold">Synchronizing client inquiries...</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white/[0.02] border border-white/[0.06] p-8">
          <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4 text-white/40">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Leads Found</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'All' 
              ? 'No inquiries match your current search criteria.'
              : 'New project submissions from /start-project will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLeads.map((lead) => {
            const statusInfo = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Pending'];
            const hasUnread = lead.unreadByAdmin > 0;

            return (
              <motion.div
                key={lead._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl transition-all duration-300 relative overflow-hidden border ${
                  hasUnread
                    ? 'bg-gradient-to-r from-blue-900/15 via-[#0c0d18] to-purple-900/15 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                    : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.07] hover:border-white/15'
                }`}
              >
                {/* Unread Glowing Pulse Ribbon */}
                {hasUnread && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl shadow-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>{lead.unreadByAdmin} New Message{lead.unreadByAdmin > 1 ? 's' : ''}</span>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Client & Business Summary */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-inner flex-shrink-0">
                      {lead.businessName ? lead.businessName.charAt(0).toUpperCase() : 'B'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-black text-white tracking-tight">{lead.businessName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${statusInfo.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-white/50 flex-wrap">
                        <span className="flex items-center gap-1 text-white/70">
                          <User size={13} className="text-white/40" />
                          {lead.contactPerson}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={13} className="text-white/40" />
                          {lead.emailAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={13} className="text-white/40" />
                          {lead.mobileNumber}
                        </span>
                      </div>

                      {/* Requirement Tags */}
                      <div className="flex items-center gap-2 pt-2 flex-wrap text-[11px]">
                        <span className="px-2.5 py-1 rounded-xl bg-white/[0.04] text-white/80 border border-white/5 font-medium flex items-center gap-1">
                          <Globe size={11} className="text-blue-400" />
                          {lead.websiteType}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-white/[0.04] text-emerald-400 border border-white/5 font-bold flex items-center gap-1">
                          <DollarSign size={11} />
                          {lead.budget}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-white/[0.04] text-purple-400 border border-white/5 font-medium flex items-center gap-1">
                          <Calendar size={11} />
                          Launch: {lead.expectedLaunchDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Live Chat Trigger */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                    
                    {/* Status Changer Select */}
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className="w-full sm:w-auto appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-white/80 text-xs font-bold rounded-2xl pl-3 pr-8 py-3 outline-none cursor-pointer focus:border-blue-500/50"
                      >
                        <option value="Pending" className="bg-[#12131c] text-white">Pending</option>
                        <option value="Reviewed" className="bg-[#12131c] text-white">Reviewed</option>
                        <option value="In Progress" className="bg-[#12131c] text-white">In Progress</option>
                        <option value="Completed" className="bg-[#12131c] text-white">Completed</option>
                        <option value="Rejected" className="bg-[#12131c] text-white">Archived</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setAdminNotes(lead.adminNotes || '');
                      }}
                      className="px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileText size={14} />
                      <span>Lead Scope</span>
                    </button>

                    {/* Live Chat Primary CTA */}
                    <button
                      onClick={() => openChat(lead)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.55)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageSquare size={14} />
                      <span>Real-time Chat</span>
                      {hasUnread && (
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Last message preview snippet */}
                {lead.lastMessage && (
                  <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-white/40">
                    <span className="truncate max-w-md">
                      <strong className="text-white/60 font-semibold uppercase text-[10px] mr-1.5">
                        {lead.lastMessage.senderRole === 'admin' ? 'You' : lead.contactPerson}:
                      </strong>
                      {lead.lastMessage.text}
                    </span>
                    <span className="text-[10px] text-white/30 whitespace-nowrap ml-2">
                      {new Date(lead.lastMessage.createdAt || lead.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. REAL-TIME CONVERSATION CHAT MODAL / DRAWER                  */}
      {/* ============================================================== */}
      {/* 5. REAL-TIME CONVERSATION CHAT MODAL */}
      <AnimatePresence>
        {activeChatLead && (
          <ProjectChatModal
            lead={activeChatLead}
            onClose={() => setActiveChatLead(null)}
            role="admin"
            onStatusChange={handleStatusChange}
            currentUserName={user?.name || 'Vaibhav Pawar'}
          />
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 6. FULL LEAD SCOPE MODAL                                       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedLead && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0d16] border border-white/10 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-y-auto z-10 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Inquiry Questionnaire</span>
                  <h2 className="text-2xl font-black text-white mt-1">{selectedLead.businessName}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Business Details</h4>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                    <p><strong className="text-white">Business Type:</strong> <span className="text-white/70">{selectedLead.businessType}</span></p>
                    <p><strong className="text-white">Contact Person:</strong> <span className="text-white/70">{selectedLead.contactPerson}</span></p>
                    <p><strong className="text-white">Email:</strong> <span className="text-white/70">{selectedLead.emailAddress}</span></p>
                    <p><strong className="text-white">Phone:</strong> <span className="text-white/70">{selectedLead.mobileNumber}</span></p>
                    {selectedLead.description && (
                      <p className="pt-2 border-t border-white/5 text-white/80 leading-relaxed"><strong className="text-white block mb-1">Description:</strong> {selectedLead.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Project Scope</h4>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                    <p><strong className="text-white">Website Type:</strong> <span className="text-white/70">{selectedLead.websiteType}</span></p>
                    <p><strong className="text-white">Budget Range:</strong> <span className="text-emerald-400 font-bold">{selectedLead.budget}</span></p>
                    <p><strong className="text-white">Target Launch:</strong> <span className="text-white/70">{selectedLead.expectedLaunchDate}</span></p>
                    <p><strong className="text-white">Domain Available:</strong> <span className="text-white/70">{selectedLead.domainAvailable}</span></p>
                    <p><strong className="text-white">Hosting Available:</strong> <span className="text-white/70">{selectedLead.hostingAvailable}</span></p>
                  </div>
                </div>
              </div>

              {selectedLead.featuresNeeded?.length > 0 && (
                <div className="pb-6">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Requested Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.featuresNeeded.map((feat, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Admin Notes */}
              <div className="pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Internal Admin Notes (Private)</h4>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add private internal notes, pricing calculation, or follow-up milestones for this lead..."
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjectLeads;
