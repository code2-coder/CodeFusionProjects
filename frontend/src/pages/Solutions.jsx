import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Monitor, ShoppingCart, LayoutGrid, Smartphone, PenTool, 
  RefreshCw, Cloud, Cpu, Building, Stethoscope, Hotel, 
  Utensils, Home, GraduationCap, Scissors, Plane, 
  PieChart, Rocket, CheckCircle, ArrowRight, Zap, Shield, 
  Search, Code, Settings, Server, Users, Wrench, LineChart
} from 'lucide-react';
import Footer from '../components/Footer';

const solutions = [
  {
    title: 'Website Development',
    description: 'Design and develop fast, responsive, SEO-friendly websites that represent your brand and generate leads.',
    icon: Monitor,
    features: ['Business Websites', 'Corporate Websites', 'Landing Pages', 'Portfolio Websites', 'CMS Integration', 'SEO Optimization', 'Performance Optimization'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'eCommerce Development',
    description: 'Build secure, scalable online stores that provide seamless shopping experiences and increase sales.',
    icon: ShoppingCart,
    features: ['Custom Online Stores', 'Payment Gateway Integration', 'Shopping Cart', 'Product Management', 'Order Management', 'Inventory System', 'Customer Accounts'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Web Application Development',
    description: 'Develop custom web applications that automate business operations and improve efficiency.',
    icon: LayoutGrid,
    features: ['CRM Systems', 'ERP Solutions', 'Booking Platforms', 'Admin Dashboards', 'Customer Portals', 'Inventory Management', 'API Integrations'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Mobile App Development',
    description: 'Create intuitive Android and iOS applications with modern user experiences.',
    icon: Smartphone,
    features: ['Android Apps', 'iOS Apps', 'Cross-platform Development', 'Business Applications', 'Service Booking Apps', 'eCommerce Apps'],
    color: 'from-orange-500 to-amber-500'
  },
  {
    title: 'UI/UX Design',
    description: 'Craft beautiful, user-centered digital experiences that improve engagement and conversion.',
    icon: PenTool,
    features: ['User Research', 'Wireframes', 'High-Fidelity UI Design', 'Interactive Prototypes', 'Design Systems', 'Accessibility'],
    color: 'from-rose-500 to-red-500'
  },
  {
    title: 'Website Redesign',
    description: 'Modernize outdated websites with improved performance, design, and functionality.',
    icon: RefreshCw,
    features: ['Modern UI', 'Responsive Design', 'Speed Optimization', 'SEO Improvements', 'Conversion Optimization', 'Accessibility'],
    color: 'from-indigo-500 to-blue-500'
  },
  {
    title: 'Cloud & DevOps',
    description: 'Deploy and manage applications with reliable cloud infrastructure and automated workflows.',
    icon: Cloud,
    features: ['Cloud Deployment', 'Docker', 'CI/CD Pipelines', 'Server Configuration', 'Monitoring', 'Security'],
    color: 'from-cyan-500 to-teal-500'
  },
  {
    title: 'AI Solutions',
    description: 'Leverage artificial intelligence to automate tasks and improve business productivity.',
    icon: Cpu,
    features: ['AI Chatbots', 'AI Assistants', 'Workflow Automation', 'Document Processing', 'AI Integration', 'Business Automation'],
    color: 'from-violet-500 to-purple-500'
  },
  {
    title: 'Website Maintenance',
    description: 'Keep your digital assets secure, up-to-date, and running smoothly with our dedicated maintenance plans.',
    icon: Wrench,
    features: ['Regular Backups', 'Security Updates', 'Performance Monitoring', 'Bug Fixing', 'Content Updates', 'Technical Support'],
    color: 'from-sky-400 to-blue-500'
  },
  {
    title: 'SEO & Performance Optimization',
    description: 'Boost your visibility and user experience with technical SEO and speed optimizations.',
    icon: LineChart,
    features: ['Technical SEO Audits', 'Speed Optimization', 'Core Web Vitals', 'On-Page SEO', 'Image Optimization', 'Analytics Setup'],
    color: 'from-amber-400 to-orange-500'
  }
];

const industries = [
  { name: 'Healthcare', icon: Stethoscope },
  { name: 'Dental Clinics', icon: Stethoscope },
  { name: 'Hotels', icon: Hotel },
  { name: 'Restaurants', icon: Utensils },
  { name: 'Real Estate', icon: Home },
  { name: 'Construction', icon: Building },
  { name: 'Education', icon: GraduationCap },
  { name: 'Beauty & Salon', icon: Scissors },
  { name: 'Travel', icon: Plane },
  { name: 'Finance', icon: PieChart },
  { name: 'Retail', icon: ShoppingCart },
  { name: 'Startups', icon: Rocket }
];

const features = [
  { title: 'Modern Technology Stack', icon: Code, desc: 'Built with the latest frameworks for optimal performance and scale.' },
  { title: 'Scalable Architecture', icon: Server, desc: 'Systems designed to grow seamlessly alongside your business.' },
  { title: 'Mobile-First Development', icon: Smartphone, desc: 'Flawless experiences across all devices and screen sizes.' },
  { title: 'SEO Optimized', icon: Search, desc: 'Built-in best practices to ensure your platform ranks high.' },
  { title: 'High Performance', icon: Zap, desc: 'Lightning-fast load times for better user retention and conversion.' },
  { title: 'Secure Development', icon: Shield, desc: 'Industry-standard security measures to protect your data.' },
  { title: 'Transparent Communication', icon: Users, desc: 'Clear, consistent updates throughout the development lifecycle.' },
  { title: 'Ongoing Support', icon: Settings, desc: 'Dedicated maintenance to keep your digital products running smoothly.' }
];

const process = [
  { step: '01', title: 'Discovery', desc: 'Understanding your business, goals, and technical requirements.' },
  { step: '02', title: 'Strategy', desc: 'Defining the architecture, technology stack, and project roadmap.' },
  { step: '03', title: 'Design', desc: 'Creating wireframes and high-fidelity, user-centric interfaces.' },
  { step: '04', title: 'Development', desc: 'Writing clean, scalable, and secure code for your product.' },
  { step: '05', title: 'Testing', desc: 'Rigorous QA to ensure performance, security, and flawless UX.' },
  { step: '06', title: 'Deployment', desc: 'Launching your product on reliable, scalable cloud infrastructure.' },
  { step: '07', title: 'Support', desc: 'Continuous monitoring, updates, and optimization.' }
];

const Solutions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--background)] pt-24 pb-0 flex flex-col relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8"
          >
            <Rocket size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-blue-200">Digital Solutions for Modern Businesses</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          >
            Build Smarter. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Grow Faster.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[color:var(--foreground)] opacity-70 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            We help startups, small businesses, and enterprises transform ideas into powerful digital products. From high-performance websites and eCommerce platforms to scalable web applications and AI-powered solutions, we build technology that drives growth and delivers measurable results.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/contact" className="px-8 py-4 rounded-xl bg-[color:var(--foreground)] text-[color:var(--background)] font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full sm:w-auto text-center flex items-center justify-center gap-2 group">
              Start Your Project
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#solutions-grid" className="px-8 py-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] bg-opacity-50 backdrop-blur-sm text-[color:var(--foreground)] font-bold text-lg hover:bg-[color:var(--secondary)] transition-all w-full sm:w-auto text-center">
              Explore Our Work
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Solutions Grid */}
      <section id="solutions-grid" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Comprehensive Digital Solutions</h2>
            <p className="text-lg text-[color:var(--foreground)] opacity-70">
              Every business is unique, and so are its challenges. Our solutions are designed to solve real business problems, improve customer experiences, automate workflows, and accelerate digital growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative glass-card p-8 rounded-3xl border border-[color:var(--border)] hover:border-blue-500/30 transition-all overflow-hidden flex flex-col h-full"
              >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${solution.color} opacity-[0.03] group-hover:opacity-[0.08] blur-3xl transition-opacity rounded-full`} />
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${solution.color} bg-opacity-10 shadow-inner border border-white/10`}>
                  <solution.icon size={28} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{solution.title}</h3>
                <p className="text-[color:var(--foreground)] opacity-70 mb-8 flex-grow">{solution.description}</p>
                
                <div className="space-y-3 mt-auto">
                  {solution.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-[color:var(--foreground)] opacity-80">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 px-6 bg-[color:var(--secondary)] bg-opacity-20 relative z-10 border-y border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-[color:var(--foreground)] opacity-70 max-w-2xl mx-auto">We build tailored solutions for businesses across various sectors, understanding the unique challenges of each industry.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass-card p-6 rounded-2xl border border-[color:var(--border)] flex flex-col items-center justify-center gap-3 hover:bg-[color:var(--secondary)] bg-opacity-50 transition-colors group cursor-pointer"
              >
                <industry.icon size={28} className="text-[color:var(--foreground)] opacity-50 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm font-semibold text-center">{industry.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Code Fusion Projects</h2>
            <p className="text-[color:var(--foreground)] opacity-70 max-w-2xl mx-auto">We combine technical excellence with business acumen to deliver products that truly perform.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-[color:var(--border)] hover:border-purple-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 border border-purple-500/20">
                  <feature.icon size={20} />
                </div>
                <h4 className="font-bold mb-2">{feature.title}</h4>
                <p className="text-sm text-[color:var(--foreground)] opacity-60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-24 px-6 bg-black/40 border-y border-[color:var(--border)] relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Development Process</h2>
            <p className="text-[color:var(--foreground)] opacity-70 max-w-2xl mx-auto">A streamlined, transparent approach to bringing your vision to life.</p>
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-0 md:border-l-0 md:flex md:flex-wrap md:justify-center md:gap-8">
            {/* Horizontal connecting line for desktop */}
            <div className="hidden md:block absolute top-[45px] left-10 right-10 h-px bg-white/10 z-0" />
            
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-10 md:pl-0 mb-12 md:mb-0 md:w-48 text-left md:text-center group"
              >
                {/* Timeline Dot (Mobile) */}
                <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-blue-500 md:hidden shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                
                {/* Number Badge */}
                <div className="w-12 h-12 rounded-full bg-[color:var(--secondary)] opacity-80 border border-[color:var(--border)] backdrop-blur-md flex items-center justify-center text-sm font-bold text-[color:var(--foreground)] mb-6 md:mx-auto relative z-10 group-hover:bg-blue-500/20 group-hover:text-blue-400 group-hover:border-blue-500/50 transition-all">
                  {step.step}
                </div>
                
                <h4 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{step.title}</h4>
                <p className="text-sm text-[color:var(--foreground)] opacity-60">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-24 px-6 relative z-10 overflow-hidden flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technologies We Use</h2>
          <p className="text-[color:var(--foreground)] opacity-70 max-w-2xl mx-auto">We leverage the most powerful and modern tools to build exceptional digital experiences.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Firebase', 'Docker', 'GitHub', 'Vercel', 'AWS'].map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/10 bg-gradient-to-br from-blue-900/30 to-purple-900/30">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 relative z-10">Ready to Build Your Next Digital Product?</h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 relative z-10">
              Whether you need a business website, eCommerce platform, custom web application, mobile app, or AI-powered solution, Code Fusion Projects is ready to help turn your vision into reality.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/contact" className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-105 transition-all shadow-xl w-full sm:w-auto text-center flex items-center justify-center gap-2 group">
                Start Your Project
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-8 py-4 rounded-xl border border-white/20 bg-black/20 backdrop-blur-md text-white font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto text-center">
                Schedule a Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
