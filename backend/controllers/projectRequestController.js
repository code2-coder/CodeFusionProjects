import ProjectRequest from '../models/ProjectRequest.js';

// @desc    Create new project request
// @route   POST /api/project-requests
// @access  Private
export const createProjectRequest = async (req, res) => {
  try {
    const projectRequest = new ProjectRequest({
      user: req.user._id,
      ...req.body
    });

    const createdRequest = await projectRequest.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project request', error: error.message });
  }
};

// @desc    Get logged in user's project requests
// @route   GET /api/project-requests/myrequests
// @access  Private
export const getMyProjectRequests = async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

// @desc    Get all project requests
// @route   GET /api/project-requests
// @access  Private/Admin
export const getAllProjectRequests = async (req, res) => {
  try {
    const requests = await ProjectRequest.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all requests', error: error.message });
  }
};
