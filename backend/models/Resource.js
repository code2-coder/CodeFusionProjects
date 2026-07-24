import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: false },
    author: { type: String, required: false },
    readingTime: { type: String, required: false },
    tags: { type: [String], required: false },
    downloads: { type: [String], required: false },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    seoTitle: { type: String, required: false },
    seoDescription: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
