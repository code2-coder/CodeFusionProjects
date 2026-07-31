import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Monitor, ShoppingCart, LayoutGrid, Smartphone, PenTool, 
  RefreshCw, Cloud, Cpu, Building, Stethoscope, Hotel, 
  Utensils, Home, GraduationCap, Scissors, Plane, 
  PieChart, Rocket, CheckCircle, ArrowRight, Zap, Shield, 
  Search, Code, Settings, Server, Users, Wrench, LineChart, Sparkles, Layers
} from 'lucide-react';
import Footer from '../components/Footer';

const solutions = [
  {
    title: 'Enterprise Web Architecture',
    description: 'We do more than build websites. We engineer high-performance, SEO-dominant digital platforms designed to scale aggressively and convert visitors into lifelong clients.',
    icon: Monitor,
    features: ['Corporate Platforms', 'High-Conversion Landing Pages', 'Headless CMS Architecture', 'Advanced SEO Engineering', 'Sub-second Performance optimization'],
    color: 'from-[#00F0FF] to-[#0080FF]',
    shadow: 'shadow-[0_0_50px_rgba(0,240,255,0.3)]',
    span: 'lg:col-span-2' // Bento large
  },
  {
    title: 'High-Performance eCommerce',
    description: 'Bespoke online retail experiences engineered for maximum conversion, secure global payments, and seamless inventory synchronization.',
    icon: ShoppingCart,
    features: ['Custom Storefronts', 'Global Payment Gateways', 'Frictionless Checkout', 'Automated Inventory'],
    color: 'from-[#FF0055] to-[#7000FF]',
    shadow: 'shadow-[0_0_50px_rgba(255,0,85,0.3)]',
    span: 'lg:col-span-1'
  },
  {
    title: 'Scalable Web Applications',
    description: 'Complex business logic transformed into intuitive, lightning-fast web applications. We build the operational backbone of modern enterprises.',
    icon: LayoutGrid,
    features: ['Custom ERP/CRM Systems', 'SaaS Platform Development', 'Secure Data Portals', 'Advanced API Integration'],
    color: 'from-[#00FF88] to-[#00A3FF]',
    shadow: 'shadow-[0_0_50px_rgba(0,255,136,0.3)]',
    span: 'lg:col-span-1'
  },
  {
    title: 'Native & Cross-Platform Mobile',
    description: 'Fluid, gesture-driven mobile applications for iOS and Android. We build addictive mobile experiences that keep users coming back.',
    icon: Smartphone,
    features: ['iOS & Android Native', 'React Native Frameworks', 'Real-time Synchronization', 'Offline-first Architecture'],
    color: 'from-[#FF9900] to-[#FF0055]',
    shadow: 'shadow-[0_0_50px_rgba(255,153,0,0.3)]',
    span: 'lg:col-span-1'
  },
  {
    title: 'Luxury UI/UX Design',
    description: 'Award-winning design systems rooted in human psychology. We craft interfaces that look expensive, feel intuitive, and drive engagement.',
    icon: PenTool,
    features: ['Behavioral User Research', 'High-Fidelity Prototyping', 'Micro-interaction Design', 'Comprehensive Design Systems'],
    color: 'from-[#FF00C8] to-[#7000FF]',
    shadow: 'shadow-[0_0_50px_rgba(255,0,200,0.3)]',
    span: 'lg:col-span-1'
  },
  {
    title: 'Cloud Infrastructure & DevOps',
    description: 'Bulletproof server architectures. We deploy your applications on military-grade, auto-scaling cloud networks for 99.99% uptime.',
    icon: Cloud,
    features: ['AWS & Vercel Deployment', 'Docker Containerization', 'Automated CI/CD Pipelines', '24/7 Security Monitoring'],
    color: 'from-[#00E5FF] to-[#0055FF]',
    shadow: 'shadow-[0_0_50px_rgba(0,229,255,0.3)]',
    span: 'lg:col-span-2' // Bento large
  },
  {
    title: 'Applied AI & Automation',
    description: 'Future-proof your business operations. We integrate custom Large Language Models and AI agents to automate your most complex workflows.',
    icon: Cpu,
    features: ['Custom LLM Integration', 'Intelligent Customer Support', 'Automated Data Processing', 'Predictive Business Analytics'],
    color: 'from-[#9D00FF] to-[#FF0055]',
    shadow: 'shadow-[0_0_50px_rgba(157,0,255,0.3)]',
    span: 'lg:col-span-1'
  },
  {
    title: 'Technical SEO & Performance',
    description: 'Dominate search rankings. We rewrite the rules of performance, optimizing every byte of data to ensure you outrank the competition.',
    icon: LineChart,
    features: ['Deep Technical Audits', 'Core Web Vitals Mastery', 'Dynamic Content Optimization', 'Advanced Schema Markup'],
    color: 'from-[#FFE600] to-[#FF5500]',
    shadow: 'shadow-[0_0_50px_rgba(255,230,0,0.3)]',
    span: 'lg:col-span-1'
  }
];

