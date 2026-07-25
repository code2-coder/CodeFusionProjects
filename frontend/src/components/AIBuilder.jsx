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
    <section id="ai-builder" className="py-32 relative overflow-hidden bg-background border-y border-[color:var(--border)]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-[color:var(--border)] shadow-sm text-purple-600 font-bold uppercase tracking-wide text-xs">
                <Zap size={16} />
                <span>Next-Gen AI Technology</span>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 font-bold uppercase tracking-widest text-[10px]">
                Coming Soon
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-foreground">Build Your Website in <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Seconds with AI</span></h2>
            <p className="text-foreground/60 text-lg md:text-xl mb-12 font-medium">
              Skip the long development cycles. Our proprietary AI understands your business needs and generates a fully functional, stunning website tailored to your brand identity.
            </p>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-card border border-[color:var(--border)] flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground tracking-tight">{step.title}</h4>
                    <p className="text-base text-foreground/60 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button disabled className="mt-12 px-8 py-4 rounded-2xl bg-secondary/50 text-foreground/50 font-bold text-lg flex items-center gap-2 cursor-not-allowed">
              Coming Soon
            </button>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative"
          >
            <div className="bg-card rounded-[2rem] p-3 border border-[color:var(--border)] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent z-0"></div>
              
              {/* Chatbot / Builder UI Mockup */}
              <div className="bg-background rounded-2xl border border-[color:var(--border)] h-[600px] flex flex-col relative z-10 shadow-inner">
                <div className="p-4 border-b border-[color:var(--border)] flex items-center gap-4 bg-secondary/30">
                  <div className="w-12 h-12 rounded-full bg-card border border-[color:var(--border)] flex items-center justify-center text-purple-600 shadow-sm">
                    <Bot size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-base text-foreground tracking-tight">Code Fusion AI</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Online</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 space-y-5 flex flex-col justify-end bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]">
                  <div className="self-start bg-card border border-[color:var(--border)] px-5 py-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                    <p className="text-sm font-medium text-foreground">Hello! I'm ready to build your website. What is the name of your business?</p>
                  </div>
                  <div className="self-end bg-purple-600 text-white px-5 py-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md">
                    <p className="text-sm font-bold">Parvati Systems</p>
                  </div>
                  <div className="self-start bg-card border border-[color:var(--border)] px-5 py-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                    <p className="text-sm font-medium text-foreground">Great! I see you provide Smart Security Solutions. Generating a premium template for you now...</p>
                  </div>
                  
                  {/* Generating animation block */}
                  <div className="self-start w-64 h-40 bg-card rounded-xl border border-[color:var(--border)] overflow-hidden relative mt-2 shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full animate-[marquee_2s_ease-in-out_infinite]"></div>
                    <div className="p-5 flex flex-col gap-4 h-full justify-center">
                      <div className="h-3 bg-secondary rounded-full w-3/4"></div>
                      <div className="h-3 bg-secondary rounded-full w-1/2"></div>
                      <div className="h-3 bg-secondary rounded-full w-full mt-auto"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[color:var(--border)] bg-secondary/30">
                  <div className="bg-background rounded-xl px-5 py-4 border border-[color:var(--border)] flex items-center justify-between shadow-sm">
                    <span className="text-sm font-medium text-foreground/40">Type your message...</span>
                    <button className="text-purple-600 hover:text-purple-500 hover:scale-110 transition-transform">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AIBuilder;
