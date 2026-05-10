const Job = require('../models/Job');
const User = require('../models/User');
const Review = require('../models/Review');

// Create job
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      location,
      salary,
      salaryMin,
      salaryMax,
      jobType,
      experienceLevel,
      companyId,
    } = req.body;

    // Validation
    if (!title || !company || !description || !requirements || !location || !jobType) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const job = new Job({
      title,
      company,
      description,
      requirements,
      location,
      salary,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      jobType,
      experienceLevel: experienceLevel || 'Entry-level',
      companyId,
      postedBy: req.userId,
    });

    await job.save();
    await job.populate('postedBy', 'firstName lastName company');

    res.status(201).json({
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all jobs with advanced filtering and pagination
exports.getAllJobs = async (req, res) => {
  try {
    const {
      location,
      jobType,
      company,
      title,
      salaryMin,
      salaryMax,
      experienceLevel,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      search,
    } = req.query;

    // Create filter
    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    
    // Salary range filter
    if (salaryMin || salaryMax) {
      filter.$or = [
        {
          salaryMin: {
            $gte: salaryMin ? parseInt(salaryMin) : 0,
            $lte: salaryMax ? parseInt(salaryMax) : Infinity,
          },
        },
        {
          salaryMax: {
            $gte: salaryMin ? parseInt(salaryMin) : 0,
            $lte: salaryMax ? parseInt(salaryMax) : Infinity,
          },
        },
      ];
    }

    // Full text search
    if (search) {
      filter.$or = [
        ...(filter.$or || []),
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    let sortObj = {};
    if (sortBy === 'newest') sortObj = { createdAt: -1 };
    else if (sortBy === 'salary') sortObj = { salaryMin: -1 };
    else if (sortBy === 'rating') sortObj = { rating: -1 };
    else sortObj = { createdAt: -1 };

    const jobs = await Job.find(filter)
      .populate('postedBy', 'firstName lastName company email phone')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Job.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      jobs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs: total,
        jobsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName company email phone bio')
      .populate('applications', 'firstName lastName email');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user is the one who posted
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    // Update fields
    const { title, company, description, requirements, location, salary, jobType } = req.body;
    if (title) job.title = title;
    if (company) job.company = company;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements;
    if (location) job.location = location;
    if (salary) job.salary = salary;
    if (jobType) job.jobType = jobType;

    await job.save();
    await job.populate('postedBy', 'firstName lastName company');

    res.json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user is the one who posted
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Apply for job
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      (app) => app.userId.toString() === req.userId && app.status !== 'withdrawn'
    );
    
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const {
      resumePath,
      coverLetter,
      portfolioUrl,
      linkedinUrl,
      phone,
      yearsOfExperience,
      notes,
      email,
    } = req.body;

    // Validate required fields
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    if (yearsOfExperience === undefined || yearsOfExperience === null) {
      return res.status(400).json({ error: 'Years of experience is required' });
    }

    job.applications.push({
      userId: req.userId,
      status: 'applied',
      appliedAt: new Date(),
      updatedAt: new Date(),
      resumePath: resumePath || '',
      coverLetter: coverLetter || '',
      portfolioUrl: portfolioUrl || '',
      linkedinUrl: linkedinUrl || '',
      phone,
      email: email || '',
      yearsOfExperience: parseInt(yearsOfExperience),
      notes: notes || '',
    });

    await job.save();
    await job.populate('applications.userId', 'firstName lastName email');

    res.json({
      message: 'Application submitted successfully',
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get jobs posted by user
exports.getUserJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.userId })
      .populate('postedBy', 'firstName lastName company')
      .populate('applications.userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, userId, status } = req.body;

    // Verify user is the job poster
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to update applications' });
    }

    // Find and update the application
    const application = job.applications.find(
      (app) => app.userId.toString() === userId
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    await job.save();
    await job.populate('applications.userId', 'firstName lastName email');

    res.json({
      message: 'Application status updated',
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Save job for user
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ error: 'Job already saved' });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Unsave job
exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.savedJobs = user.savedJobs.filter(
      (id) => id.toString() !== jobId
    );
    await user.save();

    res.json({ message: 'Job removed from saved', savedJobs: user.savedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get saved jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'savedJobs',
      populate: {
        path: 'postedBy',
        select: 'firstName lastName company email',
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.savedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ 'applications.userId': req.userId })
      .populate('postedBy', 'firstName lastName company email phone')
      .select(
        'title company location jobType applications salary experienceLevel description requirements createdAt'
      );

    // Extract application info for each job
    const applications = jobs.map((job) => {
      const app = job.applications.find(
        (a) => a.userId.toString() === req.userId
      );
      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        postedBy: job.postedBy,
        status: app.status,
        appliedAt: app.appliedAt,
        updatedAt: app.updatedAt,
        coverLetter: app.coverLetter,
        portfolioUrl: app.portfolioUrl,
        linkedinUrl: app.linkedinUrl,
        phone: app.phone,
        yearsOfExperience: app.yearsOfExperience,
        notes: app.notes,
        resumePath: app.resumePath,
      };
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Withdraw job application
exports.withdrawApplication = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const application = job.applications.find(
      (app) => app.userId.toString() === req.userId
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status === 'withdrawn') {
      return res.status(400).json({ error: 'Application is already withdrawn' });
    }

    application.status = 'withdrawn';
    application.updatedAt = new Date();
    await job.save();

    res.json({
      message: 'Application withdrawn successfully',
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add review for job
exports.addReview = async (req, res) => {
  try {
    const { jobId, rating, title, comment, pros, cons } = req.body;

    if (!rating || !title || !comment) {
      return res
        .status(400)
        .json({ error: 'Rating, title, and comment are required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user has applied for this job
    const hasApplied = job.applications.some(
      (app) => app.userId.toString() === req.userId
    );

    if (!hasApplied) {
      return res
        .status(403)
        .json({ error: 'You can only review jobs you have applied for' });
    }

    const review = new Review({
      reviewer: req.userId,
      job: jobId,
      rating,
      title,
      comment,
      pros,
      cons,
    });

    await review.save();

    // Update job rating
    const allReviews = await Review.find({ job: jobId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    job.rating = avgRating;
    job.reviewCount = allReviews.length;
    await job.save();

    res.status(201).json({
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get reviews for job
exports.getJobReviews = async (req, res) => {
  try {
    const { jobId } = req.params;

    const reviews = await Review.find({ job: jobId })
      .populate('reviewer', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
