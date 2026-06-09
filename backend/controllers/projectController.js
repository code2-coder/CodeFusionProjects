import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const { projectName, projectURL, projectCode, demo, images } = req.body;

    const project = new Project({
      projectName,
      projectURL,
      projectCode,
      demo,
      images,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const { projectName, projectURL, projectCode, demo, images } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.projectName = projectName || project.projectName;
      project.projectURL = projectURL || project.projectURL;
      project.projectCode = projectCode || project.projectCode;
      project.demo = demo || project.demo;
      project.images = images || project.images;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
