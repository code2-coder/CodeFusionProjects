import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "CEO, TechNova",
      content: "Code Fusion completely transformed our digital presence. The AI builder they developed for us saved hundreds of hours. Truly a world-class team.",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
    },
    {
      name: "David Chen",
      role: "Founder, Lumina",
      content: "The level of polish and attention to detail in their UI/UX work is unmatched. They understand the premium startup aesthetic perfectly.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
    },
    {
      name: "Elena Rodriguez",
      role: "Director, Zenith Retail",
      content: "Our e-commerce conversion rates doubled after the redesign. The speed and smoothness of the new platform are incredible.",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80"
    },
    {
      name: "Marcus Thorne",
      role: "VP Product, Elevate",
      content: "Scaling our platform was a nightmare until we partnered with them. Their architecture is flawless and incredibly performant.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
    }
  ];

  // Duplicate for seamless marquee effect
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-32 relative overflow-hidden bg-secondary/10 border-y border-[color:var(--border)]">
      {/* Background gradient orb */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Innovators</span>
          </h2>
          <p className="text-foreground/60 text-lg font-medium">Don't just take our word for it. See what our partners say.</p>
        </div>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="animate-marquee flex gap-6 px-3 whitespace-nowrap min-w-full">
          {duplicatedReviews.map((review, i) => (
            <div
              key={i}
              className="glass-card p-8 border-[color:var(--border)] relative flex-shrink-0 w-[350px] md:w-[450px] whitespace-normal group-hover:opacity-50 hover:!opacity-100 transition-opacity duration-300"
            >
              <Quote className="absolute top-6 right-6 text-foreground/5" size={40} />
              <div className="flex gap-1 text-yellow-500 mb-6">
                {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-8 relative z-10 font-medium text-sm md:text-base">
                "{review.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-[color:var(--border)]" />
                <div>
                  <h4 className="font-bold text-sm text-foreground tracking-tight">{review.name}</h4>
                  <p className="text-xs text-foreground/60 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second identical row for continuous loop */}
        <div className="animate-marquee2 absolute top-0 flex gap-6 px-3 whitespace-nowrap min-w-full">
          {duplicatedReviews.map((review, i) => (
            <div
              key={`dup-${i}`}
              className="glass-card p-8 border-[color:var(--border)] relative flex-shrink-0 w-[350px] md:w-[450px] whitespace-normal group-hover:opacity-50 hover:!opacity-100 transition-opacity duration-300"
            >
              <Quote className="absolute top-6 right-6 text-foreground/5" size={40} />
              <div className="flex gap-1 text-yellow-500 mb-6">
                {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-8 relative z-10 font-medium text-sm md:text-base">
                "{review.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-[color:var(--border)]" />
                <div>
                  <h4 className="font-bold text-sm text-foreground tracking-tight">{review.name}</h4>
                  <p className="text-xs text-foreground/60 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fade edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[color:var(--background)] to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[color:var(--background)] to-transparent pointer-events-none z-10"></div>
    </section>
  );
};

export default Testimonials;
