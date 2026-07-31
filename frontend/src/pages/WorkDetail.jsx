import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Sparkles, MonitorSmartphone, Code2, Cpu, Calendar, UserCheck, Layers } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Footer from '../components/Footer';
import { getImageUrl, handleImageError } from '../utils';

// Image loading helper with custom shimmers inside WorkDetail
const DetailImage = ({ src, alt, className, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#080808] overflow-hidden group">
      {!isLoaded && !isError && (
        <div className="absolute inset-0 z-10 animate-shimmer" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setIsError(true);
          handleImageError(e);
        }}
        className={`${className} transition-all duration-[1.5s] ease-[0.16,1,0.3,1] ${
          isLoaded ? 'opacity-90 group-hover:opacity-100 group-hover:scale-[1.02]' : 'opacity-0'
        }`}
      />
    </div>
  );
};

const WorkDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="w-12 h-12 border-t-2 border-r-2 border-blue-500 border-solid rounded-full animate-spin z-10"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center relative overflow-hidden">
        <Helmet>
          <title>404: Case Study Not Found | Code Fusion Projects</title>
        </Helmet>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="z-10 flex flex-col items-center text-center px-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <Sparkles size={30} className="text-white/20" />
          </div>
          <h1 className="text-5xl font-black mb-4 text-white tracking-tighter font-display">404: Archive Not Found</h1>
          <p className="text-white/40 mb-10 font-light text-lg">The project you are looking for has been moved or doesn't exist.</p>
          <Link to="/work" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all text-xs tracking-widest uppercase flex items-center gap-3 shadow-[0_4px_20px_rgba(255,255,255,0.15)]">
            <ArrowLeft size={16} /> Return to Index
          </Link>
        </div>
      </div>
    );
  }

  // Safe variables checks
  const clientVal = project.client || project.clientName || 'Internal / Concept';
  const roleVal = 'Full Stack & UI/UX';
  const statusVal = project.status || 'Completed';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#030303] flex flex-col relative overflow-hidden font-sans selection:bg-white/20 selection:text-white" 
      ref={containerRef}
    >
      <Helmet>
        <title>{`${project.title} - Case Study | Code Fusion Projects`}</title>
        <meta name="description" content={project.seoDescription || project.description || `Read the detailed case study, features and architecture of ${project.title}.`} />
        <meta property="og:title" content={`${project.title} - Case Study | Code Fusion Projects`} />
        <meta property="og:description" content={project.description} />
      </Helmet>
      
      {/* Ambient background layout */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[75vw] h-[55vw] rounded-full bg-blue-600/5 blur-[130px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none"></div>
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative pt-36 pb-16 px-6 z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/work" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl mb-12 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group">
              <ArrowLeft size={12} className="text-white/40 group-hover:text-white transition-colors transform group-hover:-translate-x-1 duration-300" />
              <span className="text-[10px] font-bold text-white/50 group-hover:text-white tracking-widest uppercase transition-colors">Back to Index</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full"
          >
            {project.category && (
              <span className="inline-flex items-center gap-1.5 text-blue-400 font-mono text-xs tracking-[0.25em] uppercase mb-6 font-semibold">
                <Layers size={12} /> [{project.category}]
              </span>
            )}
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[1] text-white mb-8 max-w-5xl font-display">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-3xl leading-relaxed font-light mb-12">
              {project.description}
            </p>
          </motion.div>

          {/* Action Links */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {project.demoUrl && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-transparent hover:text-white border border-transparent hover:border-white/20 font-bold rounded-full transition-all duration-500 group shadow-[0_4px_25px_rgba(255,255,255,0.1)]"
              >
                <MonitorSmartphone size={15} />
                <span className="text-[10px] uppercase tracking-[0.15em]">Live Production</span>
                <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 px-8 py-4 bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08] text-white transition-all font-bold rounded-full"
              >
                <FaGithub size={15} />
                <span className="text-[10px] uppercase tracking-[0.15em]">Repository</span>
              </a>
            )}
          </motion.div>

          {/* Details Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/[0.06]"
          >
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">
                <UserCheck size={10} /> Client
              </span>
              <span className="text-sm font-medium text-white/95">{clientVal}</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">
                <Calendar size={10} /> Timeline
              </span>
              <span className="text-sm font-medium text-white/95">
                {project.completionDate ? new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Ongoing'}
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">
                <Layers size={10} /> Role
              </span>
              <span className="text-sm font-medium text-white/95">{roleVal}</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">
                <Cpu size={10} /> Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                  {statusVal}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Hero Showcase Image */}
      {project.featuredImage && (
        <section className="relative z-20 w-full px-6 mb-28 -mt-6">
          <div className="max-w-[1300px] mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-video lg:aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden bg-[#060606] border border-white/[0.08] shadow-[0_25px_80px_rgba(0,0,0,0.6)] group"
            >
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10 mix-blend-overlay pointer-events-none" />
              <DetailImage 
                src={getImageUrl(project.featuredImage)} 
                alt={project.title} 
                className="w-full h-full object-cover object-top" 
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Overview & Specs Content layout */}
      <section className="px-6 relative z-20 pb-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-20">
          
          {/* Main overview (7/12) */}
          <div className="lg:w-7/12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-white tracking-tight font-display">Project Overview</h2>
              {project.content ? (
                <div 
                  className="prose prose-invert max-w-none text-white/60 font-light leading-relaxed text-[15px] sm:text-[16px] space-y-6
                    prose-p:leading-relaxed prose-p:text-white/60 prose-p:font-light 
                    prose-headings:text-white prose-headings:font-bold prose-headings:font-display prose-h3:text-lg prose-h3:mt-8
                    prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:transition-colors"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              ) : (
                <p className="text-white/40 font-light text-base italic">No detailed overview provided for this project.</p>
              )}
            </motion.div>
          </div>
          
          {/* Specs sidebar (5/12) */}
          <div className="lg:w-5/12">
            <div className="sticky top-32 flex flex-col gap-8">
              
              {/* Architecture specs */}
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white/[0.01] border border-white/[0.04] rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white/50">
                    <Code2 size={18} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white font-display">Stack Architecture</h3>
                </div>
                
                {project.technologies && project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="px-3.5 py-1.5 bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] rounded-lg text-xs font-medium text-white/65 hover:text-white transition-all cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/30 font-light italic">Architecture stack not specified.</p>
                )}
              </motion.div>

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="bg-white/[0.01] border border-white/[0.04] rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-blue-400">
                      <Sparkles size={18} />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-white font-display">Key Features</h3>
                  </div>
                  
                  <ul className="flex flex-col gap-4">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 group">
                        <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-400 transition-all">
                          <CheckCircle2 size={10} className="text-blue-400" />
                        </div>
                        <span className="text-white/50 group-hover:text-white/80 text-sm leading-relaxed transition-colors font-light">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Sidebar Action link box */}
              {project.demoUrl && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white/[0.01] border border-white/[0.04] rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-emerald-400">
                      <MonitorSmartphone size={18} />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-white font-display">Live Link</h3>
                  </div>
                  <p className="text-white/40 text-xs mb-6 leading-relaxed">Experience the live production system of this project instantly.</p>
                  
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 transition-all group overflow-hidden"
                  >
                    <span className="text-white/60 group-hover:text-white font-mono text-xs truncate mr-4 max-w-[80%]">{project.demoUrl.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={14} className="text-blue-400 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  </a>
                </motion.div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Interactive Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-6 py-24 relative z-20 border-t border-white/[0.04] bg-white/[0.005]">
          <div className="max-w-[1300px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tighter text-white font-display">Project Gallery</h2>
              <p className="text-white/40 text-sm font-light">Visual interface audits and responsive design layouts.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {project.gallery.map((img, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.08 }}
                  key={idx} 
                  className="rounded-3xl overflow-hidden border border-white/[0.08] hover:border-white/[0.15] shadow-xl bg-[#060606] aspect-[4/3] group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                  <DetailImage 
                    src={getImageUrl(img)} 
                    alt={`${project.title} gallery shot ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA start project */}
      <section className="py-28 px-6 relative z-20 overflow-hidden border-t border-white/[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square rounded-full bg-blue-600/[0.03] blur-[120px] pointer-events-none mix-blend-screen" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[3rem] p-12 md:p-20 border border-white/[0.06] bg-white/[0.005] backdrop-blur-2xl shadow-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 text-white font-display">Inspired? Let's build.</h2>
            <p className="text-base md:text-lg text-white/40 mb-10 max-w-xl mx-auto font-light leading-relaxed">
              We design and engineer bespoke software architectures tailored to scale your product exponentially.
            </p>
            <Link to="/start-project" className="inline-flex items-center gap-3.5 px-8 py-4 rounded-full bg-white text-black font-bold text-xs tracking-[0.15em] uppercase hover:bg-transparent hover:text-white border border-transparent hover:border-white/20 transition-all duration-300 group shadow-[0_4px_20px_rgba(255,255,255,0.1)]">
              <span>Initiate Project</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default WorkDetail;
