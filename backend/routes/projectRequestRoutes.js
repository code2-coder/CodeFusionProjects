import express from 'express';
import {
  createProjectRequest,
  getMyProjectRequests,
  getAllProjectRequests
} from '../controllers/projectRequestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createProjectRequest)
  .get(protect, admin, getAllProjectRequests);

router.route('/myrequests')
  .get(protect, getMyProjectRequests);

export default router;
