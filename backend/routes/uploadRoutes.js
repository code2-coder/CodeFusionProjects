import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (optional, but good for security)
const fileFilter = (req, file, cb) => {
  console.log('Multer receiving file with fieldname:', file.fieldname, 'mimetype:', file.mimetype);
  if (file.fieldname === 'images') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'));
    }
  } else if (file.fieldname === 'video') {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only videos are allowed'));
    }
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private/Admin
router.post('/images', protect, admin, (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Multer Error in /images:', err);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer upload error: ${err.message} (Field: ${err.field})` });
      }
      return res.status(400).json({ message: 'Error uploading images', error: err.message });
    }
    
    try {
      const filesToProcess = req.files || [];
      const filePaths = filesToProcess.map(file => `/${file.path.replace(/\\/g, '/')}`);
      res.status(200).json({ urls: filePaths });
    } catch (error) {
      res.status(400).json({ message: 'Error processing images', error: error.message });
    }
  });
});

// @desc    Upload single video
// @route   POST /api/upload/video
// @access  Private/Admin
router.post('/video', protect, admin, upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    const filePath = `/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({ url: filePath });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading video', error: error.message });
  }
});

// @desc    Upload user files (documents/images for project requests)
// @route   POST /api/upload/user-files
// @access  Private
router.post('/user-files', protect, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }
    const filePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
    res.status(200).json({ urls: filePaths });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading files', error: error.message });
  }
});

export default router;
