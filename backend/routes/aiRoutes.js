import express from 'express';
import { createProject, getProjects, getProjectDetails, generatePlan, updateProject, deleteProject, exportProject } from '../controllers/aiProjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/projects', protect, createProject);
router.get('/projects', protect, getProjects);
router.get('/projects/:projectId', protect, getProjectDetails);
router.put('/projects/:projectId', protect, updateProject);
router.delete('/projects/:projectId', protect, deleteProject);
router.get('/projects/:projectId/export', protect, exportProject);
router.post('/generate', protect, generatePlan);

export default router;
