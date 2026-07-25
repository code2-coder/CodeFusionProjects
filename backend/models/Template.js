import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    demoUrl: {
      type: String,
      required: false,
    },
    galleryImages: {
      type: [String],
      required: false,
    },
    previewVideo: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
    features: {
      type: [String],
      required: false,
    },
    technologies: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model('Template', templateSchema);
export default Template;
