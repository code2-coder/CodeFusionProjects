import Template from '../models/Template.js';

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({});
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error: error.message });
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (template) {
      res.json(template);
    } else {
      res.status(404).json({ message: 'Template not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching template', error: error.message });
  }
};

// @desc    Create a template
// @route   POST /api/templates
// @access  Private/Admin
const createTemplate = async (req, res) => {
  try {
    const { 
      title, description, category, price, demoUrl, 
      galleryImages, previewVideo, tags, features, technologies, status 
    } = req.body;
    
    const template = new Template({
      title,
      description,
      category,
      price: price || 0,
      demoUrl,
      galleryImages,
      previewVideo,
      tags,
      features,
      technologies,
      status
    });

    const createdTemplate = await template.save();
    res.status(201).json(createdTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating template', error: error.message });
  }
};

// @desc    Update a template
// @route   PUT /api/templates/:id
// @access  Private/Admin
const updateTemplate = async (req, res) => {
  try {
    const { 
      title, description, category, price, demoUrl, 
      galleryImages, previewVideo, tags, features, technologies, status 
    } = req.body;

    const template = await Template.findById(req.params.id);

    if (template) {
      template.title = title || template.title;
      template.description = description || template.description;
      template.category = category || template.category;
      template.price = price !== undefined ? price : template.price;
      template.demoUrl = demoUrl || template.demoUrl;
      template.galleryImages = galleryImages || template.galleryImages;
      template.previewVideo = previewVideo || template.previewVideo;
      template.tags = tags || template.tags;
      template.features = features || template.features;
      template.technologies = technologies || template.technologies;
      template.status = status || template.status;

      const updatedTemplate = await template.save();
      res.json(updatedTemplate);
    } else {
      res.status(404).json({ message: 'Template not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error: error.message });
  }
};

// @desc    Delete a template
// @route   DELETE /api/templates/:id
// @access  Private/Admin
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (template) {
      await Template.deleteOne({ _id: template._id });
      res.json({ message: 'Template removed' });
    } else {
      res.status(404).json({ message: 'Template not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template', error: error.message });
  }
};

export { getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate };
