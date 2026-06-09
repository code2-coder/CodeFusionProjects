import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    services: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;
