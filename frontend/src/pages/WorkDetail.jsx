import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle, Sparkles, MonitorSmartphone, Code2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils';

const WorkDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`/api/projects/slug/${slug}`);
        setProject(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        <div className="w-16 h-16 border-2 border-white/10 border-t-white rounded-full animate-spin z-10"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        <div className="z-10 flex flex-col items-center text-center px-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
            <Sparkles size={30} className="text-white/30" />
          </div>
          <h1 className="text-5xl font-black mb-4 text-white tracking-tighter">404 : Archive Not Found</h1>
          <p className="text-white/40 mb-10 font-light text-lg">The project you are looking for has been moved or doesn't exist.</p>
          <Link to="/work" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-xs tracking-widest uppercase flex items-center gap-3">
            <ArrowLeft size={16} /> Return to Index
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col relative overflow-hidden font-sans selection:bg-white/20 selection:text-white" ref={containerRef}>
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[70vw] h-[50vw] rounded-full bg-blue-600/5 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none"></div>
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative pt-32 pb-16 px-6 z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/work" className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-3xl mb-12 hover:bg-white/10 transition-all group">
              <ArrowLeft size={12} className="text-white/60 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-bold text-white/60 group-hover:text-white tracking-widest uppercase transition-colors">Back to Index</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full"
          >
            {project.category && (
              <span className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-6">
                [{project.category}]
              </span>
            )}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-8 max-w-5xl">
              {project.title}
            </h1>
            <p className="text-lg md:text-2xl text-white/50 max-w-3xl leading-relaxed font-light mb-16">
              {project.description}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-4 mb-20"
          >
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-transparent hover:text-white border border-transparent hover:border-white/30 font-bold rounded-full transition-all duration-300 group">
                <MonitorSmartphone size={16} />
                <span className="text-xs uppercase tracking-[0.15em]">Live Production</span>
                <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/10 hover:border-white/40 hover:bg-white/10 text-white transition-all font-bold rounded-full">
                <FaGithub size={16} />
                <span className="text-xs uppercase tracking-[0.15em]">Repository</span>
              </a>
            )}
          </motion.div>

          {/* Hero Meta Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/10"
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Client</span>
              <span className="text-sm font-medium text-white">{project.client || 'Internal / Concept'}</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Timeline</span>
              <span className="text-sm font-medium text-white">
                {project.completionDate ? new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Ongoing'}
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Role</span>
              <span className="text-sm font-medium text-white">Full Stack & UI/UX</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Status</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'Completed' ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`}></div>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${project.status === 'Completed' ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {project.status || 'Active'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Image Parallax Area */}
      {project.featuredImage && (
        <section className="relative z-20 w-full px-6 mb-32 -mt-10">
          <div className="max-w-[1400px] mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-video lg:aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden bg-[#050505] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] group"
            >
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10 mix-blend-overlay pointer-events-none"></div>
              <img 
                src={getImageUrl(project.featuredImage)} 
                alt={project.title} 
                className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[3s] ease-[0.16,1,0.3,1]" 
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Editorial Content Layout */}
      <section className="px-6 relative z-20 pb-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Main Content Column */}
          <div className="lg:w-7/12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-10 text-white tracking-tight">Project Overview</h2>
              {project.content ? (
                <div 
                  className="prose prose-invert prose-lg prose-p:text-white/60 prose-p:font-light prose-p:leading-relaxed prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              ) : (
                <p className="text-white/40 font-light text-lg italic">No detailed overview provided for this project.</p>
              )}
            </motion.div>
          </div>
          
          {/* Sidebar / Specs Column */}
          <div className="lg:w-5/12">
            <div className="sticky top-32 flex flex-col gap-8">
              
              {/* Stack Architecture */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Code2 size={20} className="text-white/40" />
                  <h3 className="text-xl font-bold tracking-tight">Stack Architecture</h3>
                </div>
                
                {project.technologies && project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-all cursor-default shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm opacity-40 font-light italic">Architecture stack not specified.</p>
                )}
              </motion.div>

              {/* Project Features - NEW SECTION */}
              {project.features && project.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Sparkles size={20} className="text-blue-400" />
                    <h3 className="text-xl font-bold tracking-tight">Key Features</h3>
                  </div>
                  
                  <ul className="flex flex-col gap-4">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-4 group">
                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:border-blue-400 transition-all">
                          <CheckCircle size={10} className="text-blue-400 group-hover:text-black transition-colors" />
                        </div>
                        <span className="text-white/60 group-hover:text-white/90 text-sm leading-relaxed transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Live Demo URL - Sidebar Box */}
              {project.demoUrl && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MonitorSmartphone size={20} className="text-emerald-400" />
                      <h3 className="text-xl font-bold tracking-tight">Live Demo</h3>
                    </div>
                  </div>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">Experience the live production build of this project directly.</p>
                  
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all group overflow-hidden">
                    <span className="text-white/80 group-hover:text-white font-mono text-xs truncate mr-4 max-w-[80%]">{project.demoUrl.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={16} className="text-blue-400 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  </a>
                </motion.div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-6 py-24 relative z-20 border-t border-white/5 bg-black/20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-black mb-4 tracking-tighter">Project Gallery</h2>
              <p className="text-white/40">Visual documentation of the interface and experience.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {project.gallery.map((img, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  key={idx} 
                  className="rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-[#050505] aspect-[4/3] group relative cursor-crosshair"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                  <img 
                    src={getImageUrl(img)} 
                    alt={`${project.title} gallery shot ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1] opacity-80 group-hover:opacity-100" 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-20 overflow-hidden">
        {/* Massive glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square rounded-full bg-blue-600/10 blur-[150px] pointer-events-none mix-blend-screen"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[3rem] p-12 md:p-24 border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-[0_0_80px_rgba(255,255,255,0.02)]"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Inspired? Let's build.</h2>
            <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              We engineer sophisticated digital solutions tailored for exponential growth. Start a conversation about your next venture.
            </p>
            <Link to="/start-project" className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-black font-bold text-sm tracking-[0.15em] uppercase hover:bg-transparent hover:text-white border border-transparent hover:border-white/30 transition-all duration-300 group">
              <span>Initiate Project</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorkDetail;
