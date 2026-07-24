import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: false },
    client: { type: String, required: false },
    technologies: { type: [String], required: false },
    tags: { type: [String], required: false },
    featuredImage: { type: String, required: false },
    gallery: { type: [String], required: false },
    demoUrl: { type: String, required: false },
    githubUrl: { type: String, required: false },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    seoTitle: { type: String, required: false },
    seoDescription: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
