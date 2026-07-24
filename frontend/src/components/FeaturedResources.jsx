import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const FeaturedResources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await axios.get('/api/resources');
        const featured = data.filter(r => r.published && r.featured).slice(0, 6);
        setResources(featured);
      } catch (error) {
        console.error('Error fetching featured resources:', error);
      }
    };
    fetchResources();
  }, []);

  if (resources.length === 0) return null;

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Resources</h2>
            <p className="text-[color:var(--foreground)] opacity-70 text-lg max-w-2xl">
              Latest insights, tutorials, and free tools from our team.
            </p>
          </div>
          <Link to="/resources" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all">
            Explore Resources <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={resource._id}
              className="group relative glass-card rounded-3xl border border-[color:var(--border)] overflow-hidden flex flex-col hover:border-purple-500/30 hover:shadow-xl transition-all"
            >
              <div className="relative h-56 overflow-hidden bg-black">
                {resource.coverImage ? (
                  <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full bg-purple-900/20 flex items-center justify-center">
                    <BookOpen size={32} className="opacity-30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white">
                  {resource.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">{resource.title}</h3>
                <p className="text-sm opacity-70 mb-4 line-clamp-2">{resource.excerpt}</p>
                <Link to={`/resources/${resource.slug}`} className="text-purple-400 hover:text-purple-300 font-bold text-sm inline-flex items-center gap-1">
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;
