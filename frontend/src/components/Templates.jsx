import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';

const Templates = () => {
  const templates = [
    { title: 'Portfolio Website', tag: 'Creative', img: 'https://images.unsplash.com/photo-1507238692062-5a042e9e8305?w=800&q=80' },
    { title: 'E-Commerce Store', tag: 'Business', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80' },
    { title: 'Real Estate Agency', tag: 'Corporate', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80' },
    { title: 'Restaurant Booking', tag: 'Hospitality', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
    { title: 'SaaS Dashboard', tag: 'Application', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' },
    { title: 'Dental Clinic', tag: 'Healthcare', img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80' },
  ];

  return (
    <section id="templates" className="py-32 relative bg-secondary/10 border-y border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Templates</span></h2>
            <p className="text-foreground/60 text-lg md:text-xl max-w-xl font-medium">Start your project with our meticulously crafted, high-performance templates designed for conversion.</p>
          </motion.div>
          <motion.button 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="px-6 py-3 rounded-xl bg-card border border-[color:var(--border)] font-semibold hover:bg-secondary transition-colors shrink-0 shadow-sm"
          >
            View All Templates
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl mb-5 aspect-[4/3] bg-card border border-[color:var(--border)] shadow-sm group-hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={tpl.img} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" />
                
                {/* Hover overlays */}
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                  <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <Play size={24} className="ml-1" />
                  </button>
                  <button className="w-14 h-14 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform hover:bg-black/70 backdrop-blur-md">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start px-1">
                <div>
                  <h3 className="text-xl font-bold mb-1.5 tracking-tight group-hover:text-blue-600 transition-colors">{tpl.title}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-secondary text-foreground/60 tracking-wide uppercase">{tpl.tag}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Templates;
