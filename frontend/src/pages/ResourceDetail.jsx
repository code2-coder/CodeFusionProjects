import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, User, Download, Calendar, Share2 } from 'lucide-react';
import Footer from '../components/Footer';

const ResourceDetail = () => {
  const { slug } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await axios.get(`/api/resources/slug/${slug}`);
        setResource(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resource:', error);
        setLoading(false);
      }
    };
    fetchResource();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] pt-32 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Resource Not Found</h1>
        <Link to="/resources" className="text-purple-500 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Resources
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] pt-24 pb-0 flex flex-col relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

      {/* Hero Article Banner */}
      <section className="px-6 pt-12 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link to="/resources" className="inline-flex items-center gap-2 text-[color:var(--foreground)] opacity-60 hover:opacity-100 mb-8 transition-opacity">
            <ArrowLeft size={16} /> Back to Resources
          </Link>
          
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              {resource.category}
            </span>
            {resource.readingTime && (
              <span className="flex items-center gap-1 opacity-60">
                <Clock size={14} /> {resource.readingTime}
              </span>
            )}
            <span className="flex items-center gap-1 opacity-60">
              <Calendar size={14} /> {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">{resource.title}</h1>
          
          <p className="text-xl text-[color:var(--foreground)] opacity-70 mb-10 leading-relaxed border-l-4 border-purple-500 pl-4">
            {resource.excerpt}
          </p>
          
          <div className="flex items-center justify-between border-y border-[color:var(--border)] py-6 mb-10">
            {resource.author ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {resource.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{resource.author}</p>
                  <p className="text-xs opacity-60">Author</p>
                </div>
              </div>
            ) : (
              <div></div>
            )}

            <button className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-purple-400 transition-colors">
              <Share2 size={16} /> Share
            </button>
          </div>

          {resource.coverImage && (
            <div className="rounded-3xl overflow-hidden border border-[color:var(--border)] shadow-2xl mb-16 max-h-[500px]">
              <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* Rich Text Content */}
      <section className="px-6 pb-20 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* We use prose-invert assuming a dark theme is default or active */}
          <div 
            className="prose prose-invert prose-purple max-w-none text-[color:var(--foreground)] opacity-80"
            dangerouslySetInnerHTML={{ __html: resource.content }}
          />
          
          {resource.downloads && resource.downloads.length > 0 && (
            <div className="mt-16 p-8 rounded-3xl border border-purple-500/30 bg-purple-500/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Download Resources</h3>
                <p className="opacity-70">Get access to the files mentioned in this article.</p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                {resource.downloads.map((dl, idx) => (
                  <a key={idx} href={dl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-2 transition-colors">
                    <Download size={18} /> File {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {resource.tags && resource.tags.length > 0 && (
            <div className="mt-12 flex items-center gap-4 flex-wrap">
              <span className="font-bold opacity-70">Tags:</span>
              {resource.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-[color:var(--secondary)] border border-[color:var(--border)] rounded-lg text-xs font-bold hover:border-purple-500/50 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResourceDetail;
