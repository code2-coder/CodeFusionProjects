import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Footer from '../components/Footer';

const WorkDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`/api/projects/slug/${slug}`);
        setProject(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] pt-32 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link to="/work" className="text-blue-500 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] pt-24 pb-0 flex flex-col relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

      {/* Hero Banner */}
      <section className="px-6 pt-12 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/work" className="inline-flex items-center gap-2 text-[color:var(--foreground)] opacity-60 hover:opacity-100 mb-8 transition-opacity">
            <ArrowLeft size={16} /> Back to Work
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/2">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                {project.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{project.title}</h1>
              <p className="text-xl text-[color:var(--foreground)] opacity-70 mb-8 leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 transition-colors">
                    <ExternalLink size={18} /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] hover:bg-[color:var(--card)] font-bold flex items-center gap-2 transition-colors">
                    <FaGithub size={18} /> Source Code
                  </a>
                )}
              </div>
              
              {project.client && (
                <div className="mb-8 p-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] bg-opacity-30 inline-block">
                  <span className="text-xs text-[color:var(--foreground)] opacity-50 uppercase tracking-wider block mb-1">Client</span>
                  <span className="font-bold">{project.client}</span>
                </div>
              )}
            </div>
            
            <div className="lg:w-1/2 w-full">
              {project.featuredImage ? (
                <div className="rounded-3xl overflow-hidden border border-[color:var(--border)] shadow-2xl">
                  <img src={project.featuredImage} alt={project.title} className="w-full h-auto object-cover" />
                </div>
              ) : (
                <div className="rounded-3xl border border-[color:var(--border)] shadow-2xl h-80 bg-[color:var(--secondary)] flex items-center justify-center">
                  <span className="text-[color:var(--foreground)] opacity-30 font-bold text-2xl">No Featured Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content & Technologies */}
      <section className="px-6 py-20 bg-black/40 border-y border-[color:var(--border)] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold mb-8">Project Overview</h2>
            {project.content ? (
              <div 
                className="prose prose-invert prose-blue max-w-none text-[color:var(--foreground)] opacity-80"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            ) : (
              <p className="text-[color:var(--foreground)] opacity-60 italic">No detailed overview provided for this project.</p>
            )}
          </div>
          
          <div className="lg:w-1/3">
            <div className="glass-card p-8 rounded-3xl border border-[color:var(--border)] sticky top-32">
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Technologies Used</h3>
              {project.technologies && project.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-[color:var(--background)] border border-[color:var(--border)] rounded-lg text-sm font-semibold hover:border-blue-500/50 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-50">Not specified</p>
              )}
              
              {project.tags && project.tags.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-6 mt-10 border-b border-white/10 pb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-6 py-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-lg hover:shadow-blue-500/10 transition-shadow">
                  <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center glass-card rounded-[3rem] p-12 md:p-20 border border-[color:var(--border)] bg-gradient-to-b from-blue-900/10 to-transparent">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Want to build something similar?</h2>
          <p className="text-lg opacity-70 mb-10 max-w-2xl mx-auto">Let's discuss how we can bring your ideas to life using the same high-quality development standards.</p>
          <Link to="/contact" className="inline-block px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg hover:scale-105 transition-all shadow-xl">
            Start Your Project
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorkDetail;
