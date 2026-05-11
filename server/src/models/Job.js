const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
    },
    salaryMin: {
      type: Number,
    },
    salaryMax: {
      type: Number,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry-level', 'Mid-level', 'Senior'],
      default: 'Entry-level',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applications: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['applied', 'pending', 'reviewed', 'accepted', 'rejected', 'withdrawn'],
          default: 'applied',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        resumePath: String,
        coverLetter: String,
        portfolioUrl: String,
        linkedinUrl: String,
        phone: String,
        email: String,
        yearsOfExperience: Number,
        notes: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Text index for full-text search
jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  location: 'text',
  requirements: 'text',
});

// Compound index for common queries
jobSchema.index({ jobType: 1, experienceLevel: 1, createdAt: -1 });
jobSchema.index({ postedBy: 1, createdAt: -1 });
jobSchema.index({ 'applications.userId': 1 });

module.exports = mongoose.model('Job', jobSchema);
