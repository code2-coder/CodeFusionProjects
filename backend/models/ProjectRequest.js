import mongoose from 'mongoose';

const projectRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Step 1: Business Information
    businessName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    businessType: { type: String, required: true },
    description: { type: String, required: false },
    logoUrl: { type: String, required: false },

    // Step 2: Website Requirements
    websiteType: { type: String, required: true },
    featuresNeeded: { type: [String], required: false },
    referenceWebsite: { type: String, required: false },

    // Step 3: Project Details
    domainAvailable: { type: String, required: true },
    hostingAvailable: { type: String, required: true },
    budget: { type: String, required: true },
    expectedLaunchDate: { type: String, required: true },
    contentUrls: { type: [String], required: false },
    additionalRequirements: { type: String, required: false },

    // Status tracking
    status: { 
      type: String, 
      enum: ['Pending', 'Reviewed', 'In Progress', 'Completed', 'Rejected'], 
      default: 'Pending' 
    }
  },
  {
    timestamps: true,
  }
);

const ProjectRequest = mongoose.model('ProjectRequest', projectRequestSchema);
export default ProjectRequest;
