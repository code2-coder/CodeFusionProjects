import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowRight, ExternalLink, Filter, Sparkles, Code2, Calendar, Target, Globe } from 'lucide-react';
import Footer from '../components/Footer';
import { getImageUrl, handleImageError } from '../utils';

// Premium Image component with a sleek shimmer loading state
const ImageWithShimmer = ({ src, alt, className, onError }) => {
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
        className={`${className} transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) ${
          isLoaded ? 'opacity-80 group-hover:opacity-100 group-hover:scale-[1.03]' : 'opacity-0'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 z-10" />
    </div>
  );
};

// Custom interactive Project Card with cursor-tracking glow
const ProjectCard = ({ project, index, numberStr }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Safe fallback metadata checks
  const clientName = project.client || project.clientName || 'Delivixin Partner';
  const industry = project.industry || project.category || 'Technology';
  const displayStatus = project.status || 'Completed';
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      layout="position"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch p-8 lg:p-12 rounded-[2.5rem] border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-700 overflow-hidden shadow-2xl"
    >
      {/* Dynamic Cursor Light Spot Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.08),
              transparent 70%
            )
          `,
        }}
      />

      {/* Dynamic Radial Border Light Highlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              280px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.12),
              transparent 75%
            )
          `,
          border: '1px solid transparent',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Background Index Number */}
      <div className="absolute right-8 bottom-4 text-[16rem] lg:text-[20rem] font-black text-white/[0.01] pointer-events-none tracking-tighter leading-none select-none z-0 font-display">
        {numberStr}
      </div>

      {/* Media Column (53%) */}
      <div className={`w-full lg:w-[53%] flex relative z-10 ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
        <Link 
          to={`/work/${project.slug}`} 
          className="block relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden border border-white/[0.08] group-hover:border-white/[0.15] transition-all duration-700 shadow-[0_15px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Accent Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none mix-blend-screen" />

          {/* Visual Showcase */}
          {(project.featuredImage || (project.gallery && project.gallery.length > 0)) ? (
            <ImageWithShimmer
              src={getImageUrl(project.featuredImage || project.gallery[0])}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#070707]">
              <Sparkles size={28} className="text-white/10 mb-4 animate-pulse" />
              <span className="text-white/20 font-black text-xl tracking-widest uppercase font-display">{project.title}</span>
            </div>
          )}

          {/* Floater Tag */}
          {project.category && (
            <div className="absolute top-6 right-6 z-30 px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-full shadow-lg">
              <span className="text-[9px] font-bold text-white/95 uppercase tracking-[0.2em]">{project.category}</span>
            </div>
          )}
        </Link>
      </div>

      {/* Editorial Content (47%) */}
      <div className={`w-full lg:w-[47%] flex flex-col justify-between relative z-10 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
        <div className="flex flex-col">
          {/* Index Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-blue-400 font-mono text-xs tracking-widest font-semibold">[{numberStr}]</span>
            <div className="h-[1px] bg-white/[0.08] flex-1"></div>
          </div>

          {/* Project Title */}
          <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white mb-5 leading-[1.1] transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60">
            {project.title}
          </h3>

          {/* Description */}
          <div
            className="text-white/50 text-sm md:text-base leading-relaxed font-light mb-8 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: project.content || project.description }}
          />

          {/* Spec Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-8 border-t border-white/[0.04] pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/40">
                <Target size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-white/30 text-[8px] uppercase tracking-wider font-bold">Client</span>
                <span className="text-white/80 text-xs font-medium truncate max-w-[140px]">{clientName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/40">
                <Globe size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-white/30 text-[8px] uppercase tracking-wider font-bold">Industry</span>
                <span className="text-white/80 text-xs font-medium truncate max-w-[140px]">{industry}</span>
              </div>
            </div>

            {project.completionDate && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/40">
                  <Calendar size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/30 text-[8px] uppercase tracking-wider font-bold">Timeline</span>
                  <span className="text-white/80 text-xs font-medium">
                    {new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/40">
                <Code2 size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-white/30 text-[8px] uppercase tracking-wider font-bold">Status</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 text-xs font-semibold">{displayStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stack Architecture */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {project.technologies.slice(0, 5).map((tech, i) => (
                <span 
                  key={i} 
                  className="text-[9px] font-semibold tracking-wider px-2.5 py-1 bg-white/[0.02] border border-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all rounded-md cursor-default"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="text-[9px] font-semibold tracking-wider px-2.5 py-1 bg-white/[0.01] border border-white/[0.04] text-white/30 rounded-md">
                  +{project.technologies.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button Links */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/[0.04]">
          <Link
            to={`/work/${project.slug}`}
            className="flex items-center gap-3.5 px-7 py-3 bg-white text-black hover:bg-transparent hover:text-white border border-transparent hover:border-white/20 font-bold rounded-full transition-all duration-500 group/btn shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-none"
          >
            <span className="text-[10px] uppercase tracking-[0.15em]">View Case Study</span>
            <ArrowRight size={13} className="transform group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.06] text-white/70 hover:text-white transition-all duration-300"
              title="Active Link"
            >
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Active Link</span>
              <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Shimmer Skeleton Loader for fetching projects
const ProjectSkeleton = () => (
  <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch p-8 lg:p-12 rounded-[2.5rem] border border-white/[0.02] bg-white/[0.005]">
    <div className="w-full lg:w-[53%] aspect-[16/10] rounded-3xl animate-shimmer" />
    <div className="w-full lg:w-[47%] flex flex-col justify-between py-2">
      <div className="flex flex-col gap-6">
        <div className="w-24 h-4 rounded bg-white/[0.02] animate-pulse" />
        <div className="w-3/4 h-12 rounded bg-white/[0.02] animate-pulse" />
        <div className="w-full h-20 rounded bg-white/[0.02] animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-8 rounded bg-white/[0.02] animate-pulse" />
          <div className="h-8 rounded bg-white/[0.02] animate-pulse" />
        </div>
      </div>
      <div className="w-36 h-10 rounded-full bg-white/[0.02] animate-pulse mt-8" />
    </div>
  </div>
);

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

  const headerY = useTransform(scrollYProgress, [0, 0.25], [0, -70]);
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

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col relative overflow-hidden font-sans selection:bg-white/20 selection:text-white" ref={containerRef}>
      
      {/* SEO helmet headers */}
      <Helmet>
        <title>Selected Works | Code Fusion Projects</title>
        <meta name="description" content="A curated exhibition of elite digital architecture, immersive products, and scalable enterprise platforms engineered by Code Fusion Projects." />
        <meta property="og:title" content="Selected Works | Code Fusion Projects" />
        <meta property="og:description" content="Explore our bespoke web applications, enterprise e-commerce portals, and modern architectural platforms." />
      </Helmet>

      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-blue-600/5 blur-[130px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/5 blur-[160px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative pt-40 md:pt-48 pb-20 px-6 z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl mb-8 w-fit shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            <Sparkles size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-white/80 tracking-[0.25em] uppercase">The Index</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[9.5rem] font-black tracking-tighter leading-[0.85] text-white m-0 p-0 font-display"
            >
              Selected<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/70 to-white/10" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.08)' }}>Works.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-white/40 max-w-sm leading-relaxed font-light md:pb-4"
            >
              A curated exhibition of digital architecture, immersive experiences, and scalable enterprise platforms.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-20 md:top-24 z-40 w-full px-6 mb-20 md:mb-28 py-4">
        <div className="absolute inset-0 bg-[#030303]/80 backdrop-blur-2xl border-b border-white/[0.04] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex bg-white/[0.02] p-1 rounded-full border border-white/[0.06] backdrop-blur-md">
              {filtersList.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-500 z-10 ${
                    activeFilter === filter ? 'text-black font-extrabold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <span className="relative z-20">{filter}</span>
                  {activeFilter === filter && (
                    <motion.span
                      layoutId="activeFilterIndicator"
                      className="absolute inset-0 bg-white rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.25)] z-0"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3 shrink-0 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-white/40 text-[10px] uppercase tracking-widest font-bold">
            <Filter size={12} className="text-white/50" />
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Entry' : 'Entries'}
          </div>
        </div>
      </div>

      {/* Projects Showcase Area */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pb-40">
        {loading ? (
          <div className="flex flex-col gap-24">
            <ProjectSkeleton />
            <ProjectSkeleton />
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-40 bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] text-center px-6"
              >
                <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mb-6 border border-white/[0.06]">
                  <Filter size={22} className="text-white/30" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">No matching entries</h3>
                <p className="text-white/40 max-w-sm mb-8 font-light text-sm">We couldn't find any projects matching your current filter criteria.</p>
                <button
                  onClick={() => setActiveFilter('All')}
                  className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-[10px] tracking-widest uppercase shadow-[0_4px_15px_rgba(255,255,255,0.15)]"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-24 lg:gap-32">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => {
                    const numberStr = (index + 1).toString().padStart(2, '0');
                    return (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        index={index}
                        numberStr={numberStr}
                      />
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
