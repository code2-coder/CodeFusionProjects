import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ExternalLink, Play, Search, Tag, Filter, ChevronRight, Sparkles, ShoppingCart, Download } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl, handleImageError } from '../utils';
import { load } from '@cashfreepayments/cashfree-js';
import toast from 'react-hot-toast';

// Interactive Template Card with Cursor Spot Glow
const TemplateCard = ({ tpl, handlePayment, user, navigate, location }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const isFree = !tpl.price || tpl.price === 0;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      layout="position"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-[#0c0c0c] border border-white/[0.04] hover:border-white/[0.12] rounded-[2rem] overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
    >
      {/* Light spotlight highlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.05),
              transparent 70%
            )
          `,
        }}
      />

      {/* Border Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              220px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.1),
              transparent 75%
            )
          `,
          border: '1px solid transparent',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Image Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#080808] z-10">
        <img
          src={getImageUrl((tpl.galleryImages && tpl.galleryImages[0]) || '')}
          alt={tpl.title}
          className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-[1.2s] ease-[0.16,1,0.3,1]"
          onError={handleImageError}
        />
        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/85 to-transparent pointer-events-none" />
      </div>

      {/* Card Content details */}
      <div className="px-6 pb-6 pt-0 flex flex-col flex-grow relative z-20 -mt-8">
        
        {/* Header row: category and price */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3.5 py-1 bg-white/[0.04] border border-white/[0.06] text-white/70 text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
            {tpl.category}
          </span>
          {isFree ? (
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">
              Free
            </span>
          ) : (
            <span className="px-3 py-1 bg-white text-black text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-[0_4px_15px_rgba(255,255,255,0.15)]">
              ₹{tpl.price}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-white mb-2 leading-tight group-hover:text-zinc-200 transition-colors duration-200">
          {tpl.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed font-light flex-grow">
          {tpl.description?.replace(/<[^>]+>/g, '')}
        </p>

        {/* Actions Footer */}
        <div className="mt-auto pt-4 flex flex-col gap-3.5 border-t border-white/[0.06]">
          {/* External Demos */}
          {(tpl.demoUrl || tpl.previewVideo) && (
            <div className="flex items-center gap-2">
              {tpl.demoUrl && (
                <a
                  href={tpl.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-white/80 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
              {tpl.previewVideo && (
                <a
                  href={tpl.previewVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-white/80 transition-colors"
                  title="Watch Video"
                >
                  <Play size={13} fill="currentColor" />
                </a>
              )}
            </div>
          )}

          {/* Action buttons buy / details */}
          <div className="flex items-center gap-2.5 pt-1">
            <Link
              to={`/templates/${tpl._id}`}
              className="flex-1 text-center py-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Details
            </Link>

            {!isFree ? (
              <button
                onClick={() => handlePayment(tpl)}
                className="flex-1 py-3 bg-white text-black hover:bg-transparent hover:text-white border border-transparent hover:border-white/20 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-none"
              >
                Buy Now
              </button>
            ) : (
              <button
                onClick={() => navigate(`/templates/${tpl._id}`)}
                className="flex-1 py-3 bg-emerald-500 text-black hover:bg-transparent hover:text-emerald-400 border border-transparent hover:border-emerald-500/20 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                Get Free
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([{ name: 'All' }]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceType, setPriceType] = useState('All');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const priceOptions = ['All', 'Free', 'Premium'];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await axios.get('/api/templates');
        setTemplates(data.filter(t => t.status === 'Published'));
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories([{ name: 'All' }, ...data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const initialize = async () => {
      await Promise.all([fetchTemplates(), fetchCategories()]);
      setLoading(false);
    };

    initialize();
  }, []);

  const handlePayment = async (template) => {
    if (!user) {
      toast.error("Please log in to purchase this template.");
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }

    if (!template || !template.price || template.price === 0) {
      toast.error("This template is free!");
      return;
    }

    try {
      const amount = template.price;
      const planName = template.title;

      const { data: orderData } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/payments/create-order`, {
        amount,
        planName,
        user,
        templateId: template._id
      });

      const cashfree = await load({
        mode: orderData.environment || 'sandbox'
      });

      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          console.error(result.error);
          toast.error("Payment failed or cancelled: " + (result.error.message || "Unknown error"));
        }
        if (result.paymentDetails) {
          try {
            const { data: verifyData } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/payments/verify-payment`, {
              orderId: orderData.order_id
            });

            if (verifyData && verifyData.message === 'Payment verified successfully') {
              toast.success("Payment successful! You can now download the template.");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during payment initialization");
    }
  };

  const filteredTemplates = templates.filter(tpl => {
    const title = tpl.title || '';
    const description = tpl.description || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                          description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || tpl.category === category;
    const matchesPrice = priceType === 'All' || 
                         (priceType === 'Free' && (!tpl.price || tpl.price === 0)) || 
                         (priceType === 'Premium' && tpl.price > 0);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <section id="templates" className="py-24 md:py-32 relative bg-[#030303] min-h-screen text-zinc-50 overflow-hidden font-sans">
      <Helmet>
        <title>Web Templates & Boilerplates | Code Fusion Projects</title>
        <meta name="description" content="Browse our luxury collection of developer boilerplates, enterprise React templates, and CSS architectures designed to scale." />
      </Helmet>
      
      {/* Background patterns */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/5 blur-[130px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/5 blur-[160px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            <Sparkles size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-white/80 tracking-[0.25em] uppercase">Premium Assets</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-6 font-display text-white"
          >
            Architectural <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/85 to-white/30" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.08)' }}>Boilerplates.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-400 text-sm md:text-base leading-relaxed font-light"
          >
            Jumpstart your production with our high-end, scalable web architectures and gorgeous user interfaces.
          </motion.p>
        </div>

        {/* Search & Filters Controls */}
        <div className="mb-16">
          <div className="flex flex-col gap-6 p-4 bg-white/[0.01] backdrop-blur-2xl border border-white/[0.06] rounded-3xl shadow-2xl mx-auto max-w-5xl">
            
            {/* Search Input Bar */}
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-zinc-100 placeholder-zinc-500 text-base md:text-lg font-medium transition-all"
              />
            </div>
            
            {/* Filter selectors row */}
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 pt-4 border-t border-white/[0.06]">
              {/* Category pill controls */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none w-full lg:w-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex bg-white/[0.01] p-1 rounded-full border border-white/[0.04]">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setCategory(cat.name)}
                      className={`relative px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-500 z-10 ${
                        category === cat.name ? 'text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="relative z-20">{cat.name === 'All' ? 'All Categories' : cat.name}</span>
                      {category === cat.name && (
                        <motion.span
                          layoutId="activeTemplateCategory"
                          className="absolute inset-0 bg-white rounded-full shadow-[0_4px_15px_rgba(255,255,255,0.25)] z-0"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price options row */}
              <div className="flex bg-white/[0.01] p-1 rounded-full border border-white/[0.04] shrink-0">
                {priceOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPriceType(opt)}
                    className={`relative px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-500 z-10 ${
                      priceType === opt ? 'text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="relative z-20">{opt === 'All' ? 'Any Price' : opt}</span>
                    {priceType === opt && (
                      <motion.span
                        layoutId="activeTemplatePrice"
                        className="absolute inset-0 bg-white rounded-full z-0"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          /* Empty state */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] shadow-2xl max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
              <Search size={22} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">No templates found</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">Adjust your filters or search terms to find what you're looking for.</p>
            <button 
              onClick={() => {setSearch(''); setCategory('All'); setPriceType('All');}} 
              className="px-6 py-3 bg-white hover:bg-zinc-100 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_4px_15px_rgba(255,255,255,0.15)]"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          /* Template Grid lists */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((tpl) => (
                <TemplateCard
                  key={tpl._id}
                  tpl={tpl}
                  handlePayment={handlePayment}
                  user={user}
                  navigate={navigate}
                  location={location}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default Templates;
