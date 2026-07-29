import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Play, ShoppingCart, X, CheckCircle2, ShieldCheck, Zap, Download } from 'lucide-react';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils';
import { load } from '@cashfreepayments/cashfree-js';

const TemplateDetail = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center text-white px-6">
        <h1 className="text-3xl font-bold mb-4">Template Not Found</h1>
        <p className="text-gray-400 mb-8 text-center">{error}</p>
        <Link to="/templates" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          &larr; Back to Templates
        </Link>
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
    if (!template || !template.price || template.price === 0) {
      alert("This template is free!");
      return;
    }

    try {
      const amount = template.price;
      const planName = template.title;

      const { data: orderData } = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-order`, {
        amount,
        planName,
      });

      const cashfree = await load({
        mode: import.meta.env.VITE_CASHFREE_ENVIRONMENT === 'PRODUCTION' ? 'production' : 'sandbox'
      });

      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          console.error(result.error);
          alert("Payment failed or cancelled: " + (result.error.message || "Unknown error"));
        }
        if (result.paymentDetails) {
          try {
            const { data: verifyData } = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify-payment`, {
              orderId: orderData.order_id
            });

            if (verifyData && verifyData.message === 'Payment verified successfully') {
              alert("Payment successful! You can now download the template.");
              // Trigger download or next steps here
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        }
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred during payment initialization");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-32 lg:pb-16 pt-20">
      {/* Top Header (Mobile Only) */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <Link to="/templates" className="text-gray-400 hover:text-white transition-colors p-2">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-sm font-bold text-gray-200 uppercase tracking-widest">{template.category}</h1>
        <button onClick={handleShare} className="text-gray-400 hover:text-white transition-colors p-2">
          <Share2 size={20} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:mt-10">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Header / Title Section */}
            <div>
              <div className="inline-block mb-4 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-bold uppercase tracking-widest">
                {template.category}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent leading-tight">
                {template.title}
              </h1>
            </div>

            {/* Media / Video Preview section */}
            <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden bg-[#0a0a0a] group border border-white/10 shadow-2xl shadow-cyan-900/10 ring-1 ring-white/5">
              {!isVideoOpen ? (
                <>
                  <img 
                    src={getImageUrl((template.galleryImages && template.galleryImages[0]) || 'https://via.placeholder.com/1200x600?text=No+Image')} 
                    alt={template.title} 
                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                    onClick={() => template.galleryImages && template.galleryImages[0] && setSelectedImage(template.galleryImages[0])}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {template.previewVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => setIsVideoOpen(true)}
                        className="group/btn relative w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(34,211,238,0.5)]"
                      >
                        <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
                        <Play size={36} className="text-black ml-2" fill="currentColor" />
                      </button>
                      <div className="absolute bottom-6 left-8 flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <Play size={16} className="text-cyan-400" /> Watch Demo
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <iframe 
                  src={template.previewVideo.replace("watch?v=", "embed/") + "?autoplay=1"} 
                  className="w-full h-full border-0 bg-black"
                  allow="autoplay; fullscreen"
                  title="Preview Video"
                ></iframe>
              )}
            </div>

            {/* About this template */}
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-1 bg-cyan-500 rounded-full"></span>
                About this template
              </h2>
              <div 
                className="text-gray-300 leading-relaxed text-lg sm:text-xl font-light"
                dangerouslySetInnerHTML={{ __html: template.description.replace(/\n/g, '<br />') }}
              />
            </div>

            {/* Key Features */}
            {template.features && template.features.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white flex items-center gap-3">
                  <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                  Key Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:bg-[#111] transition-colors group">
                      <div className="mt-1 bg-cyan-500/10 p-1.5 rounded-full text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-gray-300 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frameworks & Tools */}
            {template.technologies && template.technologies.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white flex items-center gap-3">
                  <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {template.technologies.map((tech, idx) => (
                    <div key={idx} className="px-6 py-3 bg-[#0a0a0a] border border-white/10 text-gray-200 text-sm font-semibold rounded-2xl flex items-center gap-2 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all">
                      <Zap size={16} className="text-cyan-400" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Images */}
            {template.galleryImages && template.galleryImages.length > 1 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white flex items-center gap-3">
                  <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {template.galleryImages.slice(1).map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer group ${idx === 0 && template.galleryImages.length > 2 ? 'sm:col-span-2 aspect-[21/9]' : 'aspect-video'}`}
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <img src={getImageUrl(imgUrl)} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors duration-500 mix-blend-overlay"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div> 
          {/* End Left Column */}

          {/* Right Column - Desktop Sticky Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl shadow-black/50">
              
              <div className="mb-8 pb-8 border-b border-white/5">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">One-time payment</p>
                <div className="text-5xl font-extrabold text-white flex items-baseline gap-2">
                  {!template.price ? 'Free' : `₹${template.price}`}
                  {template.price > 0 && <span className="text-lg text-gray-500 font-medium line-through">₹{Math.round(template.price * 1.5)}</span>}
                </div>
              </div>

              <div className="space-y-4">
                {template.price > 0 ? (
                  <button onClick={handlePayment} className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] hover:-translate-y-1">
                    <ShoppingCart size={22} /> Buy Now
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] hover:-translate-y-1">
                    <Download size={22} /> Download Free
                  </button>
                )}
                
                <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-colors">
                  <Share2 size={20} /> Share
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <span>Secure, one-time payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Zap size={20} className="text-cyan-400" />
                  <span>Instant access to source code</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <CheckCircle2 size={20} className="text-purple-400" />
                  <span>Lifetime updates included</span>
                </div>
              </div>
            </div>
          </div> 
          {/* End Right Column */}
        </div>
      </main>

      {/* Sticky Bottom Purchase Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#030303]/90 backdrop-blur-2xl border-t border-white/10 p-4 pb-6 sm:p-6 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {!template.price ? 'Free' : `₹${template.price}`}
            </div>
          </div>
          
          {template.price > 0 ? (
            <button onClick={handlePayment} className="flex-1 max-w-[300px] flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95 transition-transform">
              <ShoppingCart size={22} /> Buy Now
            </button>
          ) : (
            <button className="flex-1 max-w-[300px] flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95 transition-transform">
              <Download size={22} /> Download
            </button>
          )}
        </div>
      </div>

      {/* Lightbox / Image Modal */}
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
              className="absolute top-6 right-6 sm:top-8 sm:right-8 text-white hover:text-cyan-400 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={getImageUrl(selectedImage)} 
              alt="Full size view" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDetail;
