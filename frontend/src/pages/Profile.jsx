import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, CheckCircle2, Loader2, MessageSquare, 
  Send, Sparkles, Plus, Clock, ExternalLink, RefreshCw, X, Shield, ArrowRight
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/client';
import ProjectChatModal from '../components/common/ProjectChatModal';

const STATUS_CONFIG = {
  'Pending': { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: 'Pending Review', dot: 'bg-amber-400' },
  'Reviewed': { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: 'Reviewed', dot: 'bg-blue-400' },
  'In Progress': { color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', label: 'In Progress', dot: 'bg-purple-400' },
  'Completed': { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Completed', dot: 'bg-emerald-400' },
  'Rejected': { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: 'Archived', dot: 'bg-rose-400' },
};

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') === 'requests' ? 'requests' : 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Project Requests State
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [activeChatRequest, setActiveChatRequest] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchMyRequests();
    }
  }, [user, navigate]);

  const fetchMyRequests = async () => {
    try {
      setLoadingRequests(true);
      const { data } = await api.get('/api/project-requests/myrequests');
      setMyRequests(data);
    } catch (err) {
      console.error('Failed to fetch user requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setProfileMsg({ type: '', text: '' });
    
    const res = await updateProfile(profileData);
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMsg({ type: 'error', text: res.error });
    }
    setIsUpdating(false);
  };

  // Open live chat with Admin
  const openChat = (request) => {
    setActiveChatRequest(request);
    setMyRequests((prev) =>
      prev.map((r) => (r._id === request._id ? { ...r, unreadByClient: 0 } : r))
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 relative bg-[#030305] overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Background Mesh */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-purple-600/15 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Profile Navigation Tabs Switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl relative shadow-lg">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center gap-2 ${
                activeTab === 'profile' ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {activeTab === 'profile' && (
                <motion.div
                  layoutId="profile-tab-pill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <User size={14} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center gap-2 ${
                activeTab === 'requests' ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {activeTab === 'requests' && (
                <motion.div
                  layoutId="profile-tab-pill"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <MessageSquare size={14} />
              <span>Project Inquiries & Live Chat</span>
              {myRequests.some((r) => r.unreadByClient > 0) && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: Profile Information */}
        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden p-8 sm:p-12 relative"
          >
            <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

            <div className="flex flex-col items-center mb-8 text-center">
              <div className="relative group mb-5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-2xl rounded-full scale-[1.5]" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/20">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">{user.name || 'Account'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                {user.role === 'admin' ? 'Super Admin' : 'Verified Client'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {profileMsg.text && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }} 
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-center gap-2 shadow-inner border ${profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {profileMsg.type === 'success' ? <CheckCircle2 size={15} /> : <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    {profileMsg.text}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] pl-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={16} className="text-white/30 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-blue-500/50 text-white placeholder-white/30 text-sm font-medium transition-all"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} className="text-white/30 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-blue-500/50 text-white placeholder-white/30 text-sm font-medium transition-all"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] pl-1">Mobile Phone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={16} className="text-white/30 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-blue-500/50 text-white placeholder-white/30 text-sm font-medium transition-all"
                    placeholder="Your mobile phone"
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit" 
                disabled={isUpdating}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-2xl mt-3 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center text-sm"
              >
                {isUpdating ? <Loader2 className="animate-spin" size={17} /> : 'Save Changes'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* TAB 2: Project Inquiries & Real-time Live Chat */}
        {activeTab === 'requests' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">My Project Inquiries</h2>
                <p className="text-xs text-white/50 mt-0.5">Track your project submissions and converse with CodeFusion engineers in real-time.</p>
              </div>

              <Link
                to="/start-project"
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all"
              >
                <Plus size={14} />
                <span>Start New Project</span>
              </Link>
            </div>

            {loadingRequests ? (
              <div className="py-20 flex flex-col items-center justify-center text-white/40 gap-3">
                <RefreshCw className="animate-spin text-blue-400" size={24} />
                <span className="text-xs">Fetching your project requests...</span>
              </div>
            ) : myRequests.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] p-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={26} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No Project Requests Yet</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto mb-6">
                  Ready to build a digital experience? Fill out the project questionnaire to receive instant custom estimates and real-time engineering consultation.
                </p>
                <Link
                  to="/start-project"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                >
                  <span>Start Your Project</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myRequests.map((req) => {
                  const statusInfo = STATUS_CONFIG[req.status] || STATUS_CONFIG['Pending'];
                  const hasUnread = req.unreadByClient > 0;

                  return (
                    <div
                      key={req._id}
                      className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                        hasUnread 
                          ? 'bg-gradient-to-r from-purple-900/15 via-[#0c0d18] to-blue-900/15 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                          : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.08]'
                      }`}
                    >
                      {hasUnread && (
                        <div className="absolute top-0 right-0 px-3.5 py-1 bg-gradient-to-l from-purple-600 to-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl shadow-lg flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span>Admin Replied</span>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-black text-white tracking-tight">{req.businessName}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${statusInfo.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-white/50 flex-wrap">
                            <span><strong>Type:</strong> {req.websiteType}</span>
                            <span>•</span>
                            <span><strong>Budget:</strong> {req.budget}</span>
                            <span>•</span>
                            <span><strong>Target:</strong> {req.expectedLaunchDate}</span>
                          </div>

                          {req.lastMessage && (
                            <p className="text-xs text-white/40 pt-1 line-clamp-1">
                              <strong className="text-white/60 font-semibold uppercase text-[10px] mr-1">
                                {req.lastMessage.senderRole === 'admin' ? 'CodeFusion Team' : 'You'}:
                              </strong>
                              {req.lastMessage.text}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => openChat(req)}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.55)] transition-all"
                        >
                          <MessageSquare size={14} />
                          <span>Live Chat with Engineers</span>
                          {hasUnread && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* REAL-TIME CLIENT CONVERSATION CHAT MODAL */}
      <AnimatePresence>
        {activeChatRequest && (
          <ProjectChatModal
            lead={activeChatRequest}
            onClose={() => setActiveChatRequest(null)}
            role="client"
            currentUserName={user?.name || 'Client'}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
