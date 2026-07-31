import mongoose from 'mongoose';

const aiProjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  industry: { type: String },
  description: { type: String },
  branding: {
    colors: {
      primary: { type: String, default: '#3B82F6' },
      secondary: { type: String, default: '#10B981' },
      accent: { type: String, default: '#F59E0B' },
      background: { type: String, default: '#FFFFFF' },
      text: { type: String, default: '#111827' }
    },
    fonts: {
      heading: { type: String, default: 'Inter' },
      body: { type: String, default: 'Inter' }
    },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    logoUrl: { type: String }
  },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  customDomain: { type: String },
  subdomain: { type: String, unique: true, sparse: true },
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

const AiProject = mongoose.model('AiProject', aiProjectSchema);
export default AiProject;
