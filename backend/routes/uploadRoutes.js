import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';
import Image from '../models/Image.js';

const router = express.Router();

// Memory storage for file uploads
const storage = multer.memoryStorage();

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_DOC_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const imageFileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported image type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, GIF`), false);
  }
};

const videoFileFilter = (req, file, cb) => {
  if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported video type: ${file.mimetype}. Allowed: MP4, WebM, MOV`), false);
  }
};

const docFileFilter = (req, file, cb) => {
  if (ALLOWED_DOC_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, DOC, DOCX, and standard images`), false);
  }
};

// Multer upload instances with size limits
const uploadImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per image
});

const uploadVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit per video
});

const uploadUserFiles = multer({
  storage,
  fileFilter: docFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit per document
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private/Admin
router.post('/images', protect, admin, (req, res, _next) => {
  uploadImages.array('images', 10)(req, res, async (err) => {
    if (err) {
      console.error('Multer Error in /images:', err.message);
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const filesToProcess = req.files || [];
      if (filesToProcess.length === 0) {
        return res.status(400).json({ success: false, message: 'No image files provided' });
      }

      const filePaths = [];
      for (const file of filesToProcess) {
        const image = new Image({
          filename: file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'),
          contentType: file.mimetype,
          data: file.buffer,
        });
        await image.save();
        filePaths.push(`/api/upload/image/${image._id}`);
      }

      res.status(200).json({ success: true, urls: filePaths });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error processing images', error: error.message });
    }
  });
});

// @desc    Upload single video
// @route   POST /api/upload/video
// @access  Private/Admin
router.post('/video', protect, admin, (req, res) => {
  uploadVideo.single('video')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No video file provided' });
      }

      const video = new Image({
        filename: req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'),
        contentType: req.file.mimetype,
        data: req.file.buffer,
      });
      await video.save();
      res.status(200).json({ success: true, url: `/api/upload/image/${video._id}` });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error uploading video', error: error.message });
    }
  });
});

// @desc    Upload user files (documents/images for project requests)
// @route   POST /api/upload/user-files
// @access  Private
router.post('/user-files', protect, (req, res) => {
  uploadUserFiles.array('files', 10)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files provided' });
      }

      const filePaths = [];
      for (const file of req.files) {
        const doc = new Image({
          filename: file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'),
          contentType: file.mimetype,
          data: file.buffer,
        });
        await doc.save();
        filePaths.push(`/api/upload/image/${doc._id}`);
      }

      res.status(200).json({ success: true, urls: filePaths });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error uploading files', error: error.message });
    }
  });
});

// @desc    Get an image/file by ID
// @route   GET /api/upload/image/:id
// @access  Public
router.get('/image/:id', async (req, res) => {
  try {
    const file = await Image.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Set caching and security headers
    res.set({
      'Content-Type': file.contentType,
      'Cache-Control': 'public, max-age=86400, immutable', // Cache for 24 hours
      'X-Content-Type-Options': 'nosniff',
    });
    res.send(file.data);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching file', error: error.message });
  }
});

export default router;
