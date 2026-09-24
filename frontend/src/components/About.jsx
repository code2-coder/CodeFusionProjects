import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Rocket, Users, LayoutTemplate, Headphones, Sparkles } from 'lucide-react';

// Precision High-Performance Animated Counter
const AnimatedCounter = ({ target, suffix = '', duration = 2.2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration: duration,
      ease: [0.16, 1, 0.3, 1], // Cubic bezier easeOutExpo
      onUpdate: (latest) => setCount(Math.floor(latest)),
    });

    return () => controls.stop();
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="inline-flex items-baseline font-black tracking-tight tabular-nums">
      <span>{count}</span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 ml-0.5 select-none font-bold">
        {suffix}
      </span>
    </span>
  );
};

// Luxury Spotlight Glassmorphism Card
const StatCard = ({ stat, index }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = stat.icon;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group p-6 sm:p-7 rounded-[2rem] bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-2xl transition-all duration-500 ${stat.borderHover} shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden cursor-default`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${stat.glowColor}, transparent 65%)`,
        }}
      />

      {/* Top Specular Border Glare */}
      <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

      {/* Card Header: Icon & Optional Live Radar Badge */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${stat.iconBg} group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
          <IconComponent size={22} strokeWidth={2} />
        </div>

        {stat.isLive ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live 24/7
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-white/40 transition-colors" />
        )}
      </div>

      {/* Metric Counter Display */}
      <div className="mb-2 relative z-10">
        <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all">
          <AnimatedCounter target={stat.target} suffix={stat.suffix} />
        </h3>
      </div>

      {/* Metric Title & Contextual Microcopy */}
      <div className="relative z-10">
        <h4 className="text-sm font-bold text-white/90 tracking-wide mb-1 group-hover:text-white transition-colors">
          {stat.label}
        </h4>
        <p className="text-xs text-white/40 font-light tracking-wide group-hover:text-white/60 transition-colors">
          {stat.sublabel}
        </p>
      </div>

      {/* Ambient Corner Atmosphere */}
      <div className={`absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-br ${stat.accent}`} />
    </motion.div>
  );
};

const About = () => {
  const stats = [
    { 
      target: 100, 
      suffix: '+', 
      label: 'Projects Completed', 
      sublabel: 'Delivered with clean architecture',
      icon: Rocket,
      accent: 'from-cyan-400 via-blue-500 to-indigo-500',
      glowColor: 'rgba(56, 189, 248, 0.18)',
      borderHover: 'group-hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    { 
      target: 50, 
      suffix: '+', 
      label: 'Happy Clients', 
      sublabel: '99% Client satisfaction rate',
      icon: Users,
      accent: 'from-emerald-400 via-teal-500 to-cyan-500',
      glowColor: 'rgba(52, 211, 153, 0.18)',
      borderHover: 'group-hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    { 
      target: 30, 
      suffix: '+', 
      label: 'Templates Created', 
      sublabel: 'Production-ready premium UI kits',
      icon: LayoutTemplate,
      accent: 'from-purple-400 via-violet-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.18)',
      borderHover: 'group-hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    { 
      target: 24, 
      suffix: '/7', 
      label: 'Support Available', 
      sublabel: 'Dedicated engineers on call',
      icon: Headphones,
      accent: 'from-amber-400 via-orange-500 to-rose-500',
      glowColor: 'rgba(251, 191, 36, 0.18)',
      borderHover: 'group-hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      isLive: true
    },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden bg-[#000000] font-sans">
      
      {/* Liquid Glass Background Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Heading, Context & Animated Interactive Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] text-white font-semibold tracking-wide text-xs mb-8">
              <Sparkles size={15} className="text-blue-400" />
              <span className="uppercase tracking-widest text-white/80">About Code Fusion</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white leading-[1.1]">
              Redefining the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Digital Experience
              </span>
            </h2>
            <p className="text-white/50 text-lg md:text-2xl mb-14 font-light leading-relaxed tracking-tight max-w-2xl">
              At Code Fusion, we believe in building more than just websites. We engineer high-performing digital platforms that scale with your ambitions. Our synergy of modern architecture, luxury aesthetics, and relentless execution guarantees lasting impact.
            </p>
            
            {/* 2x2 Animated Interactive Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
              {stats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Right Column: Floating Glass Image Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-auto md:h-[700px] w-full rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] group flex items-center justify-center p-6 md:p-10 transition-colors duration-700 hover:bg-white/[0.04] hover:border-white/20"
          >
            {/* Ambient Inner Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 mix-blend-screen opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            {/* Liquid Glare Sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden rounded-[3rem]">
              <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-[glare_2s_ease-in-out_infinite]"></div>
            </div>

            {/* Poster / Showcase Asset */}
            <motion.img 
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              src="/cf-poster.png" 
              alt="Code Fusion Projects Showcase" 
              className="w-full h-full object-contain rounded-2xl relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop";
              }}
            />
          </motion.div>

        </div>
      </div>
      <style>{`
        @keyframes glare {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </section>
  );
};

export default About;
