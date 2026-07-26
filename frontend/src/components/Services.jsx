import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, PenTool, Search, Briefcase, Bot, Globe, ShoppingCart, Smartphone, Cloud, Code, TrendingUp } from 'lucide-react';

const Services = () => {
  const services = [
    { 
      icon: <Monitor size={32} strokeWidth={1.5} />, 
      title: 'Enterprise Web Development', 
      desc: 'Custom tailored, blazing fast web applications engineered for massive scale and flawless performance.', 
      span: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
      gradient: 'from-blue-600/20 to-cyan-500/10'
    },
    { 
      icon: <PenTool size={28} strokeWidth={1.5} />, 
      title: 'Luxury UI/UX Design', 
      desc: 'Premium, user-centric interfaces crafted for conversion.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-purple-600/20 to-fuchsia-500/10'
    },
    { 
      icon: <Bot size={28} strokeWidth={1.5} />, 
      title: 'AI Website Builder', 
      desc: 'Generate complete, production-ready sites in seconds.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-pink-600/20 to-rose-500/10'
    },
    { 
      icon: <Search size={28} strokeWidth={1.5} />, 
      title: 'SEO Optimization', 
      desc: 'Rank higher and grow your audience organically.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-emerald-600/20 to-teal-500/10'
    },
    { 
      icon: <Globe size={28} strokeWidth={1.5} />, 
      title: 'Global Hosting', 
      desc: 'Reliable 99.9% uptime infrastructure for your business.', 
      span: 'md:col-span-1 lg:col-span-2',
      gradient: 'from-indigo-600/20 to-blue-500/10'
    },
    { 
      icon: <ShoppingCart size={28} strokeWidth={1.5} />, 
      title: 'E-Commerce Solutions', 
      desc: 'Scalable, secure, and conversion-optimized online stores.', 
      span: 'md:col-span-2 lg:col-span-2',
      gradient: 'from-orange-600/20 to-amber-500/10'
    },
    { 
      icon: <Smartphone size={28} strokeWidth={1.5} />, 
      title: 'Mobile App Development', 
      desc: 'Native and cross-platform apps for iOS and Android.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-rose-600/20 to-red-500/10'
    },
    { 
      icon: <Cloud size={28} strokeWidth={1.5} />, 
      title: 'Cloud Architecture & Migration', 
      desc: 'Secure and efficient cloud solutions tailored to your needs.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-cyan-600/20 to-sky-500/10'
    },
    { 
      icon: <Code size={28} strokeWidth={1.5} />, 
      title: 'Custom API Development', 
      desc: 'Robust, secure, and scalable APIs to power your applications.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-yellow-600/20 to-amber-500/10'
    },
    { 
      icon: <TrendingUp size={28} strokeWidth={1.5} />, 
      title: 'Digital Marketing', 
      desc: 'Data-driven marketing strategies to maximize your ROI.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-red-600/20 to-orange-500/10'
    },
  ];

  return (
    <section id="services" className="py-32 relative bg-[#050505] overflow-hidden font-sans">
      
      {/* Background Liquid Gradients */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)] pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          >
            <Briefcase size={16} className="text-blue-400" />
            <span className="text-sm font-bold text-white tracking-widest uppercase">Expertise</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tighter leading-tight text-white"
          >
            Engineering Excellence. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Design Perfection.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            Comprehensive, high-end digital solutions designed to aggressively scale your presence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-[240px]">
          {services.map((srv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
              className={`group relative rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/20 backdrop-blur-3xl transition-all duration-500 cursor-pointer shadow-2xl flex flex-col justify-end ${srv.span}`}
            >
              {/* Animated Hover Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${srv.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen`}></div>
              
              {/* Liquid Glare Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden rounded-[2rem]">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-[glare_1.5s_ease-in-out_infinite]"></div>
              </div>

              <div className="relative z-10 p-8 flex flex-col h-full justify-between pointer-events-none">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:-translate-y-2 group-hover:bg-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 border border-white/10 shadow-lg">
                  {srv.icon}
                </div>
                
                <div className="transform group-hover:-translate-y-1 transition-transform duration-500">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                    {srv.title}
                  </h3>
                  <p className="text-base lg:text-lg text-white/50 font-light leading-relaxed max-w-md group-hover:text-white/70 transition-colors duration-500">
                    {srv.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
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

export default Services;
