import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowLeft, Share2, Play, ShoppingCart, X, CheckCircle2, ShieldCheck, Zap, Download, Layers, Globe, MessageSquare, Sparkles, Smartphone, Moon, Mail, HelpCircle, Users, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl, handleImageError } from '../utils';
import { load } from '@cashfreepayments/cashfree-js';
import toast from 'react-hot-toast';

// Image loader with custom shimmers inside TemplateDetail
const DetailImage = ({ src, alt, className, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#080808] overflow-hidden group">
      {!isLoaded && !isError && (
        <div className="absolute inset-0 z-10 animate-shimmer" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onClick={onClick}
        onError={(e) => {
          setIsError(true);
          handleImageError(e);
        }}
        className={`${className} transition-all duration-[1.2s] ease-[0.16,1,0.3,1] ${
          isLoaded ? 'opacity-75 group-hover:opacity-90 group-hover:scale-[1.02]' : 'opacity-0'
        }`}
      />
    </div>
  );
};

const TemplateDetail = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sidebarRef = useRef(null);

  const spotlightBg = useMotionTemplate`
    radial-gradient(
      300px circle at ${mouseX}px ${mouseY}px,
      rgba(59, 130, 246, 0.04),
      transparent 70%
    )
  `;

  const handleMouseMove = (e) => {
    if (!sidebarRef.current) return;
    const { left, top } = sidebarRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const { data } = await axios.get(`/api/templates/${id}`);
        setTemplate(data);
      } catch (err) {
        setError('Failed to fetch template details. It may have been removed or does not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="w-12 h-12 border-t-2 border-r-2 border-blue-500 border-solid rounded-full animate-spin z-10"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center text-white px-6 relative overflow-hidden">
        <Helmet>
          <title>Template Not Found | Code Fusion Projects</title>
        </Helmet>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/[0.08]">
            <X size={30} className="text-red-500/60" />
          </div>
          <h1 className="text-3xl font-bold mb-4 font-display">Template Not Found</h1>
          <p className="text-gray-400 mb-8 max-w-md">{error}</p>
          <Link to="/templates" className="px-6 py-3 bg-white text-black font-bold rounded-full transition-transform hover:scale-105 shadow-[0_4px_20px_rgba(255,255,255,0.15)] text-xs tracking-widest uppercase">
            &larr; Return to Templates
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: template.title,
        url: window.location.href
      });
    } catch (err) {
      console.log('Share not supported or cancelled');
    }
  };

  const handlePayment = async () => {
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

      // Use relative path for production API integration
      const { data: orderData } = await axios.post(`/api/payments/create-order`, {
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
            // Use relative path for verification check
            const { data: verifyData } = await axios.post(`/api/payments/verify-payment`, {
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

  const isFree = !template.price || template.price === 0;

  // Determine if features lists are simple tags or long description strings
  const averageFeatureLength = template.features && template.features.length > 0
    ? template.features.reduce((acc, str) => acc + str.length, 0) / template.features.length
    : 0;
  const isTagFormat = averageFeatureLength < 16;

  // Parse comma-separated descriptions into visual points
  const descriptionItems = template.description?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const isListDescription = descriptionItems.length > 1 && descriptionItems.every(item => item.length < 35);

  const getFeatureIcon = (item) => {
    const lower = item.toLowerCase();
    if (lower.includes('responsive') || lower.includes('mobile')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
          <Smartphone size={14} className="text-blue-400" />
        </div>
      );
    }
    if (lower.includes('dark') || lower.includes('theme') || lower.includes('mode')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
          <Moon size={14} className="text-purple-400" />
        </div>
      );
    }
    if (lower.includes('contact') || lower.includes('form') || lower.includes('mail')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
          <Mail size={14} className="text-cyan-400" />
        </div>
      );
    }
    if (lower.includes('blog') || lower.includes('article') || lower.includes('news')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <BookOpen size={14} className="text-amber-400" />
        </div>
      );
    }
    if (lower.includes('faq') || lower.includes('question') || lower.includes('help')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
          <HelpCircle size={14} className="text-orange-400" />
        </div>
      );
    }
    if (lower.includes('testimonials') || lower.includes('reviews') || lower.includes('users')) {
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Users size={14} className="text-emerald-400" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
        <CheckCircle2 size={14} className="text-blue-400" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-32 lg:pb-20 pt-32 lg:pt-36 relative overflow-hidden">
      <Helmet>
        <title>{`${template.title} - Template details | Code Fusion Projects`}</title>
        <meta name="description" content={template.description?.substring(0, 155)} />
      </Helmet>

      {/* Background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[75vw] h-[55vw] rounded-full bg-blue-600/5 blur-[130px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none"></div>
      </div>

      {/* Top Header navbar (Mobile Only) */}
      <header className="lg:hidden fixed top-[72px] inset-x-0 z-40 bg-[#030303]/85 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link to="/templates" className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.08]">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">{template.category}</span>
        <button onClick={handleShare} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.08]">
          <Share2 size={18} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Back Link button (Desktop Only) */}
        <div className="hidden lg:block mb-8">
          <Link to="/templates" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group">
            <ArrowLeft size={12} className="text-white/40 group-hover:text-white transition-colors transform group-hover:-translate-x-1 duration-300" />
            <span className="text-[10px] font-bold text-white/50 group-hover:text-white tracking-widest uppercase transition-colors">Back to Templates</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Left Column (Content area) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Title Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-blue-400 font-mono text-xs tracking-[0.25em] uppercase mb-5 font-semibold">
                <Layers size={12} /> [{template.category}]
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-[1.08] text-white font-display">
                {template.title}
              </h1>
            </div>

            {/* Media Block container */}
            <div className="relative w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-[#080808] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.55)] group">
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10 mix-blend-screen pointer-events-none" />

              {!isVideoOpen ? (
                <>
                  <DetailImage 
                    src={getImageUrl((template.galleryImages && template.galleryImages[0]) || '')} 
                    alt={template.title} 
                    className="w-full h-full object-cover object-top cursor-zoom-in"
                    onClick={() => template.galleryImages && template.galleryImages[0] && setSelectedImage(template.galleryImages[0])}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none z-10" />
                  
                  {template.previewVideo && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <button 
                        onClick={() => setIsVideoOpen(true)}
                        className="relative w-18 h-18 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                      >
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                        <Play size={24} className="ml-1 text-black" fill="currentColor" />
                      </button>
                      <div className="absolute bottom-6 left-6 flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/[0.08]">
                        <Play size={13} className="text-blue-400" /> Watch Demo Video
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full relative z-20 bg-black">
                  <iframe 
                    src={template.previewVideo.replace("watch?v=", "embed/") + "?autoplay=1"} 
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen"
                    title="Preview Video"
                  />
                  <button 
                    onClick={() => setIsVideoOpen(false)}
                    className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black border border-white/10"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Detailed Description */}
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white tracking-tight flex items-center gap-3 font-display">
                <span className="w-8 h-[2px] bg-blue-500 rounded-full"></span>
                About this template
              </h2>
              {isListDescription ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {descriptionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3.5 bg-[#0a0a0a] border border-white/[0.04] hover:border-white/[0.12] rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] group/desc">
                      {getFeatureIcon(item)}
                      <span className="text-white/80 text-xs font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  className="text-white/60 leading-relaxed text-base sm:text-lg font-light space-y-4 mb-2"
                  dangerouslySetInnerHTML={{ __html: template.description?.replace(/\n/g, '<br />') }}
                />
              )}
            </div>

            {/* Custom Premium Value Proposition Grid Cards */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-blue-400 animate-pulse" />
                <h3 className="text-xl font-bold text-white font-display">Premium Customization Pack Included</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Free Hosting Card */}
                <div className="p-5 bg-[#0a0a0a] border border-white/[0.04] hover:border-cyan-500/20 rounded-2xl relative overflow-hidden group/item transition-all duration-300">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 transition-transform group-hover/item:scale-105">
                    <Globe size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-widest font-mono">Free Hosting & Domain</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">We deploy your site on high-speed infrastructure at no extra charge.</p>
                </div>

                {/* Unlimited Changes Card */}
                <div className="p-5 bg-[#0a0a0a] border border-white/[0.04] hover:border-pink-500/20 rounded-2xl relative overflow-hidden group/item transition-all duration-300">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-4 transition-transform group-hover/item:scale-105">
                    <Layers size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-widest font-mono">Unlimited Changes</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">Request tweaks and adjustments until you are 100% satisfied with the layout.</p>
                </div>

                {/* Developer Consultation Card */}
                <div className="p-5 bg-[#0a0a0a] border border-white/[0.04] hover:border-amber-500/20 rounded-2xl relative overflow-hidden group/item transition-all duration-300">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 transition-transform group-hover/item:scale-105">
                    <MessageSquare size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-widest font-mono">Consultation Call</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">A developer will call/message you to understand requirements and customize the template.</p>
                </div>
              </div>
            </div>

            {/* Key Features lists */}
            {template.features && template.features.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white tracking-tight flex items-center gap-3 font-display">
                  <span className="w-8 h-[2px] bg-purple-500 rounded-full"></span>
                  Key Features
                </h2>
                
                {isTagFormat ? (
                  /* Point-wise line-by-line list format for tags */
                  <div className="flex flex-col gap-2.5">
                    {template.features.map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="inline-flex items-center flex-row gap-2.5 self-start px-4.5 py-2 bg-[#090909] border border-white/[0.04] rounded-xl hover:border-purple-500/20 hover:bg-white/[0.02] transition-all duration-300 whitespace-nowrap"
                      >
                        <span className="text-purple-400 font-extrabold font-mono text-xs select-none">#</span>
                        <span className="text-white/85 text-xs font-semibold uppercase tracking-wider">{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Card layout format for descriptive lines */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 bg-[#090909] border border-white/[0.04] rounded-2xl group transition-all duration-300">
                        <div className="mt-1 bg-purple-500/10 p-1.5 rounded-full text-purple-400 transition-colors">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="text-white/60 text-sm leading-relaxed font-light">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stack Architecture */}
            {template.technologies && template.technologies.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white tracking-tight flex items-center gap-3 font-display">
                  <span className="w-8 h-[2px] bg-pink-500 rounded-full"></span>
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-3">
                  {template.technologies.map((tech, idx) => (
                    <div key={idx} className="px-5 py-3.5 bg-[#090909] border border-white/[0.05] hover:border-pink-500/30 text-white/70 hover:text-white text-xs font-bold rounded-2xl flex items-center gap-2.5 transition-all hover:scale-[1.03]">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {template.galleryImages && template.galleryImages.length > 1 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white tracking-tight flex items-center gap-3 font-display">
                  <span className="w-8 h-[2px] bg-emerald-500 rounded-full"></span>
                  Gallery Showcase
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {template.galleryImages.slice(1).map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className={`relative rounded-3xl overflow-hidden border border-white/[0.06] bg-[#080808] cursor-zoom-in group ${
                        idx === 0 && template.galleryImages.length > 2 ? 'sm:col-span-2 aspect-[21/9]' : 'aspect-video'
                      }`}
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <img 
                        src={getImageUrl(imgUrl)} 
                        alt={`Gallery ${idx + 1}`} 
                        className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-90 group-hover:scale-102 transition-all duration-[1.2s] ease-[0.16,1,0.3,1]" 
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar block - Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1" ref={sidebarRef} onMouseMove={handleMouseMove}>
            <div className="sticky top-28 bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/[0.06] hover:border-white/[0.12] rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden group relative transition-colors duration-500">
              
              {/* spotlight glow */}
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 z-0"
                style={{
                  background: spotlightBg,
                }}
              />

              <div className="mb-8 pb-8 border-b border-white/[0.06] relative z-10">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">One-time payment</p>
                <div className="text-5xl font-extrabold text-white flex items-baseline gap-2 font-display">
                  {isFree ? 'Free' : `₹${template.price}`}
                  {!isFree && <span className="text-lg text-white/30 font-medium line-through">₹{Math.round(template.price * 1.5)}</span>}
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {!isFree ? (
                  <button 
                    onClick={handlePayment} 
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black hover:bg-black hover:text-white border border-transparent hover:border-white/20 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_4px_25px_rgba(255,255,255,0.12)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.01]"
                  >
                    <ShoppingCart size={15} /> Buy Now
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-450 hover:to-teal-450 text-black rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-[0_4px_25px_rgba(16,185,129,0.2)]">
                    <Download size={15} /> Download Free
                  </button>
                )}
                
                <button 
                  onClick={handleShare} 
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.1em] transition-all"
                >
                  <Share2 size={14} className="text-white/60" /> Share Asset
                </button>
              </div>

              <div className="mt-8 space-y-4.5 relative z-10 pt-6 border-t border-white/[0.04]">
                <div className="flex items-start gap-3.5 text-xs text-white/50 group/item">
                  <div className="p-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-emerald-400 shrink-0">
                    <ShieldCheck size={14} />
                  </div>
                  <span className="leading-normal"><strong>Secure</strong> one-time payment</span>
                </div>
                <div className="flex items-start gap-3.5 text-xs text-white/50 group/item">
                  <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-blue-400 shrink-0">
                    <Zap size={14} />
                  </div>
                  <span className="leading-normal"><strong>Instant access</strong> to source code</span>
                </div>
                <div className="flex items-start gap-3.5 text-xs text-white/50 group/item">
                  <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-cyan-400 shrink-0">
                    <Globe size={14} />
                  </div>
                  <span className="leading-normal"><strong>Free hosting</strong> & custom domain</span>
                </div>
                <div className="flex items-start gap-3.5 text-xs text-white/50 group/item">
                  <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-pink-400 shrink-0">
                    <Layers size={14} />
                  </div>
                  <span className="leading-normal"><strong>Unlimited</strong> layout changes</span>
                </div>
                <div className="flex items-start gap-3.5 text-xs text-white/50 group/item">
                  <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-amber-400 shrink-0">
                    <MessageSquare size={14} />
                  </div>
                  <span className="leading-normal"><strong>Developer Consultation:</strong> We call/message to customize & build</span>
                </div>
                <div className="flex items-start gap-3.5 text-xs text-white/50 group/item">
                  <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-purple-400 shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="leading-normal"><strong>Lifetime updates</strong> included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Action bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/[0.08] p-4.5 rounded-3xl z-50 shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <div className="flex-shrink-0">
            <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-0.5">Total Due</div>
            <div className="text-2xl font-black text-white font-display">
              {isFree ? 'Free' : `₹${template.price}`}
            </div>
          </div>
          
          {!isFree ? (
            <button onClick={handlePayment} className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3.5 bg-white text-black active:scale-95 transition-transform rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(255,255,255,0.15)]">
              <ShoppingCart size={15} /> Buy Now
            </button>
          ) : (
            <button className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black active:scale-95 transition-transform rounded-xl font-bold text-xs uppercase tracking-wider">
              <Download size={15} /> Download
            </button>
          )}
        </div>
      </div>

      {/* Gallery Zoom Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-lg" 
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-blue-400 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={20} />
            </button>
            <motion.img 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              src={getImageUrl(selectedImage)} 
              alt="Zoomed template view" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default TemplateDetail;
