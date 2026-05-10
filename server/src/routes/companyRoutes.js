const express = require('express');
const companyController = require('../controllers/companyController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ==================== IMPORTANT: Specific routes MUST come BEFORE parameterized routes (/:id) ====================

// Public routes - General
router.get('/', companyController.getAllCompanies);

// ==================== PROTECTED ROUTES (/:id) ====================
// Get company by ID (public)
router.get('/:id', companyController.getCompanyById);

// Create company (protected)
router.post('/', verifyToken, companyController.createCompany);

// Add review for company (protected)
router.post('/:id/review', verifyToken, companyController.addCompanyReview);

// Update company (protected)
router.put('/:id', verifyToken, companyController.updateCompany);

// Delete company (protected)
router.delete('/:id', verifyToken, companyController.deleteCompany);

module.exports = router;
