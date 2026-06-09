import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Websites', 'Dashboards', 'AI Tools', 'E-Commerce'];

  const projects = [
    { id: 1, title: 'Nova Fintech Dashboard', cat: 'Dashboards', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' },
    { id: 2, title: 'Lumina AI Generator', cat: 'AI Tools', img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80' },
    { id: 3, title: 'Zenith E-Commerce', cat: 'E-Commerce', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80' },
    { id: 4, title: 'Aura Portfolio', cat: 'Websites', img: 'https://images.unsplash.com/photo-1507238692062-5a042e9e8305?w=800&q=80' },
    { id: 5, title: 'Nexus Analytics', cat: 'Dashboards', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' },
    { id: 6, title: 'Echo Smart Store', cat: 'E-Commerce', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' },
  ];

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.cat === filter);

  return (
    <section id="projects" className="py-32 relative bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Work</span>
          </motion.h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">A showcase of our finest digital experiences and technical achievements.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm ${filter === cat ? 'bg-foreground text-background shadow-md scale-105' : 'bg-card border border-[color:var(--border)] hover:bg-secondary text-foreground/80 hover:text-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={project.id}
                className="group relative overflow-hidden rounded-3xl bg-card border border-[color:var(--border)] aspect-square cursor-pointer shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-shadow"
              >
                <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                
                {/* Always-on subtle gradient to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <span className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 block">{project.cat}</span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{project.title}</h3>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
