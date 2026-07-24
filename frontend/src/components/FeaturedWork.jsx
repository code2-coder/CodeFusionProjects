import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

const FeaturedWork = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('/api/projects');
        const featured = data.filter(p => p.published && p.featured).slice(0, 6);
        setProjects(featured);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      }
    };
    fetchProjects();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Work</h2>
            <p className="text-[color:var(--foreground)] opacity-70 text-lg max-w-2xl">
              Take a look at some of our most recent and impactful projects.
            </p>
          </div>
          <Link to="/work" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all">
            View All Projects <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={project._id}
              className="group relative glass-card rounded-3xl border border-[color:var(--border)] overflow-hidden flex flex-col hover:border-blue-500/30 hover:shadow-xl transition-all"
            >
              <div className="relative h-56 overflow-hidden bg-black">
                {project.featuredImage ? (
                  <img src={project.featuredImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full bg-blue-900/20" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-sm opacity-70 mb-4 line-clamp-2">{project.description}</p>
                <Link to={`/work/${project.slug}`} className="text-blue-400 hover:text-blue-300 font-bold text-sm inline-flex items-center gap-1">
                  View Case Study <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
