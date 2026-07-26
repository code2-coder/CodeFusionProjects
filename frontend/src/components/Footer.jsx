import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUp, Phone, Mail, ArrowRight, MapPin, Send, Sparkles } from 'lucide-react';
import { FaLinkedin, FaInstagram, FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <footer className="relative pt-32 pb-10 bg-[#000000] overflow-hidden text-white font-sans border-t border-white/5">
      {/* Premium Atmospheric Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/4 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ x: [20, -20, 20], y: [-20, 0, -20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen"
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-24"
        >
          
          {/* Brand & Contact Column */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4 pr-0 lg:pr-10">
            <div className="flex items-center gap-4 mb-8 group cursor-pointer w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src="/ai_logo.png" alt="Code Fusion Logo" className="relative w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] brightness-0 invert" />
              </div>
              <span className="font-display font-black text-3xl tracking-tighter text-white leading-tight">
                Code Fusion <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Projects</span>
              </span>
            </div>
            
            <p className="text-white/50 text-base leading-relaxed mb-10 font-light tracking-wide max-w-sm">
              Enterprise-grade engineering meets luxury design. Architecting scalable, AI-driven platforms for ambitious startups worldwide.
            </p>
            
            <div className="flex flex-col gap-5 mb-12">
              <a href="tel:8767316759" className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors w-fit">
                <div className="w-12 h-12 rounded-[1rem] bg-white/[0.02] border border-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-purple-500/10 group-hover:text-purple-400 group-hover:border-purple-500/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-500">
                  <Phone size={18} />
                </div>
                <span className="text-sm font-medium tracking-wide">+91 8767316759</span>
              </a>
              <a href="mailto:codefusionprojects@gmail.com" className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors w-fit">
                <div className="w-12 h-12 rounded-[1rem] bg-white/[0.02] border border-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-medium tracking-wide">codefusionprojects@gmail.com</span>
              </a>
              <div className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors w-fit cursor-default">
                <div className="w-12 h-12 rounded-[1rem] bg-white/[0.02] border border-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-pink-500/10 group-hover:text-pink-400 group-hover:border-pink-500/20 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all duration-500">
                  <MapPin size={18} />
                </div>
                <span className="text-sm font-medium tracking-wide">Global Remote</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              {[
                { icon: FaLinkedin, href: '#', color: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 hover:shadow-[0_0_20px_rgba(10,102,194,0.2)]' },
                { icon: FaInstagram, href: 'https://www.instagram.com/codefusionprojects.in?igsh=MWRtd3FjZXo2Mm54cA==', color: 'hover:text-[#E1306C] hover:bg-[#E1306C]/10 hover:border-[#E1306C]/30 hover:shadow-[0_0_20px_rgba(225,48,108,0.2)]' },
                { icon: FaGithub, href: '#', color: 'hover:text-white hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]' },
                { icon: FaTwitter, href: '#', color: 'hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 hover:shadow-[0_0_20px_rgba(29,161,242,0.2)]' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a key={i} href={item.href} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-[1rem] bg-white/[0.02] border border-white/5 backdrop-blur-md flex items-center justify-center transition-all duration-500 text-white/50 ${item.color}`}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Links Columns */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 lg:pl-4 lg:pt-4">
            <h4 className="font-bold text-lg mb-8 tracking-tight text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
              Platform
            </h4>
            <ul className="space-y-5">
              {['Features', 'AI Builder', 'Integrations', 'Pricing', 'Showcase'].map(link => (
                <li key={link}>
                  <Link to={`/#${link.toLowerCase().replace(' ', '-')}`} className="group flex items-center text-white/50 hover:text-white text-sm font-medium tracking-wide transition-all duration-300">
                    <span className="w-0 overflow-hidden group-hover:w-5 transition-all duration-300 ease-out flex items-center">
                      <ArrowRight size={14} className="text-purple-400" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 lg:pt-4">
            <h4 className="font-bold text-lg mb-8 tracking-tight text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              Agency
            </h4>
            <ul className="space-y-5">
              {['About Us', 'Our Process', 'Careers', 'Blog', 'Contact'].map(link => (
                <li key={link}>
                  <Link to={link === 'Contact' ? '/contact' : `/#${link.toLowerCase().replace(' ', '-')}`} className="group flex items-center text-white/50 hover:text-white text-sm font-medium tracking-wide transition-all duration-300">
                    <span className="w-0 overflow-hidden group-hover:w-5 transition-all duration-300 ease-out flex items-center">
                      <ArrowRight size={14} className="text-blue-400" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4 lg:pl-8">
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
              
              <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0"></div>
              
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-[70px] group-hover:bg-purple-500/20 transition-colors duration-1000 pointer-events-none"></div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-white font-medium tracking-wide text-xs mb-6 relative z-10 shadow-inner">
                <Sparkles size={14} className="text-blue-400" />
                Join the Top 1%
              </div>
              
              <p className="text-white/60 text-sm mb-8 font-light tracking-wide leading-relaxed relative z-10">
                Get exclusive engineering insights, UI/UX trends, and startup resources directly to your inbox.
              </p>
              
              <form className="relative flex flex-col gap-4 z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="relative group/input">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl pl-6 pr-14 py-4 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all text-white placeholder:text-white/30 font-medium shadow-inner" 
                    required
                  />
                  <Mail size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-blue-400 transition-colors pointer-events-none" />
                </div>
                <button type="submit" className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 group/btn hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden">
                  <span className="relative z-10">Subscribe Now</span>
                  <Send size={16} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[glare_1.5s_ease-in-out_infinite] skew-x-[-25deg]"></div>
                </button>
                <p className="text-[10px] text-white/30 text-center font-medium tracking-wide mt-2">No spam. Unsubscribe at any time.</p>
              </form>
            </div>
          </motion.div>

        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10"
        >
          <p className="text-white/40 text-xs font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Code Fusion Projects. <span className="hidden sm:inline">All rights reserved.</span>
          </p>
          
          <div className="flex gap-8 text-xs text-white/40 font-medium tracking-wide">
            <a href="#" className="hover:text-white hover:underline underline-offset-4 transition-all">Privacy</a>
            <a href="#" className="hover:text-white hover:underline underline-offset-4 transition-all">Terms</a>
            <a href="#" className="hover:text-white hover:underline underline-offset-4 transition-all">Cookies</a>
          </div>

          <button onClick={scrollToTop} className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] text-white group relative overflow-hidden">
            <ArrowUp size={20} className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
          </button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
