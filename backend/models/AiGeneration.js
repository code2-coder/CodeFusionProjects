import mongoose from 'mongoose';

const aiGenerationSchema = new mongoose.Schema({
  prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'AiPrompt', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'AiProject', required: true },
  provider: { type: String, default: 'Gemini' },
  rawOutput: { type: String }, // raw JSON or text from AI
  parsedOutput: { type: mongoose.Schema.Types.Mixed }, // parsed resulting config/components
  tokenUsage: {
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 }
  },
  latencyMs: { type: Number },
  version: { type: Number, default: 1 } // for version history
}, { timestamps: true });

const AiGeneration = mongoose.model('AiGeneration', aiGenerationSchema);
export default AiGeneration;
