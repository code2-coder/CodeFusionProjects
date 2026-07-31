import React, { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import * as aiService from '../services/aiBuilderService';
import toast from 'react-hot-toast';

export const AiBuilderContext = createContext();

export const AiBuilderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentPages, setCurrentPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const fetchProjects = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await aiService.getProjects(token);
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async (projectId) => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await aiService.getProjectDetails(projectId, token);
      if (data.success) {
        setCurrentProject(data.project);
        setCurrentPages(data.pages);
        if (data.chatHistory) {
          setChatHistory(data.chatHistory);
        }
        if (data.pages.length > 0) {
          setActivePage(data.pages.find(p => p.isHomePage) || data.pages[0]);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async (projectData) => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) throw new Error("Not authenticated");
      const data = await aiService.createProject(projectData, token);
      if (data.success) {
        setProjects([data.project, ...projects]);
        toast.success('Project created successfully!');
        return data.project;
      }
    } catch (err) {
      toast.error('Failed to create project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProjectById = async (projectId, projectData) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("Not authenticated");
      const data = await aiService.updateProject(projectId, projectData, token);
      if (data.success) {
        setProjects(projects.map(p => p._id === projectId ? data.project : p));
        toast.success('Project updated successfully');
        return data.project;
      }
    } catch (err) {
      toast.error('Failed to update project');
      console.error(err);
    }
  };

  const deleteProjectById = async (projectId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("Not authenticated");
      const data = await aiService.deleteProject(projectId, token);
      if (data.success) {
        setProjects(projects.filter(p => p._id !== projectId));
        toast.success('Project deleted successfully');
        return true;
      }
    } catch (err) {
      toast.error('Failed to delete project');
      console.error(err);
      return false;
    }
  };

  const submitPrompt = async (promptText, attachments = []) => {
    if (!token || !currentProject) return;
    
    const attachmentSummary = attachments.length > 0 
      ? `\n\n[Attachments: ${attachments.map(a => a.name).join(', ')}]` 
      : '';
      
    // Optimistically add user prompt to chat history
    const newMessage = { _id: Date.now().toString(), role: 'user', content: promptText + attachmentSummary };
    setChatHistory(prev => [...prev, newMessage]);
    
    setLoading(true);
    try {
      const data = await aiService.generatePlan(currentProject._id, promptText + attachmentSummary, token);
      if (data.success) {
        if (data.action === 'ask') {
          // AI just asked a question, don't show a toast for project update.
        } else {
          toast.success('AI updated project plan!');
        }
        // Reload project to get new structure and updated chat history
        await loadProject(currentProject._id);
      }
    } catch (error) {
      console.error(error);
      toast.error('AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCode = async (projectId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("Not authenticated");
      toast.loading('Generating your code... this may take a few seconds');
      await aiService.exportProjectCode(projectId, token);
      toast.dismiss();
      toast.success('Project code exported successfully!');
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to export code');
      console.error(err);
    }
  };

  return (
    <AiBuilderContext.Provider value={{
      projects,
      currentProject,
      currentPages,
      activePage,
      loading,
      fetchProjects,
      loadProject,
      createNewProject,
      updateProjectById,
      deleteProjectById,
      submitPrompt,
      handleExportCode,
      setActivePage,
      chatHistory
    }}>
      {children}
    </AiBuilderContext.Provider>
  );
};
