import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layout } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Founder = () => {
  const socials = [
    { icon: FaGithub, href: "https://github.com/code2-coder", label: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/vaibhavpawar18/", label: "LinkedIn" },
    { icon: FaInstagram, href: "https://www.instagram.com/vaibhav.pawar.18", label: "Instagram" }
  ];

  return (
    <section id="founder" className="py-32 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[color:var(--border)] animate-[spin_30s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border border-[color:var(--border)] bg-card shadow-sm flex items-center justify-center p-2">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" 
                  alt="Vaibhav Rohidas Pawar" 
                  className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -right-4 bg-card shadow-md p-4 rounded-2xl border border-[color:var(--border)] text-blue-600"
              >
                <Code size={24} />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 -left-6 bg-card shadow-md p-4 rounded-2xl border border-[color:var(--border)] text-purple-600"
              >
                <Layout size={24} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 tracking-tight text-foreground">Vaibhav R. Pawar</h2>
            <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 font-bold tracking-tight">Founder & Principal Architect</p>
            
            <p className="text-foreground/60 leading-relaxed mb-10 font-medium text-lg text-justify">
              A visionary full-stack developer and UI/UX expert dedicated to crafting premium digital experiences. With a deep passion for the MERN stack and modern design aesthetics, Vaibhav leads Code Fusion in delivering high-end scalable solutions for ambitious startups worldwide.
            </p>

            <div className="flex gap-4">
              {socials.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a 
                    key={i} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center hover:bg-foreground hover:text-background transition-all border border-[color:var(--border)] text-foreground/80 shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <Icon size={22} />
                  </a>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Founder;
