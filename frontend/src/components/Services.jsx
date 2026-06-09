import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, PenTool, Search, Briefcase, Bot, Globe } from 'lucide-react';

const Services = () => {
  const services = [
    { 
      icon: <Monitor size={32} />, 
      title: 'Enterprise Web Development', 
      desc: 'Custom tailored, blazing fast web applications engineered for massive scale and flawless performance.', 
      span: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
      gradient: 'from-blue-500/10 to-transparent'
    },
    { 
      icon: <PenTool size={28} />, 
      title: 'Luxury UI/UX Design', 
      desc: 'Premium, user-centric interfaces crafted for conversion.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-purple-500/10 to-transparent'
    },
    { 
      icon: <Bot size={28} />, 
      title: 'AI Website Builder', 
      desc: 'Generate complete, production-ready sites in seconds.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-pink-500/10 to-transparent'
    },
    { 
      icon: <Search size={28} />, 
      title: 'SEO Optimization', 
      desc: 'Rank higher and grow your audience organically.', 
      span: 'md:col-span-1 lg:col-span-1',
      gradient: 'from-emerald-500/10 to-transparent'
    },
    { 
      icon: <Globe size={28} />, 
      title: 'Global Hosting', 
      desc: 'Reliable 99.9% uptime infrastructure for your business.', 
      span: 'md:col-span-1 lg:col-span-2',
      gradient: 'from-indigo-500/10 to-transparent'
    },
  ];

  return (
    <section id="services" className="py-32 relative bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            Engineering Excellence. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Design Perfection.
            </span>
          </motion.h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">Comprehensive, high-end digital solutions designed to aggressively scale your presence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
          {services.map((srv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-8 group cursor-pointer relative overflow-hidden flex flex-col justify-end ${srv.span}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${srv.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 border border-[color:var(--border)] shadow-sm">
                  {srv.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all w-fit">
                    {srv.title}
                  </h3>
                  <p className="text-base text-foreground/60 font-medium leading-relaxed max-w-md">
                    {srv.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
