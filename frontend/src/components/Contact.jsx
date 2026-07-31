import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import SEO from './SEO';
import axios from 'axios';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      service: e.target.type.options[e.target.type.selectedIndex].text,
      businessType: e.target.type.value,
      message: e.target.message.value
    };

    try {
      await axios.post('/api/contact', formData);
      setIsSuccess(true);
      e.target.reset();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 lg:py-48 relative overflow-hidden bg-[#000000] border-t border-white/5 font-sans">
      <SEO 
        title="Contact Us & Get a Quote | Code Fusion Projects"
        description="Get in touch with Code Fusion Projects. Inquire about custom MERN stack developments, luxury UI/UX styling, or our ₹2,999 website creation offering."
        keywords="contact website developer, hire MERN developers, contact Code Fusion, professional web developer contact, website design cost"
      />
      {/* Cinematic Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] text-white font-semibold tracking-wide text-xs mb-8">
              <Sparkles size={16} className="text-blue-400" />
              <span className="uppercase tracking-widest text-white/80">Get In Touch</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight text-white">
              Let's Build Something <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Amazing Together</span>
            </h2>
            
            <p className="text-white/50 text-lg md:text-xl mb-16 font-light tracking-tight leading-relaxed max-w-xl">
              Ready to transform your digital presence? Drop us a message and our architectural team will get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, title: "Email Us", info: "codefusionprojects@gmail.com", color: "blue" },
                { icon: Phone, title: "Call Us", info: "+91 8767316759", color: "purple" },
                { icon: MapPin, title: "Visit Us", info: "Near Union Bank of India, Sonai Road, Sonai, Maharashtra 414105, India", color: "pink" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-6 group cursor-default"
                >
                  <div className={`w-16 h-16 rounded-[1.25rem] bg-white/[0.02] border border-white/5 backdrop-blur-md flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-white/[0.05] group-hover:border-white/10 ${
                    item.color === 'blue' ? 'text-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]' :
                    item.color === 'purple' ? 'text-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]' :
                    'text-pink-400 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]'
                  }`}>
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold text-lg mb-1 text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">{item.title}</h4>
                    <p className="text-white/50 font-light tracking-wide leading-relaxed max-w-[280px] group-hover:text-white/70 transition-colors">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-white/[0.02] backdrop-blur-3xl p-10 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group/form">
               
               {/* Internal Form Glare */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none z-0"></div>
               <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/form:opacity-100 transition-opacity duration-1000 z-0"></div>

               <form onSubmit={handleSubmit} className="relative z-10">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.3 }}
                     className="relative group"
                   >
                     <input type="text" id="name" className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all peer text-white font-medium" placeholder=" " required />
                     <label htmlFor="name" className="absolute left-6 top-5 text-white/40 font-light tracking-wide transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-[#050505] peer-focus:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-white/60 peer-valid:bg-[#050505] peer-valid:px-2 rounded-full cursor-text">Full Name</label>
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.4 }}
                     className="relative group"
                   >
                     <input type="email" id="email" className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all peer text-white font-medium" placeholder=" " required />
                     <label htmlFor="email" className="absolute left-6 top-5 text-white/40 font-light tracking-wide transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-[#050505] peer-focus:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-white/60 peer-valid:bg-[#050505] peer-valid:px-2 rounded-full cursor-text">Email Address</label>
                   </motion.div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.5 }}
                     className="relative group"
                   >
                     <input type="tel" id="phone" className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all peer text-white font-medium" placeholder=" " required />
                     <label htmlFor="phone" className="absolute left-6 top-5 text-white/40 font-light tracking-wide transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-[#050505] peer-focus:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-white/60 peer-valid:bg-[#050505] peer-valid:px-2 rounded-full cursor-text">Phone Number</label>
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.6 }}
                     className="relative group"
                   >
                     <select id="type" className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all appearance-none text-white font-medium cursor-pointer">
                       <option value="web" className="bg-[#111] text-white">Website Development</option>
                       <option value="ecommerce" className="bg-[#111] text-white">E-Commerce</option>
                       <option value="uiux" className="bg-[#111] text-white">UI/UX Design</option>
                       <option value="ai" className="bg-[#111] text-white">AI Solutions</option>
                       <option value="other" className="bg-[#111] text-white">Other</option>
                     </select>
                     <label htmlFor="type" className="absolute left-6 -top-3 text-xs font-light tracking-wide text-white/60 bg-[#050505] px-2 rounded-full">Business Type</label>
                     <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-blue-400 transition-colors">
                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     </div>
                   </motion.div>
                 </div>

                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.7 }}
                   className="relative group mb-10"
                 >
                   <textarea id="message" rows="4" className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all peer resize-none text-white font-medium" placeholder=" " required></textarea>
                   <label htmlFor="message" className="absolute left-6 top-5 text-white/40 font-light tracking-wide transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-[#050505] peer-focus:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-white/60 peer-valid:bg-[#050505] peer-valid:px-2 rounded-full cursor-text">Project Details...</label>
                 </motion.div>

                 <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  type="submit" 
                  disabled={isSubmitting || isSuccess}
                  className="w-full py-5 rounded-2xl bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn hover:scale-105 active:scale-95 disabled:opacity-80 disabled:hover:scale-100 disabled:cursor-not-allowed"
                 >
                   <AnimatePresence mode="wait">
                     {isSubmitting ? (
                       <motion.div
                         key="submitting"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="flex items-center gap-2"
                       >
                         <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                         Sending...
                       </motion.div>
                     ) : isSuccess ? (
                       <motion.div
                         key="success"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="flex items-center gap-2 text-emerald-600"
                       >
                         <CheckCircle2 size={20} />
                         Message Sent!
                       </motion.div>
                     ) : (
                       <motion.div
                         key="default"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="flex items-center gap-2"
                       >
                         <span className="relative z-10">Send Message</span>
                         <Send size={18} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                       </motion.div>
                     )}
                   </AnimatePresence>
                   {!isSubmitting && !isSuccess && (
                     <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[glare_1.5s_ease-in-out_infinite] skew-x-[-25deg]"></div>
                   )}
                 </motion.button>
               </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
