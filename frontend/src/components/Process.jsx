import React from 'react';
import { motion } from 'framer-motion';

const Process = () => {
  const steps = [
    { num: "01", title: "Requirement Gathering", desc: "Understanding your vision, target audience, and business goals deeply." },
    { num: "02", title: "UI/UX Planning", desc: "Wireframing and crafting the perfect user journey and luxury design system." },
    { num: "03", title: "Development", desc: "Building scalable, high-performance architecture using modern MERN stack." },
    { num: "04", title: "Testing", desc: "Rigorous quality assurance for flawless performance across devices." },
    { num: "05", title: "Deployment", desc: "Smooth launch with optimized servers, CI/CD pipelines, and SEO setup." },
    { num: "06", title: "Support", desc: "Continuous monitoring, maintenance, and feature enhancements." },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20, 
        mass: 1 
      } 
    },
  };

  return (
    <section className="py-32 relative bg-background border-y border-[color:var(--border)] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-foreground"
          >
            Our Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Process</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-foreground/60 text-lg md:text-xl font-medium"
          >
            A structured approach to bringing your luxury digital product to life.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 relative z-10"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="relative group p-8 rounded-3xl bg-card border border-[color:var(--border)] shadow-sm backdrop-blur-sm"
            >
              {/* Glowing hover border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/10 group-hover:to-purple-600/10 transition-colors duration-500 -z-10"></div>
              
              {/* Connecting line for larger screens */}
              {i % 3 !== 2 && i < steps.length - 1 && (
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeInOut" }}
                  style={{ originX: 0 }}
                  className="hidden lg:block absolute top-16 left-[80%] w-full h-[2px] bg-gradient-to-r from-purple-500/30 to-transparent z-[-1]"
                ></motion.div>
              )}
              
              <div className="relative">
                <motion.div 
                  className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-600/20 to-transparent mb-6 inline-block"
                  whileHover={{ scale: 1.1, x: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {step.num}
                </motion.div>
                <div className="absolute top-1/2 left-8 w-10 h-10 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <h3 className="text-2xl font-extrabold mb-4 tracking-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
                {step.title}
              </h3>
              <p className="text-foreground/70 text-base font-medium leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
