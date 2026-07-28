import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Search, Tag, Filter, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils';

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
    <section id="templates" className="py-24 md:py-32 relative bg-[#0a0a0a] min-h-screen text-zinc-50 overflow-hidden font-sans">
      
      {/* Subtle Grid Background for Premium Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Search & Filters */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-4 p-2 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-2xl shadow-lg mx-auto max-w-5xl relative">
            
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-zinc-100 placeholder-zinc-500 text-base md:text-lg font-medium transition-all"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap sm:flex-nowrap items-center p-2 border-t md:border-t-0 md:border-l border-zinc-800/80">
              <div className="relative flex-1 md:flex-none">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-zinc-800/40 hover:bg-zinc-800/80 transition-colors border border-zinc-700/50 rounded-xl focus:outline-none focus:border-zinc-500 text-zinc-300 font-medium appearance-none cursor-pointer text-sm"
                >
                  {categories.map(c => <option key={c.name} value={c.name} className="bg-zinc-900 text-zinc-200">{c.name === 'All' ? 'All Categories' : c.name}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="rotate-90 text-zinc-500" size={16} />
                </div>
              </div>

              <div className="relative flex-1 md:flex-none">
                <select 
                  value={priceType} 
                  onChange={(e) => setPriceType(e.target.value)}
                  className="w-full px-6 pr-10 py-3 bg-zinc-800/40 hover:bg-zinc-800/80 transition-colors border border-zinc-700/50 rounded-xl focus:outline-none focus:border-zinc-500 text-zinc-300 font-medium appearance-none cursor-pointer text-sm"
                >
                  {priceOptions.map(p => <option key={p} value={p} className="bg-zinc-900 text-zinc-200">{p === 'All' ? 'Any Price' : p}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="rotate-90 text-zinc-500" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-zinc-800"></div>
              <div className="absolute inset-0 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          /* Empty State */
          <div className="text-center py-32 bg-zinc-900/30 backdrop-blur-md rounded-[2rem] border border-zinc-800 shadow-xl max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700/50">
              <Search size={32} className="text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">No templates found</h3>
            <p className="text-zinc-400 text-base max-w-md mx-auto mb-8">Adjust your filters or search terms to find what you're looking for.</p>
            <button 
              onClick={() => {setSearch(''); setCategory('All'); setPriceType('All');}} 
              className="px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-xl transition-all shadow-lg"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Template Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredTemplates.map((tpl) => (
                <motion.div
                  key={tpl._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col bg-[#0c0c0c] border border-zinc-800/60 hover:border-zinc-700 rounded-3xl overflow-hidden transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Subtle Top Glow */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>

                  {/* Image Section */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                    <img 
                      src={getImageUrl((tpl.galleryImages && tpl.galleryImages[0]) || 'https://via.placeholder.com/800x600?text=No+Image')} 
                      alt={tpl.title} 
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                    />
                    
                    {/* Gradient Fade into Content */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent pointer-events-none"></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="px-6 pb-6 pt-0 flex flex-col flex-grow relative z-20 -mt-10">
                    
                    {/* Header Row: Category & Price */}
                    <div className="flex items-center justify-between mb-4">
                       <span className="px-3 py-1.5 bg-zinc-800/80 backdrop-blur-md text-zinc-300 border border-zinc-700/50 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                         {tpl.category}
                       </span>
                       {tpl.price === 0 || !tpl.price ? (
                         <span className="px-3 py-1.5 bg-emerald-500/10 backdrop-blur-md text-emerald-400 border border-emerald-500/20 text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-lg">Free</span>
                       ) : (
                         <span className="px-3 py-1.5 bg-white text-black text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">₹{tpl.price}</span>
                       )}
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-white line-clamp-1 mb-2 group-hover:text-zinc-200 transition-colors duration-200">
                      {tpl.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed font-light">
                      {tpl.description?.replace(/<[^>]+>/g, '')}
                    </p>
                    
                    {/* Footer Actions */}
                    <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-zinc-800/50">
                      {(tpl.demoUrl || tpl.previewVideo) && (
                        <div className="flex items-center gap-2 pt-2">
                          {tpl.demoUrl && (
                            <a href={tpl.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-all border border-zinc-700/50 hover:border-zinc-600">
                              <ExternalLink size={15} /> Live Demo
                            </a>
                          )}
                          {tpl.previewVideo && (
                            <a href={tpl.previewVideo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 text-zinc-200 transition-all border border-zinc-700/50 hover:border-zinc-600 flex-shrink-0">
                              <Play size={15} className="ml-0.5" fill="currentColor" />
                            </a>
                          )}
                        </div>
                      )}
                      
                      <Link to={`/templates/${tpl._id}`} className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] group/details">
                        <span>View Details</span>
                        <ChevronRight size={16} className="transform group-hover/details:translate-x-1 transition-transform" />
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
