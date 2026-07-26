import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Neha Sharma",
      role: "CEO, TechNova",
      content: "Code Fusion completely transformed our digital presence. The AI builder they developed for us saved hundreds of hours. Truly a world-class team.",
      img: "https://ui-avatars.com/api/?name=Neha+Sharma&background=8b5cf6&color=fff"
    },
    {
      name: "Rahul Desai",
      role: "Founder, Lumina",
      content: "The level of polish and attention to detail in their UI/UX work is unmatched. They understand the premium startup aesthetic perfectly.",
      img: "https://ui-avatars.com/api/?name=Rahul+Desai&background=3b82f6&color=fff"
    },
    {
      name: "Priya Patel",
      role: "Director, Zenith Retail",
      content: "Our e-commerce conversion rates doubled after the redesign. The speed and smoothness of the new platform are incredible.",
      img: "https://ui-avatars.com/api/?name=Priya+Patel&background=ec4899&color=fff"
    },
    {
      name: "Vikram Singh",
      role: "VP Product, Elevate",
      content: "Scaling our platform was a nightmare until we partnered with them. Their architecture is flawless and incredibly performant.",
      img: "https://ui-avatars.com/api/?name=Vikram+Singh&background=10b981&color=fff"
    }
  ];

  // Duplicate for seamless marquee effect
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-32 lg:py-48 relative overflow-hidden bg-[#000000] border-t border-white/5 font-sans">
      {/* Background gradient orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 mb-20 md:mb-28">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] text-white font-semibold tracking-wide text-xs mb-8">
            <Star size={14} className="text-yellow-400" />
            <span className="uppercase tracking-widest text-white/80">Testimonials</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white leading-tight">
            Trusted by <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Innovators</span>
          </h2>
          <p className="text-white/50 text-lg md:text-2xl font-light tracking-tight max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. See what our visionary partners say about our luxury digital solutions.
          </p>
        </motion.div>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="animate-marquee flex gap-8 px-4 whitespace-nowrap min-w-full">
          {duplicatedReviews.map((review, i) => (
            <div
              key={i}
              className="bg-white/[0.02] backdrop-blur-2xl p-8 md:p-10 border border-white/5 rounded-[2.5rem] relative flex-shrink-0 w-[350px] md:w-[480px] whitespace-normal group-hover:opacity-40 hover:!opacity-100 hover:scale-[1.02] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Internal Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 hover:from-blue-500/5 hover:to-purple-500/5 transition-colors duration-700 pointer-events-none"></div>
              
              <Quote className="absolute top-8 right-8 text-white/5" size={60} />
              
              <div className="flex gap-1.5 text-yellow-400/90 mb-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
              </div>
              
              <p className="text-white/80 leading-relaxed mb-10 relative z-10 font-light text-base md:text-lg tracking-tight">
                "{review.content}"
              </p>
              
              <div className="flex items-center gap-5 mt-auto relative z-10">
                <div className="w-14 h-14 rounded-full p-1 bg-white/5 border border-white/10 backdrop-blur-md">
                  <img src={review.img} alt={review.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white tracking-tight">{review.name}</h4>
                  <p className="text-sm text-white/50 font-light tracking-wide">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second identical row for continuous loop */}
        <div className="animate-marquee2 absolute top-0 flex gap-8 px-4 whitespace-nowrap min-w-full">
          {duplicatedReviews.map((review, i) => (
            <div
              key={`dup-${i}`}
              className="bg-white/[0.02] backdrop-blur-2xl p-8 md:p-10 border border-white/5 rounded-[2.5rem] relative flex-shrink-0 w-[350px] md:w-[480px] whitespace-normal group-hover:opacity-40 hover:!opacity-100 hover:scale-[1.02] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Internal Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 hover:from-blue-500/5 hover:to-purple-500/5 transition-colors duration-700 pointer-events-none"></div>
              
              <Quote className="absolute top-8 right-8 text-white/5" size={60} />
              
              <div className="flex gap-1.5 text-yellow-400/90 mb-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
              </div>
              
              <p className="text-white/80 leading-relaxed mb-10 relative z-10 font-light text-base md:text-lg tracking-tight">
                "{review.content}"
              </p>
              
              <div className="flex items-center gap-5 mt-auto relative z-10">
                <div className="w-14 h-14 rounded-full p-1 bg-white/5 border border-white/10 backdrop-blur-md">
                  <img src={review.img} alt={review.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white tracking-tight">{review.name}</h4>
                  <p className="text-sm text-white/50 font-light tracking-wide">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fade edges */}
      <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-[#000000] to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-[#000000] to-transparent pointer-events-none z-10"></div>
    </section>
  );
};

export default Testimonials;
