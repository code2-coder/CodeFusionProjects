import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, Download, ArrowRight, User } from 'lucide-react';
import Footer from '../components/Footer';

const resourceCategories = [
  'All', 'Blog Articles', 'Tutorials', 'Free Templates', 'Premium Templates',
  'UI Kits', 'Components', 'Source Code', 'Design Inspiration', 'Documentation',
  'Case Studies', 'Downloads', 'News'
];

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await axios.get('/api/resources');
        const published = data.filter(r => r.published);
        setResources(published);
        setFilteredResources(published);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setLoading(false);
      }
    };
    fetchResources();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(r => r.category === activeCategory));
    }
  }, [activeCategory, resources]);

  return (
    <div className="min-h-screen bg-[color:var(--background)] pt-24 pb-0 flex flex-col relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-8"
          >
            <BookOpen size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-purple-200">Resources</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Knowledge, Tools & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Inspiration</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[color:var(--foreground)] opacity-70 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Discover articles, guides, templates, UI kits, development resources, and free downloads designed to help businesses, developers, and designers build better digital products.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 relative z-10 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {resourceCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-purple-600 text-white shadow-md' : 'bg-[color:var(--card)] border border-[color:var(--border)] text-[color:var(--foreground)] opacity-80 hover:opacity-100 hover:border-purple-500/50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="px-6 pb-24 relative z-10 flex-grow">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {filteredResources.length === 0 ? (
                <div className="text-center py-20 bg-[color:var(--card)] border border-[color:var(--border)] rounded-3xl">
                  <h3 className="text-2xl font-bold mb-2">No resources found</h3>
                  <p className="text-[color:var(--foreground)] opacity-70">Check back later or try a different category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredResources.map((resource) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={resource._id}
                        className="group relative glass-card rounded-3xl border border-[color:var(--border)] overflow-hidden flex flex-col hover:border-purple-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="relative h-56 overflow-hidden bg-black">
                          {resource.coverImage ? (
                            <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                              <BookOpen size={48} className="text-white/20" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white">
                            {resource.category}
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">{resource.title}</h3>
                          <p className="text-[color:var(--foreground)] opacity-70 text-sm mb-6 flex-grow line-clamp-3">
                            {resource.excerpt}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-[color:var(--foreground)] opacity-60 mb-6">
                            {resource.author && (
                              <div className="flex items-center gap-1">
                                <User size={14} /> {resource.author}
                              </div>
                            )}
                            {resource.readingTime && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} /> {resource.readingTime}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              {new Date(resource.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[color:var(--border)]">
                            <Link to={`/resources/${resource.slug}`} className="flex-grow flex items-center justify-center gap-2 px-4 py-2 bg-[color:var(--secondary)] hover:bg-[color:var(--card)] border border-[color:var(--border)] text-[color:var(--foreground)] font-bold rounded-xl transition-colors text-sm group-hover:border-purple-500/50">
                              Read More
                              <ArrowRight size={14} />
                            </Link>
                            
                            {resource.downloads && resource.downloads.length > 0 && (
                              <a href={resource.downloads[0]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors tooltip-trigger" title="Download">
                                <Download size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
