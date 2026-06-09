import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    projectURL: {
      type: String,
      required: true,
    },
    projectCode: {
      type: String,
      required: false,
    },
    demo: {
      type: String, // url to demo
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
