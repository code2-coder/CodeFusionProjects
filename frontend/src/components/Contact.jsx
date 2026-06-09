import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-zinc-950 border-y border-white/10">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight text-white">Let's Build Something <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Amazing Together</span></h2>
            <p className="text-white/60 text-lg md:text-xl mb-12 font-medium">Ready to transform your digital presence? Drop us a message and we'll get back to you within 24 hours.</p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-sm shrink-0">
                  <Mail size={24} />
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-base mb-1 text-white">Email Us</h4>
                  <p className="text-white/60 font-medium">codefusionprojects@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 shadow-sm shrink-0">
                  <Phone size={24} />
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-base mb-1 text-white">Call Us</h4>
                  <p className="text-white/60 font-medium">+91 8767316759</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 shadow-sm shrink-0">
                  <MapPin size={24} />
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-base mb-1 text-white">Visit Us</h4>
                  <p className="text-white/60 font-medium leading-relaxed">Near Union Bank of India, Sonai Road,<br/>Sonai, Maharashtra 414105, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 shadow-2xl relative">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="relative group">
                   <input type="text" id="name" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all peer text-white font-medium" placeholder=" " required />
                   <label htmlFor="name" className="absolute left-4 top-4 text-white/40 font-medium transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-zinc-950 px-1 peer-valid:-top-2.5 peer-valid:text-xs peer-valid:bg-zinc-950 rounded">Full Name</label>
                 </div>
                 <div className="relative group">
                   <input type="email" id="email" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all peer text-white font-medium" placeholder=" " required />
                   <label htmlFor="email" className="absolute left-4 top-4 text-white/40 font-medium transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-zinc-950 px-1 peer-valid:-top-2.5 peer-valid:text-xs peer-valid:bg-zinc-950 rounded">Email Address</label>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="relative group">
                   <input type="tel" id="phone" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all peer text-white font-medium" placeholder=" " required />
                   <label htmlFor="phone" className="absolute left-4 top-4 text-white/40 font-medium transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-zinc-950 px-1 peer-valid:-top-2.5 peer-valid:text-xs peer-valid:bg-zinc-950 rounded">Phone Number</label>
                 </div>
                 <div className="relative group">
                   <select id="type" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all appearance-none text-white font-medium cursor-pointer">
                     <option value="web" className="bg-zinc-900">Website Development</option>
                     <option value="ecommerce" className="bg-zinc-900">E-Commerce</option>
                     <option value="uiux" className="bg-zinc-900">UI/UX Design</option>
                     <option value="ai" className="bg-zinc-900">AI Solutions</option>
                     <option value="other" className="bg-zinc-900">Other</option>
                   </select>
                   <label htmlFor="type" className="absolute left-4 -top-2.5 text-xs font-bold text-purple-400 bg-zinc-950 px-1 rounded">Business Type</label>
                 </div>
               </div>

               <div className="relative group mb-8">
                 <textarea id="message" rows="5" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all peer resize-none text-white font-medium" placeholder=" " required></textarea>
                 <label htmlFor="message" className="absolute left-4 top-4 text-white/40 font-medium transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-zinc-950 px-1 peer-valid:-top-2.5 peer-valid:text-xs peer-valid:bg-zinc-950 rounded">Message</label>
               </div>

               <button type="submit" className="w-full py-4 rounded-xl bg-white text-zinc-950 font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]">
                 Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
