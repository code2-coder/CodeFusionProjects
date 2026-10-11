import express from 'express';
import {
  createProjectRequest,
  getMyProjectRequests,
  getAllProjectRequests,
  getProjectRequestById,
  updateProjectRequestStatus,
  getProjectMessages,
  sendProjectMessage
} from '../controllers/projectRequestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createProjectRequest)
  .get(protect, admin, getAllProjectRequests);

router.route('/myrequests')
  .get(protect, getMyProjectRequests);

router.route('/:id')
  .get(protect, getProjectRequestById);

router.route('/:id/status')
  .put(protect, admin, updateProjectRequestStatus);

router.route('/:id/messages')
  .get(protect, getProjectMessages)
  .post(protect, sendProjectMessage);

export default router;
