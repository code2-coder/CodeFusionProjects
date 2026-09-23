import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import projectRequestRoutes from './routes/projectRequestRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows uploaded images/videos to be embedded across domains
    contentSecurityPolicy: false, // Disabled to avoid breaking Vite development & external script CDNs
  })
);

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://www.codefusionprojects.in',
  'https://codefusionprojects.in'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for seamless local/preview deployments
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers with reasonable limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory (reliably points to backend/uploads regardless of working directory)
const uploadsDirectory = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

// Fallback: If file is not present locally in dev, proxy/redirect to production uploads
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', (req, res) => {
    res.redirect(`https://codefusionprojects.onrender.com/uploads${req.url}`);
  });
}

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Apply General Rate Limiting to all /api routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/project-requests', projectRequestRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (_req, res) => {
  res.send('Code Fusion API is running...');
});

// Central 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
