import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import { getSocket } from '../../utils/socket';
import toast from 'react-hot-toast';
import { 
  X, Send, Sparkles, User, Mail, Phone, Globe, DollarSign, 
  Calendar, CheckCircle2, ShieldCheck, RefreshCw, Zap, 
  FileText, CheckCheck, ChevronDown, MessageSquare, Clock,
  Copy, Check, ExternalLink, ArrowRight, CornerDownLeft,
  MessageCircle, Info, ChevronRight, Layers, Tag
} from 'lucide-react';

const STATUS_CONFIG = {
  'Pending': { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: 'Pending Review', dot: 'bg-amber-400' },
  'Reviewed': { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: 'Reviewed', dot: 'bg-blue-400' },
  'In Progress': { color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', label: 'In Progress', dot: 'bg-purple-400' },
  'Completed': { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Completed', dot: 'bg-emerald-400' },
  'Rejected': { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: 'Archived', dot: 'bg-rose-400' },
};

const ADMIN_QUICK_ACTIONS = [
  {
    icon: '👋',
    title: 'Acknowledge Scope',
    text: "Hello! We have reviewed your project requirements and our engineering team is excited to collaborate with you."
  },
  {
    icon: '📅',
    title: 'Discovery Call',
    text: "Would you be available for a brief 15-minute discovery call this week to finalize requirements and architecture?"
  },
  {
    icon: '💼',
    title: 'Send Estimate',
    text: "We have finalized a customized development roadmap and estimate based on your requested features."
  },
  {
    icon: '⚡',
    title: 'Sprint Kickoff',
    text: "Everything is verified! We are ready to initiate the development sprint onboarding."
  },
  {
    icon: '📋',
    title: 'Request Assets',
    text: "Could you please share your brand assets, logo files, or reference websites to help us tailor the wireframes?"
  },
  {
    icon: '💰',
    title: 'Milestone Structure',
    text: "We can structure this project into 3 phased milestones with clear deliverables for each stage."
  }
];

const CLIENT_QUICK_ACTIONS = [
  {
    icon: '💬',
    title: 'Timeline Inquiry',
    text: "Hi team, what is our estimated development timeline for the first sprint milestone?"
  },
  {
    icon: '📅',
    title: 'Schedule Call',
    text: "I would like to schedule a quick video call with the engineering team to clarify requirements."
  },
  {
    icon: '📝',
    title: 'Added Specifications',
    text: "I have added some new feature requirements and design references to the project scope."
  },
  {
    icon: '🚀',
    title: 'Ready to Proceed',
    text: "The proposal looks solid! What are the next steps to kick off the development sprint?"
  }
];

// Helper to render text with clickable URLs
const renderFormattedText = (text) => {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 underline hover:text-cyan-200 transition-colors inline-flex items-center gap-1 font-medium break-all"
        >
          <span>{part}</span>
          <ExternalLink size={11} className="inline flex-shrink-0" />
        </a>
      );
    }
    return part;
  });
};