const industries = [
  { name: 'Healthcare', icon: Stethoscope },
  { name: 'Real Estate', icon: Home },
  { name: 'Hospitality', icon: Hotel },
  { name: 'Gastronomy', icon: Utensils },
  { name: 'Education', icon: GraduationCap },
  { name: 'Luxury Retail', icon: ShoppingCart },
  { name: 'Fintech', icon: PieChart },
  { name: 'SaaS Startups', icon: Rocket }
];

const process = [
  { step: '01', title: 'Deep Discovery', desc: 'We immerse ourselves in your business model, extracting core objectives and mapping out technical feasibility.' },
  { step: '02', title: 'Strategic Architecture', desc: 'Drafting the blueprint. We select the optimal tech stack and define the exact data flow for maximum scalability.' },
  { step: '03', title: 'Visual Engineering', desc: 'Crafting the aesthetic. Our designers produce high-fidelity interactive prototypes focused on conversion and luxury.' },
  { step: '04', title: 'Agile Development', desc: 'Our elite engineering team writes clean, modular, and secure code, bringing the visual prototypes to life.' },
  { step: '05', title: 'Rigorous QA', desc: 'We subject the product to extreme stress testing, security audits, and performance profiling across all devices.' },
  { step: '06', title: 'Global Deployment', desc: 'Seamless launch onto edge networks. We ensure zero-downtime deployment and instant global availability.' }
];

