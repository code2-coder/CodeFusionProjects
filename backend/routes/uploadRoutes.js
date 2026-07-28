import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';
import Image from '../models/Image.js';

const router = express.Router();

// Multer storage configuration - use memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private/Admin
router.post('/images', protect, admin, (req, res, next) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      console.error('Multer Error in /images:', err);
      return res.status(400).json({ message: 'Error uploading images', error: err.message });
    }
    
    try {
      const filesToProcess = req.files || [];
      const filePaths = [];
      
      for (const file of filesToProcess) {
        const image = new Image({
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer
        });
        await image.save();
        filePaths.push(`/api/upload/image/${image._id}`);
      }
      
      res.status(200).json({ urls: filePaths });
    } catch (error) {
      res.status(400).json({ message: 'Error processing images', error: error.message });
    }
  });
});

// @desc    Upload single video
// @route   POST /api/upload/video
// @access  Private/Admin
router.post('/video', protect, admin, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    const video = new Image({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer
    });
    await video.save();
    res.status(200).json({ url: `/api/upload/image/${video._id}` });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading video', error: error.message });
  }
});

// @desc    Upload user files (documents/images for project requests)
// @route   POST /api/upload/user-files
// @access  Private
router.post('/user-files', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }
    const filePaths = [];
    for (const file of req.files) {
      const doc = new Image({
        filename: file.originalname,
        contentType: file.mimetype,
        data: file.buffer
      });
      await doc.save();
      filePaths.push(`/api/upload/image/${doc._id}`);
    }
    res.status(200).json({ urls: filePaths });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading files', error: error.message });
  }
});

// @desc    Get an image/file by ID
// @route   GET /api/upload/image/:id
// @access  Public
router.get('/image/:id', async (req, res) => {
  try {
    const file = await Image.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', file.contentType);
    res.send(file.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file', error: error.message });
  }
});

export default router;