const ProjectChatModal = ({ 
  lead, 
  onClose, 
  role = 'admin', // 'admin' or 'client'
  onStatusChange,
  currentUserName
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isTypingRemote, setIsTypingRemote] = useState(false);
  const [showLeadDetailsPanel, setShowLeadDetailsPanel] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(lead?.status || 'Pending');
  const [copiedSpecs, setCopiedSpecs] = useState(false);
  const [internalNotes, setInternalNotes] = useState(lead?.adminNotes || '');
  const [savingNotes, setSavingNotes] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);

  // Lock body scroll on mount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard shortcut: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Sync status & notes
  useEffect(() => {
    if (lead?.status) setCurrentStatus(lead.status);
    if (lead?.adminNotes !== undefined) setInternalNotes(lead.adminNotes);
  }, [lead?.status, lead?.adminNotes]);

  // Load message history and initialize socket
  useEffect(() => {
    if (!lead?._id) return;

    let isMounted = true;
    const socket = getSocket();
    socketRef.current = socket;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/project-requests/${lead._id}/messages`);
        if (isMounted) {
          setMessages(data);
          scrollToBottom();
        }
      } catch (err) {
        console.error('Failed to load consultation messages:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();

    // Join lead conversation room
    socket.emit('join_project_room', lead._id);

    // Listen for new incoming messages
    const handleNewMessage = (msg) => {
      if (msg.projectRequest === lead._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
        scrollToBottom();
      }
    };

    // Listen for remote typing
    const handleRemoteTyping = ({ senderRole }) => {
      if ((role === 'admin' && senderRole === 'client') || (role === 'client' && senderRole === 'admin')) {
        setIsTypingRemote(true);
      }
    };

    const handleRemoteStopTyping = () => {
      setIsTypingRemote(false);
    };

    // Listen for status updates
    const handleStatusUpdate = ({ projectId, status }) => {
      if (projectId === lead._id) {
        setCurrentStatus(status);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleRemoteTyping);
    socket.on('user_stop_typing', handleRemoteStopTyping);
    socket.on('project_status_updated', handleStatusUpdate);

    return () => {
      isMounted = false;
      socket.emit('leave_project_room', lead._id);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleRemoteTyping);
      socket.off('user_stop_typing', handleRemoteStopTyping);
      socket.off('project_status_updated', handleStatusUpdate);
    };
  }, [lead?._id, role]);

  const scrollToBottom = (behavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 80);
  };

  // Handle typing debounce
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    const socket = socketRef.current || getSocket();
    if (lead?._id) {
      socket.emit('typing', {
        projectId: lead._id,
        senderName: currentUserName || (role === 'admin' ? 'CodeFusion Team' : 'Client'),
        senderRole: role,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { projectId: lead._id });
      }, 1500);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || sending || !lead?._id) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    const socket = socketRef.current || getSocket();
    socket.emit('stop_typing', { projectId: lead._id });

    try {
      const { data } = await api.post(`/api/project-requests/${lead._id}/messages`, {
        text: messageText,
      });

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === data._id);
        return exists ? prev : [...prev, data];
      });
      scrollToBottom();
    } catch (err) {
      console.error('Failed to dispatch message:', err);
      toast.error('Failed to send message. Please retry.');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setCurrentStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(lead._id, newStatus);
    } else {
      try {
        await api.put(`/api/project-requests/${lead._id}/status`, { status: newStatus });
        toast.success(`Project status marked as ${newStatus}`);
      } catch (err) {
        console.error('Status update failed:', err);
      }
    }
  };

  const handleSaveInternalNotes = async () => {
    if (!lead?._id) return;
    setSavingNotes(true);
    try {
      await api.put(`/api/project-requests/${lead._id}/status`, {
        adminNotes: internalNotes
      });
      toast.success('Private team notes saved!');
    } catch (err) {
      console.error('Failed to save notes:', err);
      toast.error('Could not save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const copyLeadSummary = () => {
    const summary = `
📌 CODEFUSION PROJECT LEAD
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 Business: ${lead?.businessName || 'N/A'} (${lead?.businessType || 'General'})
👤 Contact: ${lead?.contactPerson || 'N/A'}
📧 Email: ${lead?.emailAddress || 'N/A'}
📱 Phone: ${lead?.mobileNumber || 'N/A'}
🌐 Website Type: ${lead?.websiteType || 'Custom'}
💰 Estimated Budget: ${lead?.budget || 'Not specified'}
🚀 Target Launch: ${lead?.expectedLaunchDate || 'Flexible'}
🏷️ Features: ${(lead?.featuresNeeded || []).join(', ') || 'Standard Scope'}
🌐 Domain: ${lead?.domainAvailable || 'N/A'} | Hosting: ${lead?.hostingAvailable || 'N/A'}
📝 Brief: ${lead?.description || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedSpecs(true);
    toast.success('Lead specifications copied to clipboard!');
    setTimeout(() => setCopiedSpecs(false), 2000);
  };

  const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Pending'];
  const quickActions = role === 'admin' ? ADMIN_QUICK_ACTIONS : CLIENT_QUICK_ACTIONS;

  // Phone WhatsApp link
  const rawPhone = (lead?.mobileNumber || '').replace(/[^0-9]/g, '');
  const whatsAppPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
  const whatsAppGreeting = encodeURIComponent(
    `Hello ${lead?.contactPerson || 'there'}! I am following up on your CodeFusion project consultation for "${lead?.businessName}". Let's discuss your timeline & architecture.`
  );
  const whatsAppUrl = `https://wa.me/${whatsAppPhone}?text=${whatsAppGreeting}`;

  // Teleport modal via React Portal directly into document.body to break free of any stacking contexts
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      
      {/* 1. Full-Coverage Backdrop (Blocks the top navbar and any page contents completely) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl z-0"
      />

      {/* 2. Main Executive Consultation Chamber Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        className="relative z-10 w-full max-w-7xl h-[94vh] max-h-[920px] bg-[#07070d]/95 backdrop-blur-3xl border border-white/10 ring-1 ring-white/10 rounded-[2.25rem] sm:rounded-[2.75rem] shadow-[0_30px_120px_rgba(0,0,0,0.95),0_0_80px_rgba(59,130,246,0.18)] flex flex-col overflow-hidden"
      >
        {/* Top ambient highlight gradient line */}
        <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent pointer-events-none" />

        {/* ============================================================== */}
        {/* HEADER BAR                                                     */}
        {/* ============================================================== */}
        <div className="px-5 py-4 sm:px-7 sm:py-4.5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between relative z-10 flex-shrink-0">
          
          {/* Left: Client & Project Lead Identity */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-[#0c0d18] rounded-[14px] flex items-center justify-center text-white font-black text-lg">
                  {lead?.businessName ? lead.businessName.charAt(0).toUpperCase() : 'C'}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#07070d] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white truncate tracking-tight">
                  {lead?.businessName || 'Project Consultation'}
                </h2>
                
                {/* Status Badge */}
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${statusInfo.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  <span>{statusInfo.label}</span>
                </span>

                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time Active</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/50 truncate mt-0.5">
                <span className="text-white/80 font-medium">{lead?.contactPerson || 'Client Lead'}</span>
                <span>•</span>
                <span className="text-white/60 truncate">{lead?.emailAddress}</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline text-blue-400 font-semibold">{lead?.websiteType}</span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Quick WhatsApp Outreach (Admin Only) */}
            {role === 'admin' && whatsAppPhone && (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                title="Launch WhatsApp Chat with Client"
              >
                <MessageCircle size={14} className="text-emerald-400" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
            )}

            {/* Copy Lead Specs Button */}
            <button
              onClick={copyLeadSummary}
              className="p-2.5 sm:px-3 sm:py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy Project Details"
            >
              {copiedSpecs ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="hidden md:inline">{copiedSpecs ? 'Copied' : 'Copy Specs'}</span>
            </button>

            {/* Status changer select (Admin only) */}
            {role === 'admin' && (
              <div className="relative hidden sm:block">
                <select
                  value={currentStatus}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 text-xs font-bold rounded-2xl pl-3 pr-8 py-2 outline-none cursor-pointer focus:border-blue-500/50 transition-colors"
                >
                  <option value="Pending" className="bg-[#10111a] text-white">Pending</option>
                  <option value="Reviewed" className="bg-[#10111a] text-white">Reviewed</option>
                  <option value="In Progress" className="bg-[#10111a] text-white">In Progress</option>
                  <option value="Completed" className="bg-[#10111a] text-white">Completed</option>
                  <option value="Rejected" className="bg-[#10111a] text-white">Archived</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
            )}

            {/* Toggle Project Specs Button */}
            <button
              onClick={() => setShowLeadDetailsPanel(!showLeadDetailsPanel)}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showLeadDetailsPanel
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white/70 hover:text-white'
              }`}
              title="Toggle Project Specs Panel"
            >
              <FileText size={14} />
              <span className="hidden lg:inline">{showLeadDetailsPanel ? 'Hide Specs' : 'Lead Specs'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 text-white/60 hover:text-rose-300 transition-all cursor-pointer ml-1"
              aria-label="Close consultation modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN BODY: SPLIT VIEW (CHAT STREAM + LEAD INTELLIGENCE)        */}
        {/* ============================================================== */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          
          {/* Chat Stream Column */}
          <div className="flex-1 flex flex-col min-w-0 bg-transparent">
            
            {/* Scrollable Message History Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              {/* ======================================================== */}
              {/* EXECUTIVE PROJECT BRIEFING CARD (ALWAYS VISIBLE AT TOP)   */}
              {/* ======================================================== */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] shadow-[0_15px_40px_rgba(0,0,0,0.4)] relative overflow-hidden mb-6"
              >
                {/* Subtle back ambient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Sparkles size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">
                        Consultation Chamber Initialized
                      </h4>
                      <p className="text-[10px] text-white/40">
                        Direct channel between Client & CodeFusion Engineering Leads
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <Clock size={11} />
                    <span>Inquiry logged {new Date(lead?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* 4 Core Pillars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">Category</span>
                    <span className="text-white/95 font-bold truncate block mt-1 text-sm">{lead?.websiteType || 'Custom Solution'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400/70 block font-bold uppercase tracking-wider">Estimated Budget</span>
                    <span className="text-emerald-300 font-extrabold truncate block mt-1 text-sm">{lead?.budget || 'Custom Scope'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-500/[0.04] border border-purple-500/20">
                    <span className="text-[10px] text-purple-400/70 block font-bold uppercase tracking-wider">Launch Target</span>
                    <span className="text-purple-300 font-extrabold truncate block mt-1 text-sm">{lead?.expectedLaunchDate || 'Flexible'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] text-white/40 block font-bold uppercase tracking-wider">Domain / Hosting</span>
                    <span className="text-white/90 font-bold truncate block mt-1 text-xs">
                      {lead?.domainAvailable === 'Yes' ? 'Domain Ready' : 'Domain Needed'} • {lead?.hostingAvailable === 'Yes' ? 'Hosting Ready' : 'Cloud Setup'}
                    </span>
                  </div>
                </div>

                {/* Client's Requirement Statement */}
                {lead?.description && (
                  <div className="mt-3.5 pt-3.5 border-t border-white/[0.05]">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-wider block mb-1.5">
                      Client Project Statement:
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/5 font-sans italic">
                      "{lead.description}"
                    </p>
                  </div>
                )}

                {/* Requested Feature Chips */}
                {lead?.featuresNeeded?.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-white/[0.05] flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-white/40 uppercase font-bold mr-1">Target Capabilities:</span>
                    {lead.featuresNeeded.map((feat, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 text-[10px] font-semibold">
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Messages Stream */}
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-white/40 gap-3">
                  <RefreshCw className="animate-spin text-blue-400" size={26} />
                  <span className="text-xs font-semibold">Synchronizing encrypted consultation stream...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-white/40 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3.5 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    <Zap size={24} />
                  </div>
                  <p className="text-sm font-bold text-white">Direct Channel Ready</p>
                  <p className="text-xs text-white/50 max-w-md mt-1 leading-relaxed">
                    {role === 'admin'
                      ? `Send an instant response to discuss milestones, clarify specifications, or onboard ${lead?.contactPerson}.`
                      : 'Ask questions, share extra wireframes, or chat directly with CodeFusion lead engineers in real-time.'}
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isCurrentSender =
                    (role === 'admin' && msg.senderRole === 'admin') ||
                    (role === 'client' && msg.senderRole === 'client');

                  const isAdminMessage = msg.senderRole === 'admin';

                  return (
                    <motion.div
                      key={msg._id || index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isCurrentSender ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender Meta Tag */}
                      <div className="flex items-center gap-1.5 text-[10px] text-white/40 mb-1 px-1">
                        <span className={`font-bold ${isAdminMessage ? 'text-purple-400' : 'text-blue-400'}`}>
                          {isAdminMessage ? 'CodeFusion Lead Engineer' : (lead?.contactPerson || 'Client')}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Message Bubble Container */}
                      <div className={`flex items-end gap-2.5 max-w-[85%] sm:max-w-[75%] ${isCurrentSender ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Mini Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 shadow-lg ${
                          isAdminMessage
                            ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400/40'
                            : 'bg-gradient-to-tr from-blue-600 to-cyan-600 border border-blue-400/40'
                        }`}>
                          {isAdminMessage ? 'CF' : (lead?.contactPerson ? lead.contactPerson.charAt(0).toUpperCase() : 'U')}
                        </div>

                        {/* Bubble Body */}
                        <div
                          className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                            isCurrentSender
                              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-br-none shadow-[0_8px_30px_rgba(79,70,229,0.35)]'
                              : 'bg-white/[0.07] text-white/95 border border-white/10 rounded-bl-none backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                          }`}
                        >
                          <p className="whitespace-pre-wrap select-text">
                            {renderFormattedText(msg.text)}
                          </p>
                          
                          <div className={`flex items-center justify-end gap-1 mt-1.5 text-[9px] ${isCurrentSender ? 'text-white/70' : 'text-white/40'}`}>
                            {isCurrentSender && <CheckCheck size={13} className="text-white/90" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Remote Typing Indicator */}
              {isTypingRemote && (
                <div className="flex items-center gap-2 text-xs text-blue-400 pl-2 py-1">
                  <div className="flex items-center gap-1 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1 text-[11px] font-semibold text-white/60">
                      {role === 'admin' ? `${lead?.contactPerson || 'Client'} is typing...` : 'CodeFusion Lead Engineer is typing...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ======================================================== */}
            {/* QUICK ACTIONS BAR (EXPANDABLE / NO TRUNCATION ELLIPSIS)   */}
            {/* ======================================================== */}
            <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.015] flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-white/40 whitespace-nowrap pl-1 pr-2 border-r border-white/5">
                <Sparkles size={11} className="text-blue-400" />
                <span>Quick Actions</span>
              </div>

              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setNewMessage(action.text);
                    inputRef.current?.focus();
                  }}
                  className="group px-3 py-1.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-blue-500/40 text-[11px] text-white/80 hover:text-white transition-all whitespace-nowrap flex items-center gap-2 shadow-sm cursor-pointer"
                  title={action.text}
                >
                  <span className="text-sm">{action.icon}</span>
                  <span className="font-semibold text-white/90">{action.title}</span>
                </button>
              ))}
            </div>

            {/* ======================================================== */}
            {/* INPUT COMPOSER BAR                                       */}
            {/* ======================================================== */}
            <form onSubmit={handleSendMessage} className="p-3.5 sm:p-5 border-t border-white/[0.08] bg-black/60 flex items-center gap-3 flex-shrink-0">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder={
                    role === 'admin'
                      ? `Reply to ${lead?.contactPerson || 'Client'}... (Press Enter ↵ to send)`
                      : 'Message CodeFusion Lead Engineers... (Press Enter ↵ to send)'
                  }
                  className="w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl pl-4 pr-16 py-3.5 text-xs sm:text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/60 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                />

                <span className="hidden sm:inline-flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-bold uppercase tracking-wider bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5">
                  <span>Enter</span>
                  <CornerDownLeft size={10} />
                </span>
              </div>

              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(79,70,229,0.55)] transition-all flex items-center justify-center flex-shrink-0 cursor-pointer transform active:scale-95"
                title="Send Message"
              >
                {sending ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: LEAD INTELLIGENCE DRAWER                       */}
          {/* ============================================================ */}
          <AnimatePresence>
            {showLeadDetailsPanel && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 340, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="hidden lg:flex flex-col border-l border-white/[0.08] bg-[#090a12]/95 overflow-y-auto p-5 space-y-5 flex-shrink-0"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-blue-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">Lead Intelligence</h3>
                  </div>
                  <button
                    onClick={() => setShowLeadDetailsPanel(false)}
                    className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Client Profile Card */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider">Client Identity</span>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Contact:</span>
                      <strong className="text-white">{lead?.contactPerson || 'N/A'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Email:</span>
                      <a href={`mailto:${lead?.emailAddress}`} className="text-blue-400 hover:underline truncate max-w-[170px]">
                        {lead?.emailAddress || 'N/A'}
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Mobile:</span>
                      <a href={`tel:${lead?.mobileNumber}`} className="text-emerald-400 font-semibold hover:underline">
                        {lead?.mobileNumber || 'N/A'}
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Business:</span>
                      <strong className="text-white">{lead?.businessType || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Project Specs */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider">Scope Metrics</span>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Service:</span>
                      <strong className="text-blue-400">{lead?.websiteType || 'Custom'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Budget:</span>
                      <strong className="text-emerald-400 font-bold">{lead?.budget || 'Custom Quote'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Launch:</span>
                      <strong className="text-purple-400">{lead?.expectedLaunchDate || 'Flexible'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Domain:</span>
                      <strong className="text-white">{lead?.domainAvailable || 'N/A'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Hosting:</span>
                      <strong className="text-white">{lead?.hostingAvailable || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Requested Capabilities */}
                {lead?.featuresNeeded?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider">Requested Features</span>
                    <div className="flex flex-wrap gap-1.5">
                      {lead.featuresNeeded.map((f, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference Website Link */}
                {lead?.referenceWebsite && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider">Design Reference</span>
                    <a 
                      href={lead.referenceWebsite.startsWith('http') ? lead.referenceWebsite : `https://${lead.referenceWebsite}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 truncate flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <Globe size={13} className="text-blue-400 flex-shrink-0" />
                      <span className="truncate">{lead.referenceWebsite}</span>
                      <ExternalLink size={12} className="flex-shrink-0 ml-auto" />
                    </a>
                  </div>
                )}

                {/* Admin Internal Scratchpad & Pricing Notes (Admin only) */}
                {role === 'admin' && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-amber-400/90 tracking-wider flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>Private Team Notes</span>
                      </span>
                    </div>

                    <textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="Add private milestone estimates, pricing formulas, or internal notes..."
                      rows={3}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400/50 resize-none font-sans"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveInternalNotes}
                        disabled={savingNotes}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                      >
                        {savingNotes ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                        <span>Save Notes</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Outreach CTA Buttons */}
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  {whatsAppPhone && (
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    >
                      <MessageCircle size={14} className="text-emerald-400" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${lead?.emailAddress}?subject=CodeFusion%20Project%20Consultation%20-%20${encodeURIComponent(lead?.businessName || '')}`}
                    className="w-full py-2.5 px-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail size={14} className="text-blue-400" />
                    <span>Send Formal Email</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );

  // Render modal at document.body level
  return createPortal(modalContent, document.body);
};

export default ProjectChatModal;
