import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Search, Tag, Briefcase } from 'lucide-react';
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
    <section id="templates" className="py-32 relative bg-black min-h-screen text-white overflow-hidden">
      {/* Premium Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter text-white">World-Class <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">Templates</span></h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light leading-relaxed">Start your project with our meticulously crafted, high-performance templates designed for maximum conversion and stunning aesthetics.</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-16 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-500 text-lg"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap md:flex-nowrap items-center p-2">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 transition-colors border border-transparent rounded-xl focus:outline-none focus:border-blue-500/50 text-white min-w-[150px] appearance-none cursor-pointer"
              >
                {categories.map(c => <option key={c.name} value={c.name} className="bg-gray-900">{c.name === 'All' ? 'All Categories' : c.name}</option>)}
              </select>

              <select 
                value={priceType} 
                onChange={(e) => setPriceType(e.target.value)}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 transition-colors border border-transparent rounded-xl focus:outline-none focus:border-blue-500/50 text-white min-w-[150px] appearance-none cursor-pointer"
              >
                {priceOptions.map(p => <option key={p} value={p} className="bg-gray-900">{p === 'All' ? 'Any Price' : p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-32 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
            <p className="text-gray-400 text-xl font-light">No templates found matching your criteria.</p>
            <button onClick={() => {setSearch(''); setCategory('All'); setPriceType('All');}} className="mt-6 text-blue-400 font-medium hover:text-blue-300 transition-colors">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredTemplates.map((tpl, i) => (
                <motion.div
                  key={tpl._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60 z-10 pointer-events-none"></div>
                    <img src={(tpl.galleryImages && tpl.galleryImages[0]) || 'https://via.placeholder.com/800x600?text=No+Image'} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                    
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      {tpl.price === 0 || !tpl.price ? (
                        <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-sm">Free</span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-sm">
                          ₹{tpl.price}
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                      <div className="flex gap-4">
                        {tpl.demoUrl && (
                          <a href={tpl.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 hover:scale-105 transition-all shadow-lg">
                            <ExternalLink size={18} /> Live Demo
                          </a>
                        )}
                        {tpl.previewVideo && (
                          <a href={tpl.previewVideo} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                            <Play size={20} className="ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow relative z-20">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <h3 className="text-2xl font-bold tracking-tight text-white line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">{tpl.title}</h3>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed font-light">{tpl.description?.replace(/<[^>]+>/g, '')}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Tag size={12} /> {tpl.category}
                      </span>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-between items-center mt-auto">
                      <div className="flex flex-col">
                        <span className="font-bold text-xl text-white">{!tpl.price ? 'Free' : `₹${tpl.price}`}</span>
                      </div>
                      <Link to={`/templates/${tpl._id}`} className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group/btn">
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
