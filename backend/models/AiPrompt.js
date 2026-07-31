import mongoose from 'mongoose';

const aiPromptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'AiProject' },
  promptText: { type: String, required: true },
  aiResponse: { type: String },
  type: { type: String, enum: ['planner', 'designer', 'content', 'react', 'edit', 'general'], required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  targetComponent: { type: mongoose.Schema.Types.ObjectId, ref: 'AiComponent' } // if editing a specific section
}, { timestamps: true });

const AiPrompt = mongoose.model('AiPrompt', aiPromptSchema);
export default AiPrompt;
