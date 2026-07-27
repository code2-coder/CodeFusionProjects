import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="relative pt-48 pb-32 lg:pt-56 lg:pb-40 overflow-hidden flex items-center min-h-screen bg-[#000000] font-sans selection:bg-blue-500/30">
      
      {/* Apple-Style Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/20 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
        
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,rgba(0,0,0,1)_80%)] pointer-events-none"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-3xl mb-8 shadow-[0_0_30px_rgba(255,255,255,0.02)]"
          >
            <Sparkles size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-white/80 tracking-wide uppercase">Introducing CodeFusion</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.5rem,7vw,8rem)] font-black tracking-tighter mb-8 leading-[1.05] text-white drop-shadow-2xl"
          >
            Build Digital Experiences that <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
              Defy Expectations.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl lg:text-3xl text-white/50 max-w-4xl mx-auto mb-14 font-light leading-relaxed tracking-tight"
          >
            Enterprise-grade engineering meets luxury design. We architect scalable, AI-driven platforms for startups that refuse to blend in.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <Link 
              to="/start-project"
              className="group relative flex items-center justify-center gap-3 bg-white text-black font-bold text-lg sm:text-xl py-4 sm:py-5 px-8 sm:px-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Project 
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a href="#contact" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-3xl text-white font-semibold text-lg hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-sm">
                Get a Proposal
              </button>
            </a>
          </motion.div>

          {/* Glass Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 flex flex-wrap justify-center gap-4 text-sm md:text-base font-medium text-white/60"
          >
            {['100+ Projects Shipped', 'Award-Winning UI/UX', 'Sub-second Load Times', 'AI-Powered Architecture'].map((badge, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
              >
                <CheckCircle2 size={16} className="text-blue-400" />
                <span className="tracking-wide">{badge}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
