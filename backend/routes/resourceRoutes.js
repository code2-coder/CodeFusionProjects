import express from 'express';
import {
  getResources,
  getResourceBySlug,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getResources).post(protect, admin, createResource);
router.route('/slug/:slug').get(getResourceBySlug);
router
  .route('/:id')
  .put(protect, admin, updateResource)
  .delete(protect, admin, deleteResource);

export default router;
