import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { label: 'Projects Completed', value: '100+' },
    { label: 'Happy Clients', value: '50+' },
    { label: 'Templates Created', value: '30+' },
    { label: 'Support Available', value: '24/7' },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-foreground">Redefining the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Digital Experience</span></h2>
            <p className="text-foreground/60 text-lg md:text-xl mb-12 font-medium leading-relaxed">
              At Code Fusion, we believe in building more than just websites. We build powerful digital brands that stand out in the modern startup ecosystem. Our fusion of cutting-edge technology and premium luxury design ensures your business leaves a lasting impression.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-card p-8 rounded-3xl border border-[color:var(--border)] hover:border-purple-500/50 hover:shadow-lg transition-all hover:-translate-y-1 group">
                  <h3 className="text-4xl font-extrabold mb-2 tracking-tight group-hover:text-purple-600 transition-colors">{stat.value}</h3>
                  <p className="text-sm font-bold text-foreground/60 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-auto md:h-[600px] w-full rounded-[2.5rem] overflow-hidden bg-[#0A0A0A] border border-[color:var(--border)] shadow-[0_0_50px_rgba(255,255,255,0.05)] group flex items-center justify-center p-6 md:p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-white/5 mix-blend-overlay opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Promotional Image Container */}
            <img 
              src="/cf-poster.png" 
              alt="Code Fusion Projects Promo" 
              className="w-full h-full object-contain rounded-2xl relative z-10 group-hover:scale-[1.02] transition-transform duration-700 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop";
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
