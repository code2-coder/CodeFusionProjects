import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import * as aiService from '../../services/aiBuilderService';
import LivePreview from '../../components/ai-builder/LivePreview';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const ProjectPreview = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Optional: support passing pageId as query param to preview specific page, or default to home
  const searchParams = new URLSearchParams(location.search);
  const pageId = searchParams.get('pageId');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = user?.token;
        if (!token) return;
        const data = await aiService.getProjectDetails(projectId, token);
        if (data.success) {
          setProject(data.project);
          setPages(data.pages);
        }
      } catch (error) {
        console.error('Failed to load project for preview', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Preview...</div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Project not found</div>;
  }

  const activePage = pageId 
    ? pages.find(p => p._id === pageId) 
    : (pages.find(p => p.isHomePage) || pages[0]);

  return (
    <div className="w-full min-h-screen m-0 p-0 overflow-x-hidden">
      <LivePreview page={activePage} branding={project.branding} />
    </div>
  );
};

export default ProjectPreview;
