const express = require('express');
const jobController = require('../controllers/jobController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ==================== IMPORTANT: Specific routes MUST come BEFORE parameterized routes (/:id) ====================

// Public routes - General
router.get('/', jobController.getAllJobs);

// ==================== USER-SPECIFIC ROUTES (MUST be before /:id) ====================
// User job routes (protected)
router.get('/user/posted', verifyToken, jobController.getUserJobs);
router.get('/user/saved', verifyToken, jobController.getSavedJobs);
router.get('/user/applications', verifyToken, jobController.getUserApplications);

// ==================== SAVE/UNSAVE ROUTES (MUST be before /:id) ====================
router.post('/save', verifyToken, jobController.saveJob);
router.post('/unsave', verifyToken, jobController.unsaveJob);

// ==================== APPLICATION STATUS ROUTES (MUST be before /:id) ====================
router.put('/application/status', verifyToken, jobController.updateApplicationStatus);
router.post('/withdraw', verifyToken, jobController.withdrawApplication);

// ==================== PARAMETERIZED ROUTES (/:id routes) ====================
// Get job by ID (public)
router.get('/:id', jobController.getJobById);

// Get job reviews (public)
router.get('/:id/reviews', jobController.getJobReviews);

// Create job (protected)
router.post('/', verifyToken, jobController.createJob);

// Apply for job (protected)
router.post('/:id/apply', verifyToken, jobController.applyForJob);

// Add review for job (protected)
router.post('/:id/review', verifyToken, jobController.addReview);

// Update job (protected)
router.put('/:id', verifyToken, jobController.updateJob);

// Delete job (protected)
router.delete('/:id', verifyToken, jobController.deleteJob);

module.exports = router;
