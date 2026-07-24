import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Rocket, ArrowRight, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Footer from '../components/Footer';

const categories = [
  'All', 'Business Websites', 'eCommerce', 'Healthcare', 'Dental Clinics',
  'Hotels', 'Restaurants', 'Real Estate', 'Construction', 'Education',
  'Beauty & Salon', 'SaaS', 'Mobile Apps', 'Admin Dashboards', 'Landing Pages'
];

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('/api/projects');
        const published = data.filter(p => p.published);
        setProjects(published);
        setFilteredProjects(published);
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
    if (activeCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, projects]);

  return (
    <div className="min-h-screen bg-[color:var(--background)] pt-24 pb-0 flex flex-col relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8"
          >
            <Rocket size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-blue-200">Our Portfolio</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Projects That Deliver <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Real Business Results</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[color:var(--foreground)] opacity-70 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Explore our portfolio of websites, web applications, mobile apps, and digital solutions built for businesses across multiple industries. Every project reflects our commitment to quality, innovation, and measurable results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/contact" className="px-8 py-3 rounded-xl bg-[color:var(--foreground)] text-[color:var(--background)] font-bold text-lg hover:scale-105 transition-all shadow-lg w-full sm:w-auto text-center">
              Start Your Project
            </Link>
            <Link to="/#templates" className="px-8 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] bg-opacity-50 text-[color:var(--foreground)] font-bold text-lg hover:bg-[color:var(--secondary)] transition-all w-full sm:w-auto text-center">
              View Templates
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 relative z-10 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-[color:var(--card)] border border-[color:var(--border)] text-[color:var(--foreground)] opacity-80 hover:opacity-100 hover:border-blue-500/50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-24 relative z-10 flex-grow">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-[color:var(--card)] border border-[color:var(--border)] rounded-3xl">
                  <h3 className="text-2xl font-bold mb-2">No projects found</h3>
                  <p className="text-[color:var(--foreground)] opacity-70">Check back later or try a different category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={project._id}
                        className="group relative glass-card rounded-3xl border border-[color:var(--border)] overflow-hidden flex flex-col hover:border-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="relative h-56 overflow-hidden bg-black">
                          {project.featuredImage ? (
                            <img src={project.featuredImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                              <span className="text-white/30 font-bold text-xl">{project.title}</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white">
                            {project.category}
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                          <p className="text-[color:var(--foreground)] opacity-70 text-sm mb-6 flex-grow line-clamp-3">
                            {project.description}
                          </p>
                          
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.technologies.slice(0, 3).map((tech, i) => (
                                <span key={i} className="text-[10px] font-bold px-2 py-1 bg-[color:var(--secondary)] rounded-md border border-[color:var(--border)]">
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 3 && (
                                <span className="text-[10px] font-bold px-2 py-1 bg-[color:var(--secondary)] rounded-md border border-[color:var(--border)]">
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[color:var(--border)]">
                            <Link to={`/work/${project.slug}`} className="flex-grow flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm">
                              View Case Study
                              <ArrowRight size={14} />
                            </Link>
                            
                            {project.demoUrl && (
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[color:var(--secondary)] border border-[color:var(--border)] hover:border-blue-500/50 hover:text-blue-400 transition-colors tooltip-trigger" title="Live Demo">
                                <ExternalLink size={16} />
                              </a>
                            )}
                            
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[color:var(--secondary)] border border-[color:var(--border)] hover:border-purple-500/50 hover:text-purple-400 transition-colors tooltip-trigger" title="GitHub">
                                <FaGithub size={16} />
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

export default Work;
