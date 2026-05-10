const Company = require('../models/Company');
const User = require('../models/User');
const Review = require('../models/Review');

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const companies = await Company.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ rating: -1 });

    const total = await Company.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      companies,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCompanies: total,
        companiesPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      'createdBy',
      'firstName lastName email'
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Get reviews for the company
    const reviews = await Review.find({ company: req.params.id })
      .populate('reviewer', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      company,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create company
exports.createCompany = async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      logo,
      industry,
      location,
      foundedYear,
      employeeCount,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists' });
    }

    const company = new Company({
      name,
      description,
      website,
      logo,
      industry,
      location,
      foundedYear,
      employeeCount,
      createdBy: req.userId,
    });

    await company.save();

    res.status(201).json({
      message: 'Company created successfully',
      company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check authorization
    if (company.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to update this company' });
    }

    const {
      name,
      description,
      website,
      logo,
      industry,
      location,
      foundedYear,
      employeeCount,
    } = req.body;

    if (name) company.name = name;
    if (description) company.description = description;
    if (website) company.website = website;
    if (logo) company.logo = logo;
    if (industry) company.industry = industry;
    if (location) company.location = location;
    if (foundedYear) company.foundedYear = foundedYear;
    if (employeeCount) company.employeeCount = employeeCount;

    await company.save();

    res.json({
      message: 'Company updated successfully',
      company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check authorization
    if (company.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to delete this company' });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add review for company
exports.addCompanyReview = async (req, res) => {
  try {
    const { companyId, rating, title, comment, pros, cons } = req.body;

    if (!rating || !title || !comment) {
      return res
        .status(400)
        .json({ error: 'Rating, title, and comment are required' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const review = new Review({
      reviewer: req.userId,
      company: companyId,
      rating,
      title,
      comment,
      pros,
      cons,
      verified: false,
    });

    await review.save();

    // Update company rating
    const allReviews = await Review.find({ company: companyId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    company.rating = avgRating;
    company.reviewCount = allReviews.length;
    await company.save();

    res.status(201).json({
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
