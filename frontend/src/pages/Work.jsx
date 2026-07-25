import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Rocket, ArrowRight, ExternalLink, Filter, Layers, Briefcase } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Footer from '../components/Footer';

const industries = [
  'Healthcare & Dental',
  'Hotels & Hospitality',
  'Restaurants & Cafes',
  'Real Estate',
  'Construction',
  'Education',
  'Beauty & Salon',
  'Travel & Tourism',
  'Finance',
  'Startups'
];

const projectTypes = [
  'Business Websites',
  'Landing Pages',
  'eCommerce Stores',
  'Web Applications',
  'Mobile Apps',
  'Admin Dashboards',
  'SaaS Platforms'
];

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    // Check if there is a filter query param
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
        return matchCategory || matchTags;
      }));
    }
  }, [activeFilter, projects]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] pt-24 pb-0 flex flex-col relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            <Rocket size={16} className="text-blue-400" />
            <span className="text-sm font-bold text-white tracking-wide">Our Portfolio</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Transforming Ideas into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Digital Excellence</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Explore our curated selection of high-performance websites, web applications, and mobile experiences crafted for ambitious brands across various industries.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row gap-12 relative z-10 pb-24">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-28 flex flex-col gap-8">
            
            {/* Filter Group: Industry */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Briefcase size={16} className="text-blue-400" />
                </div>
                <h3 className="font-bold text-lg text-white">By Industry</h3>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleFilterClick('All')}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeFilter === 'All' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  All Projects
                </button>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => handleFilterClick(ind)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      activeFilter === ind 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group: Project Type */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Layers size={16} className="text-purple-400" />
                </div>
                <h3 className="font-bold text-lg text-white">By Project Type</h3>
              </div>
              
              <div className="flex flex-col gap-1.5">
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterClick(type)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      activeFilter === type 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Projects Grid Area */}
        <div className="flex-1 min-w-0">
          
          {/* Active Filter Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Filter className="text-white/40" size={24} />
              {activeFilter === 'All' ? 'Showing All Projects' : `Projects in "${activeFilter}"`}
              <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold border border-white/5 ml-2">
                {filteredProjects.length}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {filteredProjects.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-white/5 rounded-3xl text-center px-6 glass-card"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                    <Filter size={40} className="text-white/40" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No projects found</h3>
                  <p className="text-white/60 max-w-md mb-8">We couldn't find any projects matching "{activeFilter}". Try selecting a different category or clearing the filters.</p>
                  <button 
                    onClick={() => handleFilterClick('All')}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
                  >
                    View All Projects
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        key={project._id}
                        className="group relative glass-card rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] overflow-hidden flex flex-col hover:border-blue-500/30 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] transition-all duration-500"
                      >
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden bg-black/50">
                          {project.featuredImage ? (
                            <>
                              <img src={project.featuredImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                              <span className="text-white/30 font-bold text-xl">{project.title}</span>
                            </div>
                          )}
                          
                          {/* Badges on Image */}
                          <div className="absolute top-5 left-5 flex gap-2 flex-wrap max-w-[80%]">
                            {project.category && (
                              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white shadow-lg">
                                {project.category}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Content Area */}
                        <div className="p-8 flex flex-col flex-grow relative">
                          {/* Subtle background glow on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          
                          <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300 relative z-10">{project.title}</h3>
                          
                          <p className="text-white/60 text-sm mb-8 flex-grow line-clamp-3 leading-relaxed relative z-10">
                            {project.description}
                          </p>
                          
                          {/* Tech Stack */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                              {project.technologies.slice(0, 4).map((tech, i) => (
                                <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-white/5 rounded-md border border-white/10 text-white/80 group-hover:border-white/20 transition-colors">
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 4 && (
                                <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 rounded-md border border-white/10 text-white/80">
                                  +{project.technologies.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-auto relative z-10">
                            <Link to={`/work/${project.slug}`} className="flex-grow flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white font-bold rounded-xl transition-all duration-300 text-sm group/btn shadow-lg">
                              View Case Study
                              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                            
                            {project.demoUrl && (
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition-all tooltip-trigger shrink-0 shadow-lg" title="Live Demo">
                                <ExternalLink size={18} />
                              </a>
                            )}
                            
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-400 transition-all tooltip-trigger shrink-0 shadow-lg" title="GitHub">
                                <FaGithub size={18} />
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
      </div>

      <Footer />
    </div>
  );
};

export default Work;
