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

  return (
    <section className="py-32 relative bg-background border-y border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-foreground"
          >
            Our Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Process</span>
          </motion.h2>
          <p className="text-foreground/60 text-lg md:text-xl font-medium">A structured approach to bringing your luxury digital product to life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group p-8 rounded-3xl bg-card border border-[color:var(--border)] shadow-sm hover:shadow-lg transition-all hover:-translate-y-2"
            >
              {/* Connecting line for larger screens */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[80%] w-full h-[1px] bg-gradient-to-r from-purple-500/20 to-transparent"></div>
              )}
              
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-600/30 to-transparent mb-6 group-hover:from-purple-600/50 transition-colors">
                {step.num}
              </div>
              <h3 className="text-2xl font-extrabold mb-4 tracking-tight text-foreground group-hover:text-purple-600 transition-colors">{step.title}</h3>
              <p className="text-foreground/60 text-base font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
