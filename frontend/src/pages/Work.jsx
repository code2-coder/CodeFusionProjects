import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Rocket, ArrowRight, ExternalLink, Filter, Layers, Briefcase, Calendar, Clock, User, CheckCircle2, Activity, Sparkles } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Footer from '../components/Footer';

// Dynamic filters will be generated from projects

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [filtersList, setFiltersList] = useState(['All']);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam) {
      setActiveFilter(filterParam);
    } else {
      setActiveFilter('All');
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('/api/projects');
        const published = data.filter(p => p.published);
        setProjects(published);
        
        // Dynamically generate unique filters from categories and industries
        const uniqueFilters = new Set();
        published.forEach(p => {
          if (p.category) uniqueFilters.add(p.category);
          if (p.industry) uniqueFilters.add(p.industry);
        });
        setFiltersList(['All', ...Array.from(uniqueFilters).sort()]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };
    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => {
        const matchCategory = p.category && p.category.toLowerCase() === activeFilter.toLowerCase();
        const matchTags = p.tags && p.tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
        const matchIndustry = p.industry && p.industry.toLowerCase() === activeFilter.toLowerCase();
        return matchCategory || matchTags || matchIndustry;
      }));
    }
  }, [activeFilter, projects]);

  const renderStatusBadge = (status) => {
    if (!status) return null;
    const isCompleted = status.toLowerCase() === 'completed';
    return (
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <div className="relative flex items-center justify-center w-3 h-3">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[4px] opacity-60"></div>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full relative z-10"></div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-3 h-3">
            <div className="absolute inset-0 bg-[#00F0FF] rounded-full blur-[4px] opacity-60 animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full relative z-10"></div>
          </div>
        )}
        <span className={`text-[10px] font-bold tracking-widest uppercase ${isCompleted ? 'text-emerald-400' : 'text-[#00F0FF]'}`}>{status}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-0 flex flex-col relative overflow-hidden font-sans selection:bg-white/20">
      
      {/* Abyssal Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/5 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/5 blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-3xl mb-12 shadow-[0_0_40px_rgba(255,255,255,0.02)]"
          >
            <Sparkles size={14} className="text-[#00F0FF]" />
            <span className="text-[10px] font-bold text-white/80 tracking-[0.2em] uppercase">The Archive</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter mb-8 leading-[0.85] text-white"
          >
            Selected <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/20">Works.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl text-white/40 max-w-2xl mx-auto mb-16 leading-relaxed font-light"
          >
            An elite exhibition of high-performance digital architecture, immersive UI/UX experiences, and scalable enterprise platforms.
          </motion.p>
        </div>
      </section>

      {/* Horizontal Liquid Glass Filter Bar */}
      <div className="sticky top-24 z-40 w-full px-6 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex items-center gap-3 overflow-x-auto pb-4 pt-2 mask-linear-fade scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {filtersList.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-500 overflow-hidden shrink-0 ${
                  activeFilter === filter 
                    ? 'text-black bg-white shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-105' 
                    : 'text-white/50 bg-white/[0.02] border border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {activeFilter === filter && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent animate-[glare_2s_ease-in-out_infinite]"></div>
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Showcase Area */}
      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 pb-40">
        
        <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
          <h2 className="text-xl font-light text-white/50 flex items-center gap-3">
            <Filter size={18} />
            Viewing: <span className="text-white font-medium">{activeFilter === 'All' ? 'Complete Archive' : activeFilter}</span>
          </h2>
          <span className="px-4 py-1.5 bg-white/5 text-white rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10">
            {filteredProjects.length} Projects
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-40 bg-white/[0.01] border border-white/5 rounded-[3rem] text-center px-6"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                  <Filter size={30} className="text-white/30" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white tracking-tight">Zero Results</h3>
                <p className="text-white/40 max-w-md mb-10 font-light text-lg">No architectural case studies found for "{activeFilter}". Explore other disciplines.</p>
                <button 
                  onClick={() => setActiveFilter('All')}
                  className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Reset Archive
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-32 lg:gap-48">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        key={project._id}
                        className={`group relative flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}
                      >
                        {/* Cinematic Image Slabs (60%) */}
                        <div className="w-full lg:w-[60%] relative z-10">
                          {/* Deep Glow */}
                          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[3rem] pointer-events-none"></div>
                          
                          <Link to={`/work/${project.slug}`} className="block relative aspect-[16/10] w-full rounded-[2.5rem] overflow-hidden bg-[#050505] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] group-hover:border-white/20 transition-all duration-700 cursor-none custom-cursor-trigger">
                            {(project.featuredImage || (project.gallery && project.gallery.length > 0)) ? (
                              <img 
                                src={project.featuredImage || project.gallery[0]} 
                                alt={project.title} 
                                className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-[1.5s] ease-[0.16,1,0.3,1] grayscale-[30%] group-hover:grayscale-0" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                                <span className="text-white/10 font-black text-5xl tracking-tighter uppercase">{project.title}</span>
                              </div>
                            )}
                            
                            {/* Glass overlay highlight */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                          </Link>
                        </div>
                        
                        {/* Engineering Specs Content (40%) */}
                        <div className="w-full lg:w-[40%] flex flex-col relative z-20">
                          
                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-3 mb-8">
                            {project.category && (
                              <span className="px-3 py-1 bg-transparent text-[#00F0FF] border border-[#00F0FF]/30 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                                {project.category}
                              </span>
                            )}
                            {project.industry && (
                              <span className="px-3 py-1 bg-white/[0.03] text-white/50 border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">
                                {project.industry}
                              </span>
                            )}
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-8 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all duration-500 leading-[1.1]">
                            {project.title}
                          </h3>
                          
                          {/* Monospace Specs Grid */}
                          {(project.clientName || project.completionDate || project.status) && (
                            <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-10 py-6 border-y border-white/5 font-mono">
                              {project.clientName && (
                                <div className="flex flex-col gap-1">
                                  <span className="text-white/30 text-[10px] uppercase tracking-widest">Client</span>
                                  <span className="text-white/90 text-xs">{project.clientName}</span>
                                </div>
                              )}
                              {project.completionDate && (
                                <div className="flex flex-col gap-1">
                                  <span className="text-white/30 text-[10px] uppercase tracking-widest">Date</span>
                                  <span className="text-white/90 text-xs">
                                    {new Date(project.completionDate).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
                                  </span>
                                </div>
                              )}
                              {project.status && (
                                <div className="flex flex-col gap-1">
                                  <span className="text-white/30 text-[10px] uppercase tracking-widest">Status</span>
                                  {renderStatusBadge(project.status)}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Description */}
                          <div 
                            className="text-white/40 text-sm leading-relaxed font-light mb-10 line-clamp-3 overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: project.content || project.description }}
                          />
                          
                          {/* Tech Stack */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-12">
                              {project.technologies.slice(0, 4).map((tech, i) => (
                                <span key={i} className="text-[10px] font-mono tracking-wider px-3 py-1.5 bg-white/[0.02] border border-white/10 text-white/50 rounded-md">
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 4 && (
                                <span className="text-[10px] font-mono tracking-wider px-3 py-1.5 bg-white/[0.02] border border-white/5 text-white/30 rounded-md">
                                  +{project.technologies.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-4">
                            <Link to={`/work/${project.slug}`} className="flex-1 flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-md hover:bg-white border border-white/10 text-white hover:text-black font-bold rounded-2xl transition-all duration-500 group/btn">
                              <span className="text-xs uppercase tracking-widest">Examine</span>
                              <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                            
                            {project.demoUrl && (
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/10 text-white/50 hover:text-white transition-all shrink-0">
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Work;
