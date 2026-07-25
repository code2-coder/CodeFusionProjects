import express from 'express';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '../controllers/templateController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTemplates)
  .post(protect, admin, createTemplate);

router.route('/:id')
  .get(getTemplateById)
  .put(protect, admin, updateTemplate)
  .delete(protect, admin, deleteTemplate);

export default router;
