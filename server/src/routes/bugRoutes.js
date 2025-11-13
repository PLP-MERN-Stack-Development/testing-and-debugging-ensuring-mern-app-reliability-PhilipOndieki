/**
 * Bug Routes
 * API endpoints for bug operations
 */

const express = require('express');
const router = express.Router();
const {
  createBug,
  getAllBugs,
  getBugById,
  updateBug,
  patchBug,
  deleteBug,
  getBugStats,
} = require('../controllers/bugController');
const {
  createBugValidation,
  updateBugValidation,
  patchBugValidation,
  validateObjectId,
  queryValidation,
  handleValidationErrors,
} = require('../middleware/validator');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/bugs/stats
 * @desc    Get bug statistics
 * @access  Public
 */
router.get('/stats', getBugStats);

/**
 * @route   POST /api/bugs
 * @desc    Create a new bug
 * @access  Private (requires authentication)
 */
router.post('/', protect, createBugValidation, handleValidationErrors, createBug);

/**
 * @route   GET /api/bugs
 * @desc    Get all bugs with filtering and pagination
 * @access  Public
 */
router.get('/', queryValidation, handleValidationErrors, getAllBugs);

/**
 * @route   GET /api/bugs/:id
 * @desc    Get a single bug by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, handleValidationErrors, getBugById);

/**
 * @route   PUT /api/bugs/:id
 * @desc    Update a bug
 * @access  Private (requires authentication)
 */
router.put('/:id', protect, validateObjectId, updateBugValidation, handleValidationErrors, updateBug);

/**
 * @route   PATCH /api/bugs/:id
 * @desc    Partial update (status change)
 * @access  Private (requires authentication)
 */
router.patch('/:id', protect, validateObjectId, patchBugValidation, handleValidationErrors, patchBug);

/**
 * @route   DELETE /api/bugs/:id
 * @desc    Delete a bug
 * @access  Private (requires authentication)
 */
router.delete('/:id', protect, validateObjectId, handleValidationErrors, deleteBug);

module.exports = router;
