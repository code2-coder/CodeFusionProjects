import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ExternalLink, Filter, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [filtersList, setFiltersList] = useState(['All']);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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
          <div className="relative flex items-center justify-center w-2.5 h-2.5">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[3px] opacity-60"></div>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full relative z-10"></div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-2.5 h-2.5">
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-[3px] opacity-60 animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full relative z-10"></div>
          </div>
        )}
        <span className={`text-[9px] font-bold tracking-[0.2em] uppercase ${isCompleted ? 'text-emerald-400' : 'text-blue-400'}`}>{status}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col relative overflow-hidden font-sans selection:bg-white/20 selection:text-white" ref={containerRef}>

      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 blur-[120px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/5 blur-[150px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative pt-40 md:pt-52 pb-24 px-6 z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-3xl mb-8 w-fit shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            <Sparkles size={12} className="text-blue-400" />
            <span className="text-[10px] font-semibold text-white/80 tracking-[0.2em] uppercase">The Index</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-white m-0 p-0"
            >
              Selected<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white/90 via-white/50 to-white/10" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>Works.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-xl text-white/40 max-w-sm leading-relaxed font-light md:pb-4"
            >
              A curated exhibition of digital architecture, immersive experiences, and scalable enterprise platforms.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-20 md:top-24 z-40 w-full px-6 mb-16 md:mb-32 py-4">
        <div className="absolute inset-0 bg-[#030303]/80 backdrop-blur-2xl border-b border-white/5 mask-linear-fade pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex bg-white/[0.03] p-1.5 rounded-full border border-white/5 backdrop-blur-md">
              {filtersList.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${activeFilter === filter
                      ? 'text-black bg-white shadow-[0_2px_15px_rgba(255,255,255,0.2)]'
                      : 'text-white/40 hover:text-white'
                    }`}
                >
                  <span className="relative z-10">{filter}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3 shrink-0 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/5 text-white/40 text-[10px] uppercase tracking-widest font-bold">
            <Filter size={12} />
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Entry' : 'Entries'}
          </div>
        </div>
      </div>

      {/* Projects Showcase Area */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pb-40">

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-40 bg-white/[0.02] border border-white/5 rounded-3xl text-center px-6"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <Filter size={24} className="text-white/40" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">No matching entries</h3>
                <p className="text-white/40 max-w-sm mb-8 font-light text-sm">We couldn't find any projects matching your current filter criteria.</p>
                <button
                  onClick={() => setActiveFilter('All')}
                  className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-[10px] tracking-widest uppercase"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-32 lg:gap-40">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => {
                    const numberStr = (index + 1).toString().padStart(2, '0');

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                        key={project._id}
                        className="group relative flex flex-col lg:flex-row gap-12 lg:gap-24 items-center"
                      >
                        {/* Massive Background Number */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-black text-white/[0.02] pointer-events-none tracking-tighter leading-none select-none -z-10">
                          {numberStr}
                        </div>

                        {/* Visual Presentation (55%) */}
                        <div className={`w-full lg:w-[55%] relative z-10 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                          <Link to={`/work/${project.slug}`} className="block relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl group-hover:border-white/20 transition-all duration-700">

                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none mix-blend-overlay"></div>

                            {(project.featuredImage || (project.gallery && project.gallery.length > 0)) ? (
                              <img
                                src={project.featuredImage || project.gallery[0]}
                                alt={project.title}
                                className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-[2s] ease-[0.16,1,0.3,1]"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505]">
                                <Sparkles size={32} className="text-white/10 mb-4" />
                                <span className="text-white/20 font-black text-2xl tracking-widest uppercase">{project.title}</span>
                              </div>
                            )}

                            {/* Floating category tag on image */}
                            {project.category && (
                              <div className="absolute top-6 right-6 z-30 px-3 py-1.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full">
                                <span className="text-[9px] font-bold text-white uppercase tracking-widest">{project.category}</span>
                              </div>
                            )}
                          </Link>
                        </div>

                        {/* Editorial Details (45%) */}
                        <div className={`w-full lg:w-[45%] flex flex-col relative z-20 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>

                          <div className="flex items-center gap-4 mb-6">
                            <span className="text-blue-400 font-mono text-sm tracking-wider">[{numberStr}]</span>
                            <div className="h-px bg-white/20 flex-1"></div>
                          </div>

                          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all duration-500 leading-tight">
                            {project.title}
                          </h3>

                          <div
                            className="text-white/50 text-base leading-relaxed font-light mb-10 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: project.content || project.description }}
                          />

                          {/* Metadata Grid */}
                          {(project.clientName || project.completionDate || project.status || project.industry) && (
                            <div className="grid grid-cols-2 gap-y-8 gap-x-8 mb-12">
                              {project.clientName && (
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold">Client</span>
                                  <span className="text-white/90 text-sm font-medium">{project.clientName}</span>
                                </div>
                              )}
                              {project.industry && (
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold">Industry</span>
                                  <span className="text-white/90 text-sm font-medium">{project.industry}</span>
                                </div>
                              )}
                              {project.completionDate && (
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold">Timeline</span>
                                  <span className="text-white/90 text-sm font-medium">
                                    {new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                              )}
                              {project.status && (
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold">Status</span>
                                  {renderStatusBadge(project.status)}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tech Stack Pills */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-12">
                              {project.technologies.slice(0, 5).map((tech, i) => (
                                <span key={i} className="text-[10px] font-medium tracking-wide px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 text-white/60 hover:text-white transition-colors rounded-full cursor-default">
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 5 && (
                                <span className="text-[10px] font-medium tracking-wide px-3 py-1.5 bg-white/[0.01] border border-white/5 text-white/30 rounded-full">
                                  +{project.technologies.length - 5}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Action Area */}
                          <div className="flex items-center gap-4 mt-auto">
                            <Link
                              to={`/work/${project.slug}`}
                              className="flex items-center gap-4 px-8 py-4 bg-white text-black hover:bg-transparent hover:text-white border border-transparent hover:border-white/30 font-bold rounded-full transition-all duration-300 group/btn"
                            >
                              <span className="text-xs uppercase tracking-[0.15em]">View Case Study</span>
                              <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                            </Link>

                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-4 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/40 hover:bg-white/10 text-white/80 hover:text-white transition-all group"
                                title="Active Link"
                              >
                                <span className="text-xs uppercase tracking-[0.15em] font-bold">Active Link</span>
                                <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
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
