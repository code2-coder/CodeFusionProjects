import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Play, ShoppingCart } from 'lucide-react';
import Footer from '../components/Footer';

const TemplateDetail = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-6">
        <h1 className="text-3xl font-bold mb-4">Template Not Found</h1>
        <p className="text-gray-400 mb-8 text-center">{error}</p>
        <Link to="/templates" className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black rounded-xl font-bold transition-colors">
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

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32 lg:pb-12 pt-20">
      {/* Top Header (Mobile Only) */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <Link to="/templates" className="text-cyan-400 hover:text-cyan-300 transition-colors p-2">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold">Template Details</h1>
        <button onClick={handleShare} className="text-cyan-400 hover:text-cyan-300 transition-colors p-2">
          <Share2 size={24} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:mt-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2">
            
            {/* Media / Video Preview section */}
            <div className="relative w-full aspect-[21/9] sm:aspect-video rounded-3xl overflow-hidden bg-[#111] group border border-white/5">
              {!isVideoOpen ? (
                <>
                  <img 
                    src={(template.galleryImages && template.galleryImages[0]) || 'https://via.placeholder.com/1200x600?text=No+Image'} 
                    alt={template.title} 
                    className="w-full h-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-40"
                  />
                  {template.previewVideo && (
                    <>
                      <button 
                        onClick={() => setIsVideoOpen(true)}
                        className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 bg-cyan-400 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                      >
                        <Play size={32} className="text-black ml-2" />
                      </button>
                      <div className="absolute bottom-4 left-6 text-sm font-bold text-gray-200">
                        Preview Video
                      </div>
                    </>
                  )}
                </>
              ) : (
                <iframe 
                  src={template.previewVideo.replace("watch?v=", "embed/") + "?autoplay=1"} 
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  title="Preview Video"
                ></iframe>
              )}
            </div>

            {/* Title & Category */}
            <div className="mt-10 mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            {template.title}
          </h1>
          <p className="text-cyan-400 font-semibold text-lg">
            {template.category}
          </p>
        </div>

        {/* About this template */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">About this template</h2>
          <div 
            className="text-gray-300 leading-relaxed space-y-4 text-lg"
            dangerouslySetInnerHTML={{ __html: template.description.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Frameworks & Tools */}
        {template.technologies && template.technologies.length > 0 && (
          <div className="mb-12">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-5">Frameworks & Tools</h3>
            <div className="flex flex-wrap gap-3">
              {template.technologies.map((tech, idx) => (
                <span key={idx} className="px-5 py-2.5 bg-[#2a0b4d] border border-purple-500/20 text-[#e0c4ff] text-sm font-semibold rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other Info (Features) */}
        {template.features && template.features.length > 0 && (
          <div className="mb-12">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-5">Key Features</h3>
            <ul className="space-y-4">
              {template.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300 text-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

            {/* Gallery Images */}
            {template.galleryImages && template.galleryImages.length > 1 && (
              <div className="mb-12">
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-5">Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {template.galleryImages.slice(1).map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-[#111]">
                      <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div> {/* End Left Column */}

          {/* Right Column - Desktop Sticky Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Price</p>
                <div className="text-5xl font-bold text-white">
                  {!template.price ? 'Free' : `₹${template.price}`}
                </div>
              </div>

              <div className="space-y-4">
                {template.price > 0 ? (
                  <button className="w-full flex items-center justify-center gap-2 py-5 bg-cyan-400 hover:bg-cyan-300 text-black rounded-2xl font-bold text-lg transition-colors shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02]">
                    <ShoppingCart size={22} /> Buy Template
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 py-5 bg-cyan-400 hover:bg-cyan-300 text-black rounded-2xl font-bold text-lg transition-colors shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02]">
                    <ShoppingCart size={22} /> Download Free
                  </button>
                )}
                <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-lg transition-colors">
                  <Share2 size={22} /> Share Template
                </button>
              </div>
            </div>
          </div> {/* End Right Column */}
        </div>
      </main>

      {/* Sticky Bottom Purchase Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 p-5 sm:p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <div className="flex-shrink-0">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Price</div>
            <div className="text-3xl sm:text-4xl font-bold">
              {!template.price ? 'Free' : `₹${template.price}`}
            </div>
          </div>
          
          {template.price > 0 ? (
            <button className="flex-1 max-w-[400px] flex items-center justify-center gap-2 py-4 sm:py-5 bg-cyan-400 hover:bg-cyan-300 text-black rounded-2xl font-bold text-lg transition-colors shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02]">
              <ShoppingCart size={22} /> Buy Template
            </button>
          ) : (
            <button className="flex-1 max-w-[400px] flex items-center justify-center gap-2 py-4 sm:py-5 bg-cyan-400 hover:bg-cyan-300 text-black rounded-2xl font-bold text-lg transition-colors shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02]">
              <ShoppingCart size={22} /> Download Free
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;
