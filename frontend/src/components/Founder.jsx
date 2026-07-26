import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code, Layout, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Founder = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const socials = [
    { icon: FaGithub, href: "https://github.com/code2-coder", label: "GitHub", hoverClass: "hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:border-white" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/vaibhavpawar18/", label: "LinkedIn", hoverClass: "hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:border-cyan-400" },
    { icon: FaInstagram, href: "https://www.instagram.com/vaibhav.pawar.18", label: "Instagram", hoverClass: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:border-pink-400" }
  ];

  return (
    <section id="founder" ref={containerRef} className="py-32 lg:py-48 relative overflow-hidden bg-[#000000] font-sans">
      
      {/* Cinematic Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen"
        ></motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        
        {/* Unified Massive Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[3rem] lg:rounded-[4rem] p-8 md:p-16 shadow-2xl group overflow-hidden hover:bg-white/[0.03] hover:border-white/10 transition-colors duration-700"
        >
          {/* Edge Highlights */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          {/* Liquid Glare Sweep */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-0">
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-[glare_2.5s_ease-in-out_infinite]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center relative z-10">
            
            {/* Left: Portrait Area (Spans 5 cols) */}
            <motion.div style={{ y: imageY }} className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] group/image">
                
                {/* Rotating Halos */}
                <div className="absolute inset-[-15px] rounded-full border border-white/5 bg-transparent animate-[spin_40s_linear_infinite] group-hover/image:border-white/20 transition-colors duration-700"></div>
                <div className="absolute inset-[-30px] rounded-full border border-white/[0.02] border-dashed bg-transparent animate-[spin_60s_linear_infinite_reverse] group-hover/image:border-white/10 transition-colors duration-700"></div>

                {/* Main Portrait */}
                <div className="absolute inset-0 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden p-3 transition-transform duration-700 group-hover/image:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 mix-blend-screen opacity-0 group-hover/image:opacity-100 transition-opacity duration-1000"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80" 
                    alt="Vaibhav Rohidas Pawar" 
                    className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-700 relative z-10"
                  />
                </div>
                
                {/* Parallax Floating Badges (Now perfectly round) */}
                <motion.div 
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 -right-4 lg:-right-8 bg-white/[0.03] backdrop-blur-3xl shadow-2xl w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-500 cursor-pointer z-30 group/badge"
                >
                  <Code size={28} strokeWidth={1.5} className="group-hover/badge:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300" />
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 -left-4 lg:-left-8 bg-white/[0.03] backdrop-blur-3xl shadow-2xl w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-500 cursor-pointer z-30 group/badge"
                >
                  <Layout size={28} strokeWidth={1.5} className="group-hover/badge:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Bio Area (Spans 7 cols) */}
            <motion.div style={{ y: textY }} className="lg:col-span-7 flex flex-col justify-center">
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-8 w-fit"
              >
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-xs font-semibold text-white/70 tracking-widest uppercase">The Visionary</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 tracking-tighter text-white leading-[1.05]">
                Vaibhav Rohidas Pawar
              </h2>
              <p className="text-xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8 font-bold tracking-tight">
                Founder & Principal Architect
              </p>
              
              <p className="text-white/50 leading-relaxed mb-12 font-light text-lg md:text-xl max-w-2xl tracking-tight hover:text-white/70 transition-colors duration-700">
                A visionary full-stack developer and UI/UX expert dedicated to crafting premium digital experiences. With a deep passion for the MERN stack and modern design aesthetics, Vaibhav leads Code Fusion in delivering high-end scalable solutions for ambitious startups worldwide.
              </p>

              {/* Social Buttons */}
              <div className="flex gap-4 md:gap-6">
                {socials.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.a 
                      key={i} 
                      href={item.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      whileHover={{ scale: 1.15, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ ease: [0.16, 1, 0.3, 1] }}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/[0.03] backdrop-blur-3xl flex items-center justify-center border border-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.02)] transition-all duration-500 relative overflow-hidden group/btn ${item.hoverClass}`}
                    >
                      <Icon size={24} className="relative z-10 transition-all duration-300" />
                    </motion.a>
                  );
                })}
              </div>

            </motion.div>

          </div>
        </motion.div>

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

export default Founder;
