import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Timer, ChevronLeft, ChevronRight } from 'lucide-react';

const Pricing = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 320 : 420;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handlePayment = async (plan) => {
    if (plan.price === "Custom") {
      alert("Please contact us for custom plans.");
      return;
    }

    try {
      const amountStr = plan.price.replace('₹', '').replace(',', '');
      const amount = parseInt(amountStr);

      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, planName: plan.name }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert("Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Code Fusion",
        description: `Purchase ${plan.name} Plan`,
        image: "/ai_logo.png",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount,
                planName: plan.name,
              }),
            });

            if (verifyRes.ok) {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment failed");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("An error occurred during payment initialization");
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "₹2,999",
      desc: "Perfect for new startups.",
      features: ["5 Page Website", "Responsive Design", "Basic SEO", "Contact Form", "Free Hosting", "Free Domain 1 Year", "1 Year Technical Support", "Unlimited Changes in Website", "WhatsApp & Social Media Integration"],
      highlight: false
    },
    {
      name: "Business",
      price: "₹6,999",
      desc: "For growing businesses.",
      features: ["Up to 15 Pages", "Custom UI/UX Design", "CMS Integration", "Advanced SEO", "Performance Optimization", "Free Hosting", "Free Domain 1 Year", "1 Year Technical Support", "Unlimited Changes in Website", "WhatsApp & Social Media Integration"],
      highlight: true
    },
    {
      name: "Premium",
      price: "₹11,999",
      desc: "Enterprise scale solutions.",
      features: ["Full Stack Web App", "MERN Architecture", "AI Integration", "Custom Dashboard", "E-Commerce Setup", "Free Hosting", "Free Domain 1 Year", "1 Year Technical Support", "Unlimited Changes in Website", "WhatsApp & Social Media Integration"],
      highlight: false
    },
    {
      name: "Customized",
      price: "Custom",
      desc: "Tailored to your specific needs.",
      features: ["Custom Architecture", "Dedicated Development Team", "Cloud Infrastructure", "Advanced Security", "Free Hosting", "Free Domain 1 Year", "1 Year Technical Support", "Unlimited Changes in Website", "WhatsApp & Social Media Integration"],
      highlight: false,
      isCustom: true
    },
    {
      name: "App Development",
      price: "Custom",
      desc: "For iOS and Android platforms.",
      features: ["Native iOS & Android Apps", "Custom UI/UX Design", "Backend API Integration", "App Store Submission", "Free Hosting", "Free Domain 1 Year", "1 Year Technical Support", "Unlimited Changes", "WhatsApp & Social Media Integration"],
      highlight: false,
      isCustom: true
    }
  ];

  return (
    <section id="pricing" className="py-32 lg:py-48 relative bg-[#000000] font-sans border-t border-white/5 overflow-hidden">
      
      {/* Cinematic Lighting Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[0%] left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen"
        ></motion.div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] text-white font-semibold tracking-wide text-xs mb-8"
          >
            <Sparkles size={16} className="text-blue-400" />
            <span className="uppercase tracking-widest text-white/80">Pricing</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight text-white"
          >
            Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Investment</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg md:text-2xl max-w-2xl mx-auto font-light tracking-tight leading-relaxed"
          >
            Invest in premium quality architecture that pays for itself.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 inline-flex flex-col items-center px-10 py-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group/timerbox"
          >
            {/* Ambient inner glow for timer */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 pointer-events-none z-0"></div>
            <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Timer size={18} className="text-blue-400 animate-pulse" />
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase tracking-[0.25em]">Special Launch Offer Ends In</div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-5 relative z-10">
              {/* Hours Box */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group-hover/timerbox:bg-white/[0.06] group-hover/timerbox:border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover/timerbox:opacity-100 transition-opacity duration-700"></div>
                  <span className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter">{formatTime(timeLeft).h}</span>
                </div>
                <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-semibold mt-3">Hours</span>
              </div>
              
              <span className="text-2xl md:text-3xl text-white/20 font-light mb-7 animate-pulse">:</span>

              {/* Minutes Box */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group-hover/timerbox:bg-white/[0.06] group-hover/timerbox:border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover/timerbox:opacity-100 transition-opacity duration-700"></div>
                  <span className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter">{formatTime(timeLeft).m}</span>
                </div>
                <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-semibold mt-3">Minutes</span>
              </div>

              <span className="text-2xl md:text-3xl text-white/20 font-light mb-7 animate-pulse">:</span>

              {/* Seconds Box */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl relative overflow-hidden transition-all duration-500 group-hover/timerbox:bg-white/[0.06] group-hover/timerbox:border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover/timerbox:opacity-100 transition-opacity duration-700"></div>
                  <span className="text-3xl md:text-4xl font-black text-emerald-400 tabular-nums tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{formatTime(timeLeft).s}</span>
                </div>
                <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-semibold mt-3">Seconds</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Carousel Navigation */}
        <div className="flex justify-end gap-3 mb-6 max-w-[90rem] mx-auto px-4 lg:px-0">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg backdrop-blur-md z-20"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-lg backdrop-blur-md z-20"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Scrollable Pricing Cards Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-12 px-4 lg:px-2 pt-10 -mt-10 hide-scrollbar"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`snap-center shrink-0 w-[85vw] sm:w-[360px] lg:w-[380px] xl:w-[400px] relative backdrop-blur-3xl p-10 md:p-12 rounded-[2.5rem] transition-all duration-700 hover:-translate-y-4 group flex flex-col h-full ${
                plan.highlight 
                  ? 'bg-white/[0.06] border border-blue-500/40 shadow-[0_30px_60px_rgba(59,130,246,0.15)] md:-translate-y-6 md:hover:-translate-y-10 scale-100 z-10' 
                  : 'bg-white/[0.04] border border-white/10 shadow-2xl hover:bg-white/[0.06] hover:border-white/20'
              }`}
            >
              
              {/* Internal Glows & Glare (Requires overflow-hidden to clip to rounded corners) */}
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none z-0">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:animate-[glare_2.5s_ease-in-out_infinite]"></div>
                </div>
                {plan.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/15 to-transparent"></div>
                )}
              </div>

              {/* Top Edge Glow */}
              {plan.highlight ? (
                <div className="absolute -top-[1px] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80 z-0"></div>
              ) : (
                <div className="absolute -top-[1px] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
              )}

              {/* RECOMMENDED Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-6 py-2 rounded-full tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-[pulse_3s_ease-in-out_infinite] z-20 whitespace-nowrap border border-white/20">
                  RECOMMENDED
                </div>
              )}
              
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-black mb-3 tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all duration-500">{plan.name}</h3>
                <p className="text-white/60 text-base mb-10 font-light tracking-wide h-12">{plan.desc}</p>
                
                <div className="mb-12">
                  <span className={`font-black tracking-tighter text-white ${plan.isCustom ? 'text-4xl lg:text-5xl' : 'text-4xl lg:text-5xl'}`}>{plan.price}</span>
                  {!plan.isCustom && <span className="text-white/50 font-light ml-2">/project</span>}
                </div>

                <div className="space-y-6 mb-12 flex-1">
                  {plan.features.map((feat, j) => (
                    <motion.div 
                      key={j} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + (i * 0.1) + (j * 0.1), duration: 0.5, ease: "easeOut" }}
                      className="flex items-center gap-4"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        plan.highlight ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                      } transition-all duration-500`}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-base font-medium text-white/90 tracking-tight">{feat}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (plan.isCustom) {
                      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    } else {
                      handlePayment(plan);
                    }
                  }}
                  className={`w-full py-5 rounded-2xl font-bold transition-all duration-300 text-lg flex items-center justify-center gap-2 relative overflow-hidden group/btn ${
                    plan.highlight 
                      ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                      : 'bg-white/[0.08] border border-white/10 text-white hover:bg-white/[0.15] hover:border-white/30'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[glare_1.5s_ease-in-out_infinite] skew-x-[-25deg]"></div>
                  <span className="relative z-10">{plan.isCustom ? 'Contact Us' : 'Get Started'}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes glare {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Pricing;
