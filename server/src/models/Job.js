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

module.exports = mongoose.model('Job', jobSchema);
