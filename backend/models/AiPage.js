import mongoose from 'mongoose';

const aiPageSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'AiProject', required: true },
  title: { type: String, required: true },
  path: { type: String, required: true }, // e.g. '/', '/about', '/contact'
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }]
  },
  isHomePage: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const AiPage = mongoose.model('AiPage', aiPageSchema);
export default AiPage;
