import AiProject from '../models/AiProject.js';
import AiPage from '../models/AiPage.js';
import AiComponent from '../models/AiComponent.js';
import AiPrompt from '../models/AiPrompt.js';
import AiGeneration from '../models/AiGeneration.js';
import AiProviderFactory from '../services/ai/AiProviderFactory.js';
import { getPlannerPrompt } from '../services/ai/prompts/plannerPrompt.js';
import { getDesignerPrompt } from '../services/ai/prompts/designerPrompt.js';
import { generateProjectZip } from '../services/exportService.js';

export const createProject = async (req, res) => {
  try {
    const { name, industry, description } = req.body;
    const userId = req.user._id; // Assuming auth middleware sets req.user

    const project = new AiProject({
      user: userId,
      name,
      industry,
      description
    });
    await project.save();

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Error creating AI project:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a project
// @route   PUT /api/ai/projects/:projectId
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { name, industry, description } = req.body;
    const project = await AiProject.findOne({ _id: req.params.projectId, user: req.user._id });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.name = name || project.name;
    project.industry = industry || project.industry;
    project.description = description || project.description;

    const updatedProject = await project.save();
    res.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a project and all associated resources
// @route   DELETE /api/ai/projects/:projectId
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await AiProject.findOne({ _id: req.params.projectId, user: req.user._id });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Cascade delete associated data
    await AiPrompt.deleteMany({ project: project._id });
    await AiGeneration.deleteMany({ project: project._id });
    
    // For components, we need to find the pages first
    const pages = await AiPage.find({ project: project._id });
    const pageIds = pages.map(p => p._id);
    
    await AiComponent.deleteMany({ page: { $in: pageIds } });
    await AiPage.deleteMany({ project: project._id });
    
    // Finally delete the project
    await AiProject.deleteOne({ _id: project._id });

    res.json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await AiProject.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await AiProject.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    // Fetch pages
    const rawPages = await AiPage.find({ project: projectId }).sort({ order: 1 }).lean();
    const pageIds = rawPages.map(p => p._id);
    
    // Fetch components for those pages
    const components = await AiComponent.find({ page: { $in: pageIds } }).sort({ order: 1 }).lean();
    
    // Attach components to pages
    const pages = rawPages.map(page => ({
      ...page,
      components: components.filter(c => c.page.toString() === page._id.toString())
    }));

    // Fetch chat history
    const prompts = await AiPrompt.find({ project: projectId }).sort({ createdAt: 1 }).lean();
    
    // Map prompts to a unified chat history array
    const chatHistory = [];
    prompts.forEach(p => {
      // User message
      chatHistory.push({
        _id: p._id + '-user',
        role: 'user',
        content: p.promptText,
        createdAt: p.createdAt,
        status: p.status
      });
      // AI response (if any)
      if (p.aiResponse) {
        chatHistory.push({
          _id: p._id + '-ai',
          role: 'ai',
          content: p.aiResponse,
          createdAt: p.createdAt,
          status: 'completed'
        });
      }
    });

    res.status(200).json({ success: true, project, pages, chatHistory });
  } catch (error) {
    console.error('getProjectDetails Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const generatePlan = async (req, res) => {
  try {
    const { projectId, promptText } = req.body;
    const userId = req.user._id;

    const project = await AiProject.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Save user prompt
    const aiPrompt = new AiPrompt({
      user: userId,
      project: projectId,
      promptText,
      type: 'planner',
      status: 'processing'
    });
    await aiPrompt.save();

    // Fetch previous chat history for this project
    const previousPrompts = await AiPrompt.find({ project: projectId }).sort({ createdAt: 1 }).lean();
    const chatHistory = [];
    previousPrompts.forEach(p => {
      chatHistory.push({ role: 'user', content: p.promptText });
      if (p.aiResponse) chatHistory.push({ role: 'ai', content: p.aiResponse });
    });

    // Call AI Provider
    const provider = AiProviderFactory.getProvider();
    const systemPrompt = getPlannerPrompt({
      name: project.name,
      industry: project.industry,
      description: project.description,
      userPrompt: promptText,
      chatHistory
    });

    const aiResult = await provider.generate(systemPrompt);
    
    // Parse JSON from AI
    let parsedData = {};
    try {
      const cleanJson = aiResult.text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse AI output as JSON', parseError);
    }

    // Save generation
    const generation = new AiGeneration({
      prompt: aiPrompt._id,
      project: projectId,
      provider: 'Gemini',
      rawOutput: aiResult.text,
      parsedOutput: parsedData
    });
    await generation.save();

    // Handle conversational 'ask' action
    if (parsedData.action === 'ask') {
      aiPrompt.aiResponse = parsedData.message;
      aiPrompt.status = 'completed';
      await aiPrompt.save();
      return res.status(200).json({ success: true, message: 'AI asked a question', action: 'ask' });
    }

    // If generating, set success message
    aiPrompt.aiResponse = "I have successfully generated your project structure and design based on our conversation.";
    aiPrompt.status = 'completed';
    await aiPrompt.save();

    // Update project with branding if provided
    if (parsedData.branding) {
      project.branding = project.branding || { colors: {}, fonts: {}, theme: 'light' };
      project.branding.colors = { ...(project.branding.colors || {}), ...parsedData.branding.colors };
      if (parsedData.typography) {
        project.branding.fonts = { ...(project.branding.fonts || {}), ...parsedData.typography };
      }
      if (parsedData.theme) {
         project.branding.theme = parsedData.theme;
      }
      await project.save();
    }

    // --- NEW: Phase 4 AI Designer Step ---
    // If we have a planned structure, let's run the Designer prompt to refine tokens
    let refinedTokens = {};
    try {
      const designerSystemPrompt = getDesignerPrompt({
        name: project.name,
        industry: project.industry,
        theme: project.branding?.theme || 'light',
        pages: parsedData.pages || []
      });
      const designerResult = await provider.generate(designerSystemPrompt);
      const cleanDesignerJson = designerResult.text.replace(/```json/g, '').replace(/```/g, '').trim();
      refinedTokens = JSON.parse(cleanDesignerJson);
      
      // Update Project with refined designer tokens
      if (refinedTokens.theme) project.branding.theme = refinedTokens.theme;
      if (refinedTokens.colors) project.branding.colors = refinedTokens.colors;
      if (refinedTokens.typography) project.branding.fonts = refinedTokens.typography;
      await project.save();
    } catch (designerError) {
      console.warn('Designer prompt failed or parsing failed. Proceeding with planner defaults.', designerError);
    }

    // Generate Pages and Components
    if (parsedData.pages && Array.isArray(parsedData.pages)) {
      await AiPage.deleteMany({ project: projectId });
      const currentPages = await AiPage.find({project: projectId});
      const pageIds = currentPages.map(p => p._id);
      if(pageIds.length > 0) {
        await AiComponent.deleteMany({ page: { $in: pageIds } });
      }

      for (let i = 0; i < parsedData.pages.length; i++) {
        const pageData = parsedData.pages[i];
        const page = new AiPage({
          project: projectId,
          title: pageData.title,
          path: pageData.path,
          isHomePage: pageData.path === '/',
          order: i
        });
        await page.save();

        if (pageData.components && Array.isArray(pageData.components)) {
          for (let j = 0; j < pageData.components.length; j++) {
            const compData = pageData.components[j];
            const componentType = typeof compData === 'string' ? compData : (compData.type || compData.name || 'Unknown');
            const componentProps = typeof compData === 'object' && compData.props ? compData.props : {};
            
            const component = new AiComponent({
              page: page._id,
              type: componentType,
              props: componentProps,
              order: j

            });
            await component.save();
          }
        }
      }
    }

    res.status(200).json({ success: true, parsedData });
  } catch (error) {
    console.error('Generation Error Message:', error.message);
    console.error('Generation Error Data:', error.response?.data);
    console.error('Generation Error Stack:', error.stack);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const exportProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await AiProject.findOne({ _id: projectId, user: req.user._id });
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const pages = await AiPage.find({ project: projectId }).sort({ order: 1 }).lean();
    const pageIds = pages.map(p => p._id);
    const components = await AiComponent.find({ page: { $in: pageIds } }).sort({ order: 1 }).lean();

    await generateProjectZip(project, pages, components, res);
  } catch (error) {
    console.error('Export Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error during export' });
    }
  }
};
