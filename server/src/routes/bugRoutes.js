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

/**
 * @route   GET /api/bugs/stats
 * @desc    Get bug statistics
 * @access  Public
 */
router.get('/stats', getBugStats);

/**
 * @route   POST /api/bugs
 * @desc    Create a new bug
 * @access  Public
 */
router.post('/', createBugValidation, handleValidationErrors, createBug);

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
 * @access  Public
 */
router.put('/:id', validateObjectId, updateBugValidation, handleValidationErrors, updateBug);

/**
 * @route   PATCH /api/bugs/:id
 * @desc    Partial update (status change)
 * @access  Public
 */
router.patch('/:id', validateObjectId, patchBugValidation, handleValidationErrors, patchBug);

/**
 * @route   DELETE /api/bugs/:id
 * @desc    Delete a bug
 * @access  Public
 */
router.delete('/:id', validateObjectId, handleValidationErrors, deleteBug);

module.exports = router;
