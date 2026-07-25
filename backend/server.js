import express from 'express';
import path from 'path';
import cors from 'cors';
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

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Make uploads folder static so we can access images/videos via URL
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Code Fusion API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
