const User = require('../models/User');
const Job = require('../models/Job');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, company, resume } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (company) user.company = company;
    if (resume) user.resume = resume;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { page = 1, limit = 10, userType } = req.query;

    const filter = {};
    if (userType) filter.userType = userType;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      users,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers: total,
        usersPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get all jobs
exports.getAllJobsAdmin = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find()
      .populate('postedBy', 'firstName lastName email company')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments();
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

// Admin: Delete user
exports.deleteUserAdmin = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findById(req.userId);
    if (admin.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { userId } = req.body;

    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Delete job
exports.deleteJobAdmin = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { jobId } = req.body;

    await Job.findByIdAndDelete(jobId);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get all applications
exports.getAllApplicationsAdmin = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { page = 1, limit = 10, status } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get jobs with applications
    const jobs = await Job.find({ applications: { $exists: true, $ne: [] } })
      .populate('postedBy', 'firstName lastName email company')
      .sort({ createdAt: -1 });

    // Flatten applications with job details
    let allApplications = [];
    jobs.forEach((job) => {
      if (job.applications && job.applications.length > 0) {
        job.applications.forEach((app) => {
          allApplications.push({
            ...app.toObject ? app.toObject() : app,
            jobId: job._id,
            jobTitle: job.title,
            jobCompany: job.company,
            jobLocation: job.location,
            postedBy: job.postedBy,
          });
        });
      }
    });

    // Filter by status if provided
    if (status) {
      allApplications = allApplications.filter((app) => app.status === status);
    }

    // Sort by appliedAt descending
    allApplications.sort(
      (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
    );

    // Paginate
    const total = allApplications.length;
    const totalPages = Math.ceil(total / limitNum);
    const paginatedApplications = allApplications.slice(skip, skip + limitNum);

    // Populate user details for each application
    const applicationsWithUsers = await Promise.all(
      paginatedApplications.map(async (app) => {
        const applicant = await User.findById(app.userId).select(
          'firstName lastName email phone userType'
        );
        return {
          ...app,
          applicant,
        };
      })
    );

    res.json({
      applications: applicationsWithUsers,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalApplications: total,
        applicationsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const jobSeekers = await User.countDocuments({ userType: 'job_seeker' });
    const employers = await User.countDocuments({ userType: 'employer' });

    // Count total applications
    const jobs = await Job.find({ applications: { $exists: true, $ne: [] } });
    let totalApplications = 0;
    jobs.forEach((job) => {
      if (job.applications) {
        totalApplications += job.applications.length;
      }
    });

    const stats = {
      totalUsers,
      totalJobs,
      jobSeekers,
      employers,
      totalApplications,
      avgJobsPerEmployer: employers > 0 ? totalJobs / employers : 0,
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
