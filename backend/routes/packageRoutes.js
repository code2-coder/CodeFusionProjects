import express from 'express';
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPackages).post(protect, admin, createPackage);
router
  .route('/:id')
  .put(protect, admin, updatePackage)
  .delete(protect, admin, deletePackage);

export default router;
