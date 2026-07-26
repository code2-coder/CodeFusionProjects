import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    { 
      q: "How does Code Fusion architect enterprise-scale platforms?", 
      a: "We employ a proprietary microservices architecture paired with edge computing. Our core stack leverages modern React/Next.js and Node.js ecosystems, ensuring ultra-low latency, headless CMS integration, and boundless scalability for high-traffic environments." 
    },
    { 
      q: "Do you integrate AI directly into custom web applications?", 
      a: "Absolutely. We specialize in embedding Large Language Models (LLMs) and custom AI pipelines directly into your SaaS architecture, enabling intelligent workflow automation, dynamic data analysis, and hyper-personalized user experiences." 
    },
    { 
      q: "What is your approach to high-end UI/UX design?", 
      a: "We practice 'Liquid Glass' and 'Apple Human Interface' design philosophies. Every interface is meticulously engineered with physics-based micro-animations, cinematic ambient lighting, and bento-box layouts to evoke a profound sense of digital luxury." 
    },
    { 
      q: "Is zero-downtime deployment guaranteed?", 
      a: "Yes. We utilize containerized orchestration via Docker on AWS/Vercel infrastructure. Our advanced CI/CD pipeline ensures continuous integration, automated rollbacks, and absolutely zero-downtime deployments for mission-critical applications." 
    },
    { 
      q: "What is the timeline for a flagship web product?", 
      a: "A bespoke enterprise product typically demands 6 to 12 weeks of intense engineering. This encompasses rigorous UI/UX prototyping, full-stack development, stringent security auditing, and global performance optimization before launch." 
    },
    { 
      q: "Do you provide continuous architectural evolution?", 
      a: "We don't just maintain software; we evolve it. Our exclusive retainer partnerships include continuous performance monitoring, preemptive security patching, and proactive architectural upgrades to ensure your platform remains at the bleeding edge." 
    }
  ];

  return (
    <section className="py-32 lg:py-48 relative bg-[#000000] border-t border-white/5 font-sans overflow-hidden">
      
      {/* Cinematic Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen"
        ></motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] text-white font-semibold tracking-wide text-xs mb-8"
          >
            <HelpCircle size={16} className="text-blue-400" />
            <span className="uppercase tracking-widest text-white/80">Help Center</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight text-white"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Questions</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg md:text-2xl font-light tracking-tight max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to know about our premium services and luxurious development process.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              key={i} 
              className={`bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 group ${openIdx === i ? 'bg-white/[0.04] border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'shadow-lg'}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left relative"
              >
                {/* Subtle top glare on hover */}
                <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <span className={`font-bold text-lg md:text-xl tracking-tight transition-colors duration-300 ${openIdx === i ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' : 'text-white'}`}>{faq.q}</span>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openIdx === i ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white'}`}>
                  <ChevronDown className={`transform transition-transform duration-500 ${openIdx === i ? 'rotate-180' : ''}`} size={20} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-8 pt-0 text-white/60 leading-relaxed font-light text-base md:text-lg border-t border-white/10 mt-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                      >
                        {faq.a}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
