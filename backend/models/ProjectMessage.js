import mongoose from 'mongoose';

const projectMessageSchema = new mongoose.Schema(
  {
    projectRequest: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ProjectRequest', 
      required: true, 
      index: true 
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    senderRole: { 
      type: String, 
      enum: ['admin', 'client'], 
      required: true 
    },
    senderName: { 
      type: String, 
      required: true 
    },
    text: { 
      type: String, 
      required: true,
      trim: true
    },
    attachments: [{ 
      type: String 
    }],
    isRead: { 
      type: Boolean, 
      default: false 
    }
  },
  {
    timestamps: true
  }
);

const ProjectMessage = mongoose.model('ProjectMessage', projectMessageSchema);
export default ProjectMessage;
