import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, Folder, BookOpen, ArrowRight, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], resources: [], templates: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query) {
      setResults({ projects: [], resources: [], templates: [] });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/search?q=${query}`);
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-3xl bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 px-6 py-4 border-b border-[color:var(--border)]">
              <Search className="text-[color:var(--foreground)] opacity-50" size={24} />
              <input
                type="text"
                autoFocus
                placeholder="Search projects, resources, templates..."
                className="flex-grow bg-transparent text-[color:var(--foreground)] text-lg focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={onClose} className="p-2 bg-[color:var(--secondary)] rounded-full hover:bg-[color:var(--border)] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : query && (!results.projects || results.projects.length === 0) && (!results.resources || results.resources.length === 0) && (!results.templates || results.templates.length === 0) ? (
                <div className="text-center py-12 text-[color:var(--foreground)] opacity-60">
                  No results found for "{query}"
                </div>
              ) : !query ? (
                <div className="text-center py-12 text-[color:var(--foreground)] opacity-40">
                  Type to start searching...
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {results.projects && results.projects.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--foreground)] opacity-50 px-2 mb-3">Projects ({results.projects.length})</h3>
                      <div className="flex flex-col gap-2">
                        {results.projects.map(project => (
                          <Link 
                            key={project._id} 
                            to={`/work/${project.slug}`}
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-[color:var(--secondary)] transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                <Folder size={18} />
                              </div>
                              <div>
                                <h4 className="font-bold">{project.title}</h4>
                                <p className="text-xs text-[color:var(--foreground)] opacity-60">{project.category}</p>
                              </div>
                            </div>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.templates && results.templates.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--foreground)] opacity-50 px-2 mb-3">Templates ({results.templates.length})</h3>
                      <div className="flex flex-col gap-2">
                        {results.templates.map(template => (
                          <Link 
                            key={template._id} 
                            to={`/templates/${template._id}`}
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-[color:var(--secondary)] transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                <LayoutTemplate size={18} />
                              </div>
                              <div>
                                <h4 className="font-bold">{template.title}</h4>
                                <p className="text-xs text-[color:var(--foreground)] opacity-60">{template.category} • {template.price > 0 ? `₹${template.price}` : 'Free'}</p>
                              </div>
                            </div>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.resources && results.resources.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--foreground)] opacity-50 px-2 mb-3">Resources ({results.resources.length})</h3>
                      <div className="flex flex-col gap-2">
                        {results.resources.map(resource => (
                          <Link 
                            key={resource._id} 
                            to={`/resources/${resource.slug}`}
                            onClick={onClose}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-[color:var(--secondary)] transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                                <BookOpen size={18} />
                              </div>
                              <div>
                                <h4 className="font-bold">{resource.title}</h4>
                                <p className="text-xs text-[color:var(--foreground)] opacity-60">{resource.category}</p>
                              </div>
                            </div>
                            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;
