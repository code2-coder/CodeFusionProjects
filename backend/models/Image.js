import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  }
}, {
  timestamps: true,
});

const Image = mongoose.model('Image', imageSchema);
export default Image;
