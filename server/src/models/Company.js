const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    logo: {
      type: String,
    },
    industry: {
      type: String,
    },
    location: {
      type: String,
    },
    foundedYear: {
      type: Number,
    },
    employeeCount: {
      type: String,
      enum: ['1-50', '51-200', '201-1000', '1000+'],
    },
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
