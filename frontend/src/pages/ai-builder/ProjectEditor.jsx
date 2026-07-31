import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paperclip, Image as ImageIcon, File, Link as LinkIcon, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAiBuilder } from '../../hooks/useAiBuilder';
import SplitView from '../../components/ai-builder/layout/SplitView';
import LivePreview from '../../components/ai-builder/LivePreview';

const ProjectEditor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { loadProject, currentProject, currentPages, activePage, loading, submitPrompt, chatHistory } = useAiBuilder();
  
  const [promptText, setPromptText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setAttachments(prev => [...prev, { type, file, name: file.name }]);
      setShowAttachMenu(false);
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setAttachments(prev => [...prev, { type: 'url', url: urlInput, name: urlInput }]);
      setUrlInput('');
      setShowUrlInput(false);
      setShowAttachMenu(false);
    }
  };
  
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleInput = (e) => {
    setPromptText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt(e);
    }
  };

  const handleSendPrompt = (e) => {
    e.preventDefault();
    if (!promptText.trim() && attachments.length === 0) return;
    submitPrompt(promptText, attachments);
    setPromptText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  if (loading && !currentProject) {
    return <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">Loading Builder...</div>;
  }

  if (!currentProject) {
    return <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">Project not found.</div>;
  }

  const leftPanel = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/5 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/builder')} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">
            <span className="text-lg leading-none -mt-0.5">&larr;</span>
          </button>
          <div>
            <h2 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">{currentProject.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-xs font-medium text-gray-500 capitalize tracking-wide">{currentProject.status}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl rounded-tl-sm text-sm text-gray-300 shadow-lg relative max-w-[90%]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-purple-400" />
            <span className="font-semibold text-white">FusionAI</span>
          </div>
          Hello! I'm ready to build your website. To get the best results, could you describe your target audience and the primary goal of your site?
        </div>
        
        {chatHistory?.map((msg, index) => {
          const isUser = msg.role === 'user' || !msg.role;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg._id || index} 
              className={`flex flex-col space-y-1 mb-2 ${isUser ? 'items-end' : 'items-start'}`}
            >
              {isUser ? (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-3.5 rounded-2xl rounded-br-sm text-sm max-w-[85%] shadow-lg shadow-blue-900/20 font-medium">
                  {msg.content}
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 p-4 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-purple-400" />
                    <span className="font-semibold text-white">FusionAI</span>
                  </div>
                  <div className="leading-relaxed">
                    {msg.content}
                  </div>
                  {msg.status === 'completed' && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <span className="text-green-400 text-[10px]">✓</span>
                      </div>
                      <span className="text-gray-400">Project structure updated successfully.</span>
                    </div>
                  )}
                </div>
              )}
              {/* Legacy fallback for old messages without roles but with completed status */}
              {isUser && msg.status === 'completed' && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 p-3.5 rounded-2xl rounded-bl-sm text-sm max-w-[85%] shadow-xl flex items-center gap-2 mt-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  Updated project layout and styling.
                </div>
              )}
            </motion.div>
          );
        })}
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl rounded-bl-sm text-sm text-blue-400 self-start w-3/4 shadow-xl flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
            AI is thinking and updating your project...
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#09090b] flex flex-col relative z-20">
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all duration-300">
          
          {/* Attachment Previews */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mb-2 px-2 pt-1"
              >
                {attachments.map((att, idx) => (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                    key={idx} 
                    className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-md text-xs text-gray-300 px-3 py-1.5 rounded-full border border-gray-700/50 hover:bg-gray-700/80 transition-colors"
                  >
                    {att.type === 'image' && <ImageIcon size={12} className="text-blue-400" />}
                    {att.type === 'file' && <File size={12} className="text-purple-400" />}
                    {att.type === 'url' && <LinkIcon size={12} className="text-green-400" />}
                    <span className="truncate max-w-[150px] font-medium">{att.name}</span>
                    <button type="button" onClick={() => removeAttachment(idx)} className="hover:text-white ml-1 text-gray-400"><X size={12} /></button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* URL Input Dropdown */}
          <AnimatePresence>
            {showUrlInput && (
              <motion.form 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                onSubmit={handleAddUrl} 
                className="absolute bottom-full left-4 mb-3 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex gap-2 shadow-2xl z-30"
              >
                <input 
                  autoFocus
                  type="url" 
                  placeholder="https://..." 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-gray-800/50 text-sm px-3 py-2 rounded-lg outline-none border border-transparent focus:border-blue-500 w-56 transition-colors"
                />
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-500 font-medium transition-colors shadow-lg shadow-blue-900/20">Add</button>
                <button type="button" onClick={() => setShowUrlInput(false)} className="text-gray-400 hover:text-white px-2 transition-colors"><X size={16} /></button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Attach Menu */}
          <AnimatePresence>
            {showAttachMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-[3.5rem] left-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl py-2 w-44 shadow-2xl z-30 overflow-hidden"
              >
                <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
                  <ImageIcon size={16} className="text-blue-400" /> Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                </label>
                <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
                  <File size={16} className="text-purple-400" /> Upload File
                  <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => handleFileUpload(e, 'file')} />
                </label>
                <button type="button" onClick={() => { setShowUrlInput(true); setShowAttachMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
                  <LinkIcon size={16} className="text-green-400" /> Add URL
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSendPrompt} className="relative flex items-end gap-2 px-1 pb-1">
            <button 
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <Paperclip size={20} />
            </button>
            
            <textarea
              ref={textareaRef}
              value={promptText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Design a modern landing page..."
              rows={1}
              className="w-full bg-transparent resize-none py-2.5 text-sm focus:outline-none disabled:opacity-50 no-scrollbar placeholder-gray-500 leading-relaxed max-h-[150px]"
            />
            
            <button 
              type="submit"
              disabled={loading || (!promptText.trim() && attachments.length === 0)}
              className="p-2.5 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:bg-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/20 text-white shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Sparkles size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const centerPanel = (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center bg-repeat opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Premium Browser Chrome */}
      <div className="h-14 border-b border-white/5 bg-gray-900/40 backdrop-blur-xl z-20 flex items-center px-4 justify-between shadow-2xl relative">
        <div className="flex space-x-2">
          <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors shadow-inner"></button>
          <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors shadow-inner"></button>
          <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors shadow-inner"></button>
        </div>
        
        {/* Center URL Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 w-64 h-7 bg-black/40 border border-white/5 rounded-md flex items-center justify-center shadow-inner overflow-hidden">
          <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5 truncate px-3">
            <span className="text-gray-600">🔒</span>
            {activePage ? `localhost:5173${activePage.path}` : 'Live Preview'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {currentProject && (
            <button 
              onClick={() => window.open(`/preview/${currentProject._id}${activePage ? `?pageId=${activePage._id}` : ''}`, '_blank')}
              className="text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded-md transition-all shadow-lg"
            >
              Open Full Screen
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 lg:p-8 relative z-10 no-scrollbar">
        {currentPages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Send a prompt to the AI to generate your website structure.
          </div>
        ) : (
          <LivePreview page={activePage} branding={currentProject.branding} />
        )}
      </div>
    </div>
  );

  return <SplitView leftPanel={leftPanel} centerPanel={centerPanel} />;
};

export default ProjectEditor;
