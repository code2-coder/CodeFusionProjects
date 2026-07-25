import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Search, Tag, Rocket, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([{ name: 'All' }]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceType, setPriceType] = useState('All');

  const priceOptions = ['All', 'Free', 'Premium'];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await axios.get('/api/templates');
        setTemplates(data.filter(t => t.status === 'Published'));
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories([{ name: 'All' }, ...data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const initialize = async () => {
      await Promise.all([fetchTemplates(), fetchCategories()]);
      setLoading(false);
    };

    initialize();
  }, []);

  const filteredTemplates = templates.filter(tpl => {
    const title = tpl.title || '';
    const description = tpl.description || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                          description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || tpl.category === category;
    const matchesPrice = priceType === 'All' || 
                         (priceType === 'Free' && (!tpl.price || tpl.price === 0)) || 
                         (priceType === 'Premium' && tpl.price > 0);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <section id="templates" className="py-24 md:py-32 relative bg-[#030303] min-h-screen text-white overflow-hidden">
      {/* Premium Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center justify-center mb-16 max-w-4xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold uppercase tracking-widest text-xs mb-6">
              <Sparkles size={16} />
              <span>Explore Premium Templates</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500 leading-tight">
              World-Class <br className="hidden md:block"/> Templates
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
              Start your project with our meticulously crafted, high-performance templates designed for maximum conversion and stunning aesthetics.
            </p>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl mx-auto max-w-4xl relative">
            {/* Inner glow for search bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 rounded-[2rem] pointer-events-none"></div>
            
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-4 md:py-5 bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 text-lg md:text-xl font-medium"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap sm:flex-nowrap items-center p-2 border-t md:border-t-0 md:border-l border-white/10">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 md:flex-none px-6 py-3 md:py-4 bg-white/5 hover:bg-white/10 transition-colors border border-transparent rounded-2xl focus:outline-none focus:border-cyan-500/50 text-gray-200 font-medium appearance-none cursor-pointer"
              >
                {categories.map(c => <option key={c.name} value={c.name} className="bg-[#111] text-white">{c.name === 'All' ? 'All Categories' : c.name}</option>)}
              </select>

              <select 
                value={priceType} 
                onChange={(e) => setPriceType(e.target.value)}
                className="flex-1 md:flex-none px-6 py-3 md:py-4 bg-white/5 hover:bg-white/10 transition-colors border border-transparent rounded-2xl focus:outline-none focus:border-cyan-500/50 text-gray-200 font-medium appearance-none cursor-pointer"
              >
                {priceOptions.map(p => <option key={p} value={p} className="bg-[#111] text-white">{p === 'All' ? 'Any Price' : p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          /* Empty State */
          <div className="text-center py-32 bg-[#050505]/60 backdrop-blur-xl rounded-[3rem] border border-white/5 shadow-2xl max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Search size={40} className="text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No templates found</h3>
            <p className="text-gray-400 text-lg font-light max-w-md mx-auto mb-8">We couldn't find any templates matching your current filters. Try adjusting your search or categories.</p>
            <button 
              onClick={() => {setSearch(''); setCategory('All'); setPriceType('All');}} 
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Template Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredTemplates.map((tpl, i) => (
                <motion.div
                  key={tpl._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col bg-[#080808] border border-white/5 hover:border-cyan-500/30 rounded-[24px] overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
                >
                  {/* Spotlight Hover Glow */}
                  <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                  {/* Image Section (Inset Frame) */}
                  <div className="relative aspect-[16/10] w-auto overflow-hidden bg-[#111] z-10 m-2 rounded-[18px]">
                    <img 
                      src={(tpl.galleryImages && tpl.galleryImages[0]) || 'https://via.placeholder.com/800x600?text=No+Image'} 
                      alt={tpl.title} 
                      className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                    />
                    
                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3">
                      <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        {tpl.demoUrl && (
                          <a href={tpl.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:scale-105 transition-transform shadow-xl">
                            <ExternalLink size={16} /> Live Demo
                          </a>
                        )}
                        {tpl.previewVideo && (
                          <a href={tpl.previewVideo} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all shadow-xl backdrop-blur-md">
                            <Play size={16} className="ml-0.5" fill="currentColor" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 pt-4 flex flex-col flex-grow relative z-20">
                    <div className="flex justify-between items-start mb-3 gap-4">
                       <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300">
                         {tpl.title}
                       </h3>
                       {tpl.price === 0 || !tpl.price ? (
                         <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest rounded-lg flex-shrink-0">Free</span>
                       ) : (
                         <span className="px-2.5 py-1 bg-white/10 text-white border border-white/10 text-[10px] font-bold tracking-widest rounded-lg flex-shrink-0">₹{tpl.price}</span>
                       )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed font-normal">
                      {tpl.description?.replace(/<[^>]+>/g, '')}
                    </p>
                    
                    <div className="mt-auto flex justify-between items-center pt-5 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                         <Tag size={14} className="text-gray-500" />
                         <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{tpl.category}</span>
                      </div>
                      <Link to={`/templates/${tpl._id}`} className="flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-400 transition-colors group/btn">
                        View Details 
                        <span className="transform group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default Templates;