const Solutions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans relative overflow-hidden selection:bg-white/20 selection:text-white">
      
      {/* Abyssal Background with Deep Refractions */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#000000]">
        
        {/* Parallax Core Lighting */}
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 w-full h-full">
          {/* Main Top Light */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-30%] left-[10%] w-[100vw] h-[100vw] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)] rounded-full blur-[100px] mix-blend-screen"
          ></motion.div>
          
          {/* Cyan/Blue Left Glow */}
          <motion.div 
            animate={{ rotate: [0, 90, 0], scale: [1, 1.5, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] left-[-20%] w-[80vw] h-[80vw] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06)_0%,transparent_60%)] rounded-full blur-[120px] mix-blend-screen"
          ></motion.div>
          
          {/* Purple/Pink Right Glow */}
          <motion.div 
            animate={{ rotate: [360, 270, 360], scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] right-[-20%] w-[90vw] h-[90vw] bg-[radial-gradient(ellipse_at_center,rgba(112,0,255,0.08)_0%,transparent_60%)] rounded-full blur-[120px] mix-blend-screen"
          ></motion.div>
        </motion.div>
        
        {/* Film Grain Texture */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.25] mix-blend-overlay"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 px-6 z-10 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center">
          
          {/* Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.01] backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.5)] mb-12"
          >
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-pulse"></div>
            <span className="text-xs font-bold text-white/60 tracking-[0.3em] uppercase">Engineering The Future</span>
          </motion.div>
          
          {/* Massive Display Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(4rem,9vw,9rem)] font-black tracking-tighter mb-8 leading-[0.95] drop-shadow-2xl max-w-6xl mx-auto"
          >
            Architecting <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/20">Digital Luxury.</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-3xl text-white/40 max-w-4xl mx-auto mb-20 font-light leading-relaxed tracking-tight"
          >
            We don't just build software. We engineer high-performance digital ecosystems designed to dominate markets and accelerate hyper-growth for ambitious brands.
          </motion.p>
          
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
          >
            <Link to="/contact" className="w-full sm:w-auto px-12 py-6 rounded-full bg-white text-black font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 group tracking-tight relative overflow-hidden">
              <span className="relative z-10">Initiate Project</span>
              <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform duration-500" />
              <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover:animate-[glare_1.5s_ease-in-out_infinite] skew-x-[-25deg]"></div>
            </Link>
            <a href="#solutions-grid" className="w-full sm:w-auto px-12 py-6 rounded-full bg-white/[0.02] border border-white/10 border-t-white/20 backdrop-blur-3xl text-white font-bold text-xl hover:bg-white/[0.05] active:scale-[0.98] transition-all duration-500 flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5)] tracking-tight hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]">
              View Capabilities
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: opacityFade }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none"
        >
          <span className="text-[10px] font-bold text-white/30 tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent"></div>
        </motion.div>
      </section>

      {/* Bento Grid Solutions Section */}
      <section id="solutions-grid" className="py-32 px-6 relative z-10 scroll-mt-24 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="mb-24 md:flex items-end justify-between border-b border-white/10 pb-10">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">Capabilities</h2>
              <p className="text-xl md:text-3xl text-white/40 font-light leading-relaxed tracking-tight">
                Our core competencies. We deploy cutting-edge technology to solve complex business problems at scale.
              </p>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative bg-white/[0.01] border border-white/5 border-t-white/10 border-l-white/10 hover:border-white/20 backdrop-blur-3xl p-10 lg:p-14 rounded-[2.5rem] transition-all duration-700 overflow-hidden flex flex-col h-full shadow-[0_20px_40px_0_rgba(0,0,0,0.5)] hover:shadow-[0_40px_80px_0_rgba(0,0,0,0.8)] hover:-translate-y-2 ${solution.span || ''}`}
              >
                {/* Deep Neon Wash */}
                <div className={`absolute -inset-20 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-[0.07] blur-[100px] transition-opacity duration-1000 rounded-full pointer-events-none`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                {/* Glare effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden rounded-[2.5rem]">
                  <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-[glare_2.5s_ease-in-out_infinite]"></div>
                </div>
                
                <div className="relative z-10 flex flex-col h-full pointer-events-none">
                  {/* Floating Icon Sphere */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-12 bg-[#050505] border border-white/10 border-t-white/20 border-l-white/20 group-hover:${solution.shadow} transition-all duration-700 group-hover:scale-110 relative overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.5)]`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-[0.15] group-hover:opacity-30 transition-opacity duration-700`}></div>
                    <solution.icon size={32} className="text-white relative z-10 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-700" />
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white/90 group-hover:text-white transition-colors">{solution.title}</h3>
                  <p className="text-white/40 font-light text-xl mb-12 flex-grow leading-relaxed group-hover:text-white/70 transition-colors duration-700">{solution.description}</p>
                  
                  {/* Features List */}
                  <div className={`grid grid-cols-1 ${solution.span === 'lg:col-span-2' ? 'sm:grid-cols-2' : ''} gap-y-5 gap-x-8 mt-auto pt-8 border-t border-white/5`}>
                    {solution.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-4 group/feature">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/feature:bg-[#00F0FF] group-hover/feature:shadow-[0_0_10px_#00F0FF] transition-all duration-300 shrink-0"></div>
                        <span className="text-sm md:text-base font-light text-white/50 group-hover/feature:text-white transition-colors tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Extreme Industries Grid */}
      <section className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#010101]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">Sectors We Command</h2>
            <p className="text-xl md:text-3xl text-white/40 font-light leading-relaxed tracking-tight max-w-3xl">
              Specialized domain knowledge allows us to engineer solutions tailored to the strict demands of elite industries.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8"
          >
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/[0.01] border border-white/5 border-t-white/10 backdrop-blur-xl p-10 rounded-[2rem] flex flex-col items-center justify-center gap-6 hover:bg-white/[0.03] hover:border-white/20 transition-all duration-500 group cursor-default hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] shadow-2xl relative overflow-hidden"
              >
                {/* Subtle spotlight */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="w-16 h-16 rounded-full bg-[#050505] flex items-center justify-center border border-white/5 shadow-inner group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 relative z-10">
                  <industry.icon size={28} className="text-white/30 group-hover:text-white transition-colors duration-500 group-hover:scale-110 drop-shadow-md" />
                </div>
                <span className="text-sm md:text-base font-bold tracking-[0.1em] text-white/50 group-hover:text-white transition-colors uppercase relative z-10 text-center">{industry.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Elite Development Process */}
      <section className="py-40 px-6 bg-[#000000] relative z-10 overflow-hidden font-sans border-y border-white/5 shadow-[inset_0_50px_100px_rgba(0,0,0,0.8)]">
        
        {/* Intense local lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none mix-blend-screen"></div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-32 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-3xl mb-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <Layers size={16} className="text-white/70" />
              <span className="text-xs font-bold text-white/70 tracking-[0.3em] uppercase">The Architecture</span>
            </motion.div>

            <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter text-white leading-tight drop-shadow-2xl">
              Precision <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/30">Execution.</span>
            </h2>
            <p className="text-white/40 font-light text-xl md:text-3xl max-w-4xl mx-auto tracking-tight leading-relaxed">
              We do not guess. Our engineering process is a strictly monitored, highly iterative pipeline designed to produce flawless software from day one.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {process.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative bg-[#020202]/50 border border-white/5 border-t-white/10 border-l-white/10 backdrop-blur-3xl rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_50px_0_rgba(0,0,0,0.8)] group overflow-hidden hover:bg-white/[0.02] hover:border-white/20 hover:-translate-y-3 transition-all duration-700 flex flex-col h-full"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                {/* Number Watermark */}
                <div className="absolute top-10 right-10 text-[100px] font-black text-transparent group-hover:text-white/[0.03] transition-colors duration-700 pointer-events-none select-none tracking-tighter" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>
                  {step.step}
                </div>

                <div className="relative z-10 flex-grow pointer-events-none">
                  <div className="text-white/30 text-sm font-bold mb-8 tracking-[0.4em] group-hover:text-white transition-all duration-500 flex items-center gap-4">
                    <div className="w-8 h-[1px] bg-white/30 group-hover:bg-white transition-colors"></div>
                    PHASE {step.step}
                  </div>
                  
                  <h4 className="text-3xl md:text-4xl font-bold mb-6 text-white/90 group-hover:text-white transition-colors tracking-tight">{step.title}</h4>
                  <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed tracking-tight group-hover:text-white/70 transition-colors duration-500">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ultimate CTA */}
      <section className="py-40 px-6 relative z-10 bg-[#000000]">
        <div className="max-w-[1400px] mx-auto">
          <div className="rounded-[4rem] p-12 md:p-40 text-center relative overflow-hidden border border-white/5 border-t-white/10 border-l-white/10 bg-[#020202] backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.9)] group flex flex-col items-center">
            
            {/* Cinematic Center Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none group-hover:opacity-100 transition-opacity duration-1000 opacity-50 mix-blend-screen"></div>
            
            {/* Top Light Edge */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <h2 className="text-6xl md:text-[8rem] font-black mb-12 relative z-10 tracking-tighter leading-[0.9] drop-shadow-2xl text-white">
              Start The <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Evolution.</span>
            </h2>
            <p className="text-xl md:text-3xl text-white/40 font-light max-w-3xl mx-auto mb-20 relative z-10 tracking-tight leading-relaxed">
              We are currently accepting new projects. Partner with Code Fusion Projects to build something extraordinary.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10 w-full sm:w-auto">
              <Link to="/contact" className="w-full sm:w-auto px-16 py-8 rounded-full bg-white text-black font-black text-2xl hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_0_60px_rgba(255,255,255,0.15)] hover:shadow-[0_0_100px_rgba(255,255,255,0.4)] flex items-center justify-center gap-4 group/btn relative overflow-hidden tracking-tight">
                <span className="relative z-10">Initiate Now</span>
                <ArrowRight size={28} className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" />
                <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover/btn:animate-[glare_1.5s_ease-in-out_infinite] skew-x-[-25deg]"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <style>{`
        @keyframes glare {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
};

export default Solutions;
