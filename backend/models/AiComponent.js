import mongoose from 'mongoose';

const aiComponentSchema = new mongoose.Schema({
  page: { type: mongoose.Schema.Types.ObjectId, ref: 'AiPage', required: true },
  type: { type: String, required: true }, // e.g. 'Hero', 'Navbar', 'Features'
  layout: { type: String, default: 'default' }, // multiple layouts per component
  props: { type: mongoose.Schema.Types.Mixed, default: {} }, // content and specific props
  styles: { type: mongoose.Schema.Types.Mixed, default: {} }, // spacing, overrides
  order: { type: Number, default: 0 },
  parentComponentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AiComponent', default: null }, // for nesting if required
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const AiComponent = mongoose.model('AiComponent', aiComponentSchema);
export default AiComponent;
