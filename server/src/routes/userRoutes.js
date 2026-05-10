const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ==================== IMPORTANT: Specific routes MUST come BEFORE parameterized routes (/:id) ====================

// ==================== USER PROFILE ROUTES (Protected) ====================
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);
router.delete('/account', verifyToken, userController.deleteAccount);

// ==================== ADMIN ROUTES (MUST be before /:id) ====================
router.get('/admin/users', verifyToken, userController.getAllUsers);
router.get('/admin/jobs', verifyToken, userController.getAllJobsAdmin);
router.get('/admin/applications', verifyToken, userController.getAllApplicationsAdmin);
router.get('/admin/stats', verifyToken, userController.getDashboardStats);
router.post('/admin/delete-user', verifyToken, userController.deleteUserAdmin);
router.post('/admin/delete-job', verifyToken, userController.deleteJobAdmin);

// ==================== PARAMETERIZED ROUTES (/:id routes) ====================
// Get user by ID (public)
router.get('/:id', userController.getUserById);

module.exports = router;
