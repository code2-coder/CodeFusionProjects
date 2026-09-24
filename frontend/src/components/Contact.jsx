import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import SEO from './SEO';
import api from '../api/client';

const serviceLabels = {
  web: 'Website Development',
  ecommerce: 'E-Commerce',
  uiux: 'UI/UX Design',
  ai: 'AI Solutions',
  other: 'Other'
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'web',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // 'success' | 'error' | ''

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.type) {
      setStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name) {
      setStatus({
        type: 'error',
        message: 'Please enter your full name.'
      });
      return;
    }

    if (name.length < 2) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid full name (at least 2 characters).'
      });
      return;
    }

    if (!email) {
      setStatus({
        type: 'error',
        message: 'Please enter your email address.'
      });
      return;
    }

    // Standard RFC compliant email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address (e.g. yourname@domain.com).'
      });
      return;
    }

    if (!message) {
      setStatus({
        type: 'error',
        message: 'Please provide some details about your project or inquiry.'
      });
      return;
    }

    if (message.length < 5) {
      setStatus({
        type: 'error',
        message: 'Project details are too brief. Please describe your project in at least 5 characters.'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const payload = {
      name,
      email,
      phone,
      service: serviceLabels[formData.businessType] || 'Website Development',
      businessType: formData.businessType,
      message
    };

    try {
      const response = await api.post('/api/contact', payload);
      setStatus({
        type: 'success',
        message: response.data?.message || 'Message sent successfully! Our team will get back to you within 24 hours.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessType: 'web',
        message: ''
      });
      setTimeout(() => {
        setStatus((prev) => (prev.type === 'success' ? { type: '', message: '' } : prev));
      }, 7000);
    } catch (error) {
      console.error("Error sending message:", error);
      const serverMsg =
        error.response?.data?.message ||
        (error.message === 'Network Error' 
          ? 'Network connection issue. Please check your internet or email us directly at codefusionprojects@gmail.com.'
          : 'Failed to send message. Please try again or email us directly at codefusionprojects@gmail.com.');
      setStatus({
        type: 'error',
        message: serverMsg
      });
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

               <form onSubmit={handleSubmit} className="relative z-10" noValidate>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.3 }}
                     className="relative group"
                   >
                     <input 
                       type="text" 
                       id="name" 
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all peer text-white font-medium" 
                       placeholder=" " 
                       required 
                     />
                     <label 
                       htmlFor="name" 
                       className="absolute left-6 top-5 text-white/40 font-light tracking-wide transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-[#050505] peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white/60 peer-not-placeholder-shown:bg-[#050505] peer-not-placeholder-shown:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-white/60 peer-valid:bg-[#050505] peer-valid:px-2 rounded-full cursor-text pointer-events-none"
                     >
                       Full Name
                     </label>
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.4 }}
                     className="relative group"
                   >
                     <input 
                       type="email" 
                       id="email" 
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all peer text-white font-medium" 
                       placeholder=" " 
                       required 
                     />
                     <label 
                       htmlFor="email" 
                       className="absolute left-6 top-5 text-white/40 font-light tracking-wide transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-[#050505] peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white/60 peer-not-placeholder-shown:bg-[#050505] peer-not-placeholder-shown:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-white/60 peer-valid:bg-[#050505] peer-valid:px-2 rounded-full cursor-text pointer-events-none"
                     >
                       Email Address
                     </label>
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
                     <input 
                       type="tel" 
                       id="phone" 
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all peer text-white font-medium" 
                       placeholder=" " 
                     />
                     <label 
                       htmlFor="phone" 
                       className="absolute left-6 top-5 text-white/40 font-light tracking-wide transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-[#050505] peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white/60 peer-not-placeholder-shown:bg-[#050505] peer-not-placeholder-shown:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-white/60 peer-valid:bg-[#050505] peer-valid:px-2 rounded-full cursor-text pointer-events-none"
                     >
                       Phone Number
                     </label>
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.6 }}
                     className="relative group"
                   >
                     <select 
                       id="type" 
                       name="businessType"
                       value={formData.businessType}
                       onChange={handleChange}
                       className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all appearance-none text-white font-medium cursor-pointer"
                     >
                       <option value="web" className="bg-[#111] text-white">Website Development</option>
                       <option value="ecommerce" className="bg-[#111] text-white">E-Commerce</option>
                       <option value="uiux" className="bg-[#111] text-white">UI/UX Design</option>
                       <option value="ai" className="bg-[#111] text-white">AI Solutions</option>
                       <option value="other" className="bg-[#111] text-white">Other</option>
                     </select>
                     <label htmlFor="type" className="absolute left-6 -top-3 text-xs font-light tracking-wide text-white/60 bg-[#050505] px-2 rounded-full pointer-events-none">
                       Business Type
                     </label>
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
                   className="relative group mb-8"
                 >
                   <textarea 
                     id="message" 
                     name="message"
                     rows="4" 
                     value={formData.message}
                     onChange={handleChange}
                     className="w-full bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all peer resize-none text-white font-medium" 
                     placeholder=" " 
                     required
                   ></textarea>
                   <label 
                     htmlFor="message" 
                     className="absolute left-6 top-5 text-white/40 font-light tracking-wide transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-[#050505] peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white/60 peer-not-placeholder-shown:bg-[#050505] peer-not-placeholder-shown:px-2 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-white/60 peer-valid:bg-[#050505] peer-valid:px-2 rounded-full cursor-text pointer-events-none"
                   >
                     Project Details...
                   </label>
                 </motion.div>

                 {/* Status Feedback Notice */}
                 <AnimatePresence>
                   {status.message && (
                     <motion.div
                       initial={{ opacity: 0, y: -8, scale: 0.98 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: -8, scale: 0.98 }}
                       className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border text-sm backdrop-blur-md shadow-lg ${
                         status.type === 'success'
                           ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10'
                           : 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-rose-500/10'
                       }`}
                     >
                       {status.type === 'success' ? (
                         <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" />
                       ) : (
                         <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
                       )}
                       <p className="font-medium leading-relaxed">{status.message}</p>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 <motion.button 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.8 }}
                   type="submit" 
                   disabled={isSubmitting || status.type === 'success'}
                   className="w-full py-5 rounded-2xl bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn hover:scale-105 active:scale-95 disabled:opacity-80 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
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
                     ) : status.type === 'success' ? (
                       <motion.div
                         key="success"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="flex items-center gap-2 text-emerald-700"
                       >
                         <CheckCircle2 size={20} className="text-emerald-700" />
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
                   {!isSubmitting && status.type !== 'success' && (
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
