import ProjectRequest from '../models/ProjectRequest.js';
import ProjectMessage from '../models/ProjectMessage.js';

// @desc    Create new project request
// @route   POST /api/project-requests
// @access  Private
export const createProjectRequest = async (req, res) => {
  try {
    const projectRequest = new ProjectRequest({
      user: req.user._id,
      ...req.body,
      unreadByAdmin: 1,
      lastMessage: {
        text: req.body.description || 'Project inquiry submitted',
        senderRole: 'client',
        createdAt: new Date()
      }
    });

    const createdRequest = await projectRequest.save();

    // Optionally create the initial message if description exists
    if (req.body.description) {
      await ProjectMessage.create({
        projectRequest: createdRequest._id,
        sender: req.user._id,
        senderRole: 'client',
        senderName: req.user.name || req.body.contactPerson || 'Client',
        text: req.body.description,
        isRead: false
      });
    }

    // Broadcast new lead via socket if IO exists
    const io = req.app.get('io');
    if (io) {
      io.emit('new_project_lead', createdRequest);
    }

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
    const requests = await ProjectRequest.find({ user: req.user._id }).sort({ updatedAt: -1 });
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
    const requests = await ProjectRequest.find({})
      .populate('user', 'id name email phone')
      .sort({ updatedAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all requests', error: error.message });
  }
};

// @desc    Get single project request by ID
// @route   GET /api/project-requests/:id
// @access  Private
export const getProjectRequestById = async (req, res) => {
  try {
    const request = await ProjectRequest.findById(req.params.id).populate('user', 'id name email phone');
    if (!request) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    // Ensure only admin or request owner can view
    const isAdmin = req.user.role === 'admin';
    const isOwner = request.user && request.user._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied to this project request' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project request', error: error.message });
  }
};

// @desc    Update project request status
// @route   PUT /api/project-requests/:id/status
// @access  Private/Admin
export const updateProjectRequestStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const request = await ProjectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    if (status) request.status = status;
    if (adminNotes !== undefined) request.adminNotes = adminNotes;

    const updated = await request.save();

    // Broadcast status change to room
    const io = req.app.get('io');
    if (io) {
      io.to(request._id.toString()).emit('project_status_updated', {
        projectId: request._id,
        status: updated.status,
        adminNotes: updated.adminNotes
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project status', error: error.message });
  }
};

// @desc    Get all messages for a project request
// @route   GET /api/project-requests/:id/messages
// @access  Private
export const getProjectMessages = async (req, res) => {
  try {
    const project = await ProjectRequest.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = project.user && project.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Reset unread count for viewer
    if (isAdmin) {
      if (project.unreadByAdmin > 0) {
        project.unreadByAdmin = 0;
        await project.save();
      }
    } else {
      if (project.unreadByClient > 0) {
        project.unreadByClient = 0;
        await project.save();
      }
    }

    const messages = await ProjectMessage.find({ projectRequest: req.params.id })
      .populate('sender', 'name email role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// @desc    Send a message in a project request conversation
// @route   POST /api/project-requests/:id/messages
// @access  Private
export const sendProjectMessage = async (req, res) => {
  try {
    const { text, attachments } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const project = await ProjectRequest.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = project.user && project.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const senderRole = isAdmin ? 'admin' : 'client';
    const message = await ProjectMessage.create({
      projectRequest: project._id,
      sender: req.user._id,
      senderRole,
      senderName: req.user.name || (isAdmin ? 'CodeFusion Team' : 'Client'),
      text: text.trim(),
      attachments: attachments || [],
      isRead: false
    });

    // Update project request summary
    project.lastMessage = {
      text: text.trim(),
      senderRole,
      createdAt: new Date()
    };

    if (isAdmin) {
      project.unreadByClient = (project.unreadByClient || 0) + 1;
    } else {
      project.unreadByAdmin = (project.unreadByAdmin || 0) + 1;
    }

    await project.save();

    // Populate sender before emitting
    const populatedMessage = await message.populate('sender', 'name email role');

    // Real-time broadcast via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(project._id.toString()).emit('new_message', populatedMessage);
      // Also notify all admins of unread message
      io.emit('project_lead_updated', {
        projectId: project._id,
        lastMessage: project.lastMessage,
        unreadByAdmin: project.unreadByAdmin,
        unreadByClient: project.unreadByClient
      });
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};
