import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative pt-48 pb-32 lg:pt-56 lg:pb-40 overflow-hidden flex items-center min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(3rem,6vw,6.5rem)] font-extrabold tracking-tighter mb-8 leading-[1.05] text-foreground"
          >
            Build Digital Experiences that <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
              Defy Expectations.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-foreground/60 max-w-3xl mb-12 font-medium leading-relaxed"
          >
            Enterprise-grade engineering meets luxury design. We architect scalable, AI-driven platforms for startups that refuse to blend in.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <a href="#contact" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:scale-105 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 group">
                Start Your Project <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <a href="#contact" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 rounded-2xl bg-card border border-[color:var(--border)] text-foreground font-bold text-lg hover:bg-secondary transition-all flex items-center justify-center shadow-sm">
                Get a Proposal
              </button>
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 flex flex-wrap justify-center gap-8 text-sm md:text-base font-medium text-foreground/60"
          >
            {['100+ Projects Shipped', 'Award-Winning UI/UX', 'Sub-second Load Times', 'AI-Powered Architecture'].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Modern Soft Mesh Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob"></div>
         <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[10%] left-[40%] w-[700px] h-[700px] bg-pink-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob animation-delay-4000"></div>
      </div>
    </section>
  );
};

export default Hero;
