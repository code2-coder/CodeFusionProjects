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
    <section id="about" className="py-32 relative overflow-hidden bg-[#000000] font-sans">
      
      {/* Liquid Glass Background Orbs */}
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
          
          {/* Text & Stats Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white leading-[1.1]">
              Redefining the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Digital Experience
              </span>
            </h2>
            <p className="text-white/50 text-lg md:text-2xl mb-14 font-light leading-relaxed tracking-tight max-w-2xl">
              At Code Fusion, we believe in building more than just websites. We build powerful digital brands that stand out in the modern startup ecosystem. Our fusion of cutting-edge technology and premium luxury design ensures your business leaves a lasting impression.
            </p>
            
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:-translate-y-2 group cursor-default shadow-2xl relative overflow-hidden"
                >
                  {/* Subtle Top Border Glow */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <h3 className="text-4xl lg:text-5xl font-black mb-3 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">
                    {stat.value}
                  </h3>
                  <p className="text-xs lg:text-sm font-semibold text-white/40 uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors duration-500">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating Glass Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-auto md:h-[700px] w-full rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] group flex items-center justify-center p-6 md:p-10 transition-colors duration-700 hover:bg-white/[0.04] hover:border-white/20"
          >
            {/* Ambient Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 mix-blend-screen opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            {/* Liquid Glare */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden rounded-[3rem]">
              <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-[glare_2s_ease-in-out_infinite]"></div>
            </div>

            {/* Promotional Image */}
            <motion.img 
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              src="/cf-poster.png" 
              alt="Code Fusion Projects Promo" 
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
