import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Upload, LayoutTemplate, Zap, Rocket, Bot } from 'lucide-react';

const AIBuilder = () => {
  const steps = [
    { icon: <Sparkles size={24} />, title: "Business Details", desc: "Tell AI about your brand." },
    { icon: <Upload size={24} />, title: "Upload Assets", desc: "Logos & brand images." },
    { icon: <LayoutTemplate size={24} />, title: "Choose Style", desc: "Select a base template." },
    { icon: <Zap size={24} />, title: "AI Generation", desc: "Watch the magic happen." },
    { icon: <Rocket size={24} />, title: "Publish", desc: "Go live instantly." }
  ];

  return (
    <section id="ai-builder" className="py-32 lg:py-48 relative overflow-hidden bg-[#000000] font-sans border-t border-white/5">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] text-white font-semibold tracking-wide text-xs">
                <Zap size={16} className="text-purple-400" />
                <span className="uppercase tracking-widest text-white/80">Next-Gen AI Technology</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
                Coming Soon
              </div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white leading-tight">
              Build Your Website in <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Seconds with AI</span>
            </h2>
            <p className="text-white/50 text-lg md:text-2xl mb-12 font-light leading-relaxed tracking-tight max-w-xl">
              Skip the long development cycles. Our proprietary AI understands your business needs and generates a fully functional, stunning website tailored to your brand identity.
            </p>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-6 group cursor-default"
                >
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.02] backdrop-blur-xl border border-white/10 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)] group-hover:bg-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-500 group-hover:scale-110 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors duration-500"></div>
                    <div className="relative z-10">{step.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-white tracking-tight group-hover:text-purple-400 transition-colors duration-500">{step.title}</h4>
                    <p className="text-base text-white/50 font-light tracking-tight group-hover:text-white/70 transition-colors">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button disabled className="mt-12 px-10 py-5 rounded-full bg-white/[0.02] border border-white/5 text-white/30 font-semibold text-lg flex items-center gap-2 cursor-not-allowed backdrop-blur-md">
              Coming Soon
            </button>
          </motion.div>

          {/* AI Mockup Interface */}
          <motion.div
             initial={{ opacity: 0, x: 50, scale: 0.95 }}
             whileInView={{ opacity: 1, x: 0, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
             className="relative"
          >
            <div className="bg-white/[0.02] rounded-[3rem] p-4 md:p-6 border border-white/10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-white/20 hover:bg-white/[0.03] transition-all duration-700">
              
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/5 mix-blend-screen opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              
              {/* Liquid Glare */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden rounded-[3rem] z-20">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:animate-[glare_3s_ease-in-out_infinite]"></div>
              </div>

              {/* Chatbot UI Mockup */}
              <div className="bg-[#050505]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 h-[650px] flex flex-col relative z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                
                {/* Header */}
                <div className="p-5 md:p-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
                  <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <Bot size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-xl text-white tracking-tight">FusionAI</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                      <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Online</p>
                    </div>
                  </div>
                </div>
                
                {/* Chat Area */}
                <div className="flex-1 p-6 md:p-8 space-y-6 flex flex-col justify-end bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="self-start bg-white/[0.05] backdrop-blur-md border border-white/10 px-6 py-4 rounded-[1.5rem] rounded-tl-sm max-w-[85%] shadow-lg relative z-10"
                  >
                    <p className="text-base font-light text-white tracking-tight">Hello! I'm ready to build your website. What is the name of your business?</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="self-end bg-gradient-to-tr from-purple-600 to-pink-600 text-white px-6 py-4 rounded-[1.5rem] rounded-tr-sm max-w-[85%] shadow-[0_10px_30px_rgba(168,85,247,0.3)] relative z-10 border border-white/20"
                  >
                    <p className="text-base font-semibold tracking-tight">Parvati Systems</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    className="self-start bg-white/[0.05] backdrop-blur-md border border-white/10 px-6 py-4 rounded-[1.5rem] rounded-tl-sm max-w-[85%] shadow-lg relative z-10"
                  >
                    <p className="text-base font-light text-white tracking-tight">Great! I see you provide Smart Security Solutions. Generating a premium template for you now...</p>
                  </motion.div>
                  
                  {/* Generating animation block */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 }}
                    className="self-start w-72 h-44 bg-white/[0.03] backdrop-blur-xl rounded-[1.5rem] border border-white/10 overflow-hidden relative mt-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -translate-x-full animate-[marquee_1.5s_ease-in-out_infinite]"></div>
                    <div className="p-6 flex flex-col gap-5 h-full justify-center">
                      <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
                      <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
                      <div className="h-4 bg-white/10 rounded-full w-full mt-auto"></div>
                    </div>
                  </motion.div>
                </div>

                {/* Input Area */}
                <div className="p-5 border-t border-white/5 bg-white/[0.02]">
                  <div className="bg-[#000000] rounded-full px-6 py-5 border border-white/10 flex items-center justify-between shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group/input hover:border-white/20 transition-colors">
                    <span className="text-base font-light text-white/30">Type your message...</span>
                    <button className="text-purple-400 hover:text-white hover:scale-110 transition-all">
                      <ArrowRight size={22} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glare {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </section>
  );
};

export default AIBuilder;
