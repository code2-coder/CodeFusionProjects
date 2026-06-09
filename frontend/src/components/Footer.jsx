import React from 'react';
import { ArrowUp, Phone, Mail, ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-24 pb-10 bg-[#050505] overflow-hidden text-white border-t border-white/5">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-purple-500/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand & Contact Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 pr-0 lg:pr-8">
            <div className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img src="/ai_logo.png" alt="Code Fusion Logo" className="relative w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] brightness-0 invert animate-[pulse_4s_ease-in-out_infinite]" />
              </div>
              <span className="font-display font-bold text-2xl md:text-3xl tracking-tight text-white leading-tight">
                Code Fusion <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Projects</span>
              </span>
            </div>
            
            <p className="text-white/50 text-sm leading-relaxed mb-8 font-medium">
              Enterprise-grade engineering meets luxury design. Architecting scalable, AI-driven platforms for ambitious startups worldwide.
            </p>
            
            <div className="flex flex-col gap-4 mb-10">
              <a href="tel:8767316759" className="group flex items-center gap-4 text-white/60 hover:text-white transition-colors w-fit">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors border border-white/5">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-semibold tracking-wide">+91 8767316759</span>
              </a>
              <a href="mailto:codefusionprojects@gmail.com" className="group flex items-center gap-4 text-white/60 hover:text-white transition-colors w-fit">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors border border-white/5">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-semibold tracking-wide">codefusionprojects@gmail.com</span>
              </a>
            </div>
            
            <div className="flex gap-3">
              {[
                { icon: FaTwitter, href: '#' },
                { icon: FaGithub, href: '#' },
                { icon: FaLinkedin, href: '#' },
                { icon: FaInstagram, href: 'https://www.instagram.com/codefusionprojects.in?igsh=MWRtd3FjZXo2Mm54cA==' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a key={i} href={item.href} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white hover:text-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)] text-white/70">
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 lg:col-span-2 lg:pl-8">
            <h4 className="font-bold text-lg mb-8 tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Platform
            </h4>
            <ul className="space-y-4">
              {['Features', 'AI Builder', 'Integrations', 'Pricing', 'Showcase'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="group flex items-center text-white/50 hover:text-white text-sm font-medium transition-colors">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-out">
                      <ArrowRight size={14} className="text-purple-400" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-bold text-lg mb-8 tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Agency
            </h4>
            <ul className="space-y-4">
              {['About Us', 'Our Process', 'Careers', 'Blog', 'Contact'].map(link => (
                <li key={link}>
                  <a href="#" className="group flex items-center text-white/50 hover:text-white text-sm font-medium transition-colors">
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-out">
                      <ArrowRight size={14} className="text-blue-400" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:pl-8">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h4 className="font-bold text-xl mb-4 tracking-tight text-white relative z-10">Join the Top 1%</h4>
              <p className="text-white/50 text-sm mb-8 font-medium leading-relaxed relative z-10">
                Get exclusive engineering insights, UI/UX trends, and startup resources directly to your inbox.
              </p>
              
              <form className="relative flex flex-col sm:flex-row gap-3 z-10">
                <div className="relative flex-1">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm text-white placeholder:text-white/30 font-medium shadow-inner" 
                    required
                  />
                </div>
                <button type="submit" className="bg-white text-black px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="text-white/40 text-sm font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Code Fusion Projects. <span className="hidden sm:inline">All rights reserved.</span>
          </p>
          
          <div className="flex gap-8 text-sm text-white/40 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>

          <button onClick={scrollToTop} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:-translate-y-1 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white/60 group">
            <ArrowUp size={20} className="group-hover:animate-bounce" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
